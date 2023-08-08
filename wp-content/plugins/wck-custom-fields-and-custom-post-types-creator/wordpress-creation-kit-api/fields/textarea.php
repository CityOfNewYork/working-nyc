<?php
 /* @param string $meta Meta name.	 
 * @param array $details Contains the details for the field.	 
 * @param string $value Contains input value;
 * @param string $context Context where the function is used. Depending on it some actions are preformed.;
 * @return string $element input element html string. */

$extra_attr = apply_filters( 'wck_extra_field_attributes', '', $details, $meta );

$number_of_rows = 5;
if( !empty( $details['number_of_rows'] ) && is_numeric( trim( $details['number_of_rows'] ) ) )
    $number_of_rows = trim( $details['number_of_rows'] );

$element .= '<textarea name="'. $single_prefix . esc_attr( Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details ) ) .'" rows="'. esc_attr( $number_of_rows ) .'" id="';
if( !empty( $frontend_prefix ) )
	$element .= $frontend_prefix;
$element .= esc_attr( Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details ) ) .'" style="vertical-align:top;" class="mb-textarea mb-field"';
if( !empty( $details['readonly'] ) && $details['readonly'] == true  )
    $element .= ' readonly';
$element .= ' '.$extra_attr.'>'. esc_html( $value ) .'</textarea>';
?>