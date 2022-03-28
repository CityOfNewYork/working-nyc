<?php

/**
 * Archive Page - This view will map an archive for a particular post type to
 * a page post using the request slug. The view request slug will need to match
 * the post type slug and the page permalink.
 *
 * @author NYC Opportunity
 */

$path = $wp->request; // Request should match the page permalink and post type
$class = ucfirst($path);

require_once WorkingNYC\timber_post($class);

/**
 * Enqueue
 *
 * @author NYC Opportunity
 */

add_action('wp_enqueue_scripts', function() use ($path) {
  enqueue_script("archive-$path");
});

/**
 * Get corresponding page ID
 *
 * @author NYC Opportunity
 */

$ID = get_page_by_path($path)->ID;

$ID = defined('ICL_LANGUAGE_CODE') ?
  icl_object_id(get_page_by_path($path)->ID, 'page', true, ICL_LANGUAGE_CODE) : $ID;

/**
 * Set the Timber view context
 *
 * @author NYC Opportunity
 */

$context = Timber::get_context();

$context['page_title'] = Templating\get_title($path);

$context['page_content'] = Templating\get_content($path);

$context['post_type'] = $path;

$context['post_type_singular'] = str_replace('s', '', $context['post_type']);

$context['filters_label'] = __("Filter $path", 'WNYC');

$context['meta'] = new WorkingNYC\Meta($ID);

$context['posts'] = array_map(function($p) use ($class) {
  $class = "WorkingNYC\\$class";

  return new $class($p);
}, Timber::get_posts());

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

Timber::render('archive.twig', $context);
