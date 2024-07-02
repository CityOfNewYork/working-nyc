<?php
/*
Plugin Name: Limit Login Attempts Reloaded
Description: Block excessive login attempts and protect your site against brute force attacks. Simple, yet powerful tools to improve site performance.
Author: Limit Login Attempts Reloaded
Author URI: https://www.limitloginattempts.com/
Text Domain: limit-login-attempts-reloaded
Version: 2.26.11

Copyright 2008 - 2012 Johan Eenfeldt, 2016 - 2023 Limit Login Attempts Reloaded
*/

if( !defined( 'ABSPATH' ) ) exit;

/***************************************************************************************
 * Constants
 **************************************************************************************/
define( 'LLA_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'LLA_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'LLA_PLUGIN_FILE', __FILE__ );
define( 'LLA_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/***************************************************************************************
 * Different ways to get remote address: direct & behind proxy
 **************************************************************************************/
define( 'LLA_DIRECT_ADDR', 'REMOTE_ADDR' );
define( 'LLA_PROXY_ADDR', 'HTTP_X_FORWARDED_FOR' );

/* Notify value checked against these in limit_login_sanitize_variables() */
define( 'LLA_LOCKOUT_NOTIFY_ALLOWED', 'log,email' );

$limit_login_my_error_shown = false; /* have we shown our stuff? */
$limit_login_just_lockedout = false; /* started this pageload??? */
$limit_login_nonempty_credentials = false; /* user and pwd nonempty */

if( file_exists( LLA_PLUGIN_DIR . 'autoload.php' ) ) {

	require_once( LLA_PLUGIN_DIR . 'autoload.php' );

	add_action( 'plugins_loaded', function() {
		(new LLAR\Core\LimitLoginAttempts());
	}, 9999 );
}