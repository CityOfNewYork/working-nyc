<?php
/**
* Single entry template. Used for posts and other individual content items.
*/

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;

$template = 'single.twig';
Timber::render( $template, $context );