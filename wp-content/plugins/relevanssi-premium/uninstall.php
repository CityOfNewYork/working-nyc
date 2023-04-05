<?php
/**
 * /uninstall.php
 *
 * @package Relevanssi Premium
 * @author  Mikko Saari
 * @license https://wordpress.org/about/gpl/ GNU General Public License
 * @see     https://www.relevanssi.com/
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit();
}

global $wpdb;
define( 'RELEVANSSI_PREMIUM', true );
require_once 'lib/uninstall.php';
require_once 'premium/uninstall.php';

if ( function_exists( 'is_multisite' ) && is_multisite() ) {
	$blogids    = $wpdb->get_col( "SELECT blog_id FROM $wpdb->blogs" );
	$old_blogid = $wpdb->blogid;
	foreach ( $blogids as $blog_id ) {
		switch_to_blog( $blog_id );
		relevanssi_uninstall();
	}
	switch_to_blog( $old_blogid );

	delete_site_option( 'relevanssi_api_key' );
} else {
	relevanssi_uninstall();
}
