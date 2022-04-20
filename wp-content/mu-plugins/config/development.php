<?php

/**
 * Development environment config
 *
 * @author NYC Opportunity
 */

/**
 * Whoops PHP Error Handler
 *
 * @link https://github.com/filp/whoops
 *
 * @author NYC Opportunity
 */

if (class_exists('Whoops\Run')) {
  $whoops = new Whoops\Run;
  $whoops->pushHandler(new Whoops\Handler\PrettyPageHandler);
  $whoops->register();
}

/**
 * Shorthand for debug logging. Supports native debug log and query monitor
 * logging.
 *
 * @param  String   $str     The string to log.
 * @param  Boolean  $return  Wether to make it human readable.
 *
 * @author NYC Opportunity
 */
// phpcs:disable
function debug($str, $return = true) {
  $backtrace = debug_backtrace()[0];

  $file = isset($backtrace['file']) ? $backtrace['file'] . ':' : '';
  $line = isset($backtrace['line']) ? $backtrace['line'] : '';

  // Sent log to native debug.log
  error_log(var_export($str, $return) . " " . $file . $line);

  // Send log to Query Monitor
  do_action('qm/debug', var_export($str, $return));
}
// phpcs:enable

/**
 * Include the plugins module
 *
 * @author NYC Opportunity
 */

require_once ABSPATH . 'wp-admin/includes/plugin.php';

/**
 * Disable plugins required for security but slow down logging into the
 * site for development purposes.
 *
 * @author NYC Opportunity
 */

deactivate_plugins([
  'google-authenticator/google-authenticator.php',
  'limit-login-attempts-reloaded/limit-login-attempts-reloaded.php'
]);

/**
 * Disable Rollbar because it is only required for remote error monitoring.
 * Uncomment the activate line if you need to test it.
 *
 * @author NYC Opportunity
 */

deactivate_plugins('rollbar/rollbar-php-wordpress.php');

/**
 * Enable the Redis Caching Plugin if we have WP_REDIS_HOST defined in
 * the wp-config.php. Caching will optimize the speed of the site, especially
 * transient caches.
 *
 * @author NYC Opportunity
 */

activate_plugin('redis-cache/redis-cache.php');

/**
 * Enable Query Monitor for advanced Wordpress Query debug and other tooling.
 *
 * @author NYC Opportunity
 */

activate_plugin('query-monitor/query-monitor.php');

/**
 * Automatically log in to the CMS if the admin parameter and login constants are set.
 *
 * @author NYC Opportunity
 */

add_action('plugins_loaded', function() {
  if (isset($_REQUEST['admin']) && defined('LOGIN_USERNAME') && defined('LOGIN_PASSWORD')) {
    $response = wp_signon(array(
      'user_login' => LOGIN_USERNAME,
      'user_password' => LOGIN_PASSWORD
    ));

    if ($response->has_errors()) {
      $url = get_home_url() . '?admin=1';

      wp_die(
        __("Auto log in failed. Check your credentials and <a href=\"$url\">click here to try again</a>."),
        __('Auto log in failed')
      );
    }

    wp_redirect(get_home_url());
  }
});

/**
 * Allow local development requests
 *
 * @author NYC Opportunity
 */

header('Access-Control-Allow-Origin: *');

add_filter('allowed_http_origins', function($origins) {
  $origins[] = 'http://localhost:7000'; // Patterns

  return $origins;
});
