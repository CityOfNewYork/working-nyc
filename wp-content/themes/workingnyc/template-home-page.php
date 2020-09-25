<?php

/*
Template Name: Home Page
*/

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;

$context['meta_desc'] = WorkingNYC\get_meta_desc($post->ID);
$context['meta_keywords'] = WorkingNYC\get_meta_keywords($post->ID);
$context['meta_robots'] = WorkingNYC\get_meta_robots($post->ID);

$context['featured_posts'] = Templating\get_featured_posts($post->ID);
$context['questionnaire_post_type'] = Templating\get_questionnaire_post_type($post->ID);
$context['questionnaire_threshold'] = Templating\get_questionnaire_threshold($post->ID);
$context['questionnaire_qs'] = Templating\get_questionnaire_qs($post->ID);

$template = 'home.twig';

Timber::render( $template, $context );