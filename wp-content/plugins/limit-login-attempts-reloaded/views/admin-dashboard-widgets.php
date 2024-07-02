<?php
/**
 * Admin dashboard widgets
 *
 */

use LLAR\Core\Config;
use LLAR\Core\LimitLoginAttempts;

if ( ! defined( 'ABSPATH' ) ) exit();

$active_app = ( Config::get( 'active_app' ) === 'custom' && LimitLoginAttempts::$cloud_app ) ? 'custom' : 'local';
$is_active_app_custom = $active_app === 'custom';

if ( $is_active_app_custom ) {

	$is_exhausted = $this->info_is_exhausted();
	$block_sub_group = $this->info_sub_group();
	$upgrade_premium_url = $this->info_upgrade_url();
} else {

	$is_exhausted = false;
	$block_sub_group = '';
	$upgrade_premium_url = '';
}

$api_stats = $is_active_app_custom ? LimitLoginAttempts::$cloud_app->stats() : false;
$setup_code = Config::get( 'app_setup_code' );
?>

<div id="llar-admin-dashboard-widgets">
    <div class="llar-widget">
        <div class="widget-content">
	        <?php include_once( LLA_PLUGIN_DIR . 'views/chart-circle-failed-attempts-today.php'); ?>
        </div>
    </div>
    <div class="llar-widget widget-2">
        <div class="widget-content">
	        <?php include_once( LLA_PLUGIN_DIR . 'views/chart-failed-attempts.php'); ?>
        </div>
    </div>
</div>
