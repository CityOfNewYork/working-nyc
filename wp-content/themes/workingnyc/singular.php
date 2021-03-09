<?php
/**
* Single entry template. Used for posts and other individual content items.
*/

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;

// Sitemap
if ($post->slug == 'sitemap') {
  $context['sitemap'] = true;

  $programs = array();
  $taxonomies = get_object_taxonomies('programs', 'objects');

  // get the terms in taxonomy
  foreach ($taxonomies as $key => $tax) {
    $term_posts = array(
      'category' => array(
        'taxonomy' => $tax->label,
        'terms' => array()
      )
    );

    $terms = get_terms($tax->name, array(
      'hide_empty' => false,
    ));

    foreach ($terms as $i => $term) {
      $arr = array(
        'name' => $term->name,
        'posts' => get_posts(
          array(
              'posts_per_page' => -1,
              'post_type' => 'programs',
              'tax_query' => array(
                  array(
                      'taxonomy' => $tax->name,
                      'field' => 'term_id',
                      'terms' => $term->term_id,
                  )
              )
          )
        )
      );
      array_push($term_posts['category']['terms'], $arr);
    }
    array_push($programs, $term_posts);
  }
  $context['programs'] = $programs;
}

$template = 'single.twig';
Timber::render( $template, $context );