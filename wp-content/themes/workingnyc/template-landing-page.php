<?php

/**
 * Template Name: Landing Page
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

$context['sections'] = Templating\get_sections();

$template = array('single.twig');

/**
 * Newsletter
 *
 * @author NYC Opportunity
 */

if ($post->slug === 'newsletter') {
  // Enqueue
  add_action('wp_enqueue_scripts', function() {
    enqueue_script('newsletter');
  });

  $template = 'newsletter.twig';

  $context['show_newsletter'] = false;

  $context['form_fields'] = WorkingNYC\parse_fields($post->content);

  // Populated email from newsletter object
  if (isset($_REQUEST['EMAIL'])) {
    if ($_REQUEST['EMAIL'] != "") {
      $context['email'] = $_REQUEST['EMAIL'];
      $context['newsletter_message'] = true;
    }

    unset($_REQUEST['EMAIL']);
  } else {
    $context['newsletter_message'] = false;
    $context['email'] = '';
  }
}

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

Timber::render($template, $context);
