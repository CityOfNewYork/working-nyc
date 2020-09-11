<?php
/**
* Single entry template. Used for posts and other individual content items.
*/

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;
$context['modified_date'] = WorkingNYC\modified_date_formatted( $post->ID );

$context['meta_desc'] = WorkingNYC\get_meta_desc($post->ID);
$context['meta_keywords'] = WorkingNYC\get_meta_keywords($post->ID);
$context['meta_robots'] = WorkingNYC\get_meta_robots($post->ID);

$template = 'programs/single.twig';
Timber::render( $template, $context );
