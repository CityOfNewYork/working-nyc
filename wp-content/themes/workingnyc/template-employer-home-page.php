<?php

/**
 * Template Name: Employer Home Page
 *
 * @author NYC Opportunity
 */

require_once WorkingNYC\timber_post('Announcements');

/**
 * Context
 *
 * @author NYC Opportunity
 */

$context = Timber::get_context();

$post = Timber::get_post();

$context['post'] = $post;

// set this to true for all employer-side pages
$context['employer'] = true;

/**
 * Get the 4 top announcements based on menu order
 *
 * @author NYC Opportunity
 */

$context['announcements'] = array_map(function($post) {
    return new WorkingNYC\Announcements($post);
}, Timber::get_posts(array(
  'posts_per_page' => 4,
  'post_type' => 'announcements',
  'orderby' => 'menu_order',
  'order' => 'ASC',
)));

/**
 * Set Meta context
 *
 * @author NYC Opportunity
 */

$context['meta'] = new WorkingNYC\Meta($post);

$current_page_title = $post->page_title;

if(!empty($current_page_title)){
  add_filter('document_title',function() use ( $current_page_title ) { 
    return $current_page_title;
  },10,1);
}

/**
 * Create template friendly data for collections template
 *
 * @author NYC Opportunity
 */

$context['collections'] = array_map(function($collection) {
  return new WorkingNYC\Collection($collection);
}, Templating\get_featured_posts($post->ID));

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

$compiled = new WorkingNYC\CompileImgPreload('employer-home-page.twig', $context);

echo $compiled->html;
