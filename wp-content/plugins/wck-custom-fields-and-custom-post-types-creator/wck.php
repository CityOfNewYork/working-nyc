<?php
/*
Plugin Name: WCK - Custom Fields and Custom Post Types Creator
Description: WordPress Creation Kit consists of three tools that can help you create and maintain custom post types, custom taxonomies and most importantly, custom fields and metaboxes for your posts, pages or CPT's.
Author: Cozmoslabs, Madalin Ungureanu, Cristian Antohe
Version: 2.3.6
Author URI: http://www.cozmoslabs.com
Text Domain: wck
Domain Path: /languages

License: GPL2

== Copyright ==
Copyright 2016 Cozmoslabs (wwww.cozmoslabs.com)

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
*/

define( 'WCK_PLUGIN_DIR', WP_PLUGIN_DIR . '/' . dirname( plugin_basename( __FILE__ ) ) );
define( 'WCK_PLUGIN_DIR_URL', plugin_dir_url( __FILE__ ) );
define( 'WCK_PLUGIN_VERSION', '2.7.1' );

/* ready for localization */
$current_theme = wp_get_theme();
if( !empty( $current_theme->stylesheet ) && file_exists( get_theme_root().'/'. $current_theme->stylesheet .'/local_wck_lang' ) )
    load_plugin_textdomain( 'wck', false, basename( dirname( __FILE__ ) ).'/../../themes/'.$current_theme->stylesheet.'/local_wck_lang' );
else
    load_plugin_textdomain( 'wck', false, basename( dirname( __FILE__ ) ) . '/languages' );



/* include Custom Fields Creator API */
require_once('wordpress-creation-kit-api/wordpress-creation-kit.php');

/* include Notices Class */
if( file_exists( dirname(__FILE__).'/inc/class_notices.php' ) )
    require_once('inc/class_notices.php');

/* Create the WCK Page only for admins ( 'capability' => 'edit_theme_options' ) */
$args = array(							
			'page_title' => __( 'Wordpress Creation Kit', 'wck' ),
			'menu_title' => 'WCK',
			'capability' => 'edit_theme_options',
			'menu_slug' => 'wck-page',									
			'page_type' => 'menu_page',
			'position' => '30.27',
			'priority' => 7,
			'icon_url' => plugins_url('/images/wck-menu-item.png', __FILE__)
		);
new WCK_Page_Creator( $args );

/* Remove the automatically created submenu page */
add_action('admin_menu', 'wck_remove_wck_submenu_page', 11);
function wck_remove_wck_submenu_page(){
	remove_submenu_page( 'wck-page', 'wck-page' );
}

/* include template API */
if( file_exists( dirname(__FILE__).'/wck-template-api/wck-template-api.php' ) )
	require_once('wck-template-api/wck-template-api.php');

/* include Start and Settings Page */
require_once('wck-sas.php');

$wck_tools = get_option( 'wck_tools' );
if( $wck_tools ){
	if( !empty( $wck_tools[0]['custom-fields-creator'] ) ){
		$wck_cfc = $wck_tools[0]['custom-fields-creator'];		
	}
	if( !empty( $wck_tools[0]['custom-post-type-creator'] ) ){
		$wck_cptc = $wck_tools[0]['custom-post-type-creator'];		
	}
	if( !empty( $wck_tools[0]['custom-taxonomy-creator'] ) ){
		$wck_ctc = $wck_tools[0]['custom-taxonomy-creator'];		
	}
	if( !empty( $wck_tools[0]['frontend-posting'] ) ){
		$wck_fep = $wck_tools[0]['frontend-posting'];		
	}
	if( !empty( $wck_tools[0]['option-pages-creator'] ) ){
		$wck_opc = $wck_tools[0]['option-pages-creator'];		
	}
	if( !empty( $wck_tools[0]['swift-templates'] ) ){
		$wck_stp = $wck_tools[0]['swift-templates'];		
	}	
	if( !empty( $wck_tools[0]['swift-templates-and-front-end-posting'] ) ){
		$wck_free_to_pro = $wck_tools[0]['swift-templates-and-front-end-posting'];		
	}
}
/* include Custom Post Type Creator */
if( !isset( $wck_cptc ) || $wck_cptc == 'enabled' )
	require_once('wck-cptc.php');
/* include Custom Taxonomy Creator */
if( !isset( $wck_ctc ) || $wck_ctc == 'enabled' )
	require_once('wck-ctc.php');
/* include Custom Fields Creator */
if( !isset( $wck_cfc ) || $wck_cfc == 'enabled' )
	require_once('wck-cfc.php');



/* include FrontEnd Posting */
if( file_exists( dirname(__FILE__).'/wck-fep.php' ) && ( !isset( $wck_fep ) || $wck_fep == 'enabled' ) )
	require_once('wck-fep.php');
/* include Option Page Creator */
if( file_exists( dirname(__FILE__).'/wck-opc.php' ) && ( !isset( $wck_opc ) || $wck_opc == 'enabled' ) )
	require_once('wck-opc.php');

/* include Swift Templates */
if( file_exists( dirname(__FILE__).'/wck-stp.php' ) && ( !isset( $wck_stp ) || $wck_stp == 'enabled' ) )
	require_once('wck-stp.php');	
	
/* Include Free to Pro menu items */
if( !file_exists( dirname(__FILE__).'/wck-fep.php' ) && !file_exists( dirname(__FILE__).'/wck-stp.php' ) && !file_exists( dirname(__FILE__).'/update/update-checker.php' ) && ( !isset( $wck_free_to_pro ) || $wck_free_to_pro == 'enabled' )){
	require_once('wck-free-to-pro.php');
}

/* Include Map Helper Field */
if( ( ( !isset( $wck_cfc ) || $wck_cfc == 'enabled' ) || ( !isset( $wck_opc ) || $wck_opc == 'enabled' ) ) && file_exists( dirname( __FILE__ ) . '/wordpress-creation-kit-api/assets/map/map.php' ) )
    require_once( 'wordpress-creation-kit-api/assets/map/map.php' );

	
/* deactivation hook */
register_deactivation_hook( __FILE__, 'wck_deactivate_function' );
function wck_deactivate_function() {
	/* remove capabilities from subscriber that were added by FEP */
	$role = get_role( 'subscriber' );
    if( !empty( $role ) ){
        $role->remove_cap('upload_files');
        $role->remove_cap('edit_posts');
    }
}

/* activation hook */
add_action( 'admin_init', 'wck_maybe_unserialize' );
function wck_maybe_unserialize() {
	/* we need to see if there already are cfcs present so we can update them to the new unserialized structure introduced in wck 2.3.4 */

	$option_already_exists = get_option( 'wck_update_to_unserialized' );
	if( empty( $option_already_exists ) ){
		$args = array(
			'posts_per_page' => -1,
			'numberposts' => -1,
			'post_type' => 'wck-meta-box',
			'post_status' => 'any'
		);
		$meta_boxes = get_posts( $args );
		/* we don't have metaboxes created */
		if( empty( $meta_boxes ) ){
			add_option( 'wck_update_to_unserialized', 'no' );
		}
		else{
			add_option( 'wck_update_to_unserialized', 'yes' );
		}
	}
}

/* check for updates */
if (file_exists (WCK_PLUGIN_DIR.'/update/update-checker.php')){
	require_once ( WCK_PLUGIN_DIR.'/update/update-checker.php');
	(array)$wck_serial = get_option('wck_serial');
	if( !empty( $wck_serial[0] ) )
		$wck_serial = urlencode( $wck_serial[0]['serial-number'] );
	if(empty($wck_serial) || $wck_serial == '') $wck_serial = '';
	
	if (file_exists ( WCK_PLUGIN_DIR . '/wordpress-creation-kit-api/wck-fep/wck-fep.php' )){
		$wck_update = new wck_PluginUpdateChecker('http://updatemetadata.cozmoslabs.com/?localSerialNumber='.$wck_serial.'&uniqueproduct=WCKP', __FILE__, 'wck-pro');
	} else {
		$wck_update = new wck_PluginUpdateChecker('http://updatemetadata.cozmoslabs.com/?localSerialNumber='.$wck_serial.'&uniqueproduct=WCKH', __FILE__, 'wck-hobby');
	}
}

/* Add admin footer text for encouraging users to leave a review of the plugin on wordpress.org */
function wck_admin_rate_us( $footer_text ) {
    global $current_screen;

    if ($current_screen->parent_base == 'wck-page'){
        $rate_text = sprintf( __( 'If you enjoy using <strong> WordPress Creation Kit </strong> please <a href="%1$s" target="_blank">rate us on WordPress.org</a> to help us reach more people. More happy users means more features, less bugs and better support for everyone. ', 'wck' ),
            'https://wordpress.org/support/view/plugin-reviews/wck-custom-fields-and-custom-post-types-creator?filter=5#postform'
        );
        return '<span id="footer-thankyou">' .$rate_text . '</span>';
    } else {
        return $footer_text;
    }
}
add_filter('admin_footer_text','wck_admin_rate_us');

/* include nested repeaters */
/* if( file_exists( dirname(__FILE__).'/wordpress-creation-kit-api/wck-nested-repeaters/wck-nested-repeaters.php' ) )
	require_once('wordpress-creation-kit-api/wck-nested-repeaters/wck-nested-repeaters.php'); */
?>
