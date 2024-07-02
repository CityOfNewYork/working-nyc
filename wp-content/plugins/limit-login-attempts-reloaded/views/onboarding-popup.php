<?php

use LLAR\Core\Config;

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

/**
 * @var $this LLAR\Core\LimitLoginAttempts
 */

$admin_notify_email      = Config::get( 'admin_notify_email' );
$admin_email             = ! empty($admin_notify_email)
                               ? $admin_notify_email
                               : ( ( ! is_multisite() ) ? get_option( 'admin_email' ) : get_site_option( 'admin_email' ) );
$onboarding_popup_shown = Config::get( 'onboarding_popup_shown' );
$setup_code             = Config::get( 'app_setup_code' );

$url_site = parse_url( ( is_multisite() ) ? network_site_url() : site_url(), PHP_URL_HOST );

if ( $onboarding_popup_shown || ! empty( $setup_code ) ) {
	return;
}

ob_start(); ?>
<div class="llar-onboarding-popup__content">
    <div class="logo">
        <img src="<?php echo LLA_PLUGIN_URL ?>assets/img/icon-logo-menu-dark.png">
    </div>
    <div class="llar-onboarding__line">
        <div class="point__block visited active" data-step="1">
            <div class="point"></div>
            <div class="description">
				<?php _e( 'Welcome', 'limit-login-attempts-reloaded' ); ?>
            </div>
        </div>
        <div class="point__block" data-step="2">
            <div class="point"></div>
            <div class="description">
				<?php _e( 'Notifications', 'limit-login-attempts-reloaded' ); ?>
            </div>
        </div>
        <div class="point__block" data-step="3">
            <div class="point"></div>
            <div class="description">
				<?php _e( 'Limited Upgrade', 'limit-login-attempts-reloaded' ); ?>
            </div>
        </div>
        <div class="point__block" data-step="4">
            <div class="point"></div>
            <div class="description">
				<?php _e( 'Completion', 'limit-login-attempts-reloaded' ); ?>
            </div>
        </div>
    </div>
    <div class="llar-onboarding__body">
        <div class="title">
            <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/welcome.png">
			<?php _e( 'Welcome', 'limit-login-attempts-reloaded' ); ?>
        </div>
        <div class="card mx-auto">
            <div class="field-wrap">
                <div class="field-title">
					<?php _e( 'Add your Setup Code', 'limit-login-attempts-reloaded' ); ?>
                </div>
                <div class="field-key">
                    <input type="text" class="input_border" id="llar-setup-code-field" placeholder="<?php _e('Your Setup Code', 'limit-login-attempts-reloaded' ) ?>" value="">
                    <button class="button menu__item button__orange llar-disabled" id="llar-app-install-btn">
						<?php _e( 'Activate', 'limit-login-attempts-reloaded' ); ?>
                        <span class="dashicons dashicons-arrow-right-alt"></span>
                        <span class="preloader-wrapper"><span class="spinner llar-app-ajax-spinner"></span></span>
                    </button>
                </div>
                <div class="field-error"></div>
                <div class="field-desc">
					<?php _e( 'The Setup Code can be found in your email if you have subscribed to premium', 'limit-login-attempts-reloaded' ); ?>
                </div>
            </div>
        </div>
        <div class="card mx-auto">
            <div class="field-wrap">
                <div class="field-title">
					<?php _e( 'Not A Premium User?', 'limit-login-attempts-reloaded' ); ?>
                </div>
                <div class="field-desc-add">
					<?php _e( 'We <b>highly recommend</b> upgrading to premium for the best protection against brute force attacks and unauthorized logins', 'limit-login-attempts-reloaded' ); ?>
                </div>
                <ul class="field-list">
                    <li class="item">
						<?php _e( 'Detect, counter, and deny unauthorized logins with IP Intelligence', 'limit-login-attempts-reloaded' ); ?>
                    </li>
                    <li class="item">
						<?php _e( 'Absorb failed login activity to improve site performance', 'limit-login-attempts-reloaded' ); ?>
                    </li>
                    <li class="item">
						<?php _e( 'Block IPs by country, premium support, and much more!', 'limit-login-attempts-reloaded' ); ?>
                    </li>
                </ul>
                <div class="field-video" id="video-play">
                    <div class="video-container" id="video-container">
                        <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/video-bg.webp" id="video-poster">
                        <iframe id="video-frame" width="560" height="315"
                                src="https://www.youtube.com/embed/JfkvIiQft14"
                                title="YouTube video player" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowfullscreen></iframe>
                    </div>
                </div>
                <div class="button_block">
                    <a href="https://www.limitloginattempts.com/info.php?from=plugin-onboarding-plans"
                       class="button menu__item button__orange" target="_blank">
						<?php _e( 'Yes, show me plan options', 'limit-login-attempts-reloaded' ); ?>
                    </a>
                    <button class="button next_step menu__item button__transparent_orange">
						<?php _e( 'No, I don’t want advanced protection', 'limit-login-attempts-reloaded' ); ?>
                    </button>
                </div>
            </div>
            <div class="button_block-single">
                <button class="button next_step menu__item button__transparent_grey button-skip">
					<?php _e( 'Skip', 'limit-login-attempts-reloaded' ); ?>
                </button>
            </div>
        </div>
    </div>
</div>
<?php
$popup_complete_install_content = ob_get_clean();
?>

<?php
ob_start(); ?>
<div class="llar-onboarding__body">
    <div class="title">
        <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/email.png">
		<?php _e( 'Notification Settings', 'limit-login-attempts-reloaded' ); ?>
    </div>
    <div class="card mx-auto">
        <div class="field-wrap">
            <div class="field-email">
                <input type="text" class="input_border" id="llar-subscribe-email" placeholder="<?php _e( 'Your email', 'limit-login-attempts-reloaded' ); ?>"
                       value="<?php esc_attr_e( $admin_email ); ?>">
            </div>
            <div class="field-desc-additional">
				<?php _e( 'This email will receive notifications of unauthorized access to your website. You may turn this off in your settings.', 'limit-login-attempts-reloaded' ); ?>
            </div>
            <div class="field-checkbox">
                <input type="checkbox" name="lockout_notify_email" value="email"/>
                <span>
                    <?php _e( 'Sign me up for the LLAR newsletter to receive important security alerts, plugin updates, and helpful guides.', 'limit-login-attempts-reloaded' ); ?>
                </span>
            </div>
        </div>
    </div>
    <div class="button_block-horizon">
        <button class="button menu__item button__orange" id="llar-subscribe-email-button">
			<?php _e( 'Continue', 'limit-login-attempts-reloaded' ) ?>
            <span class="preloader-wrapper"><span class="spinner llar-app-ajax-spinner"></span></span>
        </button>
        <button class="button next_step menu__item button__transparent_orange button-skip" style="display: none">
			<?php _e( 'Skip', 'limit-login-attempts-reloaded' ); ?>
        </button>
    </div>
</div>

<?php
$content_step_2 = ob_get_clean();
?>

<?php
ob_start(); ?>
<div class="llar-onboarding__body">
    <div class="title">
        <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/rocket-min.png">
		<?php _e( 'Limited Upgrade (Free)', 'limit-login-attempts-reloaded' ); ?>
    </div>
    <div class="card mx-auto">
        <div class="field-wrap" id="llar-description-step-3">
            <div class="field-desc-add">
				<?php _e( 'Help us secure our network and we’ll provide you with limited access to our premium features including our login firewall, IP intelligence, and performance optimizer (up to 1,000 requests monthly).', 'limit-login-attempts-reloaded' ); ?>
            </div>
            <div class="field-desc-add">
				<?php _e( '<b>Would you like to opt-in?</b>', 'limit-login-attempts-reloaded' ); ?>
            </div>
            <div class="field-desc">
		        <?php _e( 'Please enter the email that will receive activation confirmation', 'limit-login-attempts-reloaded' ); ?>
            </div>
            <div class="field-email">
                <input type="text" class="input_border" id="llar-subscribe-mc-email" placeholder="<?php _e( 'Your email', 'limit-login-attempts-reloaded' ); ?>" value="">
            </div>
            <div class="field-checkbox">
                <input type="checkbox" id="onboarding_consent_registering"/>
                <span>
                    <?php echo sprintf(
                        __( 'I consent to registering my domain name <b>%s</b> with the Limit Login Attempts Reloaded cloud service.', 'limit-login-attempts-reloaded' ),
                        $url_site);
                    ?>
                </span>
            </div>
        </div>
        <div class="llar-upgrade-subscribe">
            <div class="button_block-horizon">
                <button class="button menu__item button__transparent_grey gray-back"
                        id="llar-limited-upgrade-subscribe">
					<?php _e( 'Sign Me Up', 'limit-login-attempts-reloaded' ); ?>
                    <span class="preloader-wrapper"><span class="spinner llar-app-ajax-spinner"></span></span>
                </button>
            </div>
            <div class="explanations">
				<?php echo sprintf(
					__( 'You may opt-out of this program at any time. You accept our <a class="link__style_color_inherit llar_turquoise" href="%s" target="_blank">terms of service</a> by participating in this program.', 'limit-login-attempts-reloaded' ),
					'https://www.limitloginattempts.com/terms/'
				); ?>
            </div>
        </div>
        <div class="llar-upgrade-subscribe_notification">
            <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/start.png">
			<?php _e( 'Congrats! Your website is now activated for Micro Cloud. Account information has been emailed to you for your reference.', 'limit-login-attempts-reloaded' ); ?>
        </div>
        <div class="llar-upgrade-subscribe_notification__error">
            <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/start.png">
			<?php _e( 'The server is not working, try again later', 'limit-login-attempts-reloaded' ); ?>
        </div>
        <div class="button_block-single">
            <button class="button next_step menu__item button__transparent_grey button-skip">
				<?php _e( 'Skip', 'limit-login-attempts-reloaded' ); ?>
            </button>
            <button class="button next_step menu__item button__transparent_orange orange-back llar-display-none">
				<?php _e( 'Continue', 'limit-login-attempts-reloaded' ); ?>
            </button>
        </div>
    </div>
</div>

<?php
$content_step_3 = ob_get_clean();
?>

<?php
ob_start(); ?>
<div class="llar-onboarding__body">
    <div class="title">
        <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/like-min.png">
		<?php _e( 'Thank you for completing the setup', 'limit-login-attempts-reloaded' ); ?>
    </div>
    <div class="card mx-auto">
        <div class="field-image">
            <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/schema-ok-min.png">
        </div>
        <div class="button_block-single">
            <button class="button next_step menu__item button__orange">
				<?php _e( 'Go To Dashboard', 'limit-login-attempts-reloaded' ); ?>
            </button>
        </div>
    </div>
</div>

<?php
$content_step_4 = ob_get_clean();
?>

<script>
    ;( function ( $ ) {

        $( document ).ready( function () {

            const ondoarding_modal = $.dialog( {
                title: false,
                content: `<?php echo trim( $popup_complete_install_content ); ?>`,
                type: 'default',
                typeAnimated: true,
                draggable: false,
                animation: 'top',
                animationBounce: 1,
                offsetTop: 50,
                offsetBottom: 0,
                boxWidth: '95%',
                containerFluid: true,
                bgOpacity: 0.9,
                useBootstrap: false,
                closeIcon: true,
                onClose: function () {
                    let data = {
                        action: 'dismiss_onboarding_popup',
                        sec: llar_vars.nonce_dismiss_onboarding_popup
                    }
                    llar_ajax_callback_post( ajaxurl, data )
                        .then( function () {
                            let clear_url = window.location.protocol + "//" + window.location.host + window.location.pathname;
                            window.location = clear_url + '?page=limit-login-attempts&tab=dashboard';
                        } )
                },
                buttons: {},
                onOpenBefore: function () {

                    const button_next = 'button.button.next_step';
                    const $setup_code_key = $( '#llar-setup-code-field' );
                    const $activate_button = $( '#llar-app-install-btn' );
                    const $spinner = $activate_button.find( '.preloader-wrapper .spinner' );
                    const disabled = 'llar-disabled';
                    const visibility = 'llar-visibility';
                    let email;

                    $setup_code_key.on( 'input', function () {

                        if ( $( this ).val().trim() !== '' ) {
                            $activate_button.removeClass( disabled );
                        } else {
                            $activate_button.addClass( disabled );
                        }
                    });

                    $activate_button.on( 'click', function ( e ) {
                        e.preventDefault();

                        if ( $activate_button.hasClass( disabled ) ) {
                            return;
                        }

                        const $error = $( '.field-error' );
                        const $setup_code = $setup_code_key.val();
                        $error.text( '' ).hide();
                        $activate_button.addClass( disabled );
                        $spinner.addClass( visibility );

                        llar_activate_license_key( $setup_code )
                            .then( function () {
                                setTimeout( function () {
                                    next_step_line( 2 );
                                    $( button_next ).trigger( 'click' );
                                }, 500 );
                            } )
                            .catch( function ( response ) {

                                if ( ! response.success && response.data.msg ) {
                                    $error.text( response.data.msg ).show();

                                    setTimeout( function () {
                                        $error.text( '' ).hide();
                                        $setup_code_key.val( '' );

                                    }, 4000 );
                                    $spinner.removeClass( visibility );
                                }
                            } );
                    } )

                    $( document ).on( 'click', button_next, function () {

                        let next_step = next_step_line();
                        const $html_onboarding_body = $( '.llar-onboarding__body' );

                        if ( next_step === 2 ) {
                            $html_onboarding_body.replaceWith( <?php echo json_encode( trim( $content_step_2 ), JSON_HEX_QUOT | JSON_HEX_TAG ); ?> );

                            const $subscribe_email = $( '#llar-subscribe-email' );
                            const $subscribe_email_button = $( '#llar-subscribe-email-button' );
                            const $spinner = $subscribe_email_button.find( '.preloader-wrapper .spinner' );

                            email = $subscribe_email.val().trim();

                            $subscribe_email.on( 'blur', function () {

                                email = $ ( this ).val().trim();

                                if ( ! llar_is_valid_email( email ) ) {
                                    $subscribe_email_button.addClass( disabled )
                                } else {
                                    $subscribe_email_button.removeClass( disabled )
                                }
                            });

                            $subscribe_email_button.on( 'click', function () {

                                const $is_subscribe = !! $( '.field-checkbox input[name="lockout_notify_email"]' ).prop( 'checked' );

                                $subscribe_email_button.addClass( disabled );
                                $spinner.addClass( visibility );

                                let data = {
                                    action: 'subscribe_email',
                                    email: email,
                                    is_subscribe_yes: $is_subscribe,
                                    sec: llar_vars.nonce_subscribe_email
                                }

                                llar_ajax_callback_post( ajaxurl, data )
                                    .then( function () {
                                        $subscribe_email_button.removeClass( disabled );
                                        $( button_next ).trigger( 'click' );
                                    } )

                            } )
                        } else if ( next_step === 3 ) {

                            $html_onboarding_body.replaceWith( <?php echo json_encode( trim( $content_step_3 ), JSON_HEX_QUOT | JSON_HEX_TAG ); ?> );

                            const $limited_upgrade_subscribe = $( '#llar-limited-upgrade-subscribe' );
                            const $block_upgrade_subscribe = $( '.llar-upgrade-subscribe' );
                            const $subscribe_notification = $( '.llar-upgrade-subscribe_notification' );
                            const $subscribe_notification_error = $( '.llar-upgrade-subscribe_notification__error' );
                            const $consent_registering = $( '#onboarding_consent_registering' );
                            const $button_next = $( '.button.next_step' );
                            const $button_skip = $button_next.filter( '.button-skip' );
                            const $spinner = $limited_upgrade_subscribe.find( '.preloader-wrapper .spinner' );
                            const $description = $( '#llar-description-step-3' );
                            const $subscribe_mc_email = $( '#llar-subscribe-mc-email' );


                            if ( email === '' || email === null ) {
                                email = '<?php esc_attr_e( $admin_email ); ?>'
                            }

                            $subscribe_mc_email.val(email);
                            $limited_upgrade_subscribe.addClass( disabled );

                            $subscribe_mc_email.on( 'input', function () {
                                $consent_registering.prop( 'checked', false );
                                $consent_registering.trigger( 'change' );
                            } );

                            $subscribe_mc_email.on( 'blur', function () {

                                email = $ ( this ).val().trim();

                                if ( email === '' || email === null || ! llar_is_valid_email( email ) ) {
                                    $consent_registering.prop( 'disabled', true );
                                } else {
                                    $consent_registering.prop( 'disabled', false );
                                }
                            });

                            $consent_registering.on( 'change', function () {

                                const is_checked = $( this ).prop( 'checked' );

                                if( is_checked ) {
                                    $limited_upgrade_subscribe.removeClass( disabled );
                                    $limited_upgrade_subscribe.removeClass( 'button__transparent_grey gray-back' );
                                    $limited_upgrade_subscribe.addClass( 'button__orange' );
                                } else {
                                    $limited_upgrade_subscribe.addClass( disabled );
                                    $limited_upgrade_subscribe.addClass( 'button__transparent_grey gray-back' );
                                    $limited_upgrade_subscribe.removeClass( 'button__orange' );
                                }
                            } );

                            $limited_upgrade_subscribe.on( 'click', function () {

                                $button_next.addClass( disabled );
                                $limited_upgrade_subscribe.addClass( disabled );
                                $spinner.addClass( visibility );

                                llar_activate_micro_cloud( email )
                                    .then( function () {
                                        $description.addClass( 'llar-display-none' );
                                        $subscribe_notification.addClass( 'llar-display-block' );
                                        $button_next.removeClass( disabled );
                                        $button_next.removeClass( 'llar-display-none' );
                                        $button_skip.addClass( 'llar-display-none' );
                                    })
                                    .catch( function ( response ) {
                                        $subscribe_notification_error.text( response.data.msg )
                                        $subscribe_notification_error.addClass( 'llar-display-block' )
                                        $button_skip.removeClass( disabled );
                                    })
                                    .finally( function () {
                                        $block_upgrade_subscribe.addClass( 'llar-display-none' );
                                    } )

                            });
                        } else if ( next_step === 4 ) {
                            $html_onboarding_body.replaceWith( <?php echo json_encode( trim( $content_step_4 ), JSON_HEX_QUOT | JSON_HEX_TAG ); ?> );
                        } else if ( !next_step ) {
                            ondoarding_modal.close();
                        }
                    } )
                }
            } );
        } )

        function next_step_line( offset = 1 ) {

            let step_line = $( '.llar-onboarding__line .point__block' );
            let active_step = step_line.filter( '.active' ).data( 'step' );

            if ( active_step < 4 ) {
                step_line.filter( '[data-step="' + active_step + '"]' ).removeClass( 'active' );

                for ( let i = 1; i <= offset; i++ ) {
                    active_step++;
                    step_line.filter( '[data-step="' + active_step + '"]' ).addClass( 'visited' );
                }

                step_line.filter( '[data-step="' + active_step + '"]' ).addClass( 'active' );
                return active_step;
            } else {
                return false;
            }
        }

    } )( jQuery )
</script>