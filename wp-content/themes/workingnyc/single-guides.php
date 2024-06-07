<?php

/**
 * Single entry template. Used for posts and other individual content items.
 *
 * @author NYC Opportunity
 */

require_once WorkingNYC\timber_post('Guides');

/**
 * Set the Timber view context
 *
 * @author NYC Opportunity
 */

$context = Timber::get_context();

$post = Timber::get_post();

$post = new WorkingNYC\Guides($post);

$context['post'] = $post;

// if (defined('WP_ENV') && 'development' === WP_ENV) {
//   debug($context['post']);
// }

$context['modified_date'] = WorkingNYC\modified_date_formatted($post->ID);

$context['meta'] = new WorkingNYC\Meta($post); // Add meta to post

// if (defined('WP_ENV') && 'development' === WP_ENV) {
//   debug($context['meta']);
// }

/**
 * Create template friendly data for collections template
 *
 * @author NYC Opportunity
 */

$context['collections'] = array_map(function($collection) {
  return new WorkingNYC\Collection($collection);
}, Templating\get_featured_posts($post->ID));

$current_page_title = $post->page_title;

if (!empty($current_page_title)) {
  add_filter('document_title', function() use ($current_page_title) {
    return esc_html($current_page_title);
  }, 10, 1);
}

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

$compiled = new WorkingNYC\CompileImgPreload('guides/single.twig', $context);

echo $compiled->html;
