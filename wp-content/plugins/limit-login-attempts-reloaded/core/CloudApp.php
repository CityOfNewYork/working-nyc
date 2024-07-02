<?php

namespace LLAR\Core;

use Exception;
use LLAR\Core\Http\Http;

if ( ! defined( 'ABSPATH' ) ) exit;

class CloudApp
{
	/**
	 * @var null|string
	 */
	private $id = null;

	/**
	 * @var null|string
	 */
	private $api = null;

	/**
	 * @var array
	 */
	private $config = array();

	/**
	 * @var array
	 */
	private $login_errors = array();

	/**
	 * @var null
	 */
	public $last_response_code = null;

	/**
	 * @var array
	 */
	private $stats_cache = array();

	/**
	 * App constructor.
	 * @param array $config
	 */
	public function __construct( array $config )
	{
		if ( empty( $config ) ) {
			return false;
		}

		$this->id = 'app_' . $config['id'];
		$this->api = $config['api'];
		$this->config = $config;
	}

	/**
	 * @param $error
	 * @return bool
	 */
	public function add_error( $error )
	{
		if ( ! $error ) {
			return false;
		}

		$this->login_errors[] = $error;
	}

	/**
	 * @return array
	 */
	public function get_errors()
	{
		return $this->login_errors;
	}

	/**
	 * @return null|string
	 */
	public function get_id()
	{
		return $this->id;
	}

	/**
	 * @return array
	 */
	public function get_config()
	{
		return $this->config;
	}

	/**
	 * @param $link
	 * @return false[]
	 */
	public static function setup( $link )
	{
		$return = array(
			'success' => false,
		);

		if ( empty( $link ) ) {
			return $return;
		}

		$link = 'https://' . $link;

		$domain = parse_url( home_url( '/' ) );
		$link = add_query_arg( 'domain', $domain['host'], $link );

		$plugin_data = get_plugin_data( LLA_PLUGIN_DIR . 'limit-login-attempts-reloaded.php' );
		$link = add_query_arg( 'version', $plugin_data['Version'], $link );

		$setup_response = Http::get( $link );
		$setup_response_body = json_decode( $setup_response['data'], true );

		if ( ! empty( $setup_response['error'] ) ) {

			$return['error'] = $setup_response['error'];

		} elseif( $setup_response['status'] === 200 ) {

			$return['success'] = true;
			$return['app_config'] = $setup_response_body;

		} else {

			$return['error'] = ( ! empty( $setup_response_body['message'] ) )
								? $setup_response_body['message']
								: __( 'The endpoint is not responding. Please contact your app provider to settle that.', 'limit-login-attempts-reloaded' );

			$return['response_code'] = $setup_response['status'];
		}

		return $return;
	}

	public static function activate_license_key( $setup_code )
	{
		$link = strrev( $setup_code );
		$setup_result = self::setup( $link );

		if ( $setup_result['success'] ) {

			if ( $setup_result['app_config'] ) {

				Helpers::cloud_app_update_config( $setup_result['app_config'], true );

				Config::update( 'active_app', 'custom' );
				Config::update( 'app_setup_code', $setup_code );

				$setup_result['app_config']['messages']['setup_success'] =
					! empty( $setup_result['app_config']['messages']['setup_success'] )
					? $setup_result['app_config']['messages']['setup_success']
					: __( 'The app has been successfully imported.', 'limit-login-attempts-reloaded' );

				return $setup_result;
			}
		} else {

			return $setup_result;
		}

		return $setup_result;
	}

	/**
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function stats()
	{
		if ( empty( $this->stats_cache ) ) {
			$this->stats_cache = $this->request( 'stats' );
		}

		return $this->stats_cache;
	}

	/**
	 * @return bool|mixed
	 */
	public static function stats_global()
	{
		$response = Http::get( 'https://api.limitloginattempts.com/v1/global-stats' );

		if ( $response['status'] !== 200 ) {
			return false;
		}

		return json_decode( $response['data'], true );
	}

	/**
	 * @param $data
	 *
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function acl_check( $data )
	{
		$this->prepare_settings( 'acl', $data );

		return $this->request( 'acl', 'post', $data );
	}

	/**
	 * @param $data
	 *
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function acl( $data )
	{
		return $this->request( 'acl', 'get', $data );
	}

    /**
     * @return bool|mixed
     * @throws Exception
     */
    public function info()
    {
        return $this->request( 'info' );
    }

	/**
	 * @param $data
	 *
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function acl_create( $data )
	{
		return $this->request( 'acl/create', 'post', $data );
	}

	/**
	 * @param $data
	 *
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function acl_delete( $data )
	{
		return $this->request( 'acl/delete', 'post', $data );
	}

	/**
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function country()
	{
		return $this->request( 'country', 'get' );
	}

	/**
	 * @param $data
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function country_add( $data )
	{
		return $this->request( 'country/add', 'post', $data );
	}

	/**
	 * @param $data
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function country_remove( $data )
	{
		return $this->request( 'country/remove', 'post', $data );
	}

	/**
	 * @param $data
	 *
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function country_rule( $data )
	{
		return $this->request( 'country/rule', 'post', $data );
	}

	/**
	 * @param $data
	 *
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function lockout_check( $data )
	{
		$this->prepare_settings( 'lockout', $data );

		return $this->request( 'lockout', 'post', $data );
	}

	/**
	 * @param int $limit
	 * @param string $offset
	 *
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function log($limit = 25, $offset = '')
	{
		$data = array();

		$data['limit'] = $limit;
		$data['offset'] = $offset;
		$data['is_short'] = 1;

		return $this->request( 'log', 'get', $data );
	}


	/**
	 * @param int $limit
	 * @param string $offset
	 *
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function get_login($limit = 25, $offset = '')
	{
		$data = array();

		$data['limit'] = $limit;
		$data['offset'] = $offset;
		$data['is_short'] = 1;

		return $this->request( 'login', 'get', $data );
	}


	/**
	 * @param int $limit
	 * @param string $offset
	 *
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function get_lockouts($limit = 25, $offset = '')
	{
		$data = array();

		$data['limit'] = $limit;
		$data['offset'] = $offset;

		return $this->request( 'lockout', 'get', $data );
	}

	/**
	 * Prepare settings for API request
	 *
	 * @param $method
	 */
	public function prepare_settings( $method, &$data )
	{
		$settings = array();

		if ( ! empty( $this->config['settings'] ) ) {

			foreach ( $this->config['settings'] as $setting_name => $setting_data ) {

				if ( in_array( $method, $setting_data['methods'] ) ) {
					$settings[$setting_name] = $setting_data['value'];
				}
			}
		}

		if ( $settings ) {
			$data['settings'] = $settings;
		}
	}

	/**
	 * @param $method
	 * @param string $type
	 * @param null $data
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function request( $method, $type = 'get', $data = null )
	{
		if ( ! $method ) {
			throw new Exception( 'You must specify API method.' );
		}

		$headers = array();
		$headers[] = "{$this->config['header']}: {$this->config['key']}";

		$response = Http::$type( $this->api.'/'.$method, array(
			'data'      => $data,
			'headers'   => $headers
		) );

		$this->last_response_code = !empty( $response['status'] ) ? $response['status'] : 0;

		if ( $response['status'] !== 200 ) {
			return false;
		}

		return Helpers::sanitize_stripslashes_deep( json_decode( $response['data'], true ) );
	}
}
