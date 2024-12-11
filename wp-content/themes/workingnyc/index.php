<?php

/**
 * Index template
 *
 * A fallback list template used if a more specific template is not available (i.e., this is the 404 page template)
 * Most code is copied from template-home-page.php
 *
 */

/**
 * Context
 */
require_once WorkingNYC\timber_post('Announcements');

 $context = Timber::get_context();

 $post = Timber::get_post(get_option('page_on_front'));
 
 $context['post'] = $post;

 //Set the announcement context from new landing page
 $context['announcements'] = array_map(function($post) {
    return new WorkingNYC\Announcements($post);
 }, Timber::get_posts(array(
   'posts_per_page' => 4,
   'post_type' => 'announcements',
   'orderby' => 'menu_order',
   'order' => 'ASC',
 )));

//Set the 404 page title to landing page title

 $current_page_title = $post->page_title;

 if (!empty($current_page_title)) {
   add_filter('document_title', function() use ($current_page_title) {
    return esc_html($current_page_title);
    ;
   }, 10, 1);
 }
 
 /**
  * Set Meta context
  */
 
 $context['meta'] = new WorkingNYC\Meta($post);

 //Set the collections context of new Landing page

 $context['collections'] = array_map(function($collection) {
    return new WorkingNYC\Collection($collection);
 }, Templating\get_featured_posts($post->ID));
 
 /**
  * Render the view of new Landing page.
  */
 
 $compiled = new WorkingNYC\CompileImgPreload('home.twig', $context);
 
 echo $compiled->html;
