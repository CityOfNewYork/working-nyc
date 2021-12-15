<?php

/**
 * Template Name: Generic Page
 *
 * @author NYC Opportunity
 */

/**
 * Context
 *
 * @author NYC Opportunity
 */

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;
$context['meta'] = new WorkingNYC\Meta($post->ID);
$context['sections'] = Templating\get_sections();
$context['modified_date'] = WorkingNYC\modified_date_formatted($post->ID);

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

Timber::render('index.twig', $context);
