<?php
/**
 * Login Firewall
 *
 * @var bool $is_exhausted
 * @var bool $is_active_app_custom
 * @var string $block_sub_group
 * @var string $upgrade_premium_url
 *
 */


if ( ! defined( 'ABSPATH' ) ) exit();
?>

<div id="llar-setting-page-logs__active" class="limit-login-app-dashboard">

    <?php if ( $is_active_app_custom && $block_sub_group === 'Micro Cloud' && $is_exhausted ) : ?>

        <div id="llar-header-login-custom-message">
            <div class="message-flex">
                <div class="col-first">
                    <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/micro-cloud-image-min.png">
                </div>
                <div class="col-second">
	                <?php _e( 'Your Micro Cloud plan has exhausted its requests for the month, which is required to operate the Login Firewall.', 'limit-login-attempts-reloaded' ) ?>
                </div>
                <div class="col-third">
                    <div class="row-first">
	                    <?php echo sprintf(
		                    __( 'You can <a href="%s" class="link__style_color_inherit llar_bold" target="_blank">Upgrade to Premium</a> to increase requests.', 'limit-login-attempts-reloaded' ),
		                    $upgrade_premium_url );
	                    ?>
                    </div>
                    <div class="row-second">
                        <hr><span><?php _e( 'Or', 'limit-login-attempts-reloaded' ) ?></span><hr>
                    </div>
                    <div class="row-third">
	                    <?php _e( 'Switch to the failover to access IP management tools with the free version.', 'limit-login-attempts-reloaded' ) ?>
                    </div>
                </div>
            </div>
        </div>

    <?php endif; ?>

	<?php include_once( LLA_PLUGIN_DIR.'views/app-widgets/login-attempts.php'); ?>
	<?php include_once( LLA_PLUGIN_DIR.'views/app-widgets/active-lockouts.php'); ?>
	<?php include_once( LLA_PLUGIN_DIR.'views/app-widgets/event-log.php'); ?>
	<?php include_once( LLA_PLUGIN_DIR.'views/app-widgets/country-access-rules.php'); ?>
	<?php include_once( LLA_PLUGIN_DIR.'views/app-widgets/acl-rules.php'); ?>

</div>