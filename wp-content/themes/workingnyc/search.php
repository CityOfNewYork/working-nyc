<?php

require_once WorkingNYC\timber_post('Programs');

// Get the search term
$term = (isset($_GET['s'])) ? $_GET['s'] : '';

// Create query
$wp_query = new WP_Query(array(
  's' => $term,
  'post_type' => array('programs')
));

// Redo relevanssi query and get posts in Timber format.
// This block could be made more efficient.
$relevanssi_query = relevanssi_do_query($wp_query);
$wp_query_ids = wp_list_pluck($wp_query->posts, 'ID');
$posts = Timber::get_posts($wp_query_ids);

// Set Context
$context = Timber::get_context();
$context['term'] = $term;
$context['posts'] = array_map(function($p) {
    return new WorkingNYC\Programs($p);
}, $posts);

// TODO: add translations to search
// $context['language'] = ICL_LANGUAGE_CODE;

// Render view
$templates = array('search/search-results.twig');
Timber::render($templates, $context);
