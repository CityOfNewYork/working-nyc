<?php

/**
 * Template Name: Talent Portal Home Page
 *
 * @author NYC Opportunity
 */

/**
 * Context
 *
 * @author NYC Opportunity
 */

$context = Timber::get_context();

// TODO: add this when we launch the talent portal
// $post = Timber::get_post(get_option('page_on_front'));
$post = Timber::get_post();

$context['post'] = $post;

/**
 * Set Meta context
 *
 * @author NYC Opportunity
 */

$context['meta'] = new WorkingNYC\Meta($post);

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

$compiled = new WorkingNYC\CompileImgPreload('talent-portal-home.twig', $context);

echo $compiled->html;
