<?php

/**
 * Single entry template. Used for posts and other individual content items.
 *
 * @author NYC Opportunity
 */

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;

// Sitemap
if ($post->slug == 'sitemap') {
  $context['sitemap'] = true;

  $args = array(
    'posts_per_page' => -1,
    'post_type' => 'programs',
    'orderby' => 'title',
    'order' => 'ASC'
  );

  $programs = get_posts($args);

  $context['programs'] = $programs;
}

Timber::render('single.twig', $context);
