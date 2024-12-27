<?php

/**
 * Plugin Name: Register REST Routes
 * Description: Registers custom WordPress REST API routes
 * Author: NYC Opportunity
 */

 use Spyc;

 use RestPreparePosts\RestPreparePosts as RestPreparePosts; 

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

      $orderby = (isset($params['orderby'])) ? $params['orderby'] : 'name';

      $order = (isset($params['order'])) ? $params['order'] : 'ASC';

      $type = ($postTypes) ? implode('_', $postTypes) : '';

      $empty = ($hideEmpty) ? $hideEmpty : '';

      $lang = (defined('ICL_LANGUAGE_CODE')) ? ICL_LANGUAGE_CODE : '';

      $key = implode('_', ['rest_terms_json', $type, $empty, $lang]);

      $data = ($cache) ? get_transient($key) : false;

      $res = [];

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

        $res = $data;

        // Get the terms for each taxonomy
        $data = array_map(function($tax) use ($postTypes, $hideEmpty, $orderby, $order) {
          // Get used terms limited to the post type, requires
          // a work around by getting all the posts.
          if ($postTypes) {
            foreach ($postTypes as $postType) {
              $posts = get_posts(array(
                'fields' => 'ids',
                'post_type' => $postType,
                'posts_per_page' => -1,
              ));

              $tax['terms'] = wp_get_object_terms($posts, $tax['taxonomy']->name, array(
                'orderby' => $orderby,
                'order' => $order
              ));
            }
          // Get all terms regardless of post type or count.
          } else {
            $tax['terms'] = get_terms(array(
              'taxonomy' => $tax['taxonomy']->name,
              'hide_empty' => $hideEmpty,
              'orderby' => $orderby,
              'order' => $order
            ));
          }

          return $tax;
        }, $data);

        if ($cache) {
          set_transient($key, $data, WEEK_IN_SECONDS);
        }
      }

      $response = new WP_REST_Response($data); // Create the response object

      $response->set_status(200); // Add a custom status code

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
     * Acceptable REST parameters:
     *
     * @param   Array            post_type   The desired post type or types.
     *                                       Allowed values are jobs, programs, and employer-programs
     * @param   String           s           The search term
     * @param   Integer          per_page    The number of posts per page
     * @param   Integer          page        The page number of search results to return
     *
     * @return  Array                        A list of search results matching the parameters
     */
    'callback' => function(WP_REST_Request $request) {
      $parameters = $request->get_query_params();

      $post_types = [];

      // validate post type parameter
      $ALLOWED_POST_TYPES = array('programs', 'employer-programs');

      if (isset($parameters['post_type'])) {
        if (gettype($parameters['post_type']) === 'string') {
          $post_types = array($parameters['post_type']);
        } else {
          $post_types = $parameters['post_type'];
        }

        if (count(array_intersect($post_types, $ALLOWED_POST_TYPES)) < count($post_types)) {
          throw new Exception('Invalid post type');
        }
      } else {
        $post_types = array('programs', 'employer-programs');
      }

      // create the taxonomy parameter for the WP Query based on the incoming query parameters
      $wp_query_taxonomy = [];

      // get all public taxonomies that can be used in the REST API
      foreach (get_taxonomies(array('_builtin' => false,'show_in_rest' => true), 'objects') as $tax) {
        // only include taxonomies that match the post types being searched for
        if (count(array_intersect($post_types, $tax->object_type)) > 0) {
          // add the query parameter for the taxonomy to the WP Query array
          if (isset($parameters[$tax->name])) {
            $current_tax_query = array(
              'taxonomy' => $tax->name,
              'field' => 'id',
              'terms' => $parameters[$tax->name]
            );

            // custom filtering logic for employer programs
            if (count(array_intersect($post_types, ['employer-programs'])) > 0) {
              $current_tax_query['operator'] = 'AND';
            }

            $wp_query_taxonomy[] = $current_tax_query;
          }
        }
      }

      // TODO remove
      // The current implementation of the WP Archive package unnecessarily sets the search_term
      // query parameter to be an array. This is a temporary fix that can be removed once the
      // WP Archive package is changed
      $search_term = isset($parameters['s']) ? $parameters['s'] : '';

      if (gettype($search_term) === 'array' && count($search_term) > 0) {
        $search_term = $search_term[0];
      }

      $args = array(
        's' => $search_term,
        'posts_per_page' => isset($parameters['per_page']) ? $parameters['per_page'] : 24,
        'paged' => isset($parameters['page']) ? $parameters['page'] : 1,
        'post_type' => $post_types,
        'orderby' => 'menu_order',
        'order' => 'ASC'
      );

      if (count($wp_query_taxonomy) > 0) {
        $args['tax_query'] = $wp_query_taxonomy;
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
        $data    = $controller->prepare_item_for_response($search_query->post, $request);
        
        // add logic from rest-prepare-posts
        $taxonomies = get_taxonomies(array(
          '_builtin' => false,
          'show_in_rest' => true
        ), 'objects');

        $RestPreparePosts = new RestPreparePosts();
        $RestPreparePosts->type = $data->data['type'];
        $RestPreparePosts->taxonomies = $taxonomies;
        $RestPreparePosts->timberNamespace = 'WorkingNYC';
        $context = $RestPreparePosts->getTimberContext($data->data['id']);
        $data->data['context'] = $context;

        $posts[] = $controller->prepare_response_for_collection($data);
      endwhile;

      // return results
      $response = new WP_REST_Response($posts);

      $response->set_status(200);

      $response->set_headers([
        'X-WP-Total' => $search_query->found_posts,
        'X-WP-TotalPages' => $search_query->max_num_pages,
      ]);

      return $response;
    }
  ));
});

add_action('rest_api_init', function() {

  function log_event_data($eventType, $URL, $time_stamp){
    $log_dir = WP_CONTENT_DIR . '/sendgrid-events';
    $log_file = $log_dir . '/events.log'; 
    $log_data = "Event: $eventType | URL: $URL | Timestamp: $time_stamp\n";
    file_put_contents($log_file, $log_data, FILE_APPEND);
  }

  function transform_event_data($eventData){
    $event_type = isset($eventData['event']) ? $eventData['event'] : 'unknown';
    $templateName = isset($eventData['sg_template_name']) ? $eventData['sg_template_name'] : 'unknown';
    $email = isset($eventData['email']) ? $eventData['email'] : 'unknown';
    $timestamp = isset($eventData['timestamp']) ? $eventData['timestamp'] : 'unknown';
    $url = isset($eventData['url']) ? $eventData['url'] : 'unknown';
    log_event_data($event_type, $url, $timestamp);
    return array('event'=>$event_type, 'email'=>$email, 'templateName'=>$templateName);
  }
  
  register_rest_route('api/v1', '/newsletter/confirm/', array(
    'methods' => 'POST',
    'permission_callback' => '__return_true',

    'callback' => function(WP_REST_Request $request) {
      $input = $request->get_body();
      $data = json_decode($input, true);

      if (is_array($data)) {     
        foreach ($data as $event) {
          $event_data = transform_event_data($event);         
          if($event_data['event']=='click' && $event_data['templateName']==SENDGRID_CONFIRMED_TEMPLATE_NAME){
            $apiKey = SENDGRID_API_KEY;
            $sg = new \SendGrid($apiKey);
            $request_body = json_decode('{
              "list_ids": ["'. SENDGRID_LIST_ID .'"],
              "contacts": [
                {
                  "email": "' . $event_data['email'] . '",
                  "custom_fields": {
                    "Subscription_Status": "confirmed"
                  }
                }
              ]
            }');
            try {
                $response = $sg->client
                    ->marketing()
                    ->contacts()
                    ->put($request_body);

                if($response->statusCode() == 202){
                  $sendEmail = new \SendGrid\Mail\Mail();
                  $sendEmail->setFrom(SENDGRID_SENDGER_EMAIL_ADDRESS, SENGRID_SENDER_NAME);
                  $sendEmail->setSubject(SENDGRID_CONFIRMED_SUBSCRIPTION_SUBJECT);
                  $sendEmail->addTo($event_data['email'],"User"); 
                  $templateId = SENDGRID_CONFIRMED_TEMPLATE_ID;
                  $sendEmail->setTemplateId($templateId);
                  $sendgrid = new \SendGrid($apiKey);
                  try {
                      $response_email = $sendgrid->send($sendEmail);
                      if($response_email->statusCode() == 202){
                        return new WP_REST_Response("success", 200);
                      }
                  } catch (Exception $e) {
                      return new WP_REST_Response($e->getMessage(), 500);
                  }
                }
            } catch (Exception $ex) {
              return new WP_REST_Response($ex->getMessage(), 500);
            }
          }
        }
      }
      else {
        $response->set_status(400);
        return $response;
      }
    }
  ));
});

add_action('rest_api_init', function() {

  register_rest_route('api/v1', '/newsletter/signUp/', array(
    'methods' => 'GET',
    'permission_callback' => '__return_true',

    'callback' => function(WP_REST_Request $request) {
      $email_address = $request->get_param('EMAIL');
      $zipcode = $request->get_param('ZIPCODE');
      $apiKey = SENDGRID_API_KEY;
      $sg = new \SendGrid($apiKey);
      $request_body = json_decode('{
        "list_ids": ["'. SENDGRID_LIST_ID .'"],
         "contacts": [
           {
             "email": "' . $email_address . '",
             "postal_code": "' . $zipcode . '",
             "custom_fields": {
               "Subscription_Status": "pending"
             }
           }
         ]
       }');
      try {
          $response = $sg->client
              ->marketing()
              ->contacts()
              ->put($request_body);

          if($response->statusCode() == 202){
              $email = new \SendGrid\Mail\Mail();
              $email->setFrom(SENDGRID_SENDGER_EMAIL_ADDRESS, SENGRID_SENDER_NAME);
              $email->setSubject(SENDGRID_SUBSCRIPTION_CONFIRM_SUBJECT);
              $email->addTo($email_address,"User"); 
              $templateId = $sendgrid_confirmation_template_id;
              $email->setTemplateId(SENDGRID_CONFIRMATION_TEMPATE_ID);
              $sendgrid = new \SendGrid($apiKey);
              try {
                  $response_email = $sendgrid->send($email);
                  if($response_email->statusCode() == 202){
                    return new WP_REST_Response("success", 200);
                  }
              } catch (Exception $e) {
                  return new WP_REST_Response($e->getMessage(), 500);
              }
            }
      } catch (Exception $ex) {
        return new WP_REST_Response($e->getMessage(), 500);
      }
      
    }
  ));
});