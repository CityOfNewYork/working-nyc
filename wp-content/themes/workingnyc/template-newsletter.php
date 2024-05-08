<?php

/**
 * Template Name: Newsletter
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

$context['meta'] = new WorkingNYC\Meta($post);

$context['post'] = $post;

$context['hide_jobseeker_and_employer_footer'] = true;

// Enqueue
add_action('wp_enqueue_scripts', function() {
  enqueue_script('newsletter');
});

$template = 'newsletter.twig';

// Populated email from newsletter object
if (isset($_REQUEST['EMAIL'])) {
  if ($_REQUEST['EMAIL'] != "") {
    $context['email'] = htmlspecialchars($_REQUEST['EMAIL']);
    $context['newsletter_message'] = true;
  }

  unset($_REQUEST['EMAIL']);
} else {
  $context['newsletter_message'] = false;
  $context['email'] = '';
}

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

Timber::render($template, $context);
