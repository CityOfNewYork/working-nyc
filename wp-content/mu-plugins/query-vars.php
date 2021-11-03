<?php

// phpcs:disable
/**
 * Plugin Name: Query Vars
 * Description: Adds acceptable query vars to the site for WordPress Database queries.
 * Author: NYC Opportunity
 */
// phpcs:enable

add_filter('query_vars', function($publicQueryVars) {
  /**
   * Please note, custom query parameters must use the prefix
   * to prevent conflicts with the WordPress Query
   *
   * @author NYC Opportunity
   */

  $prefix = 'wnyc_';

  array_push($publicQueryVars, $prefix . 'v');

  return $publicQueryVars;
});