<?php

// phpcs:disable
/**
 * Plugin Name: Pre-get Document Title
 * Description: Removes tagline from title tag for the homepage.
 * Plugin URI: https://github.com/cityofnewyork/nyco-wp-docker-boilerplate/wp/wp-content/mu-plugins/pre-document-get-title.php
 * Author: NYC Opportunity
 * Author URI: nyc.gov/opportunity
 */
// phpcs:enable

add_action('pre_get_document_title', function ($title) {
  // render only on the homepage
  if (is_home() || is_front_page()) {
    // remove tagline from title tag
    $title = get_bloginfo('name');
  }

  return $title;
}, 10, 1);
