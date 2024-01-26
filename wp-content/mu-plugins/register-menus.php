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
      'employer_header_menu' => __('Employer Header Menu', 'Header Menu'),
      'job_seeker_footer_menu' => __('Job Seeker Footer Menu', 'Footer Menu'),
      'job_seeker_footer_menu_secondary' => __('Secondary Job Seeker Footer', 'Footer Menu'),
      'job_seeker_footer_menu_tertiary' => __('Tertiary Job Seeker Footer', 'Footer Menu'),
      'employer_footer_menu' => __('Employer Footer Menu', 'Footer Menu'),
      'global_footer_menu' => __('Global Footer Menu', 'Footer Menu'),
    )
  );
});
