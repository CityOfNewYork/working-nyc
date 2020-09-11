<?php

/**
 * Plugin Name: Remove Menus
 * Description: Removes unused menus from the WP Dashboard
 * Author: Mayor's Office for Economic Opportunity
 */

add_action('admin_menu', function() {

  remove_menu_page( 'edit.php' );           //Posts
  remove_menu_page( 'edit-comments.php' );  //Comments

});