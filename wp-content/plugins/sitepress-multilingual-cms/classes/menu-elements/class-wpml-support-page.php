<?php

class WPML_Support_Page {
	/**
	 * @var WPML_Support_Page_Controller
	 */
	private $controller;

	/**
	 * WPML_Support_Page constructor.
	 *
	 * @param WPML_Support_Page_Controller $controller
	 */
	public function __construct( WPML_Support_Page_Controller $controller ) {
		$this->controller = $controller;
	}

	public function display_compatibility_issues() {
		echo $this->get_notice_content();
	}

	public function init_hooks() {
		if ( $this->controller->must_display_notice() ) {
			add_action( 'admin_notices', [ $this, 'display_compatibility_issues' ] );
		}
	}

	private function get_notice_content() {
		$notice = [];
		if ( $this->controller->get_message() ) {
			$notice[] = '<div class="icl-admin-message icl-admin-message-icl-admin-message-error icl-admin-message-error notice notice-error">';

			$placeholders = [
				'{extension_name}',
				'{link_to_libxml_documentation}',
				'{link_to_php7_simple_xml_issues}',
				'{link_to_outdated_libxml}',
			];

			$replacements = [
				'<strong>libxml</strong>',
				'<a href="http://php.net/manual/en/book.libxml.php" target="_blank">http://php.net/manual/en/book.libxml.php</a>',
				'<a href="https://wpml.org/errata/php-7-possible-issues-simplexml/" target="_blank">PHP 7: possible issues with SimpleXML</a>',
				'<a href="https://wpml.org/errata/older-libxml-library-needs-update-on-your-server/" target="_blank">Older libxml PHP module Needs Update on your Server</a>',
			];

			$notice[] = str_replace( $placeholders, $replacements, $this->controller->get_message() );
			$notice[] = '</div>';
		}

		return implode( PHP_EOL, $notice );
	}

}
