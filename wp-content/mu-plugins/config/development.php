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
