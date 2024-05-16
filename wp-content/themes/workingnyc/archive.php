<?php

/**
 * Template Name: Archive
 *
 * Archive Page - This view will map an archive for a particular post type to
 * a page post using the request slug. The view request slug will need to match
 * the post type slug and the page permalink.
 *
 * @author NYC Opportunity
 */

$full_path = $wp->request; // Request should match the page permalink and post type

$path = end(explode('/', $full_path));

$class = '';

switch ($path) {
  case 'announcements':
  case 'guides':
  case 'jobs':
  case 'page':
  case 'programs':
  case 'site':
    $class = ucfirst($path);
    break;
  case 'employer-programs':
  case 'services':
    $class = 'EmployerPrograms';
    break;
  default:
    wp_redirect('/404');
    exit;
}

require_once WorkingNYC\timber_post($class);

/**
 * Enqueue
 *
 * @author NYC Opportunity
 */

add_action('wp_enqueue_scripts', function() use ($path) {
  if ('services' === $path) {
    enqueue_script("archive-employer-programs");
  } elseif ('guides' !== $path) {
    enqueue_script("archive-$path");
  }
});

/**
 * Get corresponding page ID
 *
 * @author NYC Opportunity
 */

$post = get_page_by_path($full_path);

/**
 * Get status and logged in state, redirect if page isn't public
 *
 * @author NYC Opportunity
 */

if ($post->post_status === 'private' && false === is_user_logged_in()) {
  wp_redirect('/404');

  exit;
}

if ($post->post_status === 'draft' && false === is_user_logged_in()) {
  wp_redirect('/404');

  exit;
}

/**
 * Get post ID and translated post ID
 *
 * @author NYC Opportunity
 */

$ID = $post->ID;

$ID = defined('ICL_LANGUAGE_CODE') ?
  icl_object_id(get_page_by_path($full_path)->ID, 'page', true, ICL_LANGUAGE_CODE) : $ID;

/**
 * Convert previous program Query variable filters to the new syntax and
 * redirect the request to ensure it works for the front-end application.
 * At some point, this can be removed from this template.
 *
 * @author NYC Opportunity
 *
 * @since 1.9
 */

if ('programs' === $path) {
  $q = implode('&', array_filter(array_map(function($tax) {
    $query = get_query_var($tax[0], false);

    return ($query) ?
      "$tax[1][]=" . get_term_by('slug', $query, $tax[0])->term_id : false;
  }, [
    ['services', 'wnyc_ser'],
    ['populations', 'wnyc_pop'],
    ['age_ranges_served','wnyc_age'],
    ['sectors', 'wnyc_sec'],
    ['recruitment_status', 'wnyc_rst'],
    ['schedule', 'wnyc_sch'],
    ['duration', 'wnyc_dur'],
    ['locations', 'wnyc_loc']
  ])));

  if (false === empty($q)) {
    wp_redirect("?$q");

    exit;
  }
}

/**
 * Set the Timber view context
 *
 * @author NYC Opportunity
 */

$context = Timber::get_context();

$context['archive_post'] = $post;

$context['page_title'] = Templating\get_title($path);

$context['page_content'] = Templating\get_content($path);

$post_type = $path === 'services' ? 'employer-programs' : $path;

$context['post_type'] = $post_type;

$context['post_type_object'] = get_post_type_object($post_type);

$context['post_type_singular'] = str_replace('s', '', $context['post_type']);

$context['filters_label'] = __("Filter " . strtolower($context['post_type_object']->label), 'WNYC');

$context['meta'] = new WorkingNYC\Meta($post);

$context['posts'] = array_map(function($p) use ($class) {
  $class = "WorkingNYC\\$class";

  return new $class($p);
}, Timber::get_posts());

if ($path === 'employer-programs' || $path === 'services') {
  // set this to true for all employer-side pages
  $context['employer'] = true;
  $context['show_newsletter'] = false;
  $context['show_feedback'] = false;
}

$current_page_title = $post->page_title;

if(!empty($current_page_title)){
  add_filter('document_title',function() use ( $current_page_title ) { 
    return $current_page_title;
  },10,1);
}

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

$compiled = new WorkingNYC\CompileImgPreload('archive.twig', $context);

echo $compiled->html;
