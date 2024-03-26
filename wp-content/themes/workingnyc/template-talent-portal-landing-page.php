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

$post = Timber::get_post();

$context['post'] = $post;

$context['hide_jobseeker_and_employer_navigation'] = true;

/**
 * Set Meta context
 */

$context['meta'] = new WorkingNYC\Meta($post);

/**
 * Render the view
 */

$compiled = new WorkingNYC\CompileImgPreload('talent-portal-landing-page.twig', $context);

echo $compiled->html;
