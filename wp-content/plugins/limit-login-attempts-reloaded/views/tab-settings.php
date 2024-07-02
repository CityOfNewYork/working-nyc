<?php

use LLAR\Core\Config;
use LLAR\Core\Helpers;

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

/**
 * @var $this LLAR\Core\LimitLoginAttempts
 */

$gdpr         = Config::get( 'gdpr' );
$gdpr_message = Config::get( 'gdpr_message' );

$v             = explode( ',', Config::get( 'lockout_notify' ) );
$email_checked = in_array( 'email', $v );

$show_top_level_menu_item = Config::get( 'show_top_level_menu_item' );
$show_top_bar_menu_item   = Config::get( 'show_top_bar_menu_item' );
$hide_dashboard_widget    = Config::get( 'hide_dashboard_widget' );
$show_warning_badge       = Config::get( 'show_warning_badge' );

$admin_notify_email      = Config::get( 'admin_notify_email' );

$trusted_ip_origins = Config::get( 'trusted_ip_origins' );
$trusted_ip_origins = ( is_array( $trusted_ip_origins ) && ! empty( $trusted_ip_origins ) ) ? implode( ", ", $trusted_ip_origins ) : 'REMOTE_ADDR';

$active_app        = Config::get( 'active_app' );
$app_setup_code    = Config::get( 'app_setup_code' );
$active_app_config = Config::get( 'app_config' );

$is_local_empty_setup_code = ( $active_app === 'local' && empty( $app_setup_code ) );

$min_plan = 'Premium';
$plans = $this->array_name_plans();
$block_sub_group = ( $active_app === 'custom' ) ? $this->info_sub_group() : false;
$is_premium = ( $active_app === 'custom' && $plans[ $block_sub_group ] >= $plans[ $min_plan ] );

$url_try_for_free = 'https://www.limitloginattempts.com/upgrade/?from=plugin-';
$url_try_for_free_cloud = ( $active_app === 'custom' ) ? $this->info_upgrade_url() : '';
?>

<?php if ( isset( $_GET['llar-cloud-activated'] ) && ! empty( $active_app_config['messages']['setup_success'] ) ) : ?>

    <div class="llar-app-notice success">
        <p><?php echo $active_app_config['messages']['setup_success']; ?></p>
    </div>
<?php endif; ?>


<div id="llar-setting-page">
    <form action="<?php echo $this->get_options_page_uri( 'settings' ); ?>" method="post">
        <div class="llar-settings-wrap">
            <h3 class="title_page">
                <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/icon-gears.png">
				<?php _e( 'App Settings', 'limit-login-attempts-reloaded' ); ?>
            </h3>
            <div class="description-page">
				<?php _e( 'The app absorbs the main load caused by brute-force attacks, analyzes login attempts, and blocks unwanted visitors. It provides other service functions as well.', 'limit-login-attempts-reloaded' ); ?>
            </div>
            <div class="llar-settings-wrap">
                <table class="llar-form-table">
	                <?php if ( $is_local_empty_setup_code ) : ?>
                    <tr>
                        <th scope="row" valign="top"><?php _e( 'Micro Cloud', 'limit-login-attempts-reloaded' ); ?>
                            <span class="hint_tooltip-parent">
                                <span class="dashicons dashicons-editor-help"></span>
                                <div class="hint_tooltip">
                                    <div class="hint_tooltip-content">
                                        <?php _e( 'Micro Cloud is a limited upgrade to our cloud app that provides complimentary access to our premium features', 'limit-login-attempts-reloaded' ); ?>
                                    </div>
                                </div>
                            </span>
                        </th>
                        <td>
                            <div class="description-secondary p-0">
								<?php _e('Help us secure our network by sharing your login IP data. In return, receive limited access to our premium features up to 1,000 requests for the first month, and 100 requests each subsequent month. Once requests are exceeded for a given month, the premium app will switch to FREE and reset the following month.', 'limit-login-attempts-reloaded' ) ?>
                            </div>
                            <div class="description-additional p-0 pt-1_5">
		                        <?php _e('* Requests are utilized when the cloud app validates an IP address before it is able to perform a login.', 'limit-login-attempts-reloaded' ) ?>
                            </div>
                            <div class="button_block">
                                <a href="https://www.limitloginattempts.com/premium-security-zero-cost-discover-the-benefits-of-micro-cloud/"
                                   title="Learn More"
                                   target="_blank"
                                   class="button menu__item button__transparent_orange link__style_unlink">
		                            <?php _e( 'Learn More', 'limit-login-attempts-reloaded' ); ?>
                                </a>
                                <a title="Upgrade To Micro Cloud"
                                   class="button menu__item button__orange button_micro_cloud link__style_unlink">
		                            <?php _e( 'Get Started', 'limit-login-attempts-reloaded' ); ?>
                                </a>
                            </div>
                        </td>
                    </tr>
	                <?php endif; ?>

                    <tr>
                        <th scope="row" valign="top"><?php _e( 'Active App', 'limit-login-attempts-reloaded' ); ?>
                            <span class="hint_tooltip-parent">
                                <span class="dashicons dashicons-editor-help"></span>
                                <div class="hint_tooltip">
                                    <div class="hint_tooltip-content">
                                        <?php _e( 'Switches from free version (local) to premium (cloud).', 'limit-login-attempts-reloaded' ); ?>
                                    </div>
                                </div>
                            </span>
                        </th>
                        <td>
                            <select class="input_border" name="active_app" id="">
                                <option value="local" <?php selected( $active_app, 'local' ); ?>>
									<?php _e( 'Local (Free version)', 'limit-login-attempts-reloaded' ); ?>
                                </option>
								<?php if ( $active_app_config ) : ?>

                                    <option value="custom" <?php selected( $active_app, 'custom' ); ?>>
	                                    <?php _e( 'Cloud App (Premium version)', 'limit-login-attempts-reloaded' ); ?>
                                    </option>
								<?php endif; ?>
                            </select>
							<?php if ( $active_app === 'local' ) : ?>
                                <span class="llar-protect-notice">
                                    <?php echo sprintf(
		                                __( 'Get advanced protection by <a href="%s" class="unlink llar-upgrade-to-cloud">upgrading to our Cloud App</a>.', 'limit-login-attempts-reloaded' ),
                                '#' );
                                ?>
                                    </span>
							<?php endif; ?>
                        </td>
                    </tr>
                </table>
            </div>

            <div id="llar-apps-accordion" class="llar-accordion">
                <h3><?php _e( 'Local App', 'limit-login-attempts-reloaded' ); ?></h3>
                <div>
                    <table class="llar-form-table">
                        <tr>
                            <th scope="row" valign="top"><?php _e( 'Lockout', 'limit-login-attempts-reloaded' ); ?>
                                <span class="hint_tooltip-parent">
                                    <span class="dashicons dashicons-editor-help"></span>
                                    <div class="hint_tooltip">
                                        <div class="hint_tooltip-content">
                                            <?php _e( 'Set lockout limits based on failed attempts.', 'limit-login-attempts-reloaded' ); ?>
                                        </div>
                                    </div>
                                </span>
                            </th>
                            <td>
                                <input class="input_border" type="text" size="3" maxlength="4"
                                       value="<?php echo( Config::get( 'allowed_retries' ) ); ?>"
                                       name="allowed_retries"/>
								<?php _e( 'allowed retries', 'limit-login-attempts-reloaded' ); ?>
                                <span class="hint_tooltip-parent">
                                    <span class="dashicons dashicons-secondary dashicons-editor-help"></span>
                                    <div class="hint_tooltip">
                                        <div class="hint_tooltip-content">
                                            <?php _e( 'Number of failed attempts allowed before locking out.', 'limit-login-attempts-reloaded' ); ?>
                                        </div>
                                    </div>
                                </span>
                                <br/>
                                <input class="input_border mt-0_5" type="text" size="3" maxlength="4"
                                       value="<?php echo( Config::get( 'lockout_duration' ) / 60 ); ?>"
                                       name="lockout_duration"/>
								<?php _e( 'minutes lockout', 'limit-login-attempts-reloaded' ); ?>
                                <span class="hint_tooltip-parent">
                                    <span class="dashicons dashicons-secondary dashicons-editor-help"></span>
                                    <div class="hint_tooltip">
                                        <div class="hint_tooltip-content">
                                            <?php _e( 'Lockout time in minutes.', 'limit-login-attempts-reloaded' ); ?>
                                        </div>
                                    </div>
                                </span>
                                <br/>
                                <input class="input_border mt-0_5" type="text" size="3" maxlength="4"
                                       value="<?php echo( Config::get( 'allowed_lockouts' ) ); ?>"
                                       name="allowed_lockouts"/> <?php _e( 'lockouts increase lockout time to', 'limit-login-attempts-reloaded' ); ?>
                                <input class="input_border" type="text" size="3" maxlength="4"
                                       value="<?php echo( Config::get( 'long_duration' ) / 3600 ); ?>"
                                       name="long_duration"/>
								<?php _e( 'hours', 'limit-login-attempts-reloaded' ); ?>
                                <span class="hint_tooltip-parent">
                                    <span class="dashicons dashicons-secondary dashicons-editor-help"></span>
                                    <div class="hint_tooltip">
                                        <div class="hint_tooltip-content">
                                            <?php _e( 'After the specified number of lockouts the lockout time will increase by specified hours.', 'limit-login-attempts-reloaded' ); ?>
                                        </div>
                                    </div>
                                </span>
                                <br/>
                                <input class="input_border mt-0_5" type="text" size="3" maxlength="4"
                                       value="<?php echo( Config::get( 'valid_duration' ) / 3600 ); ?>"
                                       name="valid_duration"/>
								<?php _e( 'hours until retries are reset', 'limit-login-attempts-reloaded' ); ?>
                                <span class="hint_tooltip-parent">
                                    <span class="dashicons dashicons-secondary dashicons-editor-help"></span>
                                    <div class="hint_tooltip">
                                        <div class="hint_tooltip-content">
                                            <?php _e( 'Time in hours before blocks are removed.', 'limit-login-attempts-reloaded' ); ?>
                                        </div>
                                    </div>
                                </span>
                                <div class="description-secondary mt-0_5 p-0">
									<?php echo sprintf(
										__( 'After a specific IP address fails to log in <b>%1$s</b> times, a lockout lasting <b>%2$s</b> minutes is activated. If additional failed attempts occur within <b>%3$s</b> hours and lead to another lockout, once their combined total hits <b>%4$s</b>, the <b>%2$s</b> minutes duration is extended to <b>%5$s</b> hours. The lockout will be lifted once <b>%3$s</b> hours have passed since the last lockout incident.', 'limit-login-attempts-reloaded' ),
										Config::get( 'allowed_retries' ),
										Config::get( 'lockout_duration' ) / 60,
										Config::get( 'valid_duration' ) / 3600,
										Config::get( 'allowed_lockouts' ),
										Config::get( 'long_duration' ) / 3600
									); ?>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" valign="top"><?php _e( 'Trusted IP Origins', 'limit-login-attempts-reloaded' ); ?>
                                <span class="hint_tooltip-parent">
                                    <span class="dashicons dashicons-editor-help"></span>
                                    <div class="hint_tooltip">
                                        <div class="hint_tooltip-content">
                                            <?php _e( 'Server variables containing IP addresses.', 'limit-login-attempts-reloaded' ); ?>
                                        </div>
                                    </div>
                                </span>
                            </th>
                            <td>
                                <div class="field-col">
                                    <input class="input_border regular-text" type="text" name="lla_trusted_ip_origins"
                                           value="<?php esc_attr_e( $trusted_ip_origins ); ?>">
                                    <div class="description-secondary mt-0_5 p-0">
										<?php _e( 'Specify the origins you trust in order of priority, separated by commas. We strongly recommend that you <b>do not</b> use anything other than REMOTE_ADDR since other origins can be easily faked. Examples: HTTP_X_FORWARDED_FOR, HTTP_CF_CONNECTING_IP, HTTP_X_SUCURI_CLIENTIP', 'limit-login-attempts-reloaded' ); ?>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
	                <?php if ( $active_app === 'local' || ! $is_premium ) : ?>
                    <div class="add_block__under_table">
                        <div class="description">
							<?php _e( 'Why Use Our Premium Cloud App?', 'limit-login-attempts-reloaded' ); ?>
                        </div>
                        <div class="add_block__list">
                            <div class="item">
                                <img class="icon" src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/icon-lock-bg.png">
                                <div class="name">
									<?php _e( 'Absorb site load caused by attacks', 'limit-login-attempts-reloaded' ); ?>
                                </div>
                            </div>
                            <div class="item">
                                <img class="icon" src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/icon-ip-bg.png">
                                <div class="name">
									<?php _e( 'Use intelligent IP denial/unblocking technology', 'limit-login-attempts-reloaded' ); ?>
                                </div>
                            </div>
                            <div class="item">
                                <img class="icon"
                                     src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/icon-blocklist-bg.png">
                                <div class="name">
									<?php _e( 'Sync the allow/deny/pass lists between multiple domains', 'limit-login-attempts-reloaded' ); ?>
                                </div>
                            </div>
                            <div class="item">
                                <img class="icon"
                                     src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/icon-tech-support-bg.png">
                                <div class="name">
									<?php _e( 'Get premium support', 'limit-login-attempts-reloaded' ); ?>
                                </div>
                            </div>
                            <div class="item">
                                <img class="icon"
                                     src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/icon-backup-bg.png">
                                <div class="name">
									<?php _e( 'Run auto backups of access control lists, lockouts and logs', 'limit-login-attempts-reloaded' ); ?>
                                </div>
                            </div>
                            <div class="item">
                                <img class="icon"
                                     src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/icon-cancellation-bg.png">
                                <div class="name">
									<?php _e( 'No contract - cancel anytime', 'limit-login-attempts-reloaded' ); ?>
                                </div>
                            </div>
                        </div>
	                    <?php if ( $is_local_empty_setup_code ) : ?>
		                    <?php require_once( LLA_PLUGIN_DIR . 'views/micro-cloud-modal.php') ?>
                            <a class="button menu__item button_micro_cloud button__transparent_orange" target="_blank">
			                    <?php _e( 'Try For FREE', 'limit-login-attempts-reloaded' ); ?>
                            </a>
                        <?php elseif ( $block_sub_group === 'Micro Cloud' ) : ?>
                            <a href="<?php echo esc_url( $url_try_for_free_cloud ) ?>" class="button menu__item button__transparent_orange" target="_blank">
			                    <?php _e( 'Upgrade', 'limit-login-attempts-reloaded' ); ?>
                            </a>
	                    <?php else : ?>
                            <a href="<?php echo esc_url( $url_try_for_free )  . 'settings-local-block' ?>" class="button menu__item button__transparent_orange" target="_blank">
			                    <?php _e( 'Get Started', 'limit-login-attempts-reloaded' ); ?>
                            </a>
	                    <?php endif; ?>
                    </div>
	                <?php endif; ?>
                </div>
                <h3><?php ( $active_app_config ) ? esc_html_e( $active_app_config['name'] ) : _e( 'Custom App', 'limit-login-attempts-reloaded' ); ?></h3>
                <div class="custom-app-tab">
                    <table class="llar-form-table">
                        <tr>
                            <th scope="row" valign="top"><?php _e( 'Setup Code', 'limit-login-attempts-reloaded' ); ?>
                                <span class="hint_tooltip-parent">
                                    <span class="dashicons dashicons-editor-help"></span>
                                    <div class="hint_tooltip">
                                        <div class="hint_tooltip-content">
                                            <?php _e( 'This is the code you receive via email once you subscribe to the LLAR premium cloud app. (example xxxxxxxxxxxxx=yek?putes/1v/moc.stpmettanigoltimil.ipa)', 'limit-login-attempts-reloaded' ); ?>
                                        </div>
                                    </div>
                                </span>
                            </th>
                            <td>
								<?php if ( $active_app === 'custom' ) : ?>
                                    <a class="unlink link__style_unlink llar-toggle-setup-field" href="#">
										<?php _e( 'Edit', 'limit-login-attempts-reloaded' ); ?>
                                    </a>
								<?php endif; ?>
                                <div class="setup-code-wrap<?php echo ( $active_app === 'local' || ! $active_app_config ) ? ' active' : ''; ?>">
                                    <input class="input_border full_area regular-text" type="text"
                                           id="limit-login-app-setup-code"
                                           value="<?php echo ( ! empty( $app_setup_code ) ) ? esc_attr( $app_setup_code ) : ''; ?>">
                                    <button class="button menu__item button__transparent_orange"
                                            id="limit-login-app-setup">
										<?php _e( 'Submit', 'limit-login-attempts-reloaded' ); ?>
                                    </button>
                                    <span class="spinner llar-app-ajax-spinner"></span><br>
                                    <span class="llar-app-ajax-msg"></span>
                                    <div class="description-secondary mt-0_5 p-0">
										<?php _e( 'Add this code to all websites in your network to sync protection (payment required for additional domains unless it\'s with an Agency plan\'s first tier).', 'limit-login-attempts-reloaded' ) ?>
                                    </div>
                                </div>
                            </td>
                        </tr>
						<?php if ( $active_app === 'custom' && $active_app_config ) : ?>
                            <tr class="app-form-field">
                                <th scope="row" valign="top"><?php _e( 'Configuration', 'limit-login-attempts-reloaded' ); ?></th>
                                <td>
                                    <div class="field-col">
                                        <div class="textarea_border">
                                            <textarea id="limit-login-app-config" readonly="readonly"
                                                      name="limit-login-app-config" cols="60"
                                                      rows="5"><?php echo esc_textarea( json_encode( $active_app_config ) ); ?></textarea><br>
                                        </div>
                                    </div>
                                </td>
                            </tr>
						<?php endif; ?>

						<?php if ( $active_app === 'custom' && ! empty( $active_app_config['settings'] ) ) : ?>
							<?php foreach ( $active_app_config['settings'] as $setting_name => $setting_params ) : ?>
                                <tr>
                                    <th scope="row" valign="top"><?php echo $setting_params['label']; ?>
                                        <span class="hint_tooltip-parent">
                                            <span class="dashicons dashicons-editor-help"></span>
                                            <div class="hint_tooltip">
                                                <div class="hint_tooltip-content">
                                                    <?php esc_attr_e( $setting_params['description'] ); ?>
                                                </div>
                                            </div>
                                        </span>
                                    </th>
                                    <td>
                                        <div class="field-col">
											<?php if ( ! empty( $setting_params['options'] ) ) : ?>
                                                <select class="input_border"
                                                        name="llar_app_settings[<?php echo $setting_name; ?>]">
													<?php foreach ( $setting_params['options'] as $option ) : ?>
                                                        <option value="<?php esc_attr_e( $option ); ?>" <?php selected( $option, $setting_params['value'] ); ?>><?php esc_html_e( $option ); ?></option>
													<?php endforeach; ?>
                                                </select>
											<?php else : ?>
                                                <input class="input_border" type="text" class="regular-text"
                                                       name="llar_app_settings[<?php esc_attr_e( $setting_name ); ?>]"
                                                       value="<?php esc_attr_e( $setting_params['value'] ); ?>">
											<?php endif; ?>

                                            <p class="description"><?php esc_html_e( $setting_params['description'] ); ?></p>
                                        </div>
                                    </td>
                                </tr>
							<?php endforeach; ?>
						<?php endif; ?>
                    </table>
	                <?php if ( $active_app === 'local' || ! $is_premium ) : ?>
                    <div class="add_block__under_table image_plus">
                        <div class="row__list">
                            <div class="add_block__title">
                                <div class="description mt-1_5">
									<?php _e( 'Why Use Our Premium Cloud App?', 'limit-login-attempts-reloaded' ); ?>
                                </div>
	                            <?php if ( $is_local_empty_setup_code ) : ?>
                                    <a class="button menu__item button_micro_cloud button__transparent_orange mt-1_5" target="_blank">
			                            <?php _e( 'Try For FREE', 'limit-login-attempts-reloaded' ); ?>
                                    </a>
	                            <?php elseif ( $block_sub_group === 'Micro Cloud' ) : ?>
                                    <a href="<?php echo esc_url( $url_try_for_free_cloud ) ?>" class="button menu__item button__transparent_orange mt-1_5" target="_blank">
			                            <?php _e( 'Upgrade', 'limit-login-attempts-reloaded' ); ?>
                                    </a>
	                            <?php else : ?>
                                    <a href="<?php echo esc_url( $url_try_for_free ) . 'settings-cloud-block' ?>" class="button menu__item button__transparent_orange mt-1_5" target="_blank">
			                            <?php _e( 'Get Started', 'limit-login-attempts-reloaded' ); ?>
                                    </a>
	                            <?php endif; ?>
                            </div>
                            <div class="add_block__list">
                                <div class="item">
                                    <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/shield-min.png">
                                    <div class="name">
										<?php _e( 'Absorb site load caused by attacks', 'limit-login-attempts-reloaded' ); ?>
                                    </div>
                                </div>
                                <div class="item">
                                    <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/ip-min.png">
                                    <div class="name">
										<?php _e( 'Use intelligent IP denial/unblocking technology', 'limit-login-attempts-reloaded' ); ?>
                                    </div>
                                </div>
                                <div class="item">
                                    <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/cross-min.png">
                                    <div class="name">
										<?php _e( 'Sync the allow/deny/pass lists between multiple domains', 'limit-login-attempts-reloaded' ); ?>
                                    </div>
                                </div>
                                <div class="item">
                                    <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/call-min.png">
                                    <div class="name">
										<?php _e( 'Get premium support', 'limit-login-attempts-reloaded' ); ?>
                                    </div>
                                </div>
                                <div class="item">
                                    <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/backup-min.png">
                                    <div class="name">
										<?php _e( 'Run auto backups of access control lists, lockouts and logs', 'limit-login-attempts-reloaded' ); ?>
                                    </div>
                                </div>
                                <div class="item">
                                    <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/anytime-min.png">
                                    <div class="name">
										<?php _e( 'No contract - cancel anytime', 'limit-login-attempts-reloaded' ); ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
	                <?php endif; ?>
                </div>
            </div>
        </div>

        <p class="submit">
            <input class="button menu__item col button__orange" name="llar_update_settings"
                   value="<?php _e( 'Save Settings', 'limit-login-attempts-reloaded' ); ?>"
                   type="submit"/>
        </p>

        <h3 class="title_page">
            <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/icon-exploitation.png">
		    <?php _e( 'General Settings', 'limit-login-attempts-reloaded' ); ?>
        </h3>
        <div class="description-page">
		    <?php _e( 'These settings are independent of the apps.', 'limit-login-attempts-reloaded' ); ?>
        </div>

	    <?php wp_nonce_field( 'limit-login-attempts-options' ); ?>
	    <?php if ( is_network_admin() ) : ?>

        <input type="checkbox"
               name="allow_local_options" <?php echo Config::get( 'allow_local_options' ) ? 'checked' : '' ?>
               value="1"/> <?php _e( 'Let network sites use their own settings', 'limit-login-attempts-reloaded' ); ?>
            <p class="description"><?php _e( 'If disabled, the global settings will be forcibly applied to the entire network.', 'limit-login-attempts-reloaded' ) ?></p>
	    <?php elseif ( Helpers::is_network_mode() ): ?>

        <input type="checkbox"
               name="use_global_options" <?php echo Config::get( 'use_local_options' ) ? '' : 'checked' ?> value="1"
               class="use_global_options"/> <?php _e( 'Use global settings', 'limit-login-attempts-reloaded' ); ?>
        <br/>
            <script>
                jQuery( function ( $ ) {
                    var first = true;
                    $( '.use_global_options' ).change( function () {
                        var form = $( '.llar-settings-wrap' );
                        form.stop();

                        if ( this.checked ) {
                            first ? form.hide() : form.fadeOut();
                        } else {
                            first ? form.show() : form.fadeIn();
                        }

                        first = false;
                    } ).change();
                } );
            </script>
	    <?php endif ?>

        <div class="llar-settings-wrap">
            <table class="llar-form-table">
                <tr>
                    <th scope="row" valign="top"><?php _e( 'GDPR compliance', 'limit-login-attempts-reloaded' ); ?></th>
                    <td>
                        <input type="checkbox" name="gdpr" value="1" <?php if ( $gdpr ): ?> checked <?php endif; ?>/>
					    <?php echo sprintf(
						    __( 'This makes the plugin <a href="%s" class="unlink link__style_unlink" target="_blank">GDPR</a> compliant by showing a message on the login page. <a href="%s" class="unlink llar-label" target="_blank">Read more</a>', 'limit-login-attempts-reloaded' ),
						    'https://gdpr-info.eu/', 'https://www.limitloginattempts.com/gdpr-qa/?from=plugin-settings-gdpr' );
					    ?>
                        <br/>
                    </td>
                </tr>
                <tr>
                    <th scope="row" valign="top"><?php _e( 'GDPR message', 'limit-login-attempts-reloaded' ); ?>
                        <span class="hint_tooltip-parent">
                            <span class="dashicons dashicons-editor-help"></span>
                            <div class="hint_tooltip">
                                <div class="hint_tooltip-content">
                                    <?php _e( 'This message will appear at the bottom of the login page.', 'limit-login-attempts-reloaded' ); ?>
                                </div>
                            </div>
                        </span>
                    </th>
                    <td>
                        <div class="textarea_border">
                            <textarea name="gdpr_message" cols="85"><?php echo esc_textarea( stripslashes( $gdpr_message ) ); ?></textarea>
                        </div>
                        <div class="description-additional">
						    <?php _e( 'You can use a shortcode here to insert links, for example, a link to your Privacy Policy page. <br>The shortcode is: [llar-link url="https://example.com" text="Privacy Policy"]', 'limit-login-attempts-reloaded' ); ?>
                        </div>
                    </td>
                </tr>

			    <?php if ( false ) : // temporarily removed ?>
                    <tr>
                        <th scope="row" valign="top"><?php _e( 'Weekly Digest', 'limit-login-attempts-reloaded' ); ?>
                            <span class="hint_tooltip-parent">
                            <span class="dashicons dashicons-editor-help"></span>
                            <div class="hint_tooltip">
                                <div class="hint_tooltip-content">
                                    <?php _e( 'Weekly Digest', 'limit-login-attempts-reloaded'  ) ?>
                                </div>
                            </div>
                        </span>
                        </th>
                        <td>
                            <input type="checkbox" name="digest_email" <?php checked ( $email_checked ) ?>
                                   value="email"/> <?php _e( 'Email to', 'limit-login-attempts-reloaded' ); ?>
                            <input class="input_border" type="email" name="admin_digest_email"
                                   value="<?php esc_attr_e( $admin_notify_email ) ?>"
                                   placeholder="<?php _e( 'Your email', 'limit-login-attempts-reloaded' ); ?>"/>
                            <div class="description-secondary">
							    <?php _e( 'Receive a weekly digest that includes a recap of your failed logins and lockout notifications. Premium users will be able to see additional data such as countries and IPs with most failed logins.', 'limit-login-attempts-reloaded' ); ?>
                            </div>
                        </td>
                    </tr>
			    <?php endif; ?>

                <tr>
                    <th scope="row" valign="top" id="llar_lockout_notify"><?php _e( 'Notify on lockout', 'limit-login-attempts-reloaded' ); ?>
                        <span class="hint_tooltip-parent">
                            <span class="dashicons dashicons-editor-help"></span>
                            <div class="hint_tooltip">
                                <div class="hint_tooltip-content">
                                    <?php _e( 'Email address to which lockout notifications will be sent.', 'limit-login-attempts-reloaded' ); ?>
                                </div>
                            </div>
                        </span>
                    </th>
                    <td>
                        <input type="checkbox" name="lockout_notify_email" <?php checked ( $email_checked ); ?>
                               value="email"/> <?php _e( 'Email to', 'limit-login-attempts-reloaded' ); ?>
                        <input class="input_border" type="email" name="admin_notify_email"
                               value="<?php esc_attr_e( $admin_notify_email ) ?>"
                               placeholder="<?php _e( 'Your email', 'limit-login-attempts-reloaded' ); ?>"/> <?php _e( 'after', 'limit-login-attempts-reloaded' ); ?>
                        <input class="input_border" type="text" size="3" maxlength="4"
                               value="<?php echo( Config::get( 'notify_email_after' ) ); ?>"
                               name="email_after"/> <?php _e( 'lockouts', 'limit-login-attempts-reloaded' ); ?>
                        <button class="button menu__item col llar-test-email-notification-btn button__transparent_orange">
						    <?php _e( 'Test Email Notifications', 'limit-login-attempts-reloaded' ); ?>
                        </button>
                        <span class="preloader-wrapper llar-test-email-notification-loader">
                        <span class="spinner llar-app-ajax-spinner"></span>
                        <span class="msg"></span>
                    </span>
                        <div class="description-secondary"><?php echo sprintf(
							    __( 'It\'s not uncommon for web hosts to turn off emails for plugins as a security measure.<br>We\'ve <a class="llar_bold link__style_color_inherit" href="%s" target="_blank">created an article</a> to troubleshoot common email deliverability issues.', 'limit-login-attempts-reloaded' ),
							    'https://www.limitloginattempts.com/troubleshooting-guide-fixing-issues-with-non-functioning-emails-from-your-wordpress-site/'
						    ); ?>
                        </div>
                    </td>
                </tr>

                <tr>
                    <th scope="row" valign="top"><?php _e( 'Display top menu item', 'limit-login-attempts-reloaded' ); ?>
                        <span class="hint_tooltip-parent">
                            <span class="dashicons dashicons-editor-help"></span>
                            <div class="hint_tooltip">
                                <div class="hint_tooltip-content">
                                    <?php _e( 'The LLAR plugin displays its item on the top navigation menu, which provides a shortcut to the plugin.', 'limit-login-attempts-reloaded' ); ?>
                                </div>
                            </div>
                        </span>
                    </th>
                    <td>
                        <input type="checkbox" name="show_top_bar_menu_item" <?php checked( $show_top_bar_menu_item ); ?> >
					    <?php _e( '(Save and reload this page to see the changes)', 'limit-login-attempts-reloaded' ) ?>
                    </td>
                </tr>

                <tr>
                    <th scope="row" valign="top"><?php _e( 'Display left menu item', 'limit-login-attempts-reloaded' ); ?>
                        <span class="hint_tooltip-parent">
                            <span class="dashicons dashicons-editor-help"></span>
                            <div class="hint_tooltip">
                                <div class="hint_tooltip-content">
                                    <?php _e( 'The LLAR plugin displays its item on the left navigation menu, which provides a shortcut to the plugin.', 'limit-login-attempts-reloaded' ); ?>
                                </div>
                            </div>
                        </span>
                    </th>
                    <td>
                        <input type="checkbox" name="show_top_level_menu_item" <?php checked( $show_top_level_menu_item ); ?> >
					    <?php _e( '(Save and reload this page to see the changes)', 'limit-login-attempts-reloaded' ) ?>
                    </td>
                </tr>
                <tr>
                    <th scope="row" valign="top"><?php _e( 'Hide Dashboard Widget', 'limit-login-attempts-reloaded' ); ?>
                        <span class="hint_tooltip-parent">
                            <span class="dashicons dashicons-editor-help"></span>
                            <div class="hint_tooltip">
                                <div class="hint_tooltip-content">
                                    <?php _e( 'The LLAR dashboard widget provides a quick glance of your daily failed login activity on the main WordPress dashboard. You may hide this widget by checking this box.', 'limit-login-attempts-reloaded' ); ?>
                                </div>
                            </div>
                        </span>
                    </th>
                    <td>
                        <input type="checkbox" name="hide_dashboard_widget" <?php checked( $hide_dashboard_widget ); ?>>
                    </td>
                </tr>
                <tr>
                    <th scope="row" valign="top"><?php _e( 'Display Menu Warning Icon', 'limit-login-attempts-reloaded' ); ?>                        &nbsp;
                        <span class="hint_tooltip-parent">
                            <span class="dashicons dashicons-editor-help"></span>
                            <div class="hint_tooltip">
                                <div class="hint_tooltip-content">
                                    <?php _e( 'The warning badge is a red bubble icon displayed next to the LLAR logo on the main vertical navigation menu. It displays a warning if there were more than 100 attempts for a day.', 'limit-login-attempts-reloaded' ); ?>
                                </div>
                            </div>
                        </span>
                    </th>
                    <td>
                        <input type="checkbox" name="show_warning_badge" <?php checked( $show_warning_badge ); ?> >
					    <?php _e( '(Save and reload this page to see the changes)', 'limit-login-attempts-reloaded' ) ?>
                    </td>
                </tr>
            </table>
        </div>

        <script type="text/javascript">
            ( function ( $ ) {

                $( document ).ready( function () {

                    $( "#llar-apps-accordion" ).accordion( {
                        heightStyle: "content",
                        collapsible: true,
                        active: <?php echo ( $active_app === 'local' ) ? 0 : 1; ?>
                    } );

                    var $app_ajax_spinner = $( '.llar-app-ajax-spinner' ),
                        $app_ajax_msg = $( '.llar-app-ajax-msg' ),
                        $app_config_field = $( '#limit-login-app-config' );

                    if ( $app_config_field.val() ) {
                        var pretty = JSON.stringify( JSON.parse($app_config_field.val()), undefined, 2 );
                        $app_config_field.val( pretty );
                    }

                    $( '#limit-login-app-setup' ).on('click', function ( e ) {
                        e.preventDefault();

                        $app_ajax_msg.text( '' ).removeClass( 'success error' );
                        $app_ajax_spinner.css( 'visibility', 'visible' );

                        var setup_code = $( '#limit-login-app-setup-code' ).val();

                        $.post( ajaxurl, {
                            action: 'app_setup',
                            code: setup_code,
                            sec: '<?php echo esc_js( wp_create_nonce( "llar-app-setup" ) ); ?>',
                            is_network_admin: <?php echo esc_js( is_network_admin() ? 1 : 0 ); ?>
                        }, function ( response ) {

                            if ( ! response.success ) {

                                $app_ajax_msg.addClass( 'error' );
                            } else {

                                $app_ajax_msg.addClass( 'success' );

                                setTimeout( function () {

                                    window.location = window.location + '&llar-cloud-activated';

                                }, 1000 );
                            }

                            if ( ! response.success && response.data.msg ) {

                                $app_ajax_msg.text( response.data.msg );
                            }

                            $app_ajax_spinner.css( 'visibility', 'hidden' );

                            setTimeout( function () {

                                $app_ajax_msg.text( '' ).removeClass( 'success error' );

                            }, 5000 );
                        } );

                    } );

                    $( '.llar-toggle-setup-field' ).on( 'click', function ( e ) {
                        e.preventDefault();

                        $( this ).hide();

                        $( '.setup-code-wrap' ).toggleClass( 'active' );
                        $( '.app-form-field' ).toggleClass( 'active' );
                    } );

                    $( '.llar-upgrade-to-cloud' ).on( 'click', function ( e ) {
                        e.preventDefault();

                        $( "#ui-id-3" ).click();

                        $( [document.documentElement, document.body] ).animate( {
                            scrollTop: $( "#llar-apps-accordion" ).offset().top
                        }, 500 );
                    } );

                    $( '.llar-test-email-notification-btn' ).on( 'click', function ( e ) {
                        e.preventDefault();

                        const $email_input = $( 'input[name="admin_notify_email"]' );
                        const $test_email_loader = $( '.llar-test-email-notification-loader' );
                        const $test_email_loader_msg = $test_email_loader.find( '.msg' );

                        $test_email_loader_msg.text( '' );

                        $test_email_loader.toggleClass( 'loading' );

                        $.post( ajaxurl, {
                            action: 'test_email_notifications',
                            email: $email_input.val() || $email_input.attr( 'placeholder' ),
                            sec: '<?php echo esc_js( wp_create_nonce( "llar-test-email-notifications" ) ); ?>',
                        }, function ( res ) {
                            if ( res?.success ) {
                                $test_email_loader_msg.addClass( 'success' ).text( '<?php echo esc_js( __( 'Test email has been sent!', 'limit-login-attempts-reloaded' ) ) ?>' )
                            }

                            $test_email_loader.toggleClass( 'loading' );
                        } );
                    } )
                } );

            })(jQuery);
        </script>

        <p class="submit">
            <input class="button menu__item col button__orange" name="llar_update_settings"
                   value="<?php _e( 'Save Settings', 'limit-login-attempts-reloaded' ); ?>"
                   type="submit"/>
        </p>
    </form>
</div>
