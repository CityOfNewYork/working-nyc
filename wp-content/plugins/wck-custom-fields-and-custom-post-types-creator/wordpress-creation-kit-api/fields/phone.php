<?php
/* @param string $meta Meta name.
 * @param array $details Contains the details for the field.
 * @param string $value Contains input value;
 * @param string $context Context where the function is used. Depending on it some actions are preformed.;
 * @return string $element input element html string. */

require_once( plugin_dir_path(__FILE__) . '../assets/phone/phone-field.php' );

$phone_data = json_encode( array( 'phone_data'	=>	wck_make_phone_number_format( $details ) ) );

$element .= '<input data-phone-format="'. esc_attr( $phone_data ) .'" type="text" name="'. $single_prefix . esc_attr( Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details ) ) .'" id="';
if( !empty( $frontend_prefix ) )
	$element .=	$frontend_prefix;
$element .= esc_attr( Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details ) ) .'" value="'. ( ! empty( $value ) ? esc_attr( $value ) : '' ) .'" class="mb-phone mb-field"/>';
$element .= '<script type="text/javascript">
jQuery( function( $ ) {
    $( ".mb-phone" ).each( function() {
        var wppb_mask_data = $( this ).attr( "data-phone-format" );
        var wppb_mask = "";

        $.each( JSON.parse( wppb_mask_data ).phone_data, function( key, value ) {
            if( value == "#" ) {
                value = "9";
            }
            wppb_mask += value;
        } );

        $( this ).inputmask( wppb_mask );
    } );
} );
</script>';
?>