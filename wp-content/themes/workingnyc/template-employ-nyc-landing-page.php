<?php

/**
 * Template Name: Employ NYC Landing Page
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

$context['meta'] = new WorkingNYC\Meta($post);

$context['sections'] = Templating\get_sections();

$context['modified_date'] = WorkingNYC\modified_date_formatted($post->ID);

$context['hide_jobseeker_and_employer_navigation'] = true;

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

$compiled = new WorkingNYC\CompileImgPreload('employ-nyc-landing-page.twig', $context);

echo $compiled->html;
