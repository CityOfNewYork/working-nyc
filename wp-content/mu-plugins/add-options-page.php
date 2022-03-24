<?php

/**
 * Plugin Name: WNYC Settings
 * Description: Adds a settings page for the theme.
 * Author: NYC Opportunity
 */

add_action('init', function() {
  if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
      'page_title' => 'WKNYC General Settings',
      'menu_title' => 'WKNYC Settings',
      'menu_slug' => 'wknyc-general-settings',
      'capability' => 'edit_posts',
      'redirect' => false
    ));
  }
});
