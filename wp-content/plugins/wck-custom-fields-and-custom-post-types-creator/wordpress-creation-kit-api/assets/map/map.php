<?php

/*
 * Adds individual meta-data for the Map field when adding / updating a meta-box information
 *
 */
function wck_map_field_add_meta( $meta, $id, $values, $element_id = '' ) {


    if( !empty( $id ) ) {
        $meta_context = 'meta';
        $meta_context_cpt = 'wck-meta-box';

        $meta_values = get_post_meta($id, $meta, true);
    } else {
        $meta_context = 'option';
        $meta_context_cpt = 'wck-option-field';

        $meta_values = get_option( $meta );
    }


    $field_sets = get_posts( array( 'post_type' => $meta_context_cpt, 'numberposts' => -1 ) );

    if( empty( $field_sets ) )
        return;


    foreach( $field_sets as $field_set ) {

        $args = get_post_meta( $field_set->ID, 'wck_' . ( !empty( $id ) ? 'cfc' : 'opc_field' ) . '_args', true );

        if( empty( $args[0][ $meta_context . '-name' ] ) )
            continue;

        if( $args[0][ $meta_context . '-name' ] !== $meta )
            continue;

        // calculate element id
        if ( function_exists( 'is_countable' ) && is_countable($meta_values) && count($meta_values) > 0) {
            $meta_values_count = count($meta_values);
        } else if( is_array( $meta_values ) && count($meta_values) > 0 ){
            $meta_values_count = count($meta_values);
        } else {
            $meta_values_count = 1;
        }

        $element_id = ( $element_id != '' ? ( (int)$element_id + 1 ) : ( $args[0]['repeater'] == 'false' ? 1 : $meta_values_count + 1 ) );

        $fields = get_post_meta( $field_set->ID, 'wck_' . ( !empty( $id ) ? 'cfc' : 'opc' ) . '_fields', true );

        if( empty( $fields ) )
            continue;

        foreach( $fields as $field ) {

            if( $field['field-type'] !== 'map' )
                continue;

            if( !empty( $values[ Wordpress_Creation_Kit::wck_generate_slug( $field['field-title'], $field ) ] ) ) {

                wck_map_field_delete_metadata($meta, $field, $element_id, $id);
                wck_map_field_update_metadata($meta, $field, $element_id, $values[Wordpress_Creation_Kit::wck_generate_slug($field['field-title'], $field)], $id);

            }

        }

    }

}
add_action( 'wck_before_add_meta', 'wck_map_field_add_meta', 10, 4 );
add_action( 'wck_before_update_meta', 'wck_map_field_add_meta', 10, 4 );


/*
 * Add all markers for a map field as individual post_meta or options
 *
 */
function wck_map_field_update_metadata($meta, $field, $element_id, $map_markers = array(), $id = '') {

    if( !empty( $map_markers ) ) {
        foreach( $map_markers as $key => $map_marker ) {

            $meta_name = $meta . '_' . Wordpress_Creation_Kit::wck_generate_slug( $field['field-title'], $field ) . '_' . $element_id . '_' . $key;

            if( !empty( $id ) )
                update_post_meta( $id, $meta_name, $map_marker );
            else
                update_option( $meta_name, $map_marker );
        }
    }

}


/*
 * Removes all markers for a map field from the post_meta or options
 *
 */
function wck_map_field_delete_metadata($meta, $field, $element_id, $id = '') {

    global $wpdb;

    $meta_name = $meta . '_' . Wordpress_Creation_Kit::wck_generate_slug( $field['field-title'], $field ) . '_' . $element_id;

    if( !empty( $id ) ) {

        $wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key LIKE %s", $id, '%' . $meta_name . '%' ) );

        wp_cache_delete( $id, 'post_meta' );

    } else {

        $wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", '%' . $meta_name . '%' ) );

        // Needed in order to save data if other changes are made
        wp_cache_flush();

    }

}


/*
 * Returns the HTML for a map given the field
 *
 */
function wck_get_map_output( $field, $args ) {

    $defaults = array(
        'markers'     => array(),
        'editable'    => true,
        'show_search' => true,
        'extra_attr'  => '',
        'wrapper'     => ''
    );

    $args = wp_parse_args( $args, $defaults );

    $return = '';

    // Search box
    // The style:left=-99999px is set to hide the input from the viewport. It will be rewritten when the map gets initialised
    if( $args['show_search'] )
        $return .= '<input style="left: -99999px" type="text" id="' . Wordpress_Creation_Kit::wck_generate_slug( $field['title'], $field ) . '-search-box" class="wppb-map-search-box" placeholder="' . __( 'Search Location', 'profile-builder' ) . '" />';

    // Map container
    $return .= '<div id="' . Wordpress_Creation_Kit::wck_generate_slug( $field['title'], $field ) . '" class="wck-map-container" style="height: ' . $field['map_height'] . 'px;" data-editable="' . ( $args['editable'] ? 1 : 0 ) . '" data-default-zoom="' . ( !empty( $field['map_default_zoom'] ) ? (int)$field['map_default_zoom'] : 16 ) . '" data-default-lat="' . $field['map_default_latitude'] . '" data-default-lng="' . $field['map_default_longitude'] . '" ' . $args['extra_attr'] . '></div>';

    if( !empty( $args['markers'] ) ) {
        foreach( $args['markers'] as $marker )
            $return .= '<input name="' . ( $args['editable'] ? Wordpress_Creation_Kit::wck_generate_slug( $field['title'], $field ) : '' ) . '" type="hidden" class="wck-map-marker" value="' . $marker . '" />';
    }

    if( !empty( $args['wrapper'] ) )
        $return = '<' . $args['wrapper'] . '>' . $return . '</' . $args['wrapper'] . '>';

    return $return;

}