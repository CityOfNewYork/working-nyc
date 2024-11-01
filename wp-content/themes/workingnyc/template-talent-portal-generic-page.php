<?php

/**
 * Template Name: Talent Portal Generic Page
 *
 * @author NYC Opportunity
 */

/**
 * Context
 */

$context = Timber::get_context();

$post = Timber::get_post();

$context['post'] = $post;

$context['meta'] = new WorkingNYC\Meta($post);

$context['sections'] = Templating\get_sections();

// set this to true for all employer-side pages
$context['employer'] = true;

/**
 * Render the view
 */

$compiled = new WorkingNYC\CompileImgPreload('talent-portal-page.twig', $context);

echo $compiled->html;
