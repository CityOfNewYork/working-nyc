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

  if ('instructions' === $name) {
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
   * Do add page to sitemap if the meta robots field is 'noindex'
   * TODO: Only hides the url but the a tag is still printed on the page,
   * This filter only seems to allow you to modify the entry, not remove it.
   */

  // $robots = get_field('field_5f07332db6a31', $post->ID);

  // if ('noindex' === $robots) {
  //   return array();
  // }

  /**
   * Add last modified date to the URL entry.
   */

  $entry['lastmod'] = date(DATE_W3C, strtotime($post->post_modified_gmt));

  return $entry;
}, 10, 2);
