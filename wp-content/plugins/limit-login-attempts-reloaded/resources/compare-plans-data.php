<?php
/**
 * Array for plans comparison block
 *
 * @var string $active_app
 * @var LLAR\Core\LimitLoginAttempts $this
 *
 */

use LLAR\Core\Config;

$min_plan = $active_app === 'custom' ? 'Micro Cloud' : 'Free';

$plans = $this->array_name_plans();
$actual_plan = $active_app === 'custom' ? $this->info_sub_group() : $min_plan;
$upgrade_url = $active_app === 'custom' ? $this->info_upgrade_url() : 'https://www.limitloginattempts.com/info.php?from=plugin-premium-tab-upgrade';

$attribute = [];
foreach ( $plans as $plan => $rate ) {

    if ( $rate < $plans[$actual_plan] ) {
        $attribute[$plan]['attr'] = '';
        $attribute[$plan]['title'] = '';
    }
    elseif ( $rate === $plans[$actual_plan] ) {
	    $attribute[$plan]['attr'] = 'class="button menu__item button__transparent_orange llar-disabled"';
	    $attribute[$plan]['title'] = __( 'Installed', 'limit-login-attempts-reloaded' );
    }
    elseif ( $plan === 'Micro Cloud' ) {
        $attribute[$plan]['attr'] = 'class="button menu__item button__orange button_micro_cloud"';
        $attribute[$plan]['title'] = __( 'Get Started (Free)', 'limit-login-attempts-reloaded' );
    }
    else {
        $attribute[$plan]['attr'] = 'class="button menu__item button__orange" href="' . $upgrade_url . '" target="_blank"';
        $attribute[$plan]['title'] = __( 'Upgrade now', 'limit-login-attempts-reloaded' );
    }
}

$lock = '<img src="' . LLA_PLUGIN_URL . 'assets/css/images/icon-lock-bw.png" class="icon-lock">';
$yes = '<span class="llar_orange">&#x2713;</span>';

$compare_list = array(
	'buttons_header'                                => array(
		'Free'          => '<a ' . $attribute['Free']['attr'] . '>' . esc_html__( $attribute['Free']['title'], 'limit-login-attempts-reloaded' ) . '</a>',
		'Micro Cloud'   => '<a ' . $attribute['Micro Cloud']['attr'] . '>' . esc_html__( $attribute['Micro Cloud']['title'], 'limit-login-attempts-reloaded' ) . '</a>',
		'Premium'       => '<a ' . $attribute['Premium']['attr'] . '>' . esc_html__( $attribute['Premium']['title'], 'limit-login-attempts-reloaded' ) . '</a>',
		'Premium +'     => '<a ' . $attribute['Premium +']['attr'] . '>' . esc_html__( $attribute['Premium +']['title'], 'limit-login-attempts-reloaded' ) . '</a>',
		'Professional'  => '<a ' . $attribute['Professional']['attr'] . '>' . esc_html__( $attribute['Professional']['title'], 'limit-login-attempts-reloaded' ) . '</a>',
	),
    __( 'Limit Number of Retry Attempts', 'limit-login-attempts-reloaded' )                => array(
        'Free'          => $yes,
        'Micro Cloud'   => $yes,
        'Premium'       => $yes,
        'Premium +'     => $yes,
        'Professional'  => $yes,
    ),
    __( 'Configurable Lockout Timing', 'limit-login-attempts-reloaded' )                   => array(
        'Free'          => $yes,
        'Micro Cloud'   => $yes,
        'Premium'       => $yes,
        'Premium +'     => $yes,
        'Professional'  => $yes,
    ),
    __( 'Login Firewall', 'limit-login-attempts-reloaded' )                                => array(
        'description'   =>  __( "Secure your login page with our cutting-edge login firewall, defending against unauthorized access attempts and protecting your users' accounts and sensitive information.", 'limit-login-attempts-reloaded' ),
        'Free'          => $lock,
        'Micro Cloud'   => $yes,
        'Premium'       => $yes,
        'Premium +'     => $yes,
        'Professional'  => $yes,
    ),
    __( 'Performance Optimizer', 'limit-login-attempts-reloaded' )                         => array(
        'description'   =>  __( 'Absorb failed login attempts from brute force bots in the cloud to keep your website at its optimal performance.', 'limit-login-attempts-reloaded' ),
        'Free'          => $lock,
        'Micro Cloud'   => $yes . '<span class="description">' . sprintf(esc_html__( '1k for first month%s(100 per month after)', 'limit-login-attempts-reloaded' ),'<br>') . '</span>',
        'Premium'       => $yes . '<span class="description">' . esc_html__( '100k requests per month', 'limit-login-attempts-reloaded' ) . '</span>',
        'Premium +'     => $yes . '<span class="description">' . esc_html__( '200k requests per month', 'limit-login-attempts-reloaded' ) . '</span>',
        'Professional'  => $yes . '<span class="description">' . esc_html__( '300k requests per month', 'limit-login-attempts-reloaded' ) . '</span>',
    ),
	__( 'Successful Login Logs', 'limit-login-attempts-reloaded' )                         => array(
		'description'   =>  __( 'Ensure the security and integrity of your website by logging your successful logins.', 'limit-login-attempts-reloaded' ),
		'Free'          => $lock,
		'Micro Cloud'   => $yes,
		'Premium'       => $yes,
		'Premium +'     => $yes,
		'Professional'  => $yes,
	),
    __( 'Block By Country', 'limit-login-attempts-reloaded' )                              => array(
        'description'   =>  __( 'Disable IPs from any region to disable logins.', 'limit-login-attempts-reloaded' ),
        'Free'          => $lock,
        'Micro Cloud'   => $yes,
        'Premium'       => $lock,
        'Premium +'     => $yes,
        'Professional'  => $yes,
    ),
    __( 'Access Blocklist of Malicious IPs', 'limit-login-attempts-reloaded' )             => array(
        'description'   =>  __( 'Add another layer of protection from brute force bots by accessing a global database of known IPs with malicious activity.', 'limit-login-attempts-reloaded' ),
        'Free'          => $lock,
        'Micro Cloud'   => $yes,
        'Premium'       => $lock,
        'Premium +'     => $yes,
        'Professional'  => $yes,
    ),
    __( 'Auto IP Blocklist', 'limit-login-attempts-reloaded' )                             => array(
        'description'   =>  __( 'Automatically add malicious IPs to your blocklist when triggered by the system.', 'limit-login-attempts-reloaded' ),
        'Free'          => $lock,
        'Micro Cloud'   => $yes,
        'Premium'       => $lock,
        'Premium +'     => $lock,
        'Professional'  => $yes,
    ),
    __( 'Access Active Cloud Blocklist', 'limit-login-attempts-reloaded' )                 => array(
        'description'   =>  __( 'Use system wide data from over 10,000 WordPress websites to identify and block malicious IPs. This is an active list in real-time.', 'limit-login-attempts-reloaded' ),
        'Free'          => $lock,
        'Micro Cloud'   => $yes,
        'Premium'       => $lock,
        'Premium +'     => $lock,
        'Professional'  => $yes,
    ),
    __( 'Intelligent IP Blocking', 'limit-login-attempts-reloaded' )                       => array(
        'description'   =>  __( 'Use active IP database via the cloud to automatically block users before they are able to make a failed login.', 'limit-login-attempts-reloaded' ),
        'Free'          => $lock,
        'Micro Cloud'   => $yes,
        'Premium'       => $yes,
        'Premium +'     => $yes,
        'Professional'  => $yes,
    ),
    __( 'Synchronize Lockouts & Safelists/Blocklists', 'limit-login-attempts-reloaded' )   => array(
        'description'   =>  __( 'Lockouts & safelists/blocklists can be shared between multiple domains to enhance protection.', 'limit-login-attempts-reloaded' ),
        'Free'          => $lock,
        'Micro Cloud'   => $lock,
        'Premium'       => $yes,
        'Premium +'     => $yes,
        'Professional'  => $yes,
    ),
    __( 'Premium Support', 'limit-login-attempts-reloaded' )                               => array(
        'description'   =>  sprintf(
        	__( 'Receive 1 on 1 technical support via email for any issues. Free support availabe in the <a href="%s" target="_blank">WordPress support forum</a>.', 'limit-login-attempts-reloaded' ),
	        'https://wordpress.org/support/plugin/limit-login-attempts-reloaded/'),
        'Free'          => $lock,
        'Micro Cloud'   => $lock,
        'Premium'       => $yes,
        'Premium +'     => $yes,
        'Professional'  => $yes,
    ),
    'buttons_footer'                                => array(
	    'Free'          => '<a ' . $attribute['Free']['attr'] . '>' . esc_html__( $attribute['Free']['title'], 'limit-login-attempts-reloaded' ) . '</a>',
	    'Micro Cloud'   => '<a ' . $attribute['Micro Cloud']['attr'] . '>' . esc_html__( $attribute['Micro Cloud']['title'], 'limit-login-attempts-reloaded' ) . '</a>',
	    'Premium'       => '<a ' . $attribute['Premium']['attr'] . '>' . esc_html__( $attribute['Premium']['title'], 'limit-login-attempts-reloaded' ) . '</a>',
	    'Premium +'     => '<a ' . $attribute['Premium +']['attr'] . '>' . esc_html__( $attribute['Premium +']['title'], 'limit-login-attempts-reloaded' ) . '</a>',
	    'Professional'  => '<a ' . $attribute['Professional']['attr'] . '>' . esc_html__( $attribute['Professional']['title'], 'limit-login-attempts-reloaded' ) . '</a>',
    ),
);

return $compare_list;
