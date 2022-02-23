<?php

/**
 * Plugin Name: Register Taxonomies
 * Description: Creates custom taxonomies types for Working NYC
 * Author: NYC Opportunity
 */

add_action('init', function() {
  /**
   * Taxonomy: Services
   *
   * @author NYC Opportunity
   */
  register_taxonomy('services', ['programs'], array(
    'label' => __('Services'),
    'labels' => array(
      'name' => __('Services'),
      'singular_name' => __('Service')
    ),
    'public' => true,
    'publicly_queryable' => true,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_nav_menus' => true,
    'query_var' => true,
    'rewrite' => array(
      'slug' => 'services',
      'with_front' => true
    ),
    'show_admin_column' => false,
    'show_in_rest' => true,
    'show_tagcloud' => true,
    'rest_base' => 'services',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => false,
    'show_in_graphql' => false,
  ));

  /**
   * Taxonomy: Recruitment status
   *
   * @author NYC Opportunity
   */
  register_taxonomy('recruitment_status', ['programs'], array(
    'label' => __('Recruitment status'),
    'labels' => array(
      'name' => __('Recruitment status'),
      'singular_name' => __('Recruitment status')
    ),
    'public' => true,
    'publicly_queryable' => true,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_nav_menus' => true,
    'query_var' => true,
    'rewrite' => array(
      'slug' => 'recruitment_status',
      'with_front' => true
    ),
    'show_admin_column' => false,
    'show_in_rest' => true,
    'show_tagcloud' => true,
    'rest_base' => 'recruitment_status',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => false,
    'show_in_graphql' => false,
  ));

  /**
   * Taxonomy: Schedule
   *
   * @author NYC Opportunity
   */
  register_taxonomy('schedule', ['programs', 'jobs'], array(
    'label' => __('Schedule'),
    'labels' => array(
      'name' => __('Schedule'),
      'singular_name' => __('Schedule')
    ),
    'public' => true,
    'publicly_queryable' => true,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_nav_menus' => true,
    'query_var' => true,
    'rewrite' => array(
      'slug' => 'schedule',
      'with_front' => true
    ),
    'show_admin_column' => false,
    'show_in_rest' => true,
    'show_tagcloud' => true,
    'rest_base' => 'schedule',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => false,
    'show_in_graphql' => false,
  ));

  /**
   * Taxonomy: Durations
   *
   * @author NYC Opportunity
   */
  register_taxonomy('duration', ['programs'], array(
    'label' => __('Durations'),
    'labels' => array(
      'name' => __('Durations'),
      'singular_name' => __('Duration'),
    ),
    'public' => true,
    'publicly_queryable' => true,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_nav_menus' => true,
    'query_var' => true,
    'rewrite' => array(
      'slug' => 'duration',
      'with_front' => true
    ),
    'show_admin_column' => false,
    'show_in_rest' => true,
    'show_tagcloud' => true,
    'rest_base' => 'duration',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => false,
    'show_in_graphql' => false,
  ));

  /**
   * Taxonomy: Locations
   *
   * @author NYC Opportunity
   */
  register_taxonomy('locations', ['programs', 'jobs'], array(
    'label' => __('Locations'),
    'labels' => array(
      'name' => __('Locations'),
      'singular_name' => __('Location')
    ),
    'public' => true,
    'publicly_queryable' => true,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_nav_menus' => true,
    'query_var' => true,
    'rewrite' => array(
      'slug' => 'locations',
      'with_front' => true
    ),
    'show_admin_column' => false,
    'show_in_rest' => true,
    'show_tagcloud' => true,
    'rest_base' => 'locations',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => false,
    'show_in_graphql' => false
  ));

  /**
   * Taxonomy: People served
   *
   * @author NYC Opportunity
   */
  register_taxonomy('populations', ['programs', 'jobs'], array(
    'label' => __('People served'),
    'labels' => array(
      'name' => __('People served'),
      'singular_name' => __('People served'),
    ),
    'public' => true,
    'publicly_queryable' => true,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_nav_menus' => true,
    'query_var' => true,
    'rewrite' => [ 'slug' => 'populations', 'with_front' => true, ],
    'show_admin_column' => false,
    'show_in_rest' => true,
    'show_tagcloud' => true,
    'rest_base' => 'populations',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => false,
    'show_in_graphql' => false
  ));

  /**
   * Taxonomy: Sectors
   *
   * @author NYC Opportunity
   */
  register_taxonomy('sectors', ['programs', 'jobs'], array(
    'label' => __('Sectors'),
    'labels' => array(
      'name' => __('Sectors'),
      'singular_name' => __('Sector'),
    ),
    'public' => true,
    'publicly_queryable' => true,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_nav_menus' => true,
    'query_var' => true,
    'rewrite' => array(
      'slug' => 'sectors',
      'with_front' => true
    ),
    'show_admin_column' => false,
    'show_in_rest' => true,
    'show_tagcloud' => true,
    'rest_base' => 'sectors',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => false,
    'show_in_graphql' => false
  ));

  /**
   * Taxonomy: Sources
   *
   * @author NYC Opportunity
   */
  register_taxonomy('source', ['jobs'], array(
    'label' => __('Sources'),
    'labels' => array(
      'name' => __('Sources'),
      'singular_name' => __('Source'),
    ),
    'public' => true,
    'publicly_queryable' => true,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_nav_menus' => true,
    'query_var' => true,
    'rewrite' => array(
      'slug' => 'sources',
      'with_front' => true
    ),
    'show_admin_column' => false,
    'show_in_rest' => true,
    'show_tagcloud' => true,
    'rest_base' => 'sources',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => false,
    'show_in_graphql' => false
  ));

  /**
   * Taxonomy: Sources
   *
   * @author NYC Opportunity
   */
  register_taxonomy('salary', ['jobs'], array(
    'label' => __('Salary Units'),
    'labels' => array(
      'name' => __('Salary Units'),
      'singular_name' => __('Salary Unit'),
    ),
    'public' => true,
    'publicly_queryable' => true,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_nav_menus' => true,
    'query_var' => true,
    'rewrite' => array(
      'slug' => 'salary',
      'with_front' => true
    ),
    'show_admin_column' => false,
    'show_in_rest' => true,
    'show_tagcloud' => true,
    'rest_base' => 'salary',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => false,
    'show_in_graphql' => false
  ));
});
