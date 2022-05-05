<?php

/**
 * Plugin Name: Register Post Types
 * Description: Creates custom post types for Working NYC
 * Author: NYC Opportunity
 */

add_action('init', function() {
  /**
   * Post Type: Announcements
   *
   * @author NYC Opportunity
   */
  register_post_type('announcements', array(
    'labels' => array(
      'name' => __('Announcements'),
      'singular_name' => __('Announcement'),
      'all_items' => __('All Announcements'),
      'add_new' => __('Add New'),
      'add_new_item' => __('Add New Announcement'),
      'edit' => __('Edit'),
      'edit_item' => __('Edit Announcement'),
      'new_item' => __('New Announcement'),
      'view_item' => __('View Announcement'),
      'search_items' => __('Search Announcements')
    ),
    'description' => __('Announcements for opportunities and releases.'),
    'public' => true,
    'show_in_rest' => true,
    'exclude_from_search' => false,
    'show_ui' => true,
    'hierarchical' => false,
    'supports' => ['title', 'editor'],

      /**
       * @source https://developer.wordpress.org/resource/dashicons/
       */
    'menu_icon' => 'dashicons-megaphone',

      /**
       * Use the registration order to enforce menu position
       */
    'menu_position' => 21,
    'has_archive' => true,
    'rewrite' => array(
      'slug' => 'announcements',
      'with_front' => false
    )
  ));

  /**
   * Post Type: Programs
   *
   * @author NYC Opportunity
   */
  register_post_type('programs', array(
    'labels' => array(
      'name' => __('Programs'),
      'singular_name' => __('Program'),
      'all_items' => __('All Programs'),
      'add_new' => __('Add New'),
      'add_new_item' => __('Add New Program'),
      'edit' => __('Edit'),
      'edit_item' => __('Edit Program'),
      'new_item' => __('New Program'),
      'view_item' => __('View Program'),
      'search_items' => __('Search Programs')
    ),
    'description' => __('A program featured on the site.'),
    'public' => true,
    'show_in_rest' => true,
    'exclude_from_search' => false,
    'show_ui' => true,
    'hierarchical' => false,
    'supports' => ['title'],

      /**
       * @source https://developer.wordpress.org/resource/dashicons/
       */
    'menu_icon' => 'dashicons-awards',

      /**
       * Use the registration order to enforce menu position
       */
    'menu_position' => 21,
    'has_archive' => true,
    'rewrite' => array(
      'slug' => 'programs',
      'with_front' => false
    )
  ));

  /**
   * Post Type: Jobs
   *
   * @author NYC Opportunity
   */
  register_post_type('jobs', array(
    'labels' => array(
      'name' => __('Jobs'),
      'singular_name' => __('Job'),
      'all_items' => __('All Jobs'),
      'add_new' => __('Add New'),
      'add_new_item' => __('Add New Job'),
      'edit' => __('Edit'),
      'edit_item' => __('Edit Job'),
      'new_item' => __('New Job'),
      'view_item' => __('View Job'),
      'search_items' => __('Search Jobs')
    ),
    'description' => __('A job featured on the site.'),
    'public' => true,
    'show_in_rest' => true,
    'exclude_from_search' => false,
    'show_ui' => true,
    'hierarchical' => false,
    'supports' => ['title'],

      /**
       * @source https://developer.wordpress.org/resource/dashicons/
       */
    'menu_icon' => 'dashicons-businessperson',

      /**
       * Use the registration order to enforce menu position
       */
    'menu_position' => 21,
    'has_archive' => true,
    'rewrite' => array(
      'slug' => 'jobs',
      'with_front' => false
    )
  ));

  /**
   * Post Type: Application Instructions
   *
   * @author NYC Opportunity
   */
  register_post_type('instructions', array(
    'labels' => array(
      'name' => __('Application Instructions'),
      'singular_name' => __('Instruction'),
      'all_items' => __('All Instructions'),
      'add_new' => __('Add New'),
      'add_new_item' => __('Add New Instruction'),
      'edit' => __('Edit'),
      'edit_item' => __('Edit Instruction'),
      'new_item' => __('New Instruction'),
      'view_item' => __('View Instruction'),
      'search_items' => __('Search Instructions')
    ),
    'description' => __('An application instruction for a job post source.'),
    'public' => true,
    'show_in_rest' => true,
    'exclude_from_search' => true,
    'show_ui' => true,
    'hierarchical' => false,
    'supports' => ['title'],

      /**
       * @source https://developer.wordpress.org/resource/dashicons/
       */
    'menu_icon' => 'dashicons-yes-alt',

      /**
       * Use the registration order to enforce menu position
       */
    'menu_position' => 21,
    'has_archive' => false,
    'rewrite' => array(
      'slug' => 'instructions',
      'with_front' => false
    )
  ));
});
