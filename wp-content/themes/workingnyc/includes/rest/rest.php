<?php

/**
 * add orderby filter for rest api
 */
add_filter( 'rest_post_collection_params', 'filter_add_rest_orderby_params', 10, 1 );
function filter_add_rest_orderby_params( $params ) {
	$params['orderby']['enum'][] = 'menu_order';
	return $params;
}