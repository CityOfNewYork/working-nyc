<?php

/**
 * Development environment config
 */

require_once ABSPATH . 'wp-admin/includes/plugin.php';

// Disable plugins
deactivate_plugins([
    'google-authenticator/google-authenticator.php',
    'rollbar/rollbar-php-wordpress.php'
]);

// Discourage search engines
// @url https://codex.wordpress.org/Option_Reference#Privacy
update_option('blog_public', 0);

// phpcs:disable
/**
 * Shorthand for debug logging. Supports native debug log and query monitor
 * logging.
 *
 * @param   String   $str     The string to log.
 * @param   Boolean  $return  Wether to make it human readable.
 *
 * @author NYC Opportunity
 */
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