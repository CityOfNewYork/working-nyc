<?php

// phpcs:disable
/**
 * Plugin Name: Register Taxonomies
 * Description: Creates custom taxonomies for the site. The order of registration affects the display order on the front-end. Additionally, filters can be configured to show up on the front-end using the 'public' configuration parameter for each taxonomy.
 * Author: NYC Opportunity
 */
// phpcs:enable

add_action('init', function() {
  /**
   * Taxonomy: Services
   *
   * @author NYC Opportunity
   */
  register_taxonomy('services', ['programs'], array(
    'label' => __('Services', 'WNYC'),
    'labels' => array(
      'name' => __('Services', 'WNYC'),
      'singular_name' => __('Service', 'WNYC')
    ),
    'public' => false,
    'publicly_queryable' => false,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_nav_menus' => true,
    'query_var' => true,
    'rewrite' => array(
      'slug' => 'services',
      'with_front' => true
    ),
    'show_admin_column' => true,
    'show_in_rest' => true, // Use this to show in the front-end filters
    'show_tagcloud' => true,
    'rest_base' => 'services',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => true,
    'show_in_graphql' => false,
  ));

  /**
   * Taxonomy: People served
   *
   * @author NYC Opportunity
   */
  register_taxonomy('populations', ['programs'], array(
    'label' => __('People served', 'WNYC'),
    'labels' => array(
      'name' => __('People served', 'WNYC'),
      'singular_name' => __('People served', 'WNYC'),
    ),
    'public' => false,
    'publicly_queryable' => false,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_nav_menus' => true,
    'query_var' => true,
    'rewrite' => array(
      'slug' => 'populations',
      'with_front' => true,
    ),
    'show_admin_column' => false,
    'show_in_rest' => true, // Use this to show in the front-end filters
    'show_tagcloud' => true,
    'rest_base' => 'populations',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => true,
    'show_in_graphql' => false
  ));

  /**
   * Taxonomy: Sectors
   *
   * @author NYC Opportunity
   */
  register_taxonomy('sectors', ['programs', 'jobs'], array(
    'label' => __('Sectors', 'WNYC'),
    'labels' => array(
      'name' => __('Sectors', 'WNYC'),
      'singular_name' => __('Sector', 'WNYC'),
    ),
    'public' => false,
    'publicly_queryable' => false,
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
    'show_in_rest' => true, // Use this to show in the front-end filters
    'show_tagcloud' => true,
    'rest_base' => 'sectors',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => true,
    'show_in_graphql' => false
  ));

  /**
   * Taxonomy: Recruitment status
   *
   * @author NYC Opportunity
   */
  register_taxonomy('recruitment_status', ['programs'], array(
    'label' => __('Recruitment statuses', 'WNYC'),
    'labels' => array(
      'name' => __('Recruitment statuses', 'WNYC'),
      'singular_name' => __('Recruitment status', 'WNYC')
    ),
    'public' => false,
    'publicly_queryable' => false,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_nav_menus' => true,
    'query_var' => true,
    'rewrite' => array(
      'slug' => 'recruitment_status',
      'with_front' => true
    ),
    'show_admin_column' => true,
    'show_in_rest' => true, // Use this to show in the front-end filters
    'show_tagcloud' => true,
    'rest_base' => 'recruitment_status',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => true,
    'show_in_graphql' => false,
  ));

  /**
   * Taxonomy: Salary
   *
   * @author NYC Opportunity
   */
  register_taxonomy('salary', ['jobs'], array(
    'label' => __('Salary types', 'WNYC'),
    'labels' => array(
      'name' => __('Salary types', 'WNYC'),
      'singular_name' => __('Salary type', 'WNYC'),
    ),
    'public' => false,
    'publicly_queryable' => false,
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
    'show_in_rest' => true, // Use this to show in the front-end filters
    'show_tagcloud' => true,
    'rest_base' => 'salary',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => true,
    'show_in_graphql' => false
  ));

  /**
   * Taxonomy: Schedule
   *
   * @author NYC Opportunity
   */
  register_taxonomy('schedule', ['programs', 'jobs'], array(
    'label' => __('Schedules', 'WNYC'),
    'labels' => array(
      'name' => __('Schedules', 'WNYC'),
      'singular_name' => __('Schedule', 'WNYC')
    ),
    'public' => false,
    'publicly_queryable' => false,
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
    'show_in_rest' => true, // Use this to show in the front-end filters
    'show_tagcloud' => true,
    'rest_base' => 'schedule',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => true,
    'show_in_graphql' => false,
  ));

  /**
   * Taxonomy: Durations
   *
   * @author NYC Opportunity
   */
  register_taxonomy('duration', ['programs'], array(
    'label' => __('Durations', 'WNYC'),
    'labels' => array(
      'name' => __('Durations', 'WNYC'),
      'singular_name' => __('Duration', 'WNYC'),
    ),
    'public' => false,
    'publicly_queryable' => false,
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
    'show_in_rest' => true, // Use this to show in the front-end filters
    'show_tagcloud' => true,
    'rest_base' => 'duration',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => true,
    'show_in_graphql' => false,
  ));

  /**
   * Taxonomy: Locations
   *
   * @author NYC Opportunity
   */
  register_taxonomy('locations', ['programs', 'jobs'], array(
    'label' => __('Locations', 'WNYC'),
    'labels' => array(
      'name' => __('Locations', 'WNYC'),
      'singular_name' => __('Location', 'WNYC')
    ),
    'public' => false,
    'publicly_queryable' => false,
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
    'show_in_rest' => true, // Use this to show in the front-end filters
    'show_tagcloud' => true,
    'rest_base' => 'locations',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => true,
    'show_in_graphql' => false
  ));

  /**
   * Taxonomy: Sources
   *
   * @author NYC Opportunity
   */
  register_taxonomy('source', ['jobs', 'instructions'], array(
    'label' => __('Sources', 'WNYC'),
    'labels' => array(
      'name' => __('Sources', 'WNYC'),
      'singular_name' => __('Source', 'WNYC'),
    ),
    'public' => false,
    'publicly_queryable' => false,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_nav_menus' => true,
    'query_var' => true,
    'rewrite' => array(
      'slug' => 'source',
      'with_front' => true
    ),
    'show_admin_column' => true,
    'show_in_rest' => true, // Use this to show in the front-end filters
    'show_tagcloud' => true,
    'rest_base' => 'source',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => true,
    'show_in_graphql' => false
  ));

  /**
   * Taxonomy: Agency
   *
   * @author NYC Opportunity
   */
  register_taxonomy('agency', ['programs', 'jobs'], array(
    'label' => __('Agency providers', 'WNYC'),
    'labels' => array(
      'name' => __('Agency providers', 'WNYC'),
      'singular_name' => __('Agency provider', 'WNYC'),
    ),
    'public' => false,
    'publicly_queryable' => false,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_nav_menus' => true,
    'query_var' => true,
    'rewrite' => array(
      'slug' => 'agency',
      'with_front' => true
    ),
    'show_admin_column' => false,
    'show_in_rest' => false, // Use this to show in the front-end filters
    'show_tagcloud' => true,
    'rest_base' => 'agency',
    'rest_controller_class' => 'WP_REST_Terms_Controller',
    'show_in_quick_edit' => true,
    'show_in_graphql' => false
  ));
});
