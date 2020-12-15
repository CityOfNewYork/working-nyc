<?php

/*
Template Name: Home Page
*/

require_once get_stylesheet_directory() . '/timber-posts/Announcement.php';

/**
 * Context
 */

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;

/**
 * Get the 4 top announcements based on menu order
 */

$context['announcements'] = array_map(function($post) {
    return new WorkingNYC\Announcement($post);
  }, Timber::get_posts(array(
    'posts_per_page' => 4,
    'post_type' => 'announcements',
    'orderby' => 'menu_order',
    'order' => 'ASC',
  )));

$context['meta_desc'] = WorkingNYC\get_meta_desc($post->ID);
$context['meta_keywords'] = WorkingNYC\get_meta_keywords($post->ID);
$context['meta_robots'] = WorkingNYC\get_meta_robots($post->ID);

$context['featured_posts'] = Templating\get_featured_posts($post->ID);
$context['questionnaire_post_type'] = Templating\get_questionnaire_post_type($post->ID);
$context['questionnaire_threshold'] = Templating\get_questionnaire_threshold($post->ID);
$context['questionnaire_qs'] = Templating\get_questionnaire_qs($post->ID);

$template = 'home.twig';

Timber::render( $template, $context );