<?php

/**
 * Archive - This view will map an archive for a particular post type to a
 * page post using the request slug. The view request slug will need to match
 * the post type slug and the page permalink.
 *
 * @author NYC Opportunity
 */

require_once WorkingNYC\timber_post('Page');

/**
 * Get corresponding page ID
 *
 * @author NYC Opportunity
 */

$path = $wp->request; // Request should match the page permalink and post type

$ID = defined('ICL_LANGUAGE_CODE')
  ? icl_object_id(get_page_by_path($path)->ID, 'page', true, ICL_LANGUAGE_CODE) : get_page_by_path($path)->ID;

$page = new WorkingNYC\Page($ID);

/**
 * Set the Timber view context
 *
 * @author NYC Opportunity
 */

$context = Timber::get_context();

$context['page_title'] = Templating\get_title($path);
$context['page_tagline'] = Templating\get_tagline($path);
$context['post_type'] = Templating\get_post_type($path);

$context['filters'] = Templating\get_filters($path);
$context['filters_label'] = Templating\get_filter_label($path);

$context['meta_desc'] = $page->custom['meta_desc'];
$context['meta_keywords'] = $page->custom['meta_keywords'];
$context['meta_robots'] = $page->custom['meta_robots'];

$context['post'] = $page;

$context['posts'] = Timber::get_posts();

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

Timber::render("$path/archive.twig", $context);
