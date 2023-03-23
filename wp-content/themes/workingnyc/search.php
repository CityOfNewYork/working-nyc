<?php

// Get the search term
$term = (isset($_GET['s'])) ? $_GET['s'] : '';

// Create query
$wp_query = new WP_Query(array(
  's' => $term,
  'post_type' => 'any'
));

// Redo relevanssi query and get posts in Timber format.
// This block could be made more efficient.
$relevanssi_query = relevanssi_do_query($wp_query);
$wp_query_ids = wp_list_pluck($wp_query->posts, 'ID');
$posts = Timber::get_posts($wp_query_ids);

// Post filtering
// Should refactor this logic into functions.php.
// if (is_array($posts)) {
//   foreach ($posts as $i => $post) {
//     switch ($post->post_type) {
//       case 'tribe_events':
//         // Format events posts
//         $posts[$i] = new GunyEvent($post);
//         break;
//       case 'age':
//         // Add age groups to age posts
//         $age_groups = $post->terms('age_group');
//         if ($age_groups) {
//           $post->age_group = $age_groups[0];
//         }
//         break;
//     }
//   }
// }

// Set Context
$context = Timber::get_context();
$context['term'] = $term;
$context['posts'] = $posts;
// $context['language'] = ICL_LANGUAGE_CODE;

// Compile templates for search template
$templates_form = array('partials/search-form.twig');
// $templates_filters = array('partials/search-filters.twig');
// $templates_results = array('partials/post-list.twig');
$context['search'] = Timber::compile($templates_form, $context);
// $context['facet_post_type'] = Timber::compile($templates_filters, $context);
// $context['results'] = Timber::compile($templates_results, $context);

// Render view
$templates = array('search.twig');
Timber::render($templates, $context);
