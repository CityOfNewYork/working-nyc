<?php

/**
 * Single entry template. Used for posts and other individual content items.
 *
 * @author NYC Opportunity
 */

/**
 * Set the Timber view context
 *
 * @author NYC Opportunity
 */

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;
$context['modified_date'] = WorkingNYC\modified_date_formatted($post->ID);
$context['meta'] = new WorkingNYC\Meta($post->ID);

/**
 * Generate schema for page
 *
 * @author NYC Opportunity
 */

$schemas = array();

$arr_ed = array('University', 'College');
$ed = false;

foreach ($arr_ed as $value) {
  if (strpos($post->program_agency, $value) !== false || strpos($post->program_provider, $value) !== false) {
    $ed = true;
    break;
  }
}

if ($ed == true) {
  array_push(
    $schemas,
    WNYCSchema\educational_organization($post)
  );
}

if ($ed == false && $post->program_agency != '') {
  array_push(
    $schemas,
    WNYCSchema\government_service($post),
    WNYCSchema\government_organization($post)
  );
}

$context['schema'] = json_encode($schemas, JSON_UNESCAPED_SLASHES);

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

$template = 'programs/single.twig';

Timber::render($template, $context);
