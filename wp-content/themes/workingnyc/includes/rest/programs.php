<?php
/**
 * Programs WordPress REST API
 *
 * @author NYC Opportunity
 */

/**
 * Register routes and fields for Programs REST endpoint
 *
 * @author NYC Opportunity
 */
add_action('rest_api_init', function() {
  $taxonomies = get_object_taxonomies('programs');

  foreach ($taxonomies as &$taxonomy) {
    register_rest_field('programs', $taxonomy, array(
      'get_callback' => function($object, $taxonomy) {
        $post_id = $object['id'];

        $terms = wp_get_post_terms($post_id, $taxonomy);

        // Decode HTML characters
        $terms = array_map(function($term) {
          $term->name = htmlspecialchars_decode($term->name);

          return $term;
        }, $terms);

        return $terms;
      },
      'schema' => null,
    ));
  }

  register_rest_field('programs', 'title', array(
    'get_callback' => function($object) {
      $post_title = html_entity_decode($object['title']['rendered']);

      return $post_title;
    },
    'schema' => null,
  ));
});

/**
 * Add order by parameter to programs.
 *
 * @param   Array  $params  Program params
 *
 * @return  Array           $params
 */
add_filter('rest_programs_collection_params', function($params) {
  $params['orderby']['enum'][] = 'menu_order';

  return $params;
}, 10, 1);
