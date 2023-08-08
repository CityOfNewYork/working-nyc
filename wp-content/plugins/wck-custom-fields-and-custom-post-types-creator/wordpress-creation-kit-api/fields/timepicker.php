<?php
/* @param string $meta Meta name.
 * @param array $details Contains the details for the field.
 * @param string $value Contains input value;
 * @param string $context Context where the function is used. Depending on it some actions are preformed.;
 * @return string $element input element html string. */

// Get saved values for the hour and minutes
$value_hours    = '';
$value_minutes  = '';

if( !empty( $value ) && strpos( $value, ':' ) !== false ) {
    $time = explode( ':', $value );

    $value_hours = $time[0];
    $value_minutes = $time[1];
} else {
    $value = '00:00';
}

// Set hours
$hours = array();
for( $i = 0; $i <= 23; $i++ )
    array_push( $hours, ( strlen( $i ) == 1 ? '0' . $i : $i ) );

// Set minutes
$minutes = array();
for( $i = 0; $i <= 59; $i++ )
    array_push( $minutes, ( strlen( $i ) == 1 ? '0' . $i : $i ) );


// Hours drop down
$element .= '<select id="';
if( !empty( $frontend_prefix ) )
    $element .=	$frontend_prefix;
$element .= esc_attr( Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details ) ) .'-hours" class="mb-timepicker-hours" >';

if( !empty( $hours ) ){
    foreach( $hours as $hour ){
        $element .= '<option value="'. esc_attr( $hour ) .'"  '. selected( $hour, $value_hours, false ) .' >'. esc_html( $hour ) .'</option>';
    }
}
$element .= '</select>';

// Separator
$element .= '<span class="wck-timepicker-separator">:</span>';

// Minutes drop down
$element .= '<select id="';
if( !empty( $frontend_prefix ) )
    $element .=	$frontend_prefix;
$element .= esc_attr( Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details ) ) .'-minutes" class="mb-timepicker-minutes" >';

if( !empty( $minutes ) ){
    foreach( $minutes as $minute ){
        $element .= '<option value="'. esc_attr( $minute ) .'"  '. selected( $minute, $value_minutes, false ) .' >'. esc_html( $minute ) .'</option>';
    }
}
$element .= '</select>';

$element .= '<input type="hidden" name="' . $single_prefix . esc_attr( Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details ) ) . '" value="' . esc_attr( $value ) . '" class="mb-timepicker mb-field" />';

?>