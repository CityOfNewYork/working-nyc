<?php

// phpcs:disable
/**
 * Plugin Name: Configure Core Sitemaps
 * Description: Configuration for the proposed WordPress core plugin for simple sitemaps. Filters out users, taxonomies, and other post types that do not have page views.
 * Plugin URI: https://github.com/cityofnewyork/nyco-wp-docker-boilerplate/wp/wp-content/mu-plugins/core-sitemaps.php
 * Author: NYC Opportunity
 * Author URI: nyc.gov/opportunity
 */
// phpcs:enable

/**
 * Filters the list of registered sitemap providers. This can be used as the
 * first level to filter out groups of items like pages, posts, users, or
 * taxonomies.
 *
 * @param   Object          $provider  WP_Sitemaps_Provider object.
 * @param   String          $name      Name of WP_Sitemaps_Provider.
 *
 * @return  Object/Boolean             Return the provider or false to unset.
 */
add_filter('wp_sitemaps_add_provider', function($provider, $name) {
  if ('users' === $name) {
    return false;
  }

  if ('taxonomies' === $name) {
    return false;
  }

  return $provider;
}, 10, 2);

/**
 * Filter the list of post object sub types available within the sitemap.
 *
 * @param  Array  $post_types  List of registered object sub types.
 */
add_filter('wp_sitemaps_post_types', function($type) {
  // Filter out the default posts type which is not used by the site.
  unset($type['post']);

  unset($type['instructions']);

  return $type;
});

/**
 * Modify individual entries within the sitemap.
 *
 * @param   Array   $entry  The sitemap entry
 * @param   Object  $post   The post object assoc. with the entry
 *
 * @return  Array           The updated sitemap entry
 */
add_filter('wp_sitemaps_posts_entry', function($entry, $post) {
  /**
   * Add last modified date to the URL entry.
   */

  $entry['lastmod'] = date(DATE_W3C, strtotime($post->post_modified_gmt));

  return $entry;
}, 10, 2);

/**
 * Filters the query arguments for post type sitemap queries.
 *
 * @link https://developer.wordpress.org/reference/hooks/wp_sitemaps_posts_query_args
 *
 * @param   Array  $args  Array of WP_Query arguments.
 *
 * @return  Array         Modified array of WP_Query arguments.
 */
add_filter('wp_sitemaps_posts_query_args', function($args) {
  /**
   * A query argument to prevent posts from being added to the site map
   * if the meta robots custom field contains 'noindex'
   */
  $args['meta_query'] = array(
    array(
      'key' => 'meta_robots',
      'value' => 'noindex',
      'compare' => 'NOT IN'
    )
  );

  return $args;
}, 10);
