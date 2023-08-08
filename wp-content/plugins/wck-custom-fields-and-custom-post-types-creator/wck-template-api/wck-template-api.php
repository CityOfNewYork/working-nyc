<?php 
/* Copyright 2013 cozmoslabs.com (email : hello@cozmoslabs.com)
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
*/


// Load the WCK_Template_API class
require_once( 'wck-template-api-class.php' );

// Load the functions that will preprocess our field data
require_once( 'wck-field-preprocess.php' );

/**
 * Front-end function that returns an entire non-processed post meta
 *
 * @since 1.1.5
 *	 
 */
if( !function_exists( 'get_cfc_meta' ) ){
	function get_cfc_meta( $meta_name = false, $post_id = false  ){
		return WCK_Template_API::get_meta( $meta_name, $post_id );
	}
}

/**
 * Front-end function that returns a pre-processed CFC field
 *
 * @since 1.1.5
 *	 
 */
if( !function_exists( 'get_cfc_field' ) ){
	function get_cfc_field( $meta_name, $field_name, $post_id = false, $key = 0 ){
		return WCK_Template_API::get_field( $meta_name, $field_name, $post_id, $key );
	}
}

/**
 * Front-end function that echo out information found inside the field
 *
 * @since 1.1.5
 *	 
 */
if( !function_exists( 'the_cfc_field' ) ){
	function the_cfc_field( $meta_name, $field_name, $post_id = false, $key = 0, $do_echo = true ){
		
		$current_field = WCK_Template_API::get_field( $meta_name, $field_name, $post_id, $key );
		
		$field_type = WCK_Template_API::generate_slug( WCK_Template_API::get_field_type( $meta_name, $field_name ) );
			
		// use this filter to modify the return var in order to output text, links or urls
		$current_field = apply_filters('wck_output_the_field_' . $field_type, $current_field );

		if( $current_field === false ){ 
			return;
		}
		
		// Echoing objects with error out. 
		// Thus we're echoing an empty string so we don't brake the front-end,
		if ( is_object( $current_field ) ){
			return;
		}
		
		// Echoing arrays will echo 'Array'. 
		// Thus we're echoing an empty string so we don't brake the front-end.
		if ( is_array( $current_field ) ){
			return;
		}

		if ( $do_echo ){
			echo wp_kses_post( $current_field );
		} else { 
			return $current_field;
		}
	}
}
