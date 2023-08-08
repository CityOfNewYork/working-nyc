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

class WCK_Template_API{

	/**
	 * Helper function for post ID
	 * 
	 * @post_id
	 */	
	
	static function get_post_id( $post_id = false ){
		
		// set post_id to global
		if( !$post_id )
		{
			global $post;
			
			if( $post )
			{
				$post_id = $post->ID;
			}
		}
		
		// return
		return $post_id;
	}


	/**
	 * Returns the value of a post_meta created with CFC or empty.
	 * 
	 * @meta_name
	 * @post_id
	 */	
	
	static function get_meta( $meta_name = false, $post_id = false ){
		
		$post_id = WCK_Template_API::get_post_id($post_id);
		
		$post_meta = get_post_meta( $post_id, $meta_name, true ); 

		if ( is_array( $post_meta ) )
			return $post_meta;
		
		// get_post_meta with the 3'rd param true returns an empty string if nothing found. 
		// We'll overwrite that so we get an empty array. 
		return array();
	}


	/**
	 * Returns the value of a field from CFC single and repeater.
	 *
	 */	
	
	static function get_field( $meta_name = false, $field_name = false, $post_id = false, $key = 0 ){
		$post_meta = WCK_Template_API::get_meta( $meta_name, $post_id ); 
		
		if ( isset( $post_meta[$key][$field_name] ) ){
			$field_type = WCK_Template_API::generate_slug( WCK_Template_API::get_field_type( $meta_name, $field_name ) );
			
			// use this filter to modify the return var in order to output text, arrays or objects
			$output = apply_filters('wck_output_get_field_' . $field_type, $post_meta[$key][$field_name] );

			return $output;
		}
		return '';
	}
	
	/**
	 * Find out what type of field the user asks for. 
	 *
	 */	
	
	static function get_field_type( $meta_name = false, $field_name = false ){
		
		// get all CFC's
		$args = array( 
			'post_type' 		=> 'wck-meta-box',
			'posts_per_page' 	=> -1,
			'post_status'    	=> array( 'publish' ),
			'fields'        	=> 'ids',
		);
		$all_cfc = get_posts( $args );
		
		foreach( $all_cfc as $post_id ) {
			$queried_meta_name = WCK_Template_API::get_meta('wck_cfc_args', $post_id );
            if( isset( $queried_meta_name[0]['meta-name'] ) )
			    $queried_meta_name = $queried_meta_name[0]['meta-name'];
            else
                $queried_meta_name = '';
						
			if ( $meta_name == $queried_meta_name ) {
				$available_fields = WCK_Template_API::get_meta( 'wck_cfc_fields', $post_id );

				foreach ( $available_fields as $key => $field_data ){
					$current_field = WCK_Template_API::generate_slug( $field_data['field-title'] );
					if ( $current_field == $field_name ){
						return $field_data['field-type']; 
					}
				}
			}
		}

		return 'text';
	}
	
	
	/**
	 * The function used to generate slugs in WCK
	 * It's a copy from WCK-API so the template API is stand-alone
	 *
	 * @since 1.1.5
	 *	 
	 * @param string $string The input string from which we generate the slug	 
	 * @return string $slug The henerated slug
	 */
	static function generate_slug( $string ){
		$slug = rawurldecode( sanitize_title_with_dashes( remove_accents( $string ) ) );
		return $slug;
	}
}
