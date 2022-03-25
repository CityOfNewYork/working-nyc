<?php

// phpcs:disable
/**
 * Plugin Name: REST Prepare Posts
 * Description: Modifies the contents of posts in the WP REST API. Adds more detailed taxonomy term information. Also adds Timber Post context. Essentially, this keeping the REST API in sync with what's added for server side templates.
 * Author: NYC Opportunity
 */
// phpcs:enable

use RestPreparePosts\RestPreparePosts as RestPreparePosts;

require_once plugin_dir_path(__FILE__) . '/rest-prepare-posts/RestPreparePosts.php';

// Add custom fields to each post type in our list
add_action('rest_api_init', function() {
  $types = ['programs', 'jobs'];

  $taxonomies = get_taxonomies(array(
    'public' => true,
    '_builtin' => false
  ), 'objects');

  foreach ($types as $type) {
    $RestPreparePosts = new RestPreparePosts();

    /**
     * Configure Post Type Preparation
     */

    $RestPreparePosts->type = $type;

    $RestPreparePosts->taxonomies = $taxonomies;

    $RestPreparePosts->timberNamespace = 'WorkingNYC';

    add_filter('rest_prepare_' . $type, function($post) use ($RestPreparePosts) {
      // /**
      //  * Add public taxonomy details to the post.
      //  *
      //  * @var Array
      //  */
      // $post->data['terms'] = $RestPreparePosts->getTerms($post->data['id']);

      /**
       * Add public shared Timber context.
       *
       * @var Array
       */
      $post->data['context'] = $RestPreparePosts->getTimberContext($post->data['id']);

      return $post;
    });
  }
});
