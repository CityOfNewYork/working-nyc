<?php

/**
 * Plugin Name: Query Vars
 * Description: Adds acceptable query vars to the site for WordPress DB queries.
 * Plugin URI: https://github.com/cityofnewyork/working-nyc
 * Author: NYC Opportunity
 * Author URI: nyc.gov/opportunity
 */

add_filter('query_vars', function($vars) {
  /**
   * Please note, custom query parameters must use the prefix
   * to prevent conflicts with the WordPress Query
   *
   * @author NYC Opportunity
   */

  $prefix = 'wnyc_';

  /**
   * Google Optimize (or other) A/B testing query parameter
   */

  array_push($vars, $prefix . 'v'); // version

  /**
   * Query Vars to map to the WP Archive Vue history state. These are different
   * from registered query vars so that they don't interfere with the WordPress
   * Query.
   *
   * These are mapped in the following scripts
   *
   * wp-content/themes/workingnyc/src/js/programs-archive.js
   * wp-content/themes/workingnyc/src/js/jobs-archive.js
   *
   * @author NYC Opportunity
   */

   array_push($vars, $prefix . 'agy'); // agency
   array_push($vars, $prefix . 'ser'); // services
   array_push($vars, $prefix . 'rst'); // recruitment_status
   array_push($vars, $prefix . 'sch'); // schedule
   array_push($vars, $prefix . 'dur'); // duration
   array_push($vars, $prefix . 'loc'); // locations
   array_push($vars, $prefix . 'pop'); // populations
   array_push($vars, $prefix . 'age'); // agerangeserved
   array_push($vars, $prefix . 'sec'); // sectors
   array_push($vars, $prefix . 'src'); // source
   array_push($vars, $prefix . 'sal'); // salary
 
   /**
    * These need to be added to support mapping the previous /programs archive
    * query variables to the new variable set up. The Questionnaire on the
    * homepage uses the old query variables to filter results.
    *
    * @author NYC Opportunity
    */
 
   array_push($vars, 'services');
   array_push($vars, 'populations');
   array_push($vars, 'age');
   array_push($vars, 'sectors');
   array_push($vars, 'recruitment_status');
   array_push($vars, 'schedule');
   array_push($vars, 'duration');
   array_push($vars, 'locations');
   array_push($vars, 'agency');

  /**
   * Add Public Query Variable for Open Graph Images
   */

  array_push($vars, $prefix . 'ogi');

  return $vars;
});
