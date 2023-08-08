// The Map Class
function WCK_Map( $jq_obj ) {

    // Save the current instance
    var _this = this;

    this.jq_obj          = $jq_obj;
    this.default_lat     = this.jq_obj.data('default-lat') || 0;
    this.default_lng     = this.jq_obj.data('default-lng') || 0;
    this.default_zoom    = this.jq_obj.data('default-zoom') || 0;
    this.editable        = this.jq_obj.data('editable');

    this.map             = null;
    this.markers         = [];
    this.saved_positions = [];


    /*
     * Renders the map with all elements
     *
     */
    this.render_map = function() {

        // Set default center of the map
        var center = { lat: this.default_lat, lng: this.default_lng };

        // Default center of the map
        var args = {
            zoom		: this.default_zoom,
            center		: new google.maps.LatLng( center ),
            mapTypeId	: google.maps.MapTypeId.ROADMAP
        };

        // Init the map
        this.map = new google.maps.Map( this.jq_obj[0], args );

        // Get saved positions from the db
        this.saved_positions = this.get_saved_positions();


        // Add saved markers
        if( this.saved_positions.length > 0 ) {

            for( x in this.saved_positions )
                this.add_marker( this.saved_positions[x] );

            this.center_map();

        }


        // Add search box
        if( jQuery( '#' + this.jq_obj.attr('id') + '-search-box').length > 0 )
            this.render_search_box();

        // Bind map click to add marker and remove marker
        if( this.editable ) {
            this.map.addListener( 'click', function(event) {
                _this.add_marker( { lat: event.latLng.lat(), lng: event.latLng.lng() } );
            });
        }

    };


    /*
     * Attaches a search box to the map to search for places
     *
     */
    this.render_search_box = function(){

        var input = document.getElementById( this.jq_obj.attr('id') + '-search-box' );
        var searchBox = new google.maps.places.SearchBox(input);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        searchBox.addListener( 'places_changed', function() {

            var places = searchBox.getPlaces();

            if( places.length == 0 )
                return;

            // Place markers for all locations found
            places.forEach( function(place) {
                _this.add_marker( { lat : place.geometry.location.lat(), lng : place.geometry.location.lng() } )
            });

            // Center map after new markers have been placed
            _this.center_map();

        });

    };


    /*
     * Centers a map in correlation with the markers
     *
     */
    this.center_map = function() {

        var bounds = new google.maps.LatLngBounds();

        for( x in this.markers ) {
            var latlng = new google.maps.LatLng( this.markers[x].position.lat(), this.markers[x].position.lng() );
            bounds.extend( latlng );
        }

        if( this.markers.length == 1 ) {

            this.map.setCenter( bounds.getCenter() );
            this.map.setZoom( this.jq_obj.data('default-zoom') );

        } else {

            this.map.fitBounds( bounds );

        }

    };


    /*
     * Adds a new marker to the map and also adds it in the hidden fields
     * if it does not exist
     *
     */
    this.add_marker = function( position ) {

        // Add marker to the map
        var marker = new google.maps.Marker({
            position : new google.maps.LatLng( position ),
            map      : this.map
        });

        // Cache marker
        if( this.markers.indexOf( marker ) == -1 )
            this.markers.push( marker );

        // Add hidden marker field
        if( this.saved_positions.indexOf( position ) == -1 ) {
            this.jq_obj.parent().append( '<input name="' + this.jq_obj.attr('id') + ( this.jq_obj.data('repeater') == 1 ? '' : '[]' ) + '" type="hidden" class="wck-map-marker mb-field" value="' + position.lat + ',' + position.lng + '" />' );
        }

        if( this.jq_obj.parents('.mb-list-entry-fields').length > 0 ) {
            var infoWindow = new google.maps.InfoWindow({
                content : '<a class="wck-map-remove-marker" data-marker="' + _this.markers.indexOf( marker ) + '" href="#">Remove Marker</a>'
            });

            marker.addListener( 'click', function(){
                infoWindow.open( _this.map, marker );

                // Bind remove marker
                jQuery(document).on( 'click', '.wck-map-remove-marker', function(e) {
                    e.preventDefault();
                    _this.remove_marker( jQuery(this).data('marker') );
                });

            });
        }

    };


    /*
     * Removes a marker from the map and also the hidden field associated with the marker
     *
     */
    this.remove_marker = function( index ) {

        var marker = this.markers[index];

        // Remove hidden marker field
        this.jq_obj.parent().find( 'input[value="' + marker.position.lat() + ',' + marker.position.lng() + '"]' ).remove();

        // Remove marker from map
        marker.setMap(null);

    };


    /*
     * Returns the markers for a given map
     * Markers are represented by hidden field that are under the map
     *
     */
    this.get_saved_positions = function() {

        var markers = [];

        this.jq_obj.siblings('.wck-map-marker').each( function() {

            var val = jQuery(this).val();

            if( val != '' && val != undefined ) {
                val = val.split(',');
                markers.push( { lat : parseFloat( val[0] ), lng : parseFloat( val[1] ) } );
            }

        });

        return markers;

    }

}


/*
 * Initialise all maps
 */
jQuery( function($) {

    var $maps = $('.wck-map-container');


    /*
     * Render each map
     *
     */

    $maps.each( function() {

        var map = new WCK_Map( $(this) );
        map.render_map();

    });

});
