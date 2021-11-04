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
 *
 * @author NYC Opportunity
 */

WorkingNYC\require_shortcodes();

new Shortcode\Accordion();
new Shortcode\AirtableLink();
new Shortcode\Blockquote();
new Shortcode\Card();
new Shortcode\Icon();
new Shortcode\Program();

/**
 * Enqueue Global Integrations
 *
 * @author NYC Opportunity
 */

add_action('wp_enqueue_scripts', function() {
  enqueue_inline('data-layer');
  enqueue_inline('google-optimize');
  enqueue_inline('google-analytics');
  enqueue_inline('google-tag-manager');

  if ('en' !== ICL_LANGUAGE_CODE) {
    enqueue_inline('google-translate-element');
  }

  enqueue_inline('ie11-custom-properties');
});

/**
 * Manual DNS prefetch and preconnect headers that are not added through
 * enqueueing functions above. DNS prefetch is added automatically. Preconnect
 * headers always need to be added manually.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch
 *
 * @author NYC Opportunity
 */

add_filter('wp_resource_hints', function($urls, $relation_type) {
  switch ($relation_type) {
    case 'dns-prefetch':
      $urls = array_merge($urls, [
        '//www.google-analytics.com',
        '//cdn.jsdelivr.net',
        '//translate.googleapis.com'
      ]);

      break;
  }

  return $urls;
}, 10, 2);
