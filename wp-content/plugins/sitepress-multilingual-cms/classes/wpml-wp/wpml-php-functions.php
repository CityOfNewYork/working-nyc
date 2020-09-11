<?php

/**
 * Wrapper class for basic PHP functions
 */
class WPML_PHP_Functions {

	/**
	 * Wrapper around PHP constant defined
	 *
	 * @param string $constant_name
	 *
	 * @return bool
	 */
	public function defined( $constant_name ) {
		return defined( $constant_name );
	}

	/**
	 * Wrapper around PHP constant lookup
	 *
	 * @param string $constant_name
	 *
	 * @return string|int
	 */
	public function constant( $constant_name ) {
		return $this->defined( $constant_name ) ? constant( $constant_name ) : null;
	}

	/**
	 * @param string $function_name The function name, as a string.
	 *
	 * @return bool true if <i>function_name</i> exists and is a function, false otherwise.
	 * This function will return false for constructs, such as <b>include_once</b> and <b>echo</b>.
	 */
	public function function_exists( $function_name ) {
		return function_exists( $function_name );
	}

	/**
	 * @param string $class_name The class name. The name is matched in a case-insensitive manner.
	 * @param bool   $autoload [optional] Whether or not to call &link.autoload; by default.
	 *
	 * @return bool true if <i>class_name</i> is a defined class, false otherwise.
	 */
	public function class_exists( $class_name, $autoload = true ) {
		return class_exists( $class_name, $autoload );
	}

	/**
	 * @param string $name The extension name.
	 *
	 * @return bool true if the extension identified by <i>name</i> is loaded, false otherwise.
	 */
	public function extension_loaded( $name ) {
		return extension_loaded( $name );
	}

	private function phpinfo2array() {
		static $phpinfo;

		if ( ! $phpinfo || defined( 'WPML_PHP_INFO_HTML_FILE' ) ) {
			$php_info_html = $this->get_phpinfo_html();
			$info_arr      = array();
			$info_lines    = explode( "\n", strip_tags( $php_info_html, '<tr><td><h2>' ) );
			$cat           = 'General';
			foreach ( $info_lines as $line ) {
				if ( preg_match( '~<h2>(.*)</h2>~', $line, $title ) ) {
					$cat = trim( $title[1] );
				}
				if ( preg_match( '~<tr><td[^>]+>([^<]*)</td><td[^>]+>([^<]*)</td></tr>~', $line, $val ) ) {
					$info_arr[ $cat ][ trim( $val[1] ) ] = trim( $val[2] );
				} elseif ( preg_match( '~<tr><td[^>]+>([^<]*)</td><td[^>]+>([^<]*)</td><td[^>]+>([^<]*)</td></tr>~', $line, $val ) ) {
					$info_arr[ $cat ][ trim( $val[1] ) ] = array(
						'local'  => trim( $val[2] ),
						'master' => trim( $val[3] ),
					);
				}
			}
			$phpinfo = $info_arr;
		}

		return $phpinfo;
	}

	/**
	 * @param string $name The name of the module.
	 * @param string $attribute The label of the attribute to read.
	 *
	 * @return string
	 */
	public function get_module_version( $name, $attribute ) {
		$modules_info = $this->phpinfo2array();

		if ( array_key_exists( $name, $modules_info ) && array_key_exists( $attribute, $modules_info[ $name ] ) ) {
			return $modules_info[ $name ][ $attribute ];
		}

		return null;
	}

	/**
	 * @param string $string
	 *
	 * @return string
	 */
	public function mb_strtolower( $string ) {
		if ( function_exists( 'mb_strtolower' ) ) {
			return mb_strtolower( $string );
		}

		return strtolower( $string );
	}

	/**
	 * Wrapper for \phpversion()
	 *
	 * @param string $extension (optional).
	 *
	 * @return string
	 */
	public function phpversion( $extension = null ) {
		if ( defined( 'PHP_VERSION' ) ) {
			return PHP_VERSION;
		} else {
			return phpversion( $extension );
		}
	}

	/**
	 * Compares two "PHP-standardized" version number strings
	 *
	 * @param string $version1
	 * @param string $version2
	 * @param null   $operator
	 *
	 * @return mixed
	 * @see \WPML_WP_API::version_compare
	 */
	public function version_compare( $version1, $version2, $operator = null ) {
		return version_compare( $version1, $version2, $operator );
	}

	/**
	 * @param array $array
	 * @param int   $sort_flags
	 *
	 * @return array
	 */
	public function array_unique( $array, $sort_flags = SORT_REGULAR ) {
		return wpml_array_unique( $array, $sort_flags );
	}

	/**
	 * @param string $message
	 * @param int    $message_type
	 * @param string $destination
	 * @param string $extra_headers
	 *
	 * @return bool
	 */
	public function error_log( $message, $message_type = null, $destination = null, $extra_headers = null ) {
		// phpcs:disable WordPress.PHP.DevelopmentFunctions.error_log_error_log
		return error_log( $message, $message_type, $destination, $extra_headers );
		// phpcs:enable
	}

	public function exit_php() {
		exit();
	}

	/**
	 * @return false|string
	 */
	private function get_phpinfo_html() {
		if ( defined( 'WPML_PHP_INFO_HTML_FILE' ) ) {
			if ( ! function_exists( 'WP_Filesystem' ) ) {
				require_once ABSPATH . 'wp-admin/includes/file.php';
			}
			WP_Filesystem();
			global $wp_filesystem;

			return $wp_filesystem->get_contents( WPML_PHP_INFO_HTML_FILE );
		}

		ob_start();
		// phpcs:disable WordPress.PHP.DevelopmentFunctions.prevent_path_disclosure_phpinfo
		phpinfo();
		// phpcs:enable
		$php_info_html = ob_get_clean();

		return $php_info_html;
	}
}
