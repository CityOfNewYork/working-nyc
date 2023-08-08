jQuery(function(){
	jQuery(document).on( 'change', '#wck_cfc_fields #field-type', function () {
		value = jQuery(this).val();

		if( value == 'select' || value == 'select multiple' || value == 'checkbox' || value == 'radio' ){
			jQuery( '#wck_cfc_fields .row-options' ).show();
			jQuery( '#wck_cfc_fields .row-labels' ).show();
		}
		else{
			jQuery( '#wck_cfc_fields .row-options' ).hide();
			jQuery( '#wck_cfc_fields .row-labels' ).hide();
		}
		
		if( value == 'upload' ){
			jQuery( '#wck_cfc_fields .row-attach-upload-to-post' ).show();
		}
		else{
			jQuery( '#wck_cfc_fields .row-attach-upload-to-post' ).hide();
		}
		
		if( value == 'cpt select' ){
			jQuery( '#wck_cfc_fields .row-cpt' ).show();
		}
		else{
			jQuery( '#wck_cfc_fields .row-cpt' ).hide();
		}

        if( value == 'textarea' ){
            jQuery( '#wck_cfc_fields .row-number-of-rows' ).show();
            jQuery( '#wck_cfc_fields .row-readonly' ).show();
            jQuery( '#wck_cfc_fields .row-default-text' ).show();
            jQuery( '#wck_cfc_fields .row-default-value' ).hide();
        }
        else{
            jQuery( '#wck_cfc_fields .row-number-of-rows' ).hide();
            jQuery( '#wck_cfc_fields .row-readonly' ).hide();
            jQuery( '#wck_cfc_fields .row-default-text' ).hide();
        }

        if( value == 'heading' ) {
            jQuery( '#wck_cfc_fields .row-required' ).hide();
            jQuery( '#wck_cfc_fields .row-default-value' ).hide();
        }

        if( value != 'textarea' && value != 'heading' ){
            jQuery( '#wck_cfc_fields .row-required' ).show();
            jQuery( '#wck_cfc_fields .row-default-value' ).show();
        }

        if( value == 'phone' ) {
            jQuery( '#wck_cfc_fields .row-phone-format' ).show();
            jQuery( '#wck_cfc_fields .row-default-value' ).hide();
        } else {
            jQuery( '#wck_cfc_fields .row-phone-format' ).hide();
        }

        if( value == 'number' ) {
            jQuery( '#wck_cfc_fields .row-min-number-value' ).show();
            jQuery( '#wck_cfc_fields .row-max-number-value' ).show();
            jQuery( '#wck_cfc_fields .row-number-step-value' ).show();
        } else {
            jQuery( '#wck_cfc_fields .row-min-number-value' ).hide();
            jQuery( '#wck_cfc_fields .row-max-number-value' ).hide();
            jQuery( '#wck_cfc_fields .row-number-step-value' ).hide();
        }

        if( value == 'html' ) {
            jQuery( '#wck_cfc_fields .row-html-content' ).show();
            jQuery( '#wck_cfc_fields .row-default-value' ).hide();
            jQuery( '#wck_cfc_fields .row-required' ).hide();
        } else {
            jQuery( '#wck_cfc_fields .row-html-content' ).hide();
        }

        if( value == 'map' ) {
            jQuery( '#wck_cfc_fields .row-map-default-latitude' ).show();
            jQuery( '#wck_cfc_fields .row-map-default-longitude' ).show();
            jQuery( '#wck_cfc_fields .row-map-default-zoom' ).show();
            jQuery( '#wck_cfc_fields .row-map-height' ).show();
            jQuery( '#wck_cfc_fields .row-default-value' ).hide();
        } else {
            jQuery( '#wck_cfc_fields .row-map-default-latitude' ).hide();
            jQuery( '#wck_cfc_fields .row-map-default-longitude' ).hide();
            jQuery( '#wck_cfc_fields .row-map-default-zoom' ).hide();
            jQuery( '#wck_cfc_fields .row-map-height' ).hide();
        }

        if( value == 'datepicker' ){
            jQuery( '#wck_cfc_fields .row-date-format' ).show();
        }
        else{
            jQuery( '#wck_cfc_fields .row-date-format' ).hide();
        }

    });
	
	jQuery(document).on( 'change', '#container_wck_cfc_fields #field-type', function () {
		value = jQuery(this).val();
		if( value == 'select' || value == 'select multiple' || value == 'checkbox' || value == 'radio' ){
			jQuery(this).parent().parent().parent().children(".row-options").show();
			jQuery(this).parent().parent().parent().children(".row-labels").show();
		}
		else{
			jQuery(this).parent().parent().parent().children(".row-options").hide();
			jQuery(this).parent().parent().parent().children(".row-labels").hide();
		}
		
		if( value == 'upload' ){
			jQuery(this).parent().parent().parent().children(".row-attach-upload-to-post").show();
		}
		else{
			jQuery(this).parent().parent().parent().children(".row-attach-upload-to-post").hide();
		}

		if( value == 'cpt select' ){
			jQuery(this).parent().parent().parent().children(".row-cpt").show();
		}
		else{
			jQuery(this).parent().parent().parent().children(".row-cpt").hide();
		}

        if( value == 'textarea' ){
            jQuery(this).parent().parent().parent().children(".row-number-of-rows").show();
            jQuery(this).parent().parent().parent().children(".row-readonly").show();
            jQuery(this).parent().parent().parent().children(".row-default-text").show();
            jQuery(this).parent().parent().parent().children(".row-default-value").hide();
        }
        else{
            jQuery(this).parent().parent().parent().children(".row-number-of-rows").hide();
            jQuery(this).parent().parent().parent().children(".row-readonly").hide();
            jQuery(this).parent().parent().parent().children(".row-default-text").hide();
        }

        if( value == 'heading' ) {
            jQuery( this ).parent().parent().parent().children( ".row-required" ).hide();
            jQuery( this ).parent().parent().parent().children( ".row-default-value" ).hide();
        }

        if( value != 'textarea' && value != 'heading' ) {
            jQuery( this ).parent().parent().parent().children( ".row-required" ).show();
            jQuery( this ).parent().parent().parent().children( ".row-default-value" ).show();
        }

        if( value == 'phone' ) {
            jQuery( this ).parent().parent().parent().children( ".row-phone-format" ).show();
            jQuery( this ).parent().parent().parent().children( ".row-default-value" ).hide();
        } else {
            jQuery( this ).parent().parent().parent().children( ".row-phone-format" ).hide();
        }

        if( value == 'number' ) {
            jQuery( this ).parent().parent().parent().children( ".row-min-number-value" ).show();
            jQuery( this ).parent().parent().parent().children( ".row-max-number-value" ).show();
            jQuery( this ).parent().parent().parent().children( ".row-number-step-value" ).show();
        } else {
            jQuery( this ).parent().parent().parent().children( ".row-min-number-value" ).hide();
            jQuery( this ).parent().parent().parent().children( ".row-max-number-value" ).hide();
            jQuery( this ).parent().parent().parent().children( ".row-number-step-value" ).hide();
        }

        if( value == 'html' ) {
            jQuery( this ).parent().parent().parent().children( ".row-html-content" ).show();
            jQuery( this ).parent().parent().parent().children( ".row-default-value" ).hide();
            jQuery( this ).parent().parent().parent().children( ".row-required" ).hide();
        } else {
            jQuery( this ).parent().parent().parent().children( ".row-html-content" ).hide();
        }

        if( value == 'map' ) {
            jQuery( this ).parent().parent().parent().children( '.row-map-default-latitude' ).show();
            jQuery( this ).parent().parent().parent().children( '.row-map-default-longitude' ).show();
            jQuery( this ).parent().parent().parent().children( '.row-map-default-zoom' ).show();
            jQuery( this ).parent().parent().parent().children( '.row-map-height' ).show();
            jQuery( this ).parent().parent().parent().children( '.row-default-value' ).hide();
        } else {
            jQuery( this ).parent().parent().parent().children( '.row-map-default-latitude' ).hide();
            jQuery( this ).parent().parent().parent().children( '.row-map-default-longitude' ).hide();
            jQuery( this ).parent().parent().parent().children( '.row-map-default-zoom' ).hide();
            jQuery( this ).parent().parent().parent().children( '.row-map-height' ).hide();
        }

        if( value == 'datepicker' ) {
            jQuery( this ).parent().parent().parent().children( ".row-date-format" ).show();
        } else {
            jQuery( this ).parent().parent().parent().children( ".row-date-format" ).hide();
        }

    });

    /* edit slug functionality */
    jQuery( "#wck-cfc-fields" ).on( "click", ".wck-cfc-edit-slug", function(){
        jQuery(this).prev( "input[type='text']" ).removeAttr( "readonly" );
    });

    jQuery( "#wck-cfc-fields" ).on( "blur", "#wck_cfc_fields.wck-add-form #field-title", function(e){

        fieldTitle = jQuery(this).val();
        titleField = jQuery(this);
        slugField = jQuery( '#field-slug', titleField.closest( ".mb-list-entry-fields" ) );
        addButton = jQuery( '.button-primary', titleField.closest( ".mb-list-entry-fields" ) );

        if( slugField[0].hasAttribute("readonly") ) {
            addButton.attr( 'disabled', 'disabled' );
            addButton.css( 'pointer-events', 'none' )
            slugField.addClass( 'doing-ajax' );
            jQuery.post(wckAjaxurl, {action: "wck_generate_slug", field_title: fieldTitle}, function (response) {
                if (response != 'failed') {
                    slugField.val(response);
                    slugField.removeClass( 'doing-ajax' );
                }
                addButton.removeAttr( 'disabled' );
                addButton.css( 'pointer-events', 'auto' );
            });
        }
        


    });

});