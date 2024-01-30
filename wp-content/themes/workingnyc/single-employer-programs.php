<?php

/**
 * Single entry template. Used for posts and other individual content items.
 *
 * @author NYC Opportunity
 */

require_once WorkingNYC\timber_post('EmployerPrograms');

/**
 * Enqueue
 *
 * @author NYC Opportunity
 */

 wp_enqueue_script('employer-program-single-page', get_template_directory_uri() . '/assets/js/employer-program-single-page-development.js', array('jquery'), null, true);

 /**
 * Set the Timber view context
 *
 * @author NYC Opportunity
 */

$context = Timber::get_context();

$post = Timber::get_post();

$post = new WorkingNYC\EmployerPrograms($post);

$context['post'] = $post;

$context['modified_date'] = WorkingNYC\modified_date_formatted($post->ID);

$context['meta'] = new WorkingNYC\Meta($post);

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

Timber::render('employer-programs/single.twig', $context);
