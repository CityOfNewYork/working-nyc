<?php

/**
 * Template Name: Home Page
 *
 * @author NYC Opportunity
 */

require_once WorkingNYC\timber_post('Announcement');

/**
 * Context
 *
 * @author NYC Opportunity
 */

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;

/**
 * Get the 4 top announcements based on menu order
 *
 * @author NYC Opportunity
 */

$context['announcements'] = array_map(function($post) {
    return new WorkingNYC\Announcement($post);
  }, Timber::get_posts(array(
    'posts_per_page' => 4,
    'post_type' => 'announcements',
    'orderby' => 'menu_order',
    'order' => 'ASC',
  )));

$context['meta'] = new WorkingNYC\Meta($post->ID);

$context['featured_posts'] = Templating\get_featured_posts($post->ID);
$context['questionnaire_post_type'] = Templating\get_questionnaire_post_type($post->ID);
$context['questionnaire_threshold'] = Templating\get_questionnaire_threshold($post->ID);
$context['questionnaire_qs'] = Templating\get_questionnaire_qs($post->ID);

/**
 * Generate schema for page
 *
 * @author NYC Opportunity
 */

$schemas = array();

array_push($schemas,
  WNYCSchema\website(),
  WNYCSchema\organization()
);

$context['schema'] = json_encode($schemas, JSON_UNESCAPED_SLASHES);

Timber::render('home.twig', $context);
