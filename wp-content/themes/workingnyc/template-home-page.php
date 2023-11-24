<?php

/**
 * Template Name: Home Page
 *
 * @author NYC Opportunity
 */

require_once WorkingNYC\timber_post('Announcements');

/**
 * Enqueue
 *
 * @author NYC Opportunity
 */

add_action('wp_enqueue_scripts', function() {
  enqueue_inline('google-fonts-rubik');
  enqueue_inline('animate-on-scroll');
  enqueue_script('template-home-page');
});

/**
 * Context
 *
 * @author NYC Opportunity
 */

$context = Timber::get_context();

$post = Timber::get_post(get_option('page_on_front'));

$context['post'] = $post;

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

/**
 * Create template friendly data for collections template
 *
 * @author NYC Opportunity
 */

$context['collections'] = array_map(function($collection) {
  return new WorkingNYC\Collection($collection);
}, Templating\get_featured_posts($post->ID));

/**
 * Set context for the Questionnaire
 *
 * @author NYC Opportunity
 */

$context['questionnaire'] = new WorkingNYC\Questionnaire($post);

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

$compiled = new WorkingNYC\CompileImgPreload('home.twig', $context);

echo $compiled->html;
