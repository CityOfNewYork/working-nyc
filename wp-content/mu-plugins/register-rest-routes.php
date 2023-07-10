<?php

/**
 * Plugin Name: Register REST Routes
 * Description: Registers custom WordPress REST API routes
 * Author: NYC Opportunity
 */


use RestPreparePosts\RestPreparePosts as RestPreparePosts;

require_once plugin_dir_path(__FILE__) . '/rest-prepare-posts/RestPreparePosts.php';

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
   *                              a function that processes the request
   *
   * @return  Object              A WordPress REST Response
   */
  register_rest_route('api/v1', '/terms/', array(
    'methods' => 'GET',
    'permission_callback' => '__return_true',

    /**
     * Callback for the terms endpoint.
     *
     * @param   WP_REST_Request  $request    Instance WP REST Request
     *
     * Acceptable REST parameters
     *
     * @param   Array            post_type   The desired post type or types
     * @param   Boolean          hide_empty
     * @param   Boolean          cache       Wether to use transient cache results
     *
     * @return  Array                        Array of taxonomies and their terms
     */
    'callback' => function(WP_REST_Request $request) {
      $params = $request->get_params();

      $postTypes = (isset($params['post_type'])) ? $params['post_type'] : false;

      $hideEmpty = (isset($params['hide_empty'])) ? filter_var($params['hide_empty'], FILTER_VALIDATE_BOOLEAN) : false;

      $cache = (isset($params['cache'])) ? filter_var($params['cache'], FILTER_VALIDATE_BOOLEAN) : true;

      /** */

      $type = ($postTypes) ? implode('_', $postTypes) : '';

      $empty = ($hideEmpty) ? $hideEmpty : '';

      $lang = (defined('ICL_LANGUAGE_CODE')) ? ICL_LANGUAGE_CODE : '';

      $key = implode('_', ['rest_terms_json', $type, $empty, $lang]);

      $data = ($cache) ? get_transient($key) : false;

      if (false === $data) {
        $data = [];

        $query = array(
          '_builtin' => false,
          'show_in_rest' => true
        );

        // Get public taxonomies and build our initial assoc. array
        foreach (get_taxonomies($query, 'objects') as $tax) {
          if ($type != '' && 0 === count(array_intersect($postTypes, $tax->object_type))) {
            continue;
          }

          $data[] = array(
            'taxonomy' => $tax,
            'terms' => []
          );
        }

        // Get the terms for each taxonomy
        $data = array_map(function($tax) use ($postTypes, $hideEmpty) {
          // Get used terms limited to the post type, requires
          // a work around by getting all the posts.
          if ($postTypes) {
            foreach ($postTypes as $postType) {
              $posts = get_posts(array(
                'fields' => 'ids',
                'post_type' => $postType,
                'posts_per_page' => -1,
              ));

              $tax['terms'] = wp_get_object_terms($posts, $tax['taxonomy']->name, ['ids']);
            }
          // Get all terms regardless of post type or count.
          } else {
            $tax['terms'] = get_terms(array(
              'taxonomy' => $tax['taxonomy']->name,
              'hide_empty' => $hideEmpty
            ));
          }

          return $tax;
        }, $data);

        // $headers = array(
        //   'post_types' => $postTypes,
        //   'hide_empty' => $hideEmpty,
        //   'cached' => $cache,
        //   'transient_key' => $key,
        //   'expires' => WEEK_IN_SECONDS
        // );

        if ($cache) {
          set_transient($key, $data, WEEK_IN_SECONDS);
        }
      }

      $response = new WP_REST_Response($data); // Create the response object

      $response->set_status(200); // Add a custom status code

      // $response->set_headers();

      return $response;
    }
  ));
});

add_action('rest_api_init', function() {
  /**
   * Configuration
   */

  $v = 'api/v1'; // namespace for the current version of the API

  $exp = WEEK_IN_SECONDS; // expiration of the transient caches

  register_rest_route('api/v1', '/searchRelevanssi/', array(
    'methods' => 'GET',
    'permission_callback' => '__return_true',

    /**
     * Callback for the search with Relevanssi endpoint.
     *
     * Adapted from example by Aucor Oy
     * Author URI: https://www.aucor.fi/
     * Version: 1.0
     * License: GPL2+
     *
     * @param   WP_REST_Request  $request    Instance WP REST Request
     *
     * Acceptable REST parameters
     *
     * @param   String           s           The search term
     * @param   Array            post_type   The desired post type or types
     * @param   Integer          per_page    The number of posts per page   
     * @param   Integer          page        The page number of search results to return
     */
    'callback' => function(WP_REST_Request $request) {
      $parameters = $request->get_query_params();

      $args = array(
        's' => $parameters['s'],
        'posts_per_page' => $parameters['per_page'],
        'paged' => $parameters['page']
      );

      // The search feature currently only allows for jobs or programs, but the API 
      // should be flexible in case we want to search other types of pages in the future
      if (isset($parameters['post_type'])) {
        $args['post_type'] = $parameters['post_type'];
      }

      // run query
      $search_query = new WP_Query();
      $search_query->parse_query($args);
      if (function_exists('relevanssi_do_query')) {
        relevanssi_do_query($search_query);
      }

      $controller = new WP_REST_Posts_Controller('post');
      $posts = array();

      while ($search_query->have_posts()):
        $search_query->the_post();
        $curr_post = $search_query->post;
        $data = $controller->prepare_item_for_response($curr_post, $request);

        // add logic from rest-prepare-posts
        $taxonomies = get_taxonomies(array(
          '_builtin' => false,
          'show_in_rest' => true
        ), 'objects');

        $RestPreparePosts = new RestPreparePosts();
        $RestPreparePosts->type = $data->data['type'];
        $RestPreparePosts->taxonomies = $taxonomies;
        $RestPreparePosts->timberNamespace = 'WorkingNYC';
        $curr_context = $RestPreparePosts->getTimberContext($data->data['id']);
        $data->data['context'] = $curr_context;

        $posts[] = $controller->prepare_response_for_collection($data);
      endwhile;

      $response = new WP_REST_Response($posts); // Create the response object

      $response->set_status(200); // Add a custom status code

      $response->set_headers([
        'X-WP-Total' => $search_query->found_posts,
        'X-WP-TotalPages' => $search_query->max_num_pages,
      ]);

      return $response;
    }
  ));
});
