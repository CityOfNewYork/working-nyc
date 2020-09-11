<?php

/*
Template Name: Generic Page
*/

$context = Timber::get_context();
$post = Timber::get_post();

$context['meta_desc'] = WorkingNYC\get_meta_desc($post->ID);
$context['meta_keywords'] = WorkingNYC\get_meta_keywords($post->ID);
$context['meta_robots'] = WorkingNYC\get_meta_robots($post->ID);

$context['post'] = $post;
$context['sections'] = Templating\get_sections();
$context['modified_date'] = WorkingNYC\modified_date_formatted( $post->ID );

$template = array('index.twig');

Timber::render($template, $context);