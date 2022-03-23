<?php

/**
 * Plugin Name: Register REST Routes
 * Description: Registers custom WordPress REST API routes
 * Author: NYC Opportunity
 */

/**
 * Register REST Route shouldn't be done before the REST api init hook so we
 * will hook into that action.
 */
add_action('rest_api_init', function() {
  /**
   * Configuration
   */

  $v = 'api/v1'; // namespace for the current version of the API

  $exp = WEEK_IN_SECONDS; // expiration of the transient caches

  /**
   * Returns a list of public taxonomies and their terms. The argument post_type[]=
   * can be uses to get registered taxonomies for a particular post type. Multiple
   * post types can be combined.
   *
   * @param   String  $namespace  Namespace for the route
   * @param   String  $route      Endpoint for the route
   * @param   Array               An array including REST methods and
   *                                a function that processes the request
   *
   * @return  Object              A WordPress REST Response
   */
  register_rest_route('api/v1', '/terms/', array(
    'methods' => 'GET',
    'permission_callback' => '__return_true',
    'callback' => function(WP_REST_Request $request) {
      $params = $request->get_params();

      $lang = (defined('ICL_LANGUAGE_CODE')) ? '_' . ICL_LANGUAGE_CODE : '';

      $data = (isset($params['cache'])) ? false : get_transient('rest_terms_json' . $lang);

      if (false === $data) {
        $data = [];

        $query = array(
          'public' => true,
          '_builtin' => false
        );

        // Get public taxonomies and build our initial assoc. array
        foreach (get_taxonomies($query, 'objects') as $taxonomy) {
          if (isset($params['post_type']) &&
            0 === count(array_intersect($params['post_type'], $taxonomy->object_type))
          ) {
            continue;
          }

          $data[] = array(
            'name' => $taxonomy->name,
            'labels' => $taxonomy->labels,
            'taxonomy' => $taxonomy,
            'terms' => array()
          );
        }

        // Get the terms for each taxonomy
        $data = array_map(function ($tax) {
          $tax['terms'] = get_terms(array(
            'taxonomy' => $tax['name'],
            'hide_empty' => false,
          ));

          return $tax;
        }, $data);

        set_transient('rest_terms_json' . $lang, $data, WEEK_IN_SECONDS);
      }

      $response = new WP_REST_Response($data); // Create the response object

      $response->set_status(200); // Add a custom status code

      return $response;
    }
  ));
});
