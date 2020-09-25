<?php 
/**
 * Programs WP Rest API
 */

 /**
  * Register routes and fields for programs rest endpoint
  */
add_action( 'rest_api_init', 'register_rest_programs' );
add_filter( 'rest_programs_collection_params', 'filter_add_rest_orderby_params', 10, 1 );

function register_rest_programs() {
  $taxonomies = get_object_taxonomies( 'programs' );

  foreach ($taxonomies as &$taxonomy) {
    register_rest_field( 'programs', $taxonomy, array(
     'get_callback'    => 'get_rest_programs_terms',
     'schema'          => null,
    ));
  }

  register_rest_field( 'programs', 'title', array(
   'get_callback'    => 'get_rest_program_title',
   'schema'          => null,
	));
}

/**
 * Decode HTML characters
 */
function decode_html($terms) {
  foreach ($terms as &$term) { 
	  $term->name = htmlspecialchars_decode($term->name);
  }

  return $terms;
}

/**
 * Returns the terms in taxonomy
 */
function get_rest_programs_terms( $object, $taxonomy ) {
  $post_id = $object['id'];

  $terms = wp_get_post_terms( $post_id, $taxonomy );

  $terms = decode_html($terms);
 
  return $terms;
}

function get_rest_program_title( $object ) { 
  $post_title = html_entity_decode($object['title']['rendered']);
   
  return $post_title;
}