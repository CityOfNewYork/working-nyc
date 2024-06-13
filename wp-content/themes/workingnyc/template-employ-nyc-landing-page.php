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

//$context['sections'] = Templating\get_sections();

$context['upcoming_events'] = Templating\get_upcoming_events();

$context['events_form'] = Templating\get_events_form();

$context['events_header'] = Templating\get_events_header();

$context['modified_date'] = WorkingNYC\modified_date_formatted($post->ID);

$context['hide_jobseeker_and_employer_navigation'] = true;

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

$compiled = new WorkingNYC\CompileImgPreload('employ-nyc-landing-page.twig', $context);

echo $compiled->html;
