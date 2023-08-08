<?php
/* @param string $meta Meta name.
 * @param array $details Contains the details for the field.
 * @param string $value Contains input value;
 * @param string $context Context where the function is used. Depending on it some actions are preformed.;
 * @return string $element input element html string. */

$wck_extra_options = get_option( 'wck_extra_options' );

if( !empty( $wck_extra_options[0]['google-maps-api'] ) ) {

    $element .= '<div id="' . $single_prefix . esc_attr( Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details ) ) . '" class="wck-map-container" style="height: ' . $details['map_height'] . 'px;" data-repeater="' . ( $this->args['single'] && $this->args['context'] != 'option' ? '0' : '1' ) . '" data-default-lat="' . $details['map_default_latitude'] . '" data-default-lng="' . $details['map_default_longitude'] . '" data-default-zoom="' . $details['map_default_zoom'] . '" data-editable="1"></div>';

    $element .= '<input style="left: -99999px" type="text" id="' . $single_prefix . esc_attr( Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details ) ) . '-search-box" class="wck-map-search-box" placeholder="' . __( 'Search Location', 'wck' ) . '" />';

    if( !empty( $value ) && is_array( $value ) ) {
        foreach( $value as $key => $marker ) {
            $element .= '<input name="' . $single_prefix . esc_attr( Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details ) );

            // If the field is not a repeater we save it directly as an array
            if( $this->args['single'] && $this->args['context'] != 'option' ) {
                $element .= '[]';
            }

            $element .= '" type="hidden" class="wck-map-marker mb-field" value="' . $marker . '" />';
        }
    }

    // Initialise map
    $element .= '<script type="text/javascript">
    jQuery( function( $ ) {
        var $maps = jQuery(".wck-map-container");


        /*
         * Render each map
         *
         */

        $maps.each( function() {

            var map = new WCK_Map( jQuery(this) );
            map.render_map();

        });
    });
    </script>';

} else {

    $element .= '<div class="wck-notification friendly-warning">' . sprintf( __( 'In order for the map field to work it will need a Google Maps API key. Please insert your API key <a href="%s">here</a>.', 'wck' ), admin_url( 'admin.php?page=sas-page#wck_extra_options' ) ) . '</div>';

}