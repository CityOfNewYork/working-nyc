<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'database_name_here' );

/** MySQL database username */
define( 'DB_USER', 'username_here' );

/** MySQL database password */
define( 'DB_PASSWORD', 'password_here' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'put your unique phrase here' );
define( 'SECURE_AUTH_KEY',  'put your unique phrase here' );
define( 'LOGGED_IN_KEY',    'put your unique phrase here' );
define( 'NONCE_KEY',        'put your unique phrase here' );
define( 'AUTH_SALT',        'put your unique phrase here' );
define( 'SECURE_AUTH_SALT', 'put your unique phrase here' );
define( 'LOGGED_IN_SALT',   'put your unique phrase here' );
define( 'NONCE_SALT',       'put your unique phrase here' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 *
 * WP_DEBUG_DISPLAY is another companion to WP_DEBUG that controls whether debug
 * messages are shown inside the HTML of pages or not. The default is ‘true’
 * which shows errors and warnings as they are generated. Setting this to false
 * will hide all errors. This should be used in conjunction with WP_DEBUG_LOG so
 * that errors can be reviewed later.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/#wp_debug_display
 *
 * WP_DEBUG_LOG is a companion to WP_DEBUG that causes all errors to also be
 * saved to a debug.log log file This is useful if you want to review all
 * notices later or need to view notices generated off-screen (e.g. during an
 * AJAX request or wp-cron run).
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/#wp_debug_log
 *
 * SCRIPT_DEBUG is a related constant that will force WordPress to use the “dev”
 * versions of scripts and stylesheets in wp-includes/js, wp-includes/css,
 * wp-admin/js, and wp-admin/css will be loaded instead of the .min.css and
 * .min.js versions.. If you are planning on modifying some of WordPress’
 * built-in JavaScript or Cascading Style Sheets, you should add the following
 * code to your config file:
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/#script_debug
 */

define('WP_DEBUG', true);

define('WP_DEBUG_DISPLAY', false);

define('WP_DEBUG_LOG', WP_DEBUG); // wp-content/debug.log

define('SCRIPT_DEBUG', WP_DEBUG);

/**
 * WP_SITEURL allows the WordPress address (URL) to be defined. The value
 * defined is the address where your WordPress core files reside.
 *
 * WP_HOME overrides the wp_options table value for home but does not change
 * it in the database. home is the address you want people to type in their
 * browser to reach your WordPress site.
 *
 * @link https://codex.wordpress.org/Changing_The_Site_URL
 */

define('WP_SITEURL', 'http://localhost:8080');

define('WP_HOME', WP_SITEURL);

/**
 * Set our WordPress environment variable
 */

define('WP_ENV', 'development');

// define('WP_ENV', 'testing');

/**
 * Occasionally you may wish to disable the plugin or theme editor to prevent
 * overzealous users from being able to edit sensitive files and potentially
 * crash the site. Disabling these also provides an additional layer of security
 * if a hacker gains access to a well-privileged user account.
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/#disable-the-plugin-and-theme-editor
 */

define('DISALLOW_FILE_EDIT', true);

/**
 * WordPress Query Monitor Plugin Configuration. Enabling the capabilities panel
 * for Query Monitor
 *
 * @link https://wordpress.org/plugins/query-monitor/
 */

define('QM_ENABLE_CAPS_PANEL', WP_DEBUG);

define('QM_DARK_MODE', true);

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
