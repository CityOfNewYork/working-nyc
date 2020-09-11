<?php

/*
Template Name: Landing Page
*/

$context = Timber::get_context();
$post = Timber::get_post();

$context['meta_desc'] = WorkingNYC\get_meta_desc($post->ID);
$context['meta_keywords'] = WorkingNYC\get_meta_keywords($post->ID);
$context['meta_robots'] = WorkingNYC\get_meta_robots($post->ID);

$context['post'] = $post;
$context['sections'] = Templating\get_sections();

$template = array('single.twig');

// Newsletter
if ($post->slug == 'newsletter'){
  $template = 'objects/newsletter-archive.twig';
  $context['show_newsletter'] = false;

  $context['form_fields']=WorkingNYC\parse_fields($post->content);

  // populated email from newsletter object
  if (isset($_REQUEST['EMAIL'])){
    if ($_REQUEST['EMAIL'] != ""){
      $context['email']= $_REQUEST['EMAIL'];
      $context['newsletter_message']= true;
    }
    unset($_REQUEST['EMAIL']);
  } else {
    $context['newsletter_message']= false;
    $context['email']='';
  }
}

Timber::render($template, $context);