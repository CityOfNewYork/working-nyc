<?php

/**
 * Template Name: Talent Portal Landing Page
 *
 * @author NYC Opportunity
 */

/**
 * Context
 */

$context = Timber::get_context();

// TODO: add this when we launch the talent portal
// $post = Timber::get_post(get_option('page_on_front'));
$post = Timber::get_post();

$context['post'] = $post;

/**
 * Set Meta context
 */

$context['meta'] = new WorkingNYC\Meta($post);

/**
 * Render the view
 */

$compiled = new WorkingNYC\CompileImgPreload('talent-portal-landing-page.twig', $context);

echo $compiled->html;