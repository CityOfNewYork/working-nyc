<?php

namespace LLAR\Core;

use LLAR\Core\Http\Http;

if( !defined( 'ABSPATH' ) ) exit;

class Ajax {

	/**
	 * Register all ajax requests & handlers
	 */
	public function register() {

		add_action( 'wp_ajax_limit-login-unlock', array( $this, 'ajax_unlock' ) );
		add_action( 'wp_ajax_dismiss_review_notice', array( $this, 'dismiss_review_notice_callback' ) );
		add_action( 'wp_ajax_dismiss_notify_notice', array( $this, 'dismiss_notify_notice_callback' ) );
		add_action( 'wp_ajax_enable_notify', array( $this, 'enable_notify_callback' ) );
		add_action( 'wp_ajax_app_config_save', array( $this, 'app_config_save_callback' ) );
		add_action( 'wp_ajax_app_setup', array( $this, 'app_setup_callback' ) );
		add_action( 'wp_ajax_app_log_action', array( $this, 'app_log_action_callback' ) );
		add_action( 'wp_ajax_app_load_log', array( $this, 'app_load_log_callback' ) );
		add_action( 'wp_ajax_app_load_successful_login', array( $this, 'app_load_successful_login_callback' ) );
		add_action( 'wp_ajax_app_load_lockouts', array( $this, 'app_load_lockouts_callback' ) );
		add_action( 'wp_ajax_app_load_acl_rules', array( $this, 'app_load_acl_rules_callback' ) );
		add_action( 'wp_ajax_app_load_country_access_rules', array( $this, 'app_load_country_access_rules_callback' ) );
		add_action( 'wp_ajax_app_toggle_country', array( $this, 'app_toggle_country_callback' ) );
		add_action( 'wp_ajax_app_country_rule', array( $this, 'app_country_rule_callback' ) );
		add_action( 'wp_ajax_app_acl_add_rule', array( $this, 'app_acl_add_rule_callback' ) );
		add_action( 'wp_ajax_app_acl_remove_rule', array( $this, 'app_acl_remove_rule_callback' ) );
		add_action( 'wp_ajax_nopriv_get_remaining_attempts_message', array(
			$this,
			'get_remaining_attempts_message_callback'
		) );
		add_action( 'wp_ajax_subscribe_email', array( $this, 'subscribe_email_callback' ) );
        add_action( 'wp_ajax_strong_account_policies', array( $this, 'strong_account_policies_callback' ) );
        add_action( 'wp_ajax_block_by_country', array( $this, 'block_by_country_callback' ) );
		add_action( 'wp_ajax_dismiss_onboarding_popup', array( $this, 'dismiss_onboarding_popup_callback' ) );
		add_action( 'wp_ajax_onboarding_reset', array( $this, 'onboarding_reset_callback' ) );
		add_action( 'wp_ajax_close_premium_message', array( $this, 'close_premium_message' ) );
		add_action( 'wp_ajax_toggle_auto_update', array( $this, 'toggle_auto_update_callback' ) );
		add_action( 'wp_ajax_activate_micro_cloud', array( $this, 'activate_micro_cloud_callback' ) );
		add_action( 'wp_ajax_test_email_notifications', array( $this, 'test_email_notifications_callback' ) );
	}

	public function ajax_unlock() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-unlock', 'sec' );
		$ip = (string) @$_POST['ip'];

		$lockouts = (array) Config::get( 'lockouts' );

		if ( isset( $lockouts[ $ip ] ) ) {
			unset( $lockouts[ $ip ] );
			Config::update( 'lockouts', $lockouts );
		}

		//save to log
		$user_login = @(string) $_POST['username'];
		$log        = Config::get( 'logged' );

		if ( @$log[ $ip ][ $user_login ] ) {
			if ( ! is_array( $log[ $ip ][ $user_login ] ) ) {
				$log[ $ip ][ $user_login ] = array(
					'counter' => $log[ $ip ][ $user_login ],
				);
			}
			$log[ $ip ][ $user_login ]['unlocked'] = true;

			Config::update( 'logged', $log );
		}

		header( 'Content-Type: application/json' );
		echo 'true';
		exit;
	}

	public function dismiss_review_notice_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-dismiss-review', 'sec' );

		$type = isset( $_POST['type'] ) ? sanitize_text_field( $_POST['type'] ) : false;

		if ( $type === 'dismiss' ) {

			Config::update( 'review_notice_shown', true );
		}

		if ( $type === 'later' ) {

			Config::update( 'activation_timestamp', time() );
		}

		wp_send_json_success( array() );
	}

	public function dismiss_notify_notice_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-dismiss-notify-notice', 'sec' );

		$type = isset( $_POST['type'] ) ? sanitize_text_field( $_POST['type'] ) : false;

		if ( $type === 'dismiss' ) {

			Config::update( 'enable_notify_notice_shown', true );
		}

		if ( $type === 'later' ) {

			Config::update( 'notice_enable_notify_timestamp', time() );
		}

		wp_send_json_success( array() );
	}

	public function enable_notify_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-enable-notify', 'sec' );

		$notify_methods = explode( ',', Config::get( 'lockout_notify' ) );

		if ( ! in_array( 'email', $notify_methods ) ) {

			$notify_methods[] = 'email';
		}

		Config::update( 'lockout_notify', implode( ',', $notify_methods ) );
		Config::update( 'enable_notify_notice_shown', true );

		wp_send_json_success( array() );
	}

	public function app_setup_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-app-setup', 'sec' );

		if ( ! empty( $_POST['code'] ) ) {

			$setup_code = sanitize_text_field( $_POST['code'] );

			if ( $key_result = CloudApp::activate_license_key( $setup_code ) ) {

			    if ( $key_result['success'] ) {

				    wp_send_json_success( array(
					    'msg' => ( $key_result['app_config']['messages']['setup_success'] )
				    ) );
                } else {

				    wp_send_json_error( array(
					    'msg' => ( $key_result['error'] )
				    ) );
                }
            } else {

                wp_send_json_error( array(
                    'msg' => $key_result['error']
                ) );
            }
		}

		wp_send_json_error( array(
			'msg' => __( 'Please specify the Setup Code', 'limit-login-attempts-reloaded' )
		) );
	}


	public function app_log_action_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-app-log', 'sec' );

		if ( ! empty( $_POST['method'] ) && ! empty( $_POST['params'] ) ) {

			$method = sanitize_text_field( $_POST['method'] );
			$params = (array) $_POST['params'];

			if ( ! in_array( $method, array( 'lockout/delete', 'acl/create', 'acl/delete' ) ) ) {

				wp_send_json_error( array(
					'msg' => 'Wrong method.'
				) );
			}

			if ( $response = LimitLoginAttempts::$cloud_app->request( $method, 'post', $params ) ) {

				wp_send_json_success( array(
					'msg' => $response['message']
				) );

			} else {

				wp_send_json_error( array(
					'msg' => 'The endpoint is not responding. Please contact your app provider to settle that.'
				) );
			}
		}

		wp_send_json_error( array(
			'msg' => 'Wrong App id.'
		) );
	}

	public function app_acl_add_rule_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-app-acl-add-rule', 'sec' );

		if ( ! empty( $_POST['pattern'] ) && ! empty( $_POST['rule'] ) && ! empty( $_POST['type'] ) ) {

			$pattern = sanitize_text_field( $_POST['pattern'] );
			$rule    = sanitize_text_field( $_POST['rule'] );
			$type    = sanitize_text_field( $_POST['type'] );

			if ( ! in_array( $rule, array( 'pass', 'allow', 'deny' ) ) ) {

				wp_send_json_error( array(
					'msg' => 'Wrong rule.'
				) );
			}

			if ( $response = LimitLoginAttempts::$cloud_app->acl_create( array(
				'pattern' => $pattern,
				'rule'    => $rule,
				'type'    => ( $type === 'ip' ) ? 'ip' : 'login',
			) ) ) {

				wp_send_json_success( array(
					'msg' => $response['message']
				) );

			} else {

				wp_send_json_error( array(
					'msg' => 'The endpoint is not responding. Please contact your app provider to settle that.'
				) );
			}
		}

		wp_send_json_error( array(
			'msg' => 'Wrong input data.'
		) );
	}

	public function app_acl_remove_rule_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-app-acl-remove-rule', 'sec' );

		if ( ! empty( $_POST['pattern'] ) && ! empty( $_POST['type'] ) ) {

			$pattern = sanitize_text_field( $_POST['pattern'] );
			$type    = sanitize_text_field( $_POST['type'] );

			if ( $response = LimitLoginAttempts::$cloud_app->acl_delete( array(
				'pattern' => $pattern,
				'type'    => ( $type === 'ip' ) ? 'ip' : 'login',
			) ) ) {

				wp_send_json_success( array(
					'msg' => $response['message']
				) );

			} else {

				wp_send_json_error( array(
					'msg' => 'The endpoint is not responding. Please contact your app provider to settle that.'
				) );
			}
		}

		wp_send_json_error( array(
			'msg' => 'Wrong input data.'
		) );
	}

	public function app_load_log_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-app-load-log', 'sec' );

		$offset = sanitize_text_field( $_POST['offset'] );
		$limit  = sanitize_text_field( $_POST['limit'] );

		$log = LimitLoginAttempts::$cloud_app->log( $limit, $offset );

		if ( $log ) {

			$date_format    = get_option( 'date_format' ) . ' ' . get_option( 'time_format' );
			$countries_list = Helpers::get_countries_list();

			ob_start();
			if ( empty( $log['items'] ) && ! empty( $log['offset'] ) ) : ?>
			<?php elseif ( $log['items'] ) : ?>

				<?php foreach ( $log['items'] as $item ) :
					$country_name = ! empty( $countries_list[ $item['country_code'] ] ) ? $countries_list[ $item['country_code'] ] : '';
					?>
                    <tr>
                        <td class="llar-col-nowrap"><?php echo get_date_from_gmt( date( 'Y-m-d H:i:s', $item['created_at'] ), $date_format ); ?></td>
                        <td>
                            <div class="llar-log-country-flag">
                                <span class="hint_tooltip-parent">
                                    <img src="<?php echo LLA_PLUGIN_URL . 'assets/img/flags/' . esc_attr( strtolower( $item['country_code'] ) ) . '.png' ?>">
                                    <div class="hint_tooltip">
                                        <div class="hint_tooltip-content">
                                            <?php echo esc_attr( $country_name ) ?>
                                        </div>
                                    </div>
                                </span>
                                <span><?php echo esc_html( $item['ip'] ); ?></span></div>
                        </td>
                        <td><?php echo esc_html( $item['gateway'] ); ?></td>
                        <td><?php echo ( is_null( $item['login'] ) ) ? '-' : esc_html( $item['login'] ); ?></td>
                        <td><?php echo ( is_null( $item['result'] ) ) ? '-' : esc_html( $item['result'] ); ?></td>
                        <td><?php echo ( is_null( $item['reason'] ) ) ? '-' : esc_html( $item['reason'] ); ?></td>
                        <td><?php echo ( is_null( $item['pattern'] ) ) ? '-' : esc_html( $item['pattern'] ); ?></td>
                        <td><?php echo ( is_null( $item['attempts_left'] ) ) ? '-' : esc_html( $item['attempts_left'] ); ?></td>
                        <td><?php echo ( is_null( $item['time_left'] ) ) ? '-' : esc_html( $item['time_left'] ) ?></td>
                        <td class="llar-app-log-actions">
							<?php
							if ( $item['actions'] ) {

								foreach ( $item['actions'] as $action ) {

									echo '<button class="button llar-app-log-action-btn js-app-log-action" 
									style="color:' . esc_attr( $action['color'] ) . '; border-color:' . esc_attr( $action['color'] ) . '" 
                                    data-method="' . esc_attr( $action['method'] ) . '" 
                                    data-params="' . esc_attr( json_encode( $action['data'], JSON_FORCE_OBJECT ) ) . '" 
                                    href="#" title="' . $action['label'] . '"><i class="dashicons dashicons-' . esc_attr( $action['icon'] ) . '"></i></button>';
								}
							} else {
								echo '-';
							}
							?>
                        </td>
                    </tr>
				<?php endforeach; ?>
			<?php else : ?>
				<?php if ( empty( $offset ) ) : ?>
                    <tr class="empty-row">
                        <td colspan="100%"
                            style="text-align: center"><?php _e( 'No events yet.', 'limit-login-attempts-reloaded' ); ?></td>
                    </tr>
				<?php endif; ?>
			<?php endif; ?>
			<?php

			wp_send_json_success( array(
				'html'        => ob_get_clean(),
				'offset'      => $log['offset'],
				'total_items' => count( $log['items'] )
			) );

		} else {

			wp_send_json_error( array(
				'msg' => 'The endpoint is not responding. Please contact your app provider to settle that.'
			) );
		}
	}


	public function app_load_successful_login_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-app-load-login', 'sec' );

		if ( empty( $_POST['limit'] ) && empty( $_POST['custom'] ) && ! $_POST['offset'] && ! $_POST['url_premium'] ) {
			wp_send_json_error( array() );
        }

		$offset = sanitize_text_field( $_POST['offset'] );
		$limit  = sanitize_text_field( $_POST['limit'] );
		$custom  = sanitize_text_field( $_POST['custom'] );
		$upgrade_premium_url = sanitize_text_field( $_POST['url_premium'] );

		if ( $custom === 'true') {

		    $data = LimitLoginAttempts::$cloud_app->get_login( $limit, $offset );
        } else {

			$local_data = ['at' => time() - 60, 'login' => 'admin', 'ip' => '11.22.33.44', 'location' => ['country_code' => 'US'], 'roles' => ['administrator']];
			$data['items'] = array_fill(0, 5, $local_data);
			$data['offset'] = '';
		}

		if ( $data ) {

			$date_format    = get_option( 'date_format' ) . ' ' . get_option( 'time_format' );
			$current_date   = date('Y-m-d');
			$current_year   = date('Y');

			$countries_list = Helpers::get_countries_list();
			$continent_list = Helpers::get_continent_list();

			ob_start();
			if ( empty( $data['items'] ) && ! empty( $data['offset'] ) ) :

			elseif ( $data['items'] ) : ?>

				<?php foreach ( $data['items'] as $item ) :

					$limited = isset( $item['limited'] ) ? filter_var( $item['limited'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE ) : false;

					if ( $limited ) :
						$item['login']                    = 'admin';
						$item['location']['country_code'] = 'ZZ';
						$item['roles']                    = [ 'administrator' ];
						$item['ip']                       = '11.22.33.44';
					endif;

					$login = ! empty( $item['login'] ) ? $item['login'] : '';
					$country_name = ! empty( $item['location']['country_code'] ) ? $countries_list[ $item['location']['country_code'] ] : '';
					$continent_name = ! empty( $item['location']['continent_code'] ) ? $continent_list[ $item['location']['continent_code'] ] : '';
					$long_login = mb_strlen( $login ) > 10;
					$login_url = !empty( $item['user_id'] ) ? get_edit_user_link( $item['user_id'] ) : '';

					$latitude = !empty( $item['location']['latitude'] ) ? $item['location']['latitude'] : false;
					$longitude = !empty( $item['location']['longitude'] ) ? $item['location']['longitude'] : false;

					$log_date_gmt   = date('Y-m-d H:i:s', $item['at']);
					$log_local_date = get_date_from_gmt($log_date_gmt, 'Y-m-d');
					$log_local_time = get_date_from_gmt($log_date_gmt, get_option('time_format'));
					$log_year       = get_date_from_gmt($log_date_gmt, 'Y');

					if ($log_local_date === $current_date) {
						$correct_date = __('Today at ', 'limit-login-attempts-reloaded') . $log_local_time;
					} elseif ($log_year === $current_year) {
						$log_local_month_day = get_date_from_gmt($log_date_gmt, 'M j');
						$correct_date = $log_local_month_day . ' at ' . $log_local_time;
					} else {
						$correct_date = get_date_from_gmt($log_date_gmt, $date_format);
					}
					?>
                    <tr>
                        <td class="llar-col-nowrap"><?php echo esc_html( $correct_date ) ?></td>
                        <td class="cell-login <?php echo $limited ? 'llar-blur-block-cell' : '' ?>">
                            <span class="hint_tooltip-parent">
                                    <a href="<?php echo $login_url ?>" target="_blank"><?php echo esc_html( $login ) ?></a>
                                    <?php if ( $long_login ) : ?>
                                        <div class="hint_tooltip">
                                            <div class="hint_tooltip-content">
                                                <?php echo esc_html( $login ) ?>
                                            </div>
                                        </div>
                                    <?php endif; ?>
                            </span>
                        </td>
                        <td>
                            <div class="llar-log-country-flag <?php echo $limited ? 'llar-blur-block-cell' : '' ?>">
                                <span class="hint_tooltip-parent">
                                    <img src="<?php echo LLA_PLUGIN_URL . 'assets/img/flags/' . esc_attr( strtolower( $item['location']['country_code'] ) ) . '.png' ?>">
                                    <div class="hint_tooltip">
                                        <div class="hint_tooltip-content">
                                            <?php echo $country_name ?>
                                        </div>
                                    </div>
                                </span>
                                <span><?php echo esc_html( $item['ip'] ) ?></span>
                            </div>
                        </td>
                        <td class="<?php echo $limited ? 'llar-blur-block-cell' : '' ?>">
                            <?php if ( isset( $item['roles'] ) && is_array( $item['roles'] ) ) : ?>
                                <span class="hint_tooltip-parent">
                                    <?php $admin_key = array_search( 'administrator', $item['roles'] );
                                    if ( $admin_key !== false ) : ?>
                                        <span><?php echo esc_html( $item['roles'][$admin_key] ) ?></span>
                                        <?php unset( $item['roles'][$admin_key] );
                                    elseif ( isset($item['roles'][0]) ) :
                                        echo esc_html( $item['roles'][0] );
                                        unset( $item['roles'][0] );
                                    endif;
                                    $list_roles = '';
                                    foreach ( $item['roles'] as $role ) :
                                            $list_roles .= '<li>' . esc_html( $role ) . '</li>';
                                    endforeach;
                                    if ( ! empty ( $list_roles ) ) : ?>
                                        <span class="dashicons dashicons-menu-alt2"></span>
                                        <div class="hint_tooltip">
                                            <div class="hint_tooltip-content">
                                                <ul>
                                                    <?php echo $list_roles; ?>
                                                </ul>
                                            </div>
                                        </div>
                                    <?php endif; ?>
                                </span>
                            <?php endif; ?>
                        </td>
                        <td class="button-open">
		                    <button class="button llar-add-login-open">
                                <i class="dashicons dashicons-arrow-down-alt2"></i>
                            </button>
                        </td>
                    </tr>
                    <tr class="hidden-row">

					<?php if ( $limited ) : ?>

                        <td colspan="4" style="max-width: 290px">
                            <div>
		                        <?php echo sprintf(
			                        __( 'Login details could not be populated due to insufficient cloud resources.<br>Please <a class="link__style_unlink llar_turquoise" href="%s" target="_blank">upgrade to Premium</a> to access this data.', 'limit-login-attempts-reloaded' ),
			                        $upgrade_premium_url
		                        ); ?>
                            </div>
                        </td>

                        <?php else : ?>
                            <td colspan="2" style="max-width: 200px">

                                <?php if ( !empty( $continent_name ) ) : ?>
                                    <div>
                                        <span><?php _e( 'Continent: ', 'limit-login-attempts-reloaded' ) ?></span><?php echo $continent_name ?>
                                    </div>
                                <?php endif ?>

                                <?php if ( !empty( $country_name ) ) :

                                    $country_code = $item['location']['country_code'] !== 'ZZ' ? ' (' . esc_html( $item['location']['country_code'] ) . ')' : '';
                                    ?>
                                    <div>
                                        <span><?php _e( 'Country: ', 'limit-login-attempts-reloaded' ) ?></span><?php echo esc_html($country_name) . esc_html($country_code) ?>
                                    </div>
                                <?php endif ?>

                                <?php if ( !empty( $item['location']['stateprov'] ) ) : ?>
                                    <div>
                                        <span><?php _e( 'State/Province: ', 'limit-login-attempts-reloaded' ) ?></span><?php echo esc_html( $item['location']['stateprov'] ) ?>
                                    </div>
                                <?php endif ?>

                                <?php if ( !empty( $item['location']['district'] ) ) : ?>
                                    <div>
                                        <span><?php _e( 'District: ', 'limit-login-attempts-reloaded' ) ?></span><?php echo esc_html( $item['location']['district'] ) ?>
                                    </div>
                                <?php endif ?>

                                <?php if ( !empty( $item['location']['city'] ) ) : ?>
                                    <div>
                                        <span><?php _e( 'City: ', 'limit-login-attempts-reloaded' ) ?></span><?php echo esc_html( $item['location']['city'] ) ?>
                                    </div>
                                <?php endif ?>

                                <?php if ( !empty( $item['location']['zipcode'] ) ) : ?>
                                    <div>
                                        <span><?php _e( 'Zipcode: ', 'limit-login-attempts-reloaded' ) ?></span><?php echo esc_html( $item['location']['zipcode'] ) ?>
                                    </div>
                                <?php endif ?>

                                <?php if ( $latitude && $longitude ) : ?>
                                    <div>
                                        <span><?php _e( 'Latitude, Longitude: ', 'limit-login-attempts-reloaded' ) ?></span>
                                        <a href="https://www.limitloginattempts.com/map?lat=<?php echo esc_attr( $latitude ) ?>&lon=<?php echo esc_attr( $longitude ) ?>" target="_blank">
                                            <?php echo esc_html( $latitude ) . ', ' . esc_html( $longitude ) ?>
                                        </a>
                                    </div>
                                <?php endif ?>

                                <?php if ( !empty( $item['location']['timezone_name'] ) ) :

                                    $timezone_offset = '';
                                    if ( !empty( $item['location']['timezone_offset'] ) ) {

                                        $timezone_offset = (int)$item['location']['timezone_offset'] > 0
                                            ? '+' . $item['location']['timezone_offset']
                                            : $item['location']['timezone_offset'];
                                    }
                                    ?>
                                    <div>
                                        <span>
                                            <?php _e( 'Timezone: ', 'limit-login-attempts-reloaded' ) ?>
                                        </span>
                                        <?php echo esc_html( $item['location']['timezone_name'] ) . ' [' . esc_html( $timezone_offset ) . ']'  ?>
                                    </div>
                                <?php endif ?>

                                <?php if ( !empty( $item['location']['isp_name'] ) && !empty( $item['location']['organization_name'] ) ) :

                                    $usage_type = !empty( $item['location']['usage_type'] ) ? ' (' . $item['location']['usage_type'] . ')' : '';

                                    $isp_name = $item['location']['isp_name'];
                                    $organization_name = $item['location']['organization_name'];

                                    if ( $isp_name === $organization_name ) {

                                        $full_name =  $organization_name;
                                    } elseif ( strpos($isp_name, $organization_name ) !== false ) {

                                        $full_name = $isp_name;
                                    } elseif ( strpos($organization_name, $isp_name ) !== false ) {

                                        $full_name = $organization_name;
                                    } else {

                                        $full_name =  $isp_name . ' / ' . $organization_name;
                                    }
                                    ?>

                                    <div>
                                        <span><?php _e( 'Internet Provider: ', 'limit-login-attempts-reloaded' ) ?></span><?php echo esc_html( $full_name ) . esc_html( $usage_type ) ?>
                                    </div>

                                <?php endif ?>

                                <?php if ( !empty( $item['location']['connection_type'] ) ) : ?>
                                    <div>
                                        <span><?php _e( 'Connection Type: ', 'limit-login-attempts-reloaded' ) ?></span><?php echo esc_html( $item['location']['connection_type'] ) ?>
                                    </div>
                                <?php endif ?>

					        <?php endif ?>
                        </td>
                        <td colspan="3">
					        <?php if ( $latitude && $longitude ) : ?>
                                <iframe class="open_street_map" data-latitude="<?php echo esc_attr( $latitude ) ?>" data-longitude="<?php echo esc_attr( $longitude ) ?>"
                                        width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0">
                                </iframe>
					        <?php endif; ?>
                        </td>
                    </tr>
				<?php endforeach; ?>
			<?php else : ?>
				<?php if ( empty( $offset ) ) : ?>
                    <tr class="empty-row">
                        <td colspan="100%"
                            style="text-align: center"><?php _e( 'No events yet.', 'limit-login-attempts-reloaded' ); ?></td>
                    </tr>
				<?php endif; ?>
			<?php endif; ?>
			<?php

			wp_send_json_success( array(
				'html'        => ob_get_clean(),
				'offset'      => $data['offset'],
				'total_items' => count( $data['items'] )
			) );

		} else {

			wp_send_json_error( array(
				'msg' => 'The endpoint is not responding. Please contact your app provider to settle that.'
			) );
		}
	}

	public function app_load_lockouts_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-app-load-lockouts', 'sec' );

		$offset = sanitize_text_field( $_POST['offset'] );
		$limit  = sanitize_text_field( $_POST['limit'] );

		$lockouts = LimitLoginAttempts::$cloud_app->get_lockouts( $limit, $offset );

		if ( $lockouts ) {

			ob_start(); ?>

			<?php if ( $lockouts['items'] ) : ?>
				<?php foreach ( $lockouts['items'] as $item ) : ?>
                    <tr>
                        <td><?php echo esc_html( $item['ip'] ); ?></td>
                        <td><?php echo ( is_null( $item['login'] ) ) ? '-' : esc_html( implode( ',', $item['login'] ) ); ?></td>
                        <td><?php echo ( is_null( $item['count'] ) ) ? '-' : esc_html( $item['count'] ); ?></td>
                        <td><?php echo ( is_null( $item['ttl'] ) ) ? '-' : esc_html( round( ( $item['ttl'] - time() ) / 60 ) ); ?></td>
                    </tr>
				<?php endforeach; ?>

			<?php else: ?>
				<?php if ( empty( $offset ) ) : ?>
                    <tr class="empty-row">
                        <td colspan="4"
                            style="text-align: center"><?php _e( 'No lockouts yet.', 'limit-login-attempts-reloaded' ); ?></td>
                    </tr>
				<?php endif; ?>
			<?php endif; ?>
			<?php

			wp_send_json_success( array(
				'html'   => ob_get_clean(),
				'offset' => $lockouts['offset']
			) );

		} elseif ( intval( LimitLoginAttempts::$cloud_app->last_response_code ) >= 400 && intval( LimitLoginAttempts::$cloud_app->last_response_code ) < 500 ) {

			$app_config = Config::get( 'app_config' );

			wp_send_json_error( array(
				'error_notice' => '<div class="llar-app-notice">
                                        <p>' . $app_config['messages']['sync_error'] . '<br><br>' . sprintf( __( 'Meanwhile, the app falls over to the <a href="%s">default functionality</a>.', 'limit-login-attempts-reloaded' ), admin_url( 'options-general.php?page=limit-login-attempts&tab=logs-local' ) ) . '</p>
                                    </div>'
			) );
		} else {

			wp_send_json_error( array(
				'msg' => 'The endpoint is not responding. Please contact your app provider to settle that.'
			) );
		}
	}

	public function app_load_acl_rules_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-app-load-acl-rules', 'sec' );

		$type   = sanitize_text_field( $_POST['type'] );
		$limit  = sanitize_text_field( $_POST['limit'] );
		$offset = sanitize_text_field( $_POST['offset'] );

		$acl_list = LimitLoginAttempts::$cloud_app->acl( array(
			'type'   => $type,
			'limit'  => $limit,
			'offset' => $offset
		) );

		if ( $acl_list ) {

			ob_start(); ?>

			<?php if ( $acl_list['items'] ) : ?>
				<?php foreach ( $acl_list['items'] as $item ) : ?>
                    <tr class="llar-app-rule-<?php echo esc_attr( $item['rule'] ); ?>">
                        <td class="rule-pattern" scope="col">
                            <?php echo esc_html( $item['pattern'] ); ?>
                        </td>
                        <td scope="col">
                            <?php echo esc_html( $item['rule'] ); ?><?php echo ( $type === 'ip' ) ? '<span class="origin">' . esc_html( $item['origin'] ) . '</span>' : ''; ?>
                        </td>
                        <td class="llar-app-acl-action-col" scope="col">
                            <button class="button llar-app-acl-remove" data-type="<?php echo esc_attr( $type ); ?>"
                                    data-pattern="<?php echo esc_attr( $item['pattern'] ); ?>">
                                <span class="dashicons dashicons-no"></span>
                            </button>
                        </td>
                    </tr>
				<?php endforeach; ?>
			<?php else : ?>
                <tr class="empty-row">
                    <td colspan="3" style="text-align: center">
                        <?php _e( 'No rules yet.', 'limit-login-attempts-reloaded' ); ?>
                    </td>
                </tr>
			<?php endif; ?>
			<?php

			wp_send_json_success( array(
				'html'   => ob_get_clean(),
				'offset' => $acl_list['offset']
			) );

		} else {

			wp_send_json_error( array(
				'msg' => 'The endpoint is not responding. Please contact your app provider to settle that.'
			) );
		}
	}

	public function app_load_country_access_rules_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-app-load-country-access-rules', 'sec' );

		$country_rules = LimitLoginAttempts::$cloud_app->country();

		if ( $country_rules ) {

			wp_send_json_success( $country_rules );
		} else {

			wp_send_json_error( array(
				'msg' => 'Something wrong.'
			) );
		}
	}

	public function app_toggle_country_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-app-toggle-country', 'sec' );

		$code        = sanitize_text_field( $_POST['code'] );
		$action_type = sanitize_text_field( $_POST['type'] );

		if ( ! $code ) {

			wp_send_json_error( array(
				'msg' => 'Wrong country code.'
			) );
		}

		$result = false;

		if ( $action_type === 'add' ) {

			$result = LimitLoginAttempts::$cloud_app->country_add( array(
				'code' => $code
			) );

		} else if ( $action_type === 'remove' ) {

			$result = LimitLoginAttempts::$cloud_app->country_remove( array(
				'code' => $code
			) );
		}

		if ( $result ) {

			wp_send_json_success( array() );
		} else {

			wp_send_json_error( array(
				'msg' => 'Something wrong.'
			) );
		}
	}

	public function app_country_rule_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-app-country-rule', 'sec' );

		$rule = sanitize_text_field( $_POST['rule'] );

		if ( empty( $rule ) || ! in_array( $rule, array( 'allow', 'deny' ) ) ) {

			wp_send_json_error( array(
				'msg' => 'Wrong rule.'
			) );
		}

		$result = LimitLoginAttempts::$cloud_app->country_rule( array(
			'rule' => $rule
		) );

		if ( $result ) {

			wp_send_json_success( array() );
		} else {

			wp_send_json_error( array(
				'msg' => 'Something wrong.'
			) );
		}
	}


	public function subscribe_email_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-subscribe-email', 'sec' );

		$email            = sanitize_text_field( trim( $_POST['email'] ) );
		$is_subscribe_yes = sanitize_text_field( $_POST['is_subscribe_yes'] ) === 'true';
		$admin_email   = ( ! is_multisite() ) ? get_option( 'admin_email' ) : get_site_option( 'admin_email' );

		if ( ! empty( $email ) && is_email( $email ) ) {

			Config::update( 'admin_notify_email', $email );
			Config::update( 'lockout_notify', 'email' );

			if ( $is_subscribe_yes ) {
				$response = Http::post( 'https://api.limitloginattempts.com/my/key', array(
					'data' => array(
						'email' => $email
					)
				) );

				if ( !empty( $response['error'] ) ) {

					wp_send_json_error( $response['error'] );
				} else {

					$response_body = json_decode( $response['data'], true );

					if ( ! empty( $response_body['key'] ) ) {
						Config::update( 'cloud_key', $response_body['key'] );
					}
				}
			}

			wp_send_json_success( array( 'email' => $email, 'is_subscribe_yes' => $is_subscribe_yes ) );

		} else if ( empty( $email ) ) {
			Config::update( 'admin_notify_email', $admin_email );
			Config::update( 'lockout_notify', '' );

			wp_send_json_success( array( 'email' => $admin_email, 'is_subscribe_yes' => '' ) );
		}

		wp_send_json_error( array( 'email' => $email, 'is_subscribe_yes' => $is_subscribe_yes ) );
	}


    public function strong_account_policies_callback() {

        if ( ! current_user_can( 'activate_plugins' ) ) {

            wp_send_json_error( array() );
        }

        check_ajax_referer( 'llar-strong-account-policies', 'sec' );

        $is_checklist = sanitize_text_field( trim( $_POST['is_checklist'] ) );

        Config::update( 'checklist', $is_checklist );

        wp_send_json_success();
    }

    public function block_by_country_callback() {

        if ( ! current_user_can( 'activate_plugins' ) ) {

            wp_send_json_error( array() );
        }

        check_ajax_referer( 'llar-block_by_country', 'sec' );

        $is_checklist = sanitize_text_field( trim( $_POST['is_checklist'] ) );

        Config::update( 'block_by_country', $is_checklist );

        wp_send_json_success();
    }


	public function dismiss_onboarding_popup_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer( 'llar-dismiss-onboarding-popup', 'sec' );

		Config::update( 'onboarding_popup_shown', true );

		wp_send_json_success();
	}

	public function get_remaining_attempts_message_callback() {

		check_ajax_referer( 'llar-get-remaining-attempts-message', 'sec' );

		if ( ! session_id() ) {
			session_start();
		}

		$remaining = ! empty( $_SESSION['login_attempts_left'] ) ? intval( $_SESSION['login_attempts_left'] ) : 0;
		$message   = ( ! $remaining ) ? '' : sprintf( _n( "<strong>%d</strong> attempt remaining.", "<strong>%d</strong> attempts remaining.", $remaining, 'limit-login-attempts-reloaded' ), $remaining );
		wp_send_json_success( $message );
	}


    public function onboarding_reset_callback() {

        if ( ! current_user_can( 'update_plugins' ) ) {

            wp_send_json_error( array() );
        }

        check_ajax_referer( 'llar-action-onboarding-reset', 'sec' );

        if ( Config::get( 'active_app' ) !== 'local' || ! empty( Config::get( 'app_setup_code' ) ) ) {

            wp_send_json_error( array() );
        }

        Config::update( 'onboarding_popup_shown', 0 );

        wp_send_json_success();
    }


    public function close_premium_message() {

	    check_ajax_referer( 'llar-close-premium-message', 'sec' );

	    Config::update( 'notifications_message_shown', strtotime( '+1 day' ) );

	    wp_send_json_success();
    }


    public function activate_micro_cloud_callback() {

        if ( ! current_user_can( 'update_plugins' ) ) {

            wp_send_json_error( array('msg' => 'Wrong country code.') );
        }

        check_ajax_referer( 'llar-activate-micro-cloud', 'sec' );
	    $email = sanitize_text_field( trim( $_POST['email'] ) );

	    if ( ! empty( $email ) && is_email( $email ) ) {

            $url_api = defined( 'LLAR_MC_URL' ) ? LLAR_MC_URL : 'https://api.limitloginattempts.com/checkout/network';

            $data = [
                'group' => 'free',
                'email' => $email
            ];

            $response = Http::post( $url_api, array(
                'data' => $data
            ) );

            if ( ! empty( $response['error'] ) ) {

                wp_send_json_error( $response['error'] );

            } else {

                $response_body = json_decode( $response['data'], true );

                if ( ! empty( $response_body['setup_code'] ) ) {

	                if ( $key_result = CloudApp::activate_license_key( $response_body['setup_code'] ) ) {

		                if ( $key_result['success'] ) {

			                wp_send_json_success( array(
				                'msg' => ( $key_result )
			                ) );
		                } else {

			                wp_send_json_error( array(
				                'msg' => ( $key_result )
			                ) );
		                }
	                } else {

		                wp_send_json_error( array(
			                'msg' => $key_result['error']
		                ) );
	                }
                }
            }
        }

	    wp_send_json_error( array() );
    }


	public function toggle_auto_update_callback() {

		if ( ! current_user_can( 'update_plugins' ) ) {

			wp_send_json_error( array() );
		}

		if ( Helpers::is_block_automatic_update_disabled() ) {

            wp_send_json_error( array( 'msg' => 'Can\'t turn auto-updates on. Please ask your hosting provider or developer for assistance.') );
        }

		check_ajax_referer( 'llar-toggle-auto-update', 'sec' );

		$value = sanitize_text_field( $_POST['value'] );
		$auto_update_plugins = get_site_option( 'auto_update_plugins', array() );

		if( $value === 'yes' ) {
			$auto_update_plugins[] = LLA_PLUGIN_BASENAME;
			Config::update( 'auto_update_choice', 1 );

		} else if ( $value === 'no' ) {
			if ( ( $key = array_search( LLA_PLUGIN_BASENAME, $auto_update_plugins ) ) !== false ) {
				unset($auto_update_plugins[$key]);
			}
			Config::update( 'auto_update_choice', 0 );
		}

		update_site_option( 'auto_update_plugins', $auto_update_plugins );

		wp_send_json_success();
	}

	public function test_email_notifications_callback() {

		if ( ! current_user_can( 'activate_plugins' ) ) {

			wp_send_json_error( array() );
		}

		check_ajax_referer('llar-test-email-notifications', 'sec');

		$to = sanitize_email( $_POST['email'] );

		if( empty( $to ) || !is_email( $to ) ) {

			wp_send_json_error( array(
                'msg' => __( 'Wrong email format.', 'limit-login-attempts-reloaded' ),
            ) );
		}

		if( wp_mail(
            $to,
            __( 'LLAR Security Notifications [TEST]', 'limit-login-attempts-reloaded' ),
            __( 'Your email notifications for Limit Login Attempts Reloaded are working correctly. If this email is going to spam, please be sure to add this address to your safelist.', 'limit-login-attempts-reloaded' )
        ) ) {

			wp_send_json_success();
		} else {

			wp_send_json_error();
		}
	}
}
