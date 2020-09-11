<?php

/**
 * Plugin Name: Registering Menus
 * Description: Adds header and footer menu.
 * Author: Mayor's Office for Economic Opportunity
 */

add_action('init', function() {
  register_nav_menus(
    array(
      'header_menu' => __( 'Header Menu', 'Header Menu' ),
      'footer_menu' => __( 'Footer Menu', 'Footer Menu'),
    )
  );
});