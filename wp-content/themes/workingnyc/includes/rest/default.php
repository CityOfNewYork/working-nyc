<?php

/**
 * Add orderby filter for REST API
 *
 * @author NYC Opportunity
 */
add_filter('rest_post_collection_params', function($params) {
    $params['orderby']['enum'][] = 'menu_order';

    return $params;
}, 10, 1);
