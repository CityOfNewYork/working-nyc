<?php

/**
 * Single entry template. Used for posts and other individual content items.
 *
 * @author NYC Opportunity
 */

require_once WorkingNYC\timber_post('Jobs');

/**
 * Set the Timber view context
 *
 * @author NYC Opportunity
 */

$context = Timber::get_context();

$post = Timber::get_post();

$post = new WorkingNYC\Jobs($post);

$context['post'] = $post;

if (defined('WP_ENV') && 'development' === WP_ENV) {
  debug($context['post']);
}

$context['modified_date'] = WorkingNYC\modified_date_formatted($post->ID);

$context['meta'] = new WorkingNYC\Meta($post); // Add meta to post

if (defined('WP_ENV') && 'development' === WP_ENV) {
  debug($context['meta']);
}

/**
 * Generate schema for page
 *
 * @author NYC Opportunity
 */

$schema = json_decode($context['schema']); // Decode base schema to add

$context['schema'] = json_encode(array_merge($schema, $post->schema), JSON_UNESCAPED_SLASHES);

if (defined('WP_ENV') && 'development' === WP_ENV) {
  debug(json_decode($context['schema']));
}

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

Timber::render('jobs/single.twig', $context);
