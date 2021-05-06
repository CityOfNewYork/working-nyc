<?php

/**
 * Plugin Name: Template Redirect
 * Description: Disable Author pages and other default templates
 * Plugin URI: https://github.com/nycopportunity/working-nyc
 * Author: NYC Opportunity
 * Author URI: nyc.gov/opportunity
 */

add_action('template_redirect', function() {
  if (is_author()) {
    wp_redirect(get_option('home'), 301);

    exit;
  }
});
