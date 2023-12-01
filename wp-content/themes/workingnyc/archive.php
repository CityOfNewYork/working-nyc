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

$path = $wp->request; // Request should match the page permalink and post type

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
    // // only allow logged in users to view employer content for now
    // if (is_user_logged_in() === false) {
    //   wp_redirect('/404');

    //   exit;
    // }
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
  if ('guides' !== $path) {
    enqueue_script("archive-$path");
  }
});

/**
 * Get corresponding page ID
 *
 * @author NYC Opportunity
 */

$post = get_page_by_path($path);

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
  icl_object_id(get_page_by_path($path)->ID, 'page', true, ICL_LANGUAGE_CODE) : $ID;

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

$context['page_title'] = Templating\get_title($path);

$context['page_content'] = Templating\get_content($path);

$context['post_type'] = $path;

$context['post_type_object'] = get_post_type_object($path);

$context['post_type_singular'] = str_replace('s', '', $context['post_type']);

$context['filters_label'] = __("Filter " . strtolower($context['post_type_object']->label), 'WNYC');

$context['meta'] = new WorkingNYC\Meta($post);

$context['posts'] = array_map(function($p) use ($class) {
  $class = "WorkingNYC\\$class";

  return new $class($p);
}, Timber::get_posts());

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

$compiled = new WorkingNYC\CompileImgPreload('archive.twig', $context);

echo $compiled->html;
