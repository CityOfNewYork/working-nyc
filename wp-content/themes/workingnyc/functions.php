<?php

/**
 * Get Path Helpers
 *
 * @author NYC Opportunity
 */

require_once get_stylesheet_directory() . '/includes/paths.php';

/**
 * Timber Site
 *
 * @author NYC Opportunity
 */

require_once WorkingNYC\timber_post('Site');

new WorkingNYC\Site();

/**
 * Require Includes
 *
 * @author NYC Opportunity
 */

WorkingNYC\require_includes();

/**
 * Shortcodes
 *
 * @link /shortcodes/
 * @link https://codex.wordpress.org/Shortcode
 */

WorkingNYC\require_shortcodes();

new Shortcode\Accordion();
new Shortcode\AirtableLink();
new Shortcode\Blockquote();
new Shortcode\Card();
new Shortcode\Icon();
new Shortcode\Program();
