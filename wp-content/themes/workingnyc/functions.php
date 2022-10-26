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
 * Add global support in the theme for thumbnails. Individual post types may
 * have Featured Image support added by including "thumbnail" in the "supports"
 * array attribute.
 *
 * @link /wp-content/mu-plugins/register-post-types.php
 *
 * @author NYC Opportunity
 */

add_theme_support('post-thumbnails');

add_image_size('open-graph', 1200, 628, array('center', 'center'));
add_image_size('small', 480);
add_image_size('mobile', 768);
add_image_size('tablet', 1112);
add_image_size('desktop', 1920);

/**
 * Create instance of Icons
 */

new WorkingNYC\Icons(['guides']);

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
new Shortcode\Alert();
new Shortcode\Blockquote();
new Shortcode\Button();
new Shortcode\Card();
new Shortcode\Icon();
new Shortcode\Job();
new Shortcode\Program();

/**
 * Enqueue Global Integrations
 *
 * @author NYC Opportunity
 */

add_action('wp_enqueue_scripts', function() {
  if (SUPPORT_IE_11 && is_IE()) {
    enqueue_inline('ie11-custom-properties');
    enqueue_script('polyfills');
  }

  if (!is_admin()) {
    enqueue_language_style('site-default');
  }

  enqueue_script('global');

  enqueue_inline('rollbar');
  enqueue_inline('data-layer');
  enqueue_inline('google-optimize');
  enqueue_inline('google-analytics');
  enqueue_inline('google-tag-manager');

  if ('en' !== ICL_LANGUAGE_CODE) {
    enqueue_inline('google-translate-element');
  }
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

    case 'preconnect':
      $urls = array_merge($urls, [
        'https://cdn.jsdelivr.net',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ]);
  }

  return $urls;
}, 10, 2);
