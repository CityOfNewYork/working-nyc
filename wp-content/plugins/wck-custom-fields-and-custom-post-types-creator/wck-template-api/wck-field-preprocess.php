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


/**
 * Preprocess the textarea field types.
 * We're converting new lines to <br /> tags
 *
 * @since 1.1.5
 *
 * @param string $field The actual field content
 * @return string $field The processed field
 */
add_filter( 'wck_output_get_field_textarea', 'wck_preprocess_field_textarea', 10 );
function wck_preprocess_field_textarea( $field ){
	return nl2br( $field );
}

/**
 * Preprocess the checkbox field types.
 * We're returnig an array with the selected checkboxes
 *
 * @since 1.1.5
 *
 * @param string $field The actual field content
 * @return string $checkbox The processed field
 */
 add_filter( 'wck_output_get_field_checkbox', 'wck_preprocess_field_checkbox', 10 );
function wck_preprocess_field_checkbox( $field ){
	if( !empty( $field ) ){
		$checkbox = explode( ', ', $field );
		return $checkbox;
	}
	return array();
}

/**
 * Preprocess the checkbox field types in the the_cfc_field .
 * We're returnig a coma separated list with the selected values - not labels
 *
 * @since 1.1.5
 *
 * @param string $field The actual field content
 * @return string $checkbox The processed field
 */
 add_filter( 'wck_output_the_field_checkbox', 'wck_preprocess_the_field_checkbox', 10 );
function wck_preprocess_the_field_checkbox( $field ){
	if( !empty( $field ) ){
		$checkbox_list = implode( ', ', $field );
		return $checkbox_list;
	}
	return '';
}

/**
 * Preprocess the upload field types.
 * We're returning an array for images and an object for normal files
 *
 * @since 1.1.5
 *
 * @param string $field The actual field content
 * @return string $upload The processed field
 */
add_filter( 'wck_output_get_field_upload', 'wck_preprocess_field_upload', 10 );
function wck_preprocess_field_upload( $field ){

	if ( $field == '' || !is_numeric( $field ) )
		return false;

	if ( is_null( get_post( $field ) ) )
		return false;

	$attachment = get_post( $field );

	// create array to hold value data
	$value = array(
		'id'          => $attachment->ID,
		'alt'         => get_post_meta($attachment->ID, '_wp_attachment_image_alt', true),
		'title'       => $attachment->post_title,
		'caption'     => $attachment->post_excerpt,
		'description' => $attachment->post_content
	);

	if ( wp_attachment_is_image( $field ) ) {

		$src = wp_get_attachment_image_src( $attachment->ID, 'full' );

		$value['url'] = $src[0];
		$value['width'] = $src[1];
		$value['height'] = $src[2];

		// find all image sizes
		$image_sizes = get_intermediate_image_sizes();

		if( $image_sizes ) {
			foreach( $image_sizes as $image_size ) {
				// find src
				$src = wp_get_attachment_image_src( $attachment->ID, $image_size );

				// add src
				$value[ 'sizes' ][ $image_size ] = $src[0];
				$value[ 'sizes' ][ $image_size . '-width' ] = $src[1];
				$value[ 'sizes' ][ $image_size . '-height' ] = $src[2];
			}
		}
	} else
		$value['url'] = wp_get_attachment_url( $attachment->ID );

	return $value;
}

/**
 * Preprocess the upload field types in the_cfc_field function.
 * We're returnig an url.
 *
 * @since 1.1.5
 *
 */
add_filter( 'wck_output_the_field_upload', 'wck_preprocess_the_field_upload', 10 );
function wck_preprocess_the_field_upload( $field ){

	if( $field === false ){
		return;
	}

	if ( is_object( $field ) ){
		return $field->guid;
	}

	if ( is_array( $field ) ){
		return $field['url'];
	}

}


/**
 * Preprocess the user select field types.
 * We're returnig an array with user related information
 *
 * @since 1.1.5
 *
 * @param string $field The actual field content
 * @return string $user The processed field
 */
add_filter( 'wck_output_get_field_user-select', 'wck_preprocess_field_user_select', 10 );
function wck_preprocess_field_user_select( $uid ){
	$user_data = get_userdata( $uid );

	if ( $user_data ){
		$user_array = array();
		$user_array['ID'] = $uid;
		$user_array['user_firstname'] = $user_data->user_firstname;
		$user_array['user_lastname'] = $user_data->user_lastname;
		$user_array['nickname'] = $user_data->nickname;
		$user_array['user_nicename'] = $user_data->user_nicename;
		$user_array['display_name'] = $user_data->display_name;
		$user_array['user_email'] = $user_data->user_email;
		$user_array['user_url'] = $user_data->user_url;
		$user_array['user_registered'] = $user_data->user_registered;
		$user_array['user_description'] = $user_data->user_description;
		$user_array['user_avatar'] = get_avatar( $uid );

		return $user_array;

	} else {

		return false;

	}
}

/**
 * Preprocess the user select field types for the_cfc_field.
 * We're returnig the Display Name
 *
 * @since 1.1.5
 *
 */
add_filter( 'wck_output_the_field_user-select', 'wck_preprocess_the_field_user_select', 10 );
function wck_preprocess_the_field_user_select( $user ){

	if( $user === false ){
		return;
	}

	if( is_array( $user ) ){
		return $user['display_name'];
	}

}

/**
 * Preprocess the cpt select field types.
 * We're returnig a post object
 *
 * @since 1.1.5
 *
 * @param string $field The actual field content
 * @return string $user The processed field
 */
add_filter( 'wck_output_get_field_cpt-select', 'wck_preprocess_field_cpt_select', 10 );
function wck_preprocess_field_cpt_select( $id ){

	if ( $id == '' || !is_numeric( $id ) )
		return false;

	$post = get_post( $id );
	if( is_null( $post ) )
		return false;

	return $post;
}

/**
 * Preprocess the cpt select field types for the_cpt_field.
 * We're returnig the post title.
 *
 * @since 1.1.5
 *
 */
add_filter( 'wck_output_the_field_cpt-select', 'wck_preprocess_the_field_cpt_select', 10 );
function wck_preprocess_the_field_cpt_select( $post ){

	if( $post == false ){
		return;
	}

	if( is_object( $post ) ){
		return $post->post_title;
	}

}
