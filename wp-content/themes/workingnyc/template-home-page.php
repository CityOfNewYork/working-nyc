<?php

/**
 * Template Name: Home Page
 *
 * @author NYC Opportunity
 */

require_once WorkingNYC\timber_post('Announcements');
require_once WorkingNYC\timber_post('Programs');

/**
 * Enqueue
 *
 * @author NYC Opportunity
 */

add_action('wp_enqueue_scripts', function() {
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

$context['meta'] = new WorkingNYC\Meta($post->ID);

$context['featured_posts'] = array_map(function($section) {
  $section['featured_posts_objects'] = array_map(function($post) {
    return new WorkingNYC\Programs($post);
  }, $section['featured_posts_objects']);

  return $section;
}, Templating\get_featured_posts($post->ID));

$context['questionnaire_post_type'] = Templating\get_questionnaire_post_type($post->ID);
$context['questionnaire_threshold'] = Templating\get_questionnaire_threshold($post->ID);
$context['questionnaire_qs'] = Templating\get_questionnaire_qs($post->ID);

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

Timber::render('home.twig', $context);
