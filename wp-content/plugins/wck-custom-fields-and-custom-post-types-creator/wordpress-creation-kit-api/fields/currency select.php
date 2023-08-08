<?php
/* @param string $meta Meta name.
 * @param array $details Contains the details for the field.
 * @param string $value Contains input value;
 * @param string $context Context where the function is used. Depending on it some actions are preformed.;
 * @return string $element input element html string. */

require_once( plugin_dir_path(__FILE__) . '../assets/currency/currency-select.php' );

$currencies = wck_get_currencies();

$extra_attr = apply_filters( 'wck_extra_field_attributes', '', $details, $meta );

$element .= '<select name="'. $single_prefix . esc_attr( Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details ) ) .'"  id="';
if( !empty( $frontend_prefix ) )
    $element .=	$frontend_prefix;
$element .= esc_attr( Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details ) ) .'" class="mb-currency-select mb-field" '. $extra_attr .'>';
$element .= '<option value="">'. __('...Choose', 'wck') .'</option>';
if( !empty( $currencies ) ){
    foreach( $currencies as $currency_code => $currency_name ){
        $currency_symbol = wck_get_currency_symbol( $currency_code );

        $currency_name = ( empty( $currency_symbol ) ? $currency_name : $currency_name . ' (' . $currency_symbol . ')' );

        $element .= '<option value="'. esc_attr( $currency_code ) .'"  '. selected( $currency_code, $value, false ) .' >'. esc_html( $currency_name ) .'</option>';
    }
}
$element .= '</select>';
?>