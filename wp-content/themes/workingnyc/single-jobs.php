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

$context['modified_date'] = WorkingNYC\modified_date_formatted($post->ID);

$context['meta'] = new WorkingNYC\Meta($post->ID);

/**
 * Generate schema for page
 *
 * @author NYC Opportunity
 */

$schema = json_decode($context['schema']); // Decode base schema to add

$context['schema'] = json_encode(array_merge($schema, $post->schema), JSON_UNESCAPED_SLASHES);

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

Timber::render('jobs/single.twig', $context);
