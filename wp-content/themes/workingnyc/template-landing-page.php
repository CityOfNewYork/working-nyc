<?php

/**
 * Template Name: Landing Page
 *
 * @author NYC Opportunity
 */

$context = Timber::get_context();
$post = Timber::get_post();

$context['meta'] = new WorkingNYC\Meta($post->ID);

$context['post'] = $post;
$context['sections'] = Templating\get_sections();

$template = array('single.twig');

/**
 * Newsletter
 *
 * @author NYC Opportunity
 */

if ($post->slug == 'newsletter') {
  $template = 'objects/newsletter-archive.twig';
  $context['show_newsletter'] = false;

  $context['form_fields']=WorkingNYC\parse_fields($post->content);

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

Timber::render($template, $context);
