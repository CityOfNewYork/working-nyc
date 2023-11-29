<?php

add_filter('rest_post_collection_params', function($params) {
  $params['orderby']['enum'][] = 'menu_order';

  return $params;
});

add_filter('rest_programs_collection_params', function($params) {
  $params['orderby']['enum'][] = 'menu_order';

  return $params;
});

add_filter('rest_jobs_collection_params', function($params) {
  $params['orderby']['enum'][] = 'menu_order';

  return $params;
});

add_filter('rest_guides_collection_params', function($params) {
  $params['orderby']['enum'][] = 'menu_order';

  return $params;
});

add_filter('rest_employer-programs_collection_params', function($params) {
  $params['orderby']['enum'][] = 'menu_order';

  return $params;
});
