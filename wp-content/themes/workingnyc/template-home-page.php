<?php

/**
 * Template Name: Home Page
 *
 * @author NYC Opportunity
 */

require_once WorkingNYC\timber_post('Announcements');
require_once WorkingNYC\timber_post('Programs');
require_once WorkingNYC\timber_post('Jobs');

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

/**
 * Set Meta context
 *
 * @author NYC Opportunity
 */

$context['meta'] = new WorkingNYC\Meta($post);

/**
 * Extend Timber posts for each post type
 *
 * @author NYC Opportunity
 */

$context['featured_posts'] = array_map(function($section) {
  $section['featured_posts_objects'] = array_map(function($post) {
    switch ($post->post_type) {
      case 'programs':
        $post = new WorkingNYC\Programs($post);
        break;

      case 'jobs':
        $post = new WorkingNYC\Jobs($post);
        break;
    }

    return $post;
  }, $section['featured_posts_objects']);

  $types = array_unique(array_map(function($post) {
    return $post->post_type;
  }, $section['featured_posts_objects']));

  // If there is only one post type, set the archive link for the section.
  $section['featured_posts_archive'] = (count($types) === 1) ? array(
    'label' => __('See all ' . $types[0], 'WNYC'),
    'link' => get_post_type_archive_link($types[0])
  ) : false;

  return $section;
}, Templating\get_featured_posts($post->ID));

/**
 * Set context for the Questionnaire
 *
 * @author NYC Opportunity
 */

$context['questionnaire_post_type'] = Templating\get_questionnaire_post_type($post->ID);

$context['questionnaire_threshold'] = Templating\get_questionnaire_threshold($post->ID);

$context['questionnaire_qs'] = Templating\get_questionnaire_qs($post->ID);

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

Timber::render('home.twig', $context);
