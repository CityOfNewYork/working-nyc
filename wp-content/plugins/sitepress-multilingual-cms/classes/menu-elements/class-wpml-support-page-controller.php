<?php

class WPML_Support_Page_Controller {
	private $wpml_wp_api;

	/**
	 * WPML_Support_Page constructor.
	 *
	 * @param WPML_WP_API $wpml_wp_api
	 */
	public function __construct( WPML_WP_API $wpml_wp_api ) {
		$this->wpml_wp_api = $wpml_wp_api;
	}

	/**
	 * @return string
	 */
	private function missing_extension_message() {
		return '<p class="missing-extension-message">'
		       . esc_html__( 'It looks like the {extension_name} extension, which is required by WPML, is not installed. Please refer to this link to know how to install this extension: {link_to_libxml_documentation}.', 'sitepress' )
		       . '</p>';
	}

	/**
	 * @return string
	 */
	private function old_extension_message() {
		return '<p class="outdated-extension-message">'
		       . esc_html__( 'It looks like the {extension_name} extension, which is required by WPML, is outdated. Please refer to this link to know why a more recent version of the module is required: {link_to_outdated_libxml}.', 'sitepress' )
		       . '</p>';
	}

	/**
	 * @return string
	 */
	private function missing_extension_message_for_php7() {
		return '<p class="missing-extension-message-for-php7">' . esc_html__( 'You are using PHP 7: in some cases, the extension might have been removed during a system update. In this case, please see {link_to_php7_simple_xml_issues}.', 'sitepress' ) . '</p>';
	}

	/**
	 * @return string
	 */
	private function contact_the_admin() {
		return '<p class="contact-the-admin">' . esc_html__( 'You may need to contact your server administrator or your hosting company to install this extension.', 'sitepress' ) . '</p>';
	}

	public function must_display_notice() {
		if ( ! $this->wpml_wp_api->is_back_end() ) {
			return false;
		}

		if ( $this->has_outdated_libxml() ) {
			return true;
		}

		if ( $this->wpml_wp_api->is_support_page() && ! $this->has_libxml() ) {
			return true;
		}

		return false;
	}

	/**
	 * @return string
	 */
	public function get_message() {
		if ( ! $this->must_display_notice() ) {
			return '';
		}

		$message = [];
		if ( ! $this->has_libxml() ) {
			$message[] = $this->missing_extension_message();

			if ( $this->has_php7() ) {
				$message[] = $this->missing_extension_message_for_php7();
			}

		} elseif ( $this->has_outdated_libxml() ) {
			$message[] = $this->old_extension_message();
		}

		if ( $message ) {
			$message[] = $this->contact_the_admin();
		}

		return implode( PHP_EOL, $message );
	}

	/**
	 * @return bool
	 */
	private function has_libxml() {
		return $this->wpml_wp_api->extension_loaded( 'libxml' );
	}

	/**
	 * @return mixed
	 */
	private function has_outdated_libxml() {
		if ( ! $this->has_libxml() ) {
			return false;
		}

		$libxml_version = $this->wpml_wp_api->get_module_version( 'libxml', 'libXML Compiled Version' );
		if ( ! $libxml_version ) {
			$libxml_version = $this->wpml_wp_api->get_module_version( 'dom', 'libxml Version' );
		}
		if ( ! $libxml_version ) {
			$libxml_version = $this->wpml_wp_api->get_module_version( 'xml', 'libxml2 Version' );
		}

		if ( ! $libxml_version ) {
			return false;
		}

		return $this->wpml_wp_api->version_compare_naked( $libxml_version, '2.7.8', '<' );
	}

	/**
	 * @return mixed
	 */
	private function has_php7() {
		return $this->wpml_wp_api->version_compare_naked( $this->wpml_wp_api->phpversion(), '7.0.0', '>=' );
	}
}
