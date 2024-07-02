<?php

use LLAR\Core\Helpers;
use LLAR\Core\Config;
use LLAR\Core\LimitLoginAttempts;

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

$active_app = Config::get( 'active_app' );
$active_app = ( $active_app === 'custom' && LimitLoginAttempts::$cloud_app ) ? 'custom' : 'local';
$setup_code = Config::get( 'app_setup_code' );

$debug_info = '';
$ips        = $server = array();

foreach ( $_SERVER as $key => $value ) {

	if ( in_array( $key, array( 'SERVER_ADDR' ) ) || is_array( $value ) ) {
		continue;
	}

	$ips_for_check = array_map( 'trim', explode( ',', $value ) );
	foreach ( $ips_for_check as $ip ) {

		if ( Helpers::is_ip_valid( $ip ) ) {

			if ( ! in_array( $ip, $ips ) ) {
				$ips[] = $ip;
			}

			if ( ! isset( $server[ $key ] ) ) {
				$server[ $key ] = '';
			}

			if ( in_array( $ip, array( '127.0.0.1', '0.0.0.0' ) ) ) {
				$server[ $key ] = $ip;
			} else {
				$server[ $key ] .= 'IP' . array_search( $ip, $ips ) . ',';
			}
		}
	}
}

foreach ( $server as $server_key => $ips ) {
	$debug_info .= $server_key . ' = ' . trim( $ips, ',' ) . "\n";
}

$plugin_data = get_plugin_data( LLA_PLUGIN_FILE );
?>


<div id="llar-setting-page-debug">
    <div class="llar-settings-wrap">
        <table class="llar-form-table">
            <tr>
                <th scope="row" valign="top"><?php echo __( 'Debug Info', 'limit-login-attempts-reloaded' ); ?></th>
                <td>
                    <div class="textarea_border">
                        <textarea cols="70" rows="10" onclick="this.select()"
                                  readonly><?php echo esc_textarea( $debug_info ); ?></textarea>
                    </div>
                    <div class="description-secondary">
						<?php _e( 'Copy the contents of the window and provide to support.', 'limit-login-attempts-reloaded' ); ?>
                    </div>
                </td>
            </tr>
            <tr>
                <th scope="row" valign="top"><?php echo __( 'Version', 'limit-login-attempts-reloaded' ); ?></th>
                <td>
                    <div><?php echo esc_html( $plugin_data['Version'] ); ?></div>
                </td>
            </tr>
			<?php if ( $active_app === 'local' && empty( $setup_code ) ) : ?>
                <tr>
                    <th scope="row" valign="top"><?php echo __( 'Start Over', 'limit-login-attempts-reloaded' ); ?>
                        <span class="hint_tooltip-parent">
                            <span class="dashicons dashicons-editor-help"></span>
                            <div class="hint_tooltip">
                                <div class="hint_tooltip-content">
                                    <?php esc_attr_e( 'You can start over the onboarding process by clicking this button. All existing data will remain unchanged.', 'limit-login-attempts-reloaded' ); ?>
                                </div>
                            </div>
                        </span>
                    </th>
                    <td>
                        <div class="button_block-single">
                            <button class="button menu__item button__transparent_orange" id="llar_onboarding_reset">
								<?php _e( 'Reset', 'limit-login-attempts-reloaded' ); ?>
                            </button>
                        </div>
                    </td>
                </tr>
			<?php endif; ?>
        </table>
    </div>
</div>

