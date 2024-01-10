<?php

/**
 * Single entry template. Used for posts and other individual content items.
 *
 * @author NYC Opportunity
 */

require_once WorkingNYC\timber_post('EmployerPrograms');

// only allow logged in users to view employer content for now
if (is_user_logged_in() === false) {
    wp_redirect('/404');

    exit;
}

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
