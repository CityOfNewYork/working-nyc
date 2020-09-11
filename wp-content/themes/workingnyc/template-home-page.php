<?php

/*
Template Name: Home Page
*/

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;

$context['featured_posts'] = Templating\get_featured_posts($post->ID);
$context['questionnaire_post_type'] = Templating\get_questionnaire_post_type($post->ID);
$context['questionnaire_threshold'] = Templating\get_questionnaire_threshold($post->ID);
$context['questionnaire_qs'] = Templating\get_questionnaire_qs($post->ID);

$template = 'home.twig';

Timber::render( $template, $context );