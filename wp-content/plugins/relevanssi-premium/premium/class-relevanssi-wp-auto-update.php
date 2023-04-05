<?php
/**
 * /premium/class-relevanssi-wp-auto-update.php
 *
 * @package Relevanssi_Premium
 * @author  Mikko Saari
 * @license https://wordpress.org/about/gpl/ GNU General Public License
 * @see     https://www.relevanssi.com/
 */

/**
 * Manages the auto update system for Relevanssi Premium.
 *
 * Manages the auto updates, getting update information from Relevanssi.com and passing it to the WordPress update system.
 */
class Relevanssi_WP_Auto_Update {
	/**
	 * The plugin current version
	 *
	 * @var string
	 */
	public $current_version;

	/**
	 * The plugin remote update path
	 *
	 * @var string
	 */
	public $update_path;

	/**
	 * Plugin Slug (plugin_directory/plugin_file.php)
	 *
	 * @var string
	 */
	public $plugin_slug;

	/**
	 * Plugin name (plugin_file)
	 *
	 * @var string
	 */
	public $slug;

	/**
	 * Initializes a new instance of the WordPress Auto-Update class
	 *
	 * @param string $current_version Current version of the plugin.
	 * @param string $update_path Path to the remove service.
	 * @param string $plugin_slug Plugin slug.
	 */
	public function __construct( $current_version, $update_path, $plugin_slug ) {
		// Set the class public variables.
		$this->current_version = $current_version;
		$this->update_path     = $update_path;
		$this->plugin_slug     = $plugin_slug;
		list ($t1, $t2)        = explode( '/', $plugin_slug );
		$this->slug            = str_replace( '.php', '', $t2 );

		// define the alternative API for updating checking.
		add_filter( 'pre_set_site_transient_update_plugins', array( &$this, 'check_update' ) );

		// Define the alternative response for information checking.
		add_filter( 'plugins_api', array( &$this, 'check_info' ), 10, 3 );
	}

	/**
	 * Adds our self-hosted autoupdate plugin to the filter transient.
	 *
	 * @param object $transient The filtered transient.
	 *
	 * @return object $ transient
	 */
	public function check_update( $transient ) {
		// Get the remote version.
		$info           = $this->get_remote_information();
		$remote_version = 0;
		if ( isset( $info->new_version ) ) {
			$remote_version = $info->new_version;
		}

		// If a newer version is available, add the update.
		if ( version_compare( $this->current_version, $remote_version, '<' ) ) {
			$obj              = new stdClass();
			$obj->slug        = $this->slug;
			$obj->new_version = $remote_version;
			$obj->url         = $this->update_path;
			$obj->package     = $this->update_path;
			$obj->icons       = $info->icons;
			$obj->banners     = $info->banners;

			$transient->response[ $this->plugin_slug ] = $obj;
		}
		return $transient;
	}

	/**
	 * Adds our self-hosted description to the filter.
	 *
	 * @param boolean $false Result object or array, should return false.
	 * @param array   $action Type of information request.
	 * @param object  $arg Plugin API arguments.
	 *
	 * @return bool|object
	 */
	public function check_info( $false, $action, $arg ) {
		if ( isset( $arg->slug ) ) {
			if ( $arg->slug === $this->slug ) {
				$information = $this->get_remote_information();
				return $information;
			}
		}
		return false;
	}

	/**
	 * Returns the remote version.
	 *
	 * @return string $remote_version Version number at the remote end.
	 */
	public function get_remote_version() {
		$api_key = get_site_option( 'relevanssi_api_key' );
		$request = wp_remote_post( $this->update_path, array(
			'body' => array(
				'api_key' => $api_key,
				'action'  => 'version',
			),
		) );
		if ( ! is_wp_error( $request ) || 200 === wp_remote_retrieve_response_code( $request ) ) {
			return $request['body'];
		}
		return false;
	}

	/**
	 * Get information about the remote version.
	 *
	 * @return bool|object
	 */
	public function get_remote_information() {
		$api_key = get_site_option( 'relevanssi_api_key' );
		$request = wp_remote_post( $this->update_path, array(
			'body' => array(
				'api_key' => $api_key,
				'action'  => 'info',
			),
		) );
		if ( ! is_wp_error( $request ) || 200 === wp_remote_retrieve_response_code( $request ) ) {
			if ( is_serialized( $request['body'] ) ) {
				return unserialize( $request['body'] ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions
			}
		}
		return false;
	}

	/**
	 * Returns the status of the plugin licensing.
	 *
	 * @return boolean $remote_license
	 */
	public function get_remote_license() {
		$api_key = get_site_option( 'relevanssi_api_key' );
		$request = wp_remote_post( $this->update_path, array(
			'body' => array(
				'api_key' => $api_key,
				'action'  => 'license',
			),
		) );
		if ( ! is_wp_error( $request ) || 200 === wp_remote_retrieve_response_code( $request ) ) {
			return $request['body'];
		}
		return false;
	}
}

/**
 * Activates the auto update mechanism.
 *
 * @global array $relevanssi_variables Relevanssi global variables, used for plugin file name and version number.
 *
 * Hooks into 'init' filter hook to activate the auto update mechanism.
 */
function relevanssi_activate_auto_update() {
	global $relevanssi_variables;
	$api_key = get_site_option( 'relevanssi_api_key' );
	if ( 'su9qtC30xCLLA' === crypt( $api_key, 'suolaa' ) ) {
		$relevanssi_plugin_remote_path = 'https://www.relevanssi.com/update/update-development.php';
	} else {
		$relevanssi_plugin_remote_path = 'https://www.relevanssi.com/update/update.php';
	}
	new Relevanssi_WP_Auto_Update( $relevanssi_variables['plugin_version'], $relevanssi_plugin_remote_path, $relevanssi_variables['plugin_basename'] );
}
