<?php

use LLAR\Core\Config;
use LLAR\Core\Helpers;
use LLAR\Core\LimitLoginAttempts;

if ( ! defined( 'ABSPATH' ) ) exit();

/**
 * @var $this LimitLoginAttempts
 */

$lockouts_total = Config::get( 'lockouts_total' );
$lockouts = Config::get( 'login_lockouts' );
$lockouts_now = is_array( $lockouts ) ? count( $lockouts ) : 0;

$white_list_ips = Config::get( 'whitelist' );
$white_list_ips = ( is_array( $white_list_ips ) && !empty( $white_list_ips ) ) ? implode( "\n", $white_list_ips ) : '';

$white_list_usernames = Config::get( 'whitelist_usernames' );
$white_list_usernames = ( is_array( $white_list_usernames ) && !empty( $white_list_usernames ) ) ? implode( "\n", $white_list_usernames ) : '';

$black_list_ips = Config::get( 'blacklist' );
$black_list_ips = ( is_array( $black_list_ips ) && !empty( $black_list_ips ) ) ? implode( "\n", $black_list_ips ) : '';

$black_list_usernames = Config::get( 'blacklist_usernames' );
$black_list_usernames = ( is_array( $black_list_usernames ) && ! empty( $black_list_usernames ) ) ? implode( "\n", $black_list_usernames ) : '';

$url_try_for_free = 'https://www.limitloginattempts.com/upgrade/?from=plugin-';
?>

<div id="llar-setting-page-logs">
    <h3 class="title_page">
        <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/icon-check.png">
        <?php _e( 'Statistics', 'limit-login-attempts-reloaded' ); ?>
    </h3>

    <form action="<?php echo $this->get_options_page_uri('logs-local'); ?>" method="post">
        <?php wp_nonce_field( 'limit-login-attempts-options' ); ?>

        <div class="llar-settings-wrap">
            <table class="llar-form-table">
                <tr>
                    <th scope="row" valign="top">
                        <?php _e( 'Total lockouts', 'limit-login-attempts-reloaded' ); ?>
                    </th>
                    <td>
                        <?php if ( $lockouts_total > 0 ) : ?>
                            <input class="button menu__item col button__transparent_orange mx-0_5" name="reset_total"
                                   value="<?php _e( 'Reset Counter', 'limit-login-attempts-reloaded' ); ?>"
                                   type="submit"/>
                            <?php echo sprintf(
                                    _n( '%d lockout since last reset', '%d lockouts since last reset',
                                        $lockouts_total, 'limit-login-attempts-reloaded' ), $lockouts_total
                            ); ?>
                        <?php else :
                            _e( 'No lockouts yet', 'limit-login-attempts-reloaded' );
                        endif ?>
                    </td>
                </tr>
                <?php if ( $lockouts_now > 0 ) : ?>
                    <tr>
                        <th scope="row" valign="top">
                            <?php _e( 'Active lockouts', 'limit-login-attempts-reloaded' ); ?>
                        </th>
                        <td>
                            <input class="button" name="reset_current"
                                   value="<?php _e( 'Restore Lockouts', 'limit-login-attempts-reloaded' ); ?>"
                                   type="submit"/>
                            <?php echo sprintf(
                                    __( '%d IP is currently blocked from trying to log in', 'limit-login-attempts-reloaded' ),
                                    $lockouts_now
                            ); ?>
                        </td>
                    </tr>
                <?php endif ?>
            </table>
        </div>
    </form>

    <form action="<?php echo $this->get_options_page_uri('logs-local' ); ?>" method="post">
        <?php wp_nonce_field( 'limit-login-attempts-options' ); ?>

        <div class="llar-settings-wrap">
            <table class="llar-form-table">
                <tr>
                    <th scope="row" valign="top">
                        <?php _e( 'Safelist', 'limit-login-attempts-reloaded' ); ?>
                    </th>
                    <td>
                        <div class="field-col">
                            <div class="description-secondary p-0">
                                <?php _e( 'One IP or IP range (1.2.3.4-5.6.7.8) per line', 'limit-login-attempts-reloaded' ); ?>
                            </div>
                            <div class="textarea_border mt-0_5">
                                <textarea name="lla_whitelist_ips" rows="5" cols="50"><?php echo esc_textarea( $white_list_ips ); ?></textarea>
                            </div>
                        </div>
                        <div class="field-col">
                            <div class="description-secondary p-0">
                                <?php _e( 'One Username per line', 'limit-login-attempts-reloaded' ); ?>
                            </div>
                            <div class="textarea_border mt-0_5">
                                <textarea name="lla_whitelist_usernames" rows="5" cols="50"><?php echo esc_textarea( $white_list_usernames ); ?></textarea>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row" valign="top">
                        <?php _e( 'Denylist', 'limit-login-attempts-reloaded' ); ?>
                    </th>
                    <td>
                        <div class="field-col">
                            <div class="description-secondary p-0">
                                <?php _e ( 'One IP or IP range (1.2.3.4-5.6.7.8) per line', 'limit-login-attempts-reloaded' ); ?>
                            </div>
                            <div class="textarea_border mt-0_5">
                                <textarea name="lla_blacklist_ips" rows="5" cols="50"><?php echo esc_textarea( $black_list_ips ); ?></textarea>
                            </div>
                        </div>
                        <div class="field-col">
                            <div class="description-secondary p-0">
                                <?php _e( 'One Username per line', 'limit-login-attempts-reloaded' ); ?>
                            </div>
                            <div class="textarea_border mt-0_5">
                                <textarea name="lla_blacklist_usernames" rows="5" cols="50"><?php echo esc_textarea( $black_list_usernames ); ?></textarea>
                            </div>
                        </div>
                        <div class="description-additional p-0 mt-0_5">
                            <?php echo sprintf(
                                __( 'Automate your denylist with IP intelligence when you <a href="%s" class="unlink link__style_unlink" target="_blank">upgrade to premium</a>.', 'limit-login-attempts-reloaded' ),
                                'https://www.limitloginattempts.com/info.php?from=plugin-denylist'
                            ); ?>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <p class="submit">
            <input class="button menu__item col button__orange" name="llar_update_dashboard"
                   value="<?php echo __( 'Save Settings', 'limit-login-attempts-reloaded' ); ?>"
                   type="submit"/>
        </p>
    </form>

    <div class="add_block__under_table image_plus">
        <div class="row__list">
            <div class="add_block__title">
                <div class="description mt-1_5">
                    <?php _e( 'Upgrade To Premium For Our Login Firewall', 'limit-login-attempts-reloaded' ); ?>
                </div>
                <a href="<?php echo esc_url( $url_try_for_free ) . 'logs-settings' ?>" class="button menu__item button__transparent_orange mt-1_5" target="_blank">
                    <?php _e( 'Try For FREE', 'limit-login-attempts-reloaded' ); ?>
                </a>
            </div>
            <div class="add_block__list">
                <div class="item">
                    <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/identify-counter-min.png">
                    <div class="name">
                        <?php _e( 'Identify & Counter New Threats With IP Intelligence', 'limit-login-attempts-reloaded' ); ?>
                    </div>
                </div>
                <div class="item">
                    <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/actibe-ip-min.png">
                    <div class="name">
                        <?php _e( 'Access Active Databases Of Malicious IPs To Bolster Defenses', 'limit-login-attempts-reloaded' ); ?>
                    </div>
                </div>
                <div class="item">
                    <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/unblock-min.png">
                    <div class="name">
                        <?php _e( 'Unblock The Blocked Admin With Ease', 'limit-login-attempts-reloaded' ); ?>
                    </div>
                </div>
                <div class="item">
                    <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/deny-ip-min.png">
                    <div class="name">
                        <?php _e( 'Deny IPs By Country', 'limit-login-attempts-reloaded' ); ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php
    $log = Config::get( 'logged' );
    $log = Helpers::sorted_log_by_date( $log );
    $lockouts = (array) Config::get( 'lockouts' );

    if ( is_array( $log ) && ! empty( $log ) ) : ?>
        <h3 class="title_page">
            <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/icon-pre-install.png">
            <?php _e( 'Lockout log', 'limit-login-attempts-reloaded' ); ?>
        </h3>

        <form action="<?php echo $this->get_options_page_uri('logs-local'); ?>" method="post">
            <?php wp_nonce_field( 'limit-login-attempts-options' ); ?>
            <input type="hidden" value="true" name="clear_log"/>
            <div class="description-page">
                <input class="button menu__item col button__transparent_orange mx-0_5" name="submit"
                       value="<?php _e( 'Clear Log', 'limit-login-attempts-reloaded' ); ?>"
                       type="submit"/>
                <span class="description-secondary">
                    <?php echo sprintf(
                        __( '<a href="%s" class="unlink link__style_unlink" target="_blank">Upgrade today</a> to optimize or unload your DB by moving logs to the cloud.', 'limit-login-attempts-reloaded' ),
                        'https://www.limitloginattempts.com/info.php?from=plugin-clear-log'
                    ); ?>
                </span>
            </div>
        </form>

        <div class="limit-login-log">
            <div class="llar-settings-wrap">
                <table class="llar-form-table">
                    <tr>
                        <th scope="col"><?php _e( "Date", 'limit-login-attempts-reloaded' ); ?></th>
                        <th scope="col"><?php echo _x( "IP", "Internet address", 'limit-login-attempts-reloaded' ); ?></th>
                        <th scope="col"><?php _e( 'Tried to log in as', 'limit-login-attempts-reloaded' ); ?></th>
                        <th scope="col"><?php _e( 'Gateway', 'limit-login-attempts-reloaded' ); ?></th>
                        <th>
                    </tr>

                    <?php foreach ( $log as $date => $user_info ) : ?>
                        <tr>
                            <td class="limit-login-date"><?php echo date_i18n(__( 'F d, Y H:i', 'limit-login-attempts-reloaded' ), $date ); ?></td>
                            <td class="limit-login-ip">
                                <?php esc_html_e( $user_info['ip'] ); ?>
                            </td>
                            <td class="limit-login-max">
                                <?php echo esc_html__( $user_info['username'] ) . ' (' . esc_html__( $user_info['counter'] ) . __( ' lockouts', 'limit-login-attempts-reloaded' ) . ')'; ?>
                            </td>
                            <td class="limit-login-gateway">
                                <?php esc_html_e( $user_info['gateway'] ); ?>
                            </td>
                            <td>
                                <?php if ( ! empty( $lockouts[ $user_info['ip'] ] ) && $lockouts[ $user_info['ip'] ] > time() ) : ?>
                                    <a href="#" class="button limit-login-unlock" data-ip="<?php esc_attr_e( $user_info['ip'] )?>"
                                       data-username="<?php esc_attr_e( $user_info['username'] )?>">
                                        <?php esc_html_e( 'Unlock', 'limit-login-attempts-reloaded' ); ?>
                                    </a>
                                <?php elseif ( $user_info['unlocked'] ) : ?>
                                    <?php esc_html_e( 'Unlocked', 'limit-login-attempts-reloaded' ); ?>
                                <?php endif ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>

                </table>
            </div>
        </div>

        <div class="add_block__under_table image_plus">
            <div class="row__list">
                <div class="add_block__title">
                    <div class="description mt-1_5">
                        <?php _e( 'Upgrade Today For Enhanced Logs & IP Intelligence', 'limit-login-attempts-reloaded' ); ?>
                    </div>
                    <a href="<?php echo $url_try_for_free . 'logs-log' ?>" class="button menu__item button__transparent_orange mt-1_5" target="_blank">
                        <?php _e( 'Try For FREE', 'limit-login-attempts-reloaded' ); ?>
                    </a>
                </div>
                <div class="add_block__list">
                    <div class="item">
                        <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/enhanced-logs-min.png">
                        <div class="name">
                            <?php _e( 'Enhanced Logs Tell You Exactly Which IPs Are Attempting Logins', 'limit-login-attempts-reloaded' ); ?>
                        </div>
                    </div>
                    <div class="item">
                        <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/new-threats-min.png">
                        <div class="name">
                            <?php _e( 'Identify & Counter New Threats With Ease', 'limit-login-attempts-reloaded' ); ?>
                        </div>
                    </div>
                    <div class="item">
                        <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/deny-list-min.png">
                        <div class="name">
                            <?php _e( 'Automatically Add Malicious IPs To Your Deny List', 'limit-login-attempts-reloaded' ); ?>
                        </div>
                    </div>
                    <div class="item">
                        <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/unblock-min.png">
                        <div class="name">
                            <?php _e( 'Unblock The Blocked Admins Effortlessly', 'limit-login-attempts-reloaded' ); ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script>jQuery( function( $ ) {
                $( '.limit-login-log .limit-login-unlock' ).click( function()
                {
                    var btn = $( this );

                    if ( btn.hasClass('disabled') )
                        return false;
                    btn.addClass( 'disabled' );

                    $.post( ajaxurl, {
                        action: 'limit-login-unlock',
                        sec: '<?php echo wp_create_nonce('llar-unlock' ) ?>',
                        ip: btn.data( 'ip' ),
                        username: btn.data( 'username' )
                    } )
                        .done( function( data ) {
                            if ( data === true )
                                btn.fadeOut( function(){ $( this ).parent().text( 'Unlocked' ) });
                            else
                                fail();
                        } ).fail( fail );

                    function fail() {
                        alert( 'Connection error' );
                        btn.removeClass( 'disabled' );
                    }

                    return false;
                } );
            } )
        </script>
	<?php endif; ?>
</div>

