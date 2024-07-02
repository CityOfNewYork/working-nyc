<?php

use LLAR\Core\Config;

if( !defined( 'ABSPATH' ) ) exit();

/**
 * @var $this LLAR\Core\LimitLoginAttempts
 */

$setup_code = Config::get( 'app_setup_code' );

if ( ! empty( $setup_code ) ) {
	return;
}

$admin_email = ( !is_multisite() ) ? get_option( 'admin_email' ) : get_site_option( 'admin_email' );
$url_site = parse_url( ( is_multisite() ) ? network_site_url() : site_url(), PHP_URL_HOST );

ob_start(); ?>
    <div class="micro_cloud_modal__content">
        <div class="micro_cloud_modal__body">
            <div class="micro_cloud_modal__body_header">
                <div class="left_side">
                    <div class="title">
                        <?php _e( 'Get Started with Micro Cloud for FREE', 'limit-login-attempts-reloaded' ); ?>
                    </div>
                    <div class="description">
                        <?php _e( 'Help us secure our network and we’ll provide you with limited access to our premium features including our login firewall, IP Intelligence, and performance optimizer.', 'limit-login-attempts-reloaded' ); ?>
                    </div>
                    <div class="description-add">
                        <?php _e( 'Please note that some domains have very high brute force activity, which may cause Micro Cloud to run out of resources in under 24 hours. We will send an email when resources are fully utilized and the app reverts back to the free version. You may upgrade to one of our premium plans to prevent the app from reverting.', 'limit-login-attempts-reloaded' ); ?>
                    </div>
                </div>
                <div class="right_side">
                    <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/micro-cloud-image-min.png">
                </div>
            </div>
            <div class="card mx-auto">
                <div class="card-header">
                    <div class="title">
                        <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/tools.png">
                        <?php _e( 'How To Activate Micro Cloud', 'limit-login-attempts-reloaded' ); ?>
                    </div>
                </div>
                <div class="card-body step-first">
                    <div class="description">
                        <?php _e( 'Please enter the email that will receive activation confirmation', 'limit-login-attempts-reloaded' ); ?>
                    </div>
                    <div class="field-wrap">
                        <div class="field-email">
                            <input type="text" class="input_border" id="llar-subscribe-email"
                                   placeholder="<?php _e( 'Your email', 'limit-login-attempts-reloaded' ); ?>"
                                   value="<?php esc_attr_e( $admin_email ); ?>">
                        </div>
                    </div>
                    <div class="field-checkbox">
                        <input type="checkbox" id="mc_consent_registering"/>
                        <span>
                            <?php echo sprintf(
	                            __( 'I consent to registering my domain name <b>%s</b> with the Limit Login Attempts Reloaded cloud service.', 'limit-login-attempts-reloaded' ),
	                            $url_site);
                            ?>
                        </span>
                    </div>
                    <div class="button_block-single">
                        <button class="button menu__item button__orange" id="llar-button_subscribe-email">
                            <?php _e( 'Continue', 'limit-login-attempts-reloaded' ); ?>
                            <span class="preloader-wrapper"><span class="spinner llar-app-ajax-spinner"></span></span>
                        </button>
                        <div class="description_add">
                            <?php echo sprintf(
                                __( 'By signing up you agree to our <a href="%s" class="llar_turquoise">terms of service</a> and <a href="%s" class="llar_turquoise">privacy policy.</a>', 'limit-login-attempts-reloaded' ),
                                'https://www.limitloginattempts.com/terms/', 'https://www.limitloginattempts.com/privacy-policy/' );
                            ?>
                        </div>
                    </div>
                </div>
                <div class="card-body step-second llar-display-none">
                    <div class="llar-upgrade-subscribe_notification__error llar-display-none">
                        <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/start.png">
                        <?php _e( 'The server is not working, try again later', 'limit-login-attempts-reloaded' ); ?>
                    </div>
                    <div class="llar-upgrade-subscribe_notification">
                        <div class="field-image">
                            <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/schema-ok-min.png">
                        </div>
                        <div class="description_add">
                            <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/start.png">
	                        <?php _e( 'Micro Cloud has been activated!', 'limit-login-attempts-reloaded' ); ?>
                        </div>
                    </div>
                    <div class="button_block-single">
                        <button class="button next_step menu__item button__orange" id="llar-button_dashboard">
                            <?php _e( 'Go To Dashboard', 'limit-login-attempts-reloaded' ); ?>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php
$micro_cloud_popup_content = ob_get_clean();
?>

<script>
    ;( function( $ ) {

        $( document ).ready( function() {

            const $button_micro_cloud = $( '.button.button_micro_cloud, a.button_micro_cloud' );

            $button_micro_cloud.on( 'click', function () {
                micro_cloud_modal.open();
            } )

            const micro_cloud_modal = $.dialog( {
                title: false,
                content: `<?php echo trim( $micro_cloud_popup_content ); ?>`,
                lazyOpen: true,
                type: 'default',
                typeAnimated: true,
                draggable: false,
                animation: 'top',
                animationBounce: 1,
                offsetTop: 50,
                boxWidth: 1280,
                bgOpacity: 0.9,
                useBootstrap: false,
                closeIcon: true,
                buttons: {},
                onOpenBefore: function () {

                    const $subscribe_email = $( '#llar-subscribe-email' );
                    const $button_subscribe_email = $( '#llar-button_subscribe-email' );
                    const $card_body_first = $( '.card-body.step-first' );
                    const $card_body_second = $( '.card-body.step-second' );
                    const $button_dashboard = $( '#llar-button_dashboard' );
                    const $consent_registering = $( '#mc_consent_registering' );
                    const $subscribe_notification = $( '.llar-upgrade-subscribe_notification' );
                    const $subscribe_notification_error = $( '.llar-upgrade-subscribe_notification__error' );
                    const $spinner = $button_subscribe_email.find( '.preloader-wrapper .spinner' );
                    const disabled = 'llar-disabled';
                    const visibility = 'llar-visibility';

                    let email = $subscribe_email.val().trim();

                    $button_subscribe_email.addClass( disabled );

                    $subscribe_email.on( 'input', function () {
                        $consent_registering.prop( 'checked', false );
                        $consent_registering.trigger( 'change' );
                    } );

                    $subscribe_email.on( 'blur', function() {

                        email = $( this ).val().trim();

                        if ( email === '' || email === null || ! llar_is_valid_email( email ) ) {
                            $consent_registering.prop( 'disabled', true );
                        } else {
                            $consent_registering.prop( 'disabled', false );
                        }
                    } );

                    $consent_registering.on( 'change', function () {

                        const is_checked = $( this ).prop( 'checked' );

                        if( is_checked ) {
                            $button_subscribe_email.removeClass( disabled );
                        } else {
                            $button_subscribe_email.addClass( disabled );
                        }
                    } );

                    $button_subscribe_email.on( 'click', function ( e ) {
                        e.preventDefault();

                        if ( $button_subscribe_email.hasClass( disabled ) ) {
                            return;
                        }

                        $button_subscribe_email.addClass( disabled );
                        $spinner.addClass( visibility );

                        llar_activate_micro_cloud( email )
                            .then( function() {

                                $button_subscribe_email.removeClass( disabled );
                            } )
                            .catch( function() {

                                $subscribe_notification_error.removeClass( 'llar-display-none' );
                                $subscribe_notification.addClass( 'llar-display-none' );
                            } )
                            .finally( function() {

                                $card_body_first.addClass( 'llar-display-none' );
                                $card_body_second.removeClass( 'llar-display-none' );
                            } );

                        $button_dashboard.on( 'click', function () {
                            let clear_url = window.location.protocol + "//" + window.location.host + window.location.pathname;
                            window.location = clear_url + '?page=limit-login-attempts&tab=dashboard';

                        } )

                    } )
                }
            } );


            micro_cloude_hash( window.location.hash );

            $( window ).on( 'hashchange', function() {
                micro_cloude_hash( window.location.hash );
            } );

            function micro_cloude_hash( current_hash ) {

                const target_hash = '#modal_micro_cloud';

                if ( current_hash && current_hash === target_hash ) {
                    $button_micro_cloud.click();
                }
            }

        } )

    } )( jQuery )
</script>