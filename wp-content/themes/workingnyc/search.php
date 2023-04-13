<?php

require_once WorkingNYC\timber_post('Jobs');
require_once WorkingNYC\timber_post('Programs');

// Get the search term
$term = (isset($_GET['s'])) ? $_GET['s'] : '';

// Create query
$wp_query = new WP_Query(array(
  's' => $term,
  'post_type' => array('jobs', 'programs')
));

// Redo relevanssi query and get posts in Timber format.
// This block could be made more efficient by not getting the posts
// through Timber::get_posts but there needs to be a way to format
// the posts for the timber template.

// relevanssi_do_query puts the results in wp_query
$relevanssi_query = relevanssi_do_query($wp_query);
$wp_query_ids = wp_list_pluck($wp_query->posts, 'ID');
$posts = Timber::get_posts($wp_query_ids);

// Set Context
$context = Timber::get_context();
$context['term'] = $term;
$context['posts'] = array_map(function($p) {
  if ($p->post_type == 'programs') {
    return new WorkingNYC\Programs($p);
  } else {
    return new WorkingNYC\Jobs($p);
  }
}, $posts);

// TODO add support for languages other than English
// $context['language'] = ICL_LANGUAGE_CODE;

// Render view
$templates = array('search.twig');
Timber::render($templates, $context);
