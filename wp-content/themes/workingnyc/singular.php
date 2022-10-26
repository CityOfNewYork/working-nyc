<?php

/**
 * Single entry template. Used for posts and other individual content items.
 *
 * @author NYC Opportunity
 */

/**
 * Set the Timber view context
 *
 * @author NYC Opportunity
 */

$context = Timber::get_context();

$post = Timber::get_post();

$context['post'] = $post;

/**
 * Sitemap View
 *
 * @author NYC Opportunity
 */

if ($post->slug == 'sitemap') {
  $context['sitemap'] = true;

  $context['programs'] = Timber::get_posts(array(
    'posts_per_page' => -1,
    'post_type' => 'programs',
    'orderby' => 'title',
    'order' => 'ASC'
  ));

  $context['guides'] = Timber::get_posts(array(
    'posts_per_page' => -1,
    'post_type' => 'guides',
    'orderby' => 'title',
    'order' => 'ASC'
  ));

  $context['jobs'] = Timber::get_posts(array(
    'posts_per_page' => -1,
    'post_type' => 'jobs',
    'orderby' => 'title',
    'order' => 'ASC'
  ));

  $context['announcements'] = Timber::get_posts(array(
    'posts_per_page' => -1,
    'post_type' => 'announcements',
    'orderby' => 'title',
    'order' => 'ASC'
  ));
}

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

$compiled = new WorkingNYC\CompileImgPreload('single.twig', $context);

echo $compiled->html;
