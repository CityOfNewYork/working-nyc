<?php

/**
 * Plugin Name: Register Post Types
 * Description: Creates custom post types for WorkingNYC
 * Author: NYC Opportunity
 */

add_action('init', function() {
  register_post_type(
    'programs',
    array(
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
      // 'taxonomies' => array(''),
      'hierarchical' => false,
      'supports' => array( 'title' ),
      'menu_icon' => 'dashicons-format-aside',
      'menu_position' => 21,
      'has_archive' => true,
      'rewrite' => array(
        'slug' => 'programs',
        'with_front' => false
      )
    )
  );

  register_post_type(
    'announcements',
    array(
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
      'supports' => array( 'title' ),
      'menu_icon' => 'dashicons-megaphone',
      'menu_position' => 22,
      'has_archive' => true,
      'rewrite' => array(
        'slug' => 'announcements',
        'with_front' => false
      )
    )
  );
});
