<?php

/**
 * Plugin Name: Registering Menus
 * Description: Adds header and footer menu.
 * Author: NYC Opportunity
 */

add_action('init', function() {
  register_nav_menus(
    array(
      'job_seeker_header_menu' => __('Job Seeker Header Menu', 'Header Menu'),
      'footer_menu' => __('Footer Menu', 'Footer Menu'),
      'footer_menu_secondary' => __('Secondary Footer', 'Footer Menu'),
      'footer_menu_tertiary' => __('Tertiary Footer', 'Footer Menu')
    )
  );
});
