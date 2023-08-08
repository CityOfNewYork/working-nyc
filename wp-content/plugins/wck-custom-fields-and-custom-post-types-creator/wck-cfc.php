<?php
/* Creates Custom Meta Box Fields for WordPress. It supports repeater fields and uses AJAX to handle data. */

/* Add Scripts */
add_action('admin_enqueue_scripts', 'wck_cfc_print_scripts' );
function wck_cfc_print_scripts($hook){
	if( isset( $_GET['post_type'] ) || isset( $_GET['post'] ) ){
		if( isset( $_GET['post_type'] ) )
			$post_type = sanitize_text_field( $_GET['post_type'] );
		else if( isset( $_GET['post'] ) )
			$post_type = get_post_type( absint( $_GET['post'] ) );

		if( 'wck-meta-box' == $post_type ){
			wp_register_style('wck-cfc-css', plugins_url('/css/wck-cfc.css', __FILE__));
			wp_enqueue_style('wck-cfc-css');

			wp_register_script('wck-cfc-js', plugins_url('/js/wck-cfc.js', __FILE__), array( 'jquery' ), '1.0' );
			wp_enqueue_script('wck-cfc-js');
		}
	}
}

/* hook to create custom post types */
add_action( 'init', 'wck_cfc_create_custom_fields_cpt' );

function wck_cfc_create_custom_fields_cpt(){
	if( is_admin() && current_user_can( 'edit_theme_options' ) ){
		$labels = array(
			'name' => _x( 'WCK Custom Meta Boxes', 'post type general name', "wck"),
			'singular_name' => _x( 'Custom Meta Box', 'post type singular name', "wck"),
			'add_new' => _x( 'Add New', 'Custom Meta Box', "wck" ),
			'add_new_item' => __( "Add New Meta Box", "wck" ),
			'edit_item' => __( "Edit Meta Box", "wck" ) ,
			'new_item' => __( "New Meta Box", "wck" ),
			'all_items' => __( "Custom Fields Creator", "wck" ),
			'view_item' => __( "View Meta Box", "wck" ),
			'search_items' => __( "Search Meta Boxes", "wck" ),
			'not_found' =>  __( "No Meta Boxes found", "wck" ),
			'not_found_in_trash' => __( "No Meta Boxes found in Trash", "wck" ),
			'parent_item_colon' => '',
			'menu_name' => __( "Custom Meta Boxes", "wck" )
		);
		$args = array(
			'labels' => $labels,
			'public' => false,
			'publicly_queryable' => false,
			'show_ui' => true,
			'show_in_menu' => 'wck-page',
			'has_archive' => false,
			'hierarchical' => false,
			'capability_type' => 'post',
			'supports' => array( 'title' )
		);

		register_post_type( 'wck-meta-box', $args );
	}
}

/* add admin body class to cfc custom post type */
add_filter( 'admin_body_class', 'wck_cfc_admin_body_class' );
function wck_cfc_admin_body_class( $classes ){
	if( isset( $_GET['post_type'] ) || isset( $_GET['post'] ) ){
		if( isset( $_GET['post_type'] ) )
			$post_type = sanitize_text_field( $_GET['post_type'] );
		else if( isset( $_GET['post'] ) )
			$post_type = get_post_type( absint( $_GET['post'] ) );

		if( 'wck-meta-box' == $post_type ){
			$classes .= ' wck_page_cfc-page ';
		}
	}
	return $classes;
}

/* Remove view action from post list view */
add_filter('post_row_actions','wck_cfc_remove_view_action');
function wck_cfc_remove_view_action($actions){
	global $post;
   if ($post->post_type =="wck-meta-box"){
	   unset( $actions['view'] );
   }
   return $actions;
}


/* create the meta box */
add_action( 'init', 'wck_cfc_create_box', 500 );
function wck_cfc_create_box(){
	global $wpdb;

	/* get post types */
	$public_cpt_arg = apply_filters( 'wck_cfc_public_cpt_arg', true );
	$args = array(
			'public'   => $public_cpt_arg
		);
	$output = 'objects'; // or objects
	$post_types = get_post_types($args,$output);
	$post_type_names = array();
	if( !empty( $post_types ) ){
		foreach ($post_types  as $post_type ) {
			if ( $post_type->name != 'attachment' && $post_type->name != 'wck-meta-box' && $post_type->name != 'wck-frontend-posting' && $post_type->name != 'wck-option-page' && $post_type->name != 'wck-option-field' && $post_type->name != 'wck-swift-template' )
				$post_type_names[] = $post_type->name;
		}
	}
	/* add CPTC registered with WCK that are not public */
	if( $public_cpt_arg ){
		$cpts = get_option('wck_cptc');
		if( !empty( $cpts ) ){
			foreach( $cpts as $cpt ){
				if( $cpt['public'] == 'false' )
					$post_type_names[] = $cpt['post-type'];
			}
		}
	}

	/* get page templates */
	$templates = wck_get_page_templates();

	/* set up the fields array */
	$cfc_box_args_fields = array(
		array( 'type' => 'text', 'title' => __( 'Group Name', 'wck' ), 'slug' => 'meta-name', 'description' => __( 'The name of the group. Must be unique, only lowercase letters, no spaces and no special characters.', 'wck' ), 'required' => true ),
		array( 'type' => 'select', 'title' => __( 'Post Type', 'wck' ), 'slug' => 'post-type', 'options' => $post_type_names, 'default-option' => true, 'description' => __( 'What post type the meta box should be attached to', 'wck' ), 'required' => true ),
		array( 'type' => 'select', 'title' => __( 'Repeater', 'wck' ), 'slug' => 'repeater', 'options' => array( 'false', 'true' ), 'default' => 'false', 'description' => __( 'Whether the box supports just one entry or if it is a repeater field. By default it is a single field.', 'wck' ) ),
		array( 'type' => 'select', 'title' => __( 'Sortable', 'wck' ), 'slug' => 'sortable', 'options' => array( 'true', 'false' ), 'default' => 'false', 'description' => __( 'Whether the entries are sortable or not. This is valid for repeater fields.', 'wck' ) ),
		array( 'type' => 'text', 'title' => __( 'Post ID', 'wck' ), 'slug' => 'post-id', 'description' => __( 'ID of a post on which the meta box should appear. You can also input multiple IDs and separate them with ","', 'wck' ) )
	);

	/* only in pro version */
	if( function_exists( 'wck_nr_add_repeater_boxes' ) ){
			$nested_arg = array( array( 'type' => 'select', 'title' => __( 'Nested', 'wck' ), 'options' => array( 'true', 'false' ), 'default' => 'false', 'description' => __( 'Set to true if you want this metabox to be a nested repeater inside another repeater.', 'wck' ) ) );
			array_splice( $cfc_box_args_fields, 1, 0, $nested_arg );
	}

	if( !empty( $templates ) )
		$cfc_box_args_fields[] = array( 'type' => 'select', 'title' => __( 'Page Template', 'wck' ), 'slug' => 'page-template', 'options' => $templates, 'default-option' => true, 'description' => __( 'If post type is "page" you can further select a page templete. The meta box will only appear  on the page that has that selected page template.', 'wck' ) );

	/* added box style in version 2.4.4 */
	$cfc_box_args_fields[] = array( 'type' => 'select', 'title' => __( 'Box Style', 'wck' ), 'slug' => 'box-style', 'options' => array( '%Default (WP meta-box)%default', '%Seamless (no meta-box)%seamless' ), 'default' => 'default', 'description' => __( 'If the fields should be in a meta-box or not', 'wck' ) );

	/* set up the box arguments */
	$args = array(
		'metabox_id' => 'wck-cfc-args',
		'metabox_title' => __( 'Meta Box Arguments', 'wck' ),
		'post_type' => 'wck-meta-box',
		'meta_name' => 'wck_cfc_args',
		'meta_array' => $cfc_box_args_fields,
		'sortable' => false,
		'single' => true
	);

	/* create the box */
	new Wordpress_Creation_Kit( $args );

	/* set up field types */

	$field_types = array( 'heading', 'text', 'number', 'textarea', 'select', 'select multiple', 'checkbox', 'radio', 'phone', 'upload', 'wysiwyg editor', 'datepicker', 'timepicker', 'colorpicker', 'country select', 'user select', 'cpt select', 'currency select', 'html', 'map' );

	$field_types = apply_filters( 'wck_field_types', $field_types );

	/* setup post types */
	$post_types = get_post_types( array( 'public'   => true ), 'names' );

	/* set up the fields array */
	$cfc_box_fields_fields = apply_filters( 'wck_cfc_box_fields_fields', array(
		array( 'type' => 'text', 'title' => __( 'Field Title', 'wck' ), 'slug' => 'field-title', 'description' => __( 'Title of the field. A slug will automatically be generated.', 'wck' ), 'required' => true ),
		array( 'type' => 'select', 'title' => __( 'Field Type', 'wck' ), 'slug' => 'field-type', 'options' => $field_types, 'default-option' => true, 'description' => __( 'The field type', 'wck' ), 'required' => true ),
		array( 'type' => 'text', 'title' => __( 'Field Slug', 'wck' ), 'slug' => 'field-slug', 'readonly' => true, 'description' => __( 'The meta name of the field, generated automatically from the title, by which you can query. Can be changed. Must be unique, only lowercase letters, no spaces and no special characters.', 'wck' ), 'required' => true ),
		array( 'type' => 'textarea', 'title' => __( 'Description', 'wck' ), 'slug' => 'description', 'description' => 'The description of the field.' ),
		array( 'type' => 'select', 'title' => __( 'Required', 'wck' ), 'slug' => 'required', 'options' => array( 'false', 'true' ), 'default' => 'false', 'description' => __( 'Whether the field is required or not', 'wck' ) ),
		array( 'type' => 'select', 'title' => __( 'CPT', 'wck' ), 'slug' => 'cpt', 'options' => $post_types, 'default' => 'post', 'description' => __( 'Select what custom post type should be used in the CPT Select.', 'wck' ) ),
		array( 'type' => 'text', 'title' => __( 'Default Value', 'wck' ), 'slug' => 'default-value', 'description' => __( 'Default value of the field. For Checkboxes if there are multiple values separate them with a ",". For an Upload field input an attachment id.', 'wck' ) ),
		array( 'type' => 'textarea', 'title' => __( 'Default Text', 'wck' ), 'slug' => 'default-text', 'description' => __( 'Default text of the textarea.', 'wck' ) ),
		array( 'type' => 'textarea', 'title' => __( 'HTML Content', 'wck' ), 'slug' => 'html-content', 'description' => __( 'Add your HTML (or text) content.', 'wck' ) ),
		array( 'type' => 'text', 'title' => __( 'Options', 'wck' ), 'slug' => 'options', 'description' => __( 'Options for field types "select", "checkbox" and "radio". For multiple options separate them with a ",".', 'wck' ) ),
		array( 'type' => 'text', 'title' => __( 'Labels', 'wck' ), 'slug' => 'labels', 'description' => __( 'Labels for field types "select", "checkbox" and "radio". For multiple options separate them with a ",".', 'wck' ) ),
		array( 'type' => 'text', 'title' => __( 'Phone Format', 'wck' ), 'slug' => 'phone-format', 'default' => '(###) ###-####', 'description' => __( "You can use: # for numbers, parentheses ( ), - sign, + sign, dot . and spaces.", 'wck' ) .'<br>'.  __( "Eg. (###) ###-####", 'wck' ) .'<br>'. __( "Empty field won't check for correct phone number.", 'wck' ) ),
		array( 'type' => 'text', 'title' => __( 'Min Number Value', 'wck' ), 'slug' => 'min-number-value', 'description' => __( "Min allowed number value (0 to allow only positive numbers)", 'wck' ) .'<br>'. __( "Leave it empty for no min value", 'wck' ) ),
		array( 'type' => 'text', 'title' => __( 'Max Number Value', 'wck' ), 'slug' => 'max-number-value', 'description' => __( "Max allowed number value (0 to allow only negative numbers)", 'wck' ) .'<br>'. __( "Leave it empty for no max value", 'wck' ) ),
		array( 'type' => 'text', 'title' => __( 'Number Step Value', 'wck' ), 'slug' => 'number-step-value', 'description' => __( "Step value 1 to allow only integers, 0.1 to allow integers and numbers with 1 decimal", 'wck' ) .'<br>'. __( "To allow multiple decimals use for eg. 0.01 (for 2 deciamls) and so on", 'wck' ) .'<br>'. __( "You can also use step value to specify the legal number intervals (eg. step value 2 will allow only -4, -2, 0, 2 and so on)", 'wck' ) .'<br>'. __( "Leave it empty for no restriction", 'wck' ) ),
		array( 'type' => 'checkbox', 'title' => __( 'Attach upload to post', 'wck' ), 'slug' => 'attach-upload-to-post', 'description' => __( 'Uploads will be attached to the post if this is checked', 'wck' ), 'options' => array( 'yes' ), 'default' => 'yes' ),
		array( 'type' => 'text', 'title' => __( 'Number of rows', 'wck' ), 'slug' => 'number-of-rows', 'description' => __( 'Number of rows for the textarea', 'wck' ), 'default' => '5' ),
        array( 'type' => 'select', 'title' => __( 'Readonly', 'wck' ), 'slug' => 'readonly', 'options' => array( 'false', 'true' ), 'default' => 'false', 'description' => __( 'Whether the textarea is readonly or not', 'wck' ) ),
        array( 'type' => 'text', 'title' => __( 'Default Latitude', 'wck' ), 'slug' => 'map-default-latitude', 'description' => __( 'The latitude at which the map should be displayed when no pins are attached.', 'wck' ), 'default' => 0 ),
        array( 'type' => 'text', 'title' => __( 'Default Longitude', 'wck' ), 'slug' => 'map-default-longitude', 'description' => __( 'The longitude at which the map should be displayed when no pins are attached.', 'wck' ), 'default' => 0 ),
        array( 'type' => 'text', 'title' => __( 'Default Zoom', 'wck' ), 'slug' => 'map-default-zoom', 'description' => __( 'Add a number from 0 to 19. The higher the number the higher the zoom.', 'wck' ), 'default' => 15 ),
        array( 'type' => 'text', 'title' => __( 'Map Height', 'wck' ), 'slug' => 'map-height', 'description' => __( 'The height of the map.', 'wck' ), 'default' => 350 ),
		array( 'type' => 'select', 'title' => __( 'Date Format', 'wck' ), 'slug' => 'date-format', 'description' => __( 'The format of the datepicker date', 'wck' ), 'options' => array( '%Default - dd-mm-yy%dd-mm-yy', '%Datepicker default - mm/dd/yy%mm/dd/yy', '%ISO 8601 (extended) - yy-mm-dd%yy-mm-dd', '%ISO 8601 (basic) - yymmdd%yymmdd', '%Short - d M, y%d M, y', '%Medium - d MM, y%d MM, y', '%Full - DD, d MM, yy%DD, d MM, yy', '%With text - \'day\' d \'of\' MM \'in the year\' yy%\'day\' d \'of\' MM \'in the year\' yy', '%Two digit year - dd-mm-y%dd-mm-y' ), 'default' => 'dd-mm-yy' ),
	));


	/* set up the box arguments */
	$args = array(
		'metabox_id' => 'wck-cfc-fields',
		'metabox_title' => __( 'Meta Box Fields', 'wck' ),
		'post_type' => 'wck-meta-box',
		'meta_name' => 'wck_cfc_fields',
		'meta_array' => $cfc_box_fields_fields
	);

	/* create the box */
	new Wordpress_Creation_Kit( $args );
}

/* advanced label options container for update form */
add_action( "wck_before_add_form_wck_cfc_args_element_0", 'wck_cfc_description_for_args_box' );
function wck_cfc_description_for_args_box(){
	echo '<div class="cfc-message"><p>'. esc_html__( 'Enter below the arguments for the meta box.', 'wck' ) .'</p></div>';
}

/* add css classes on update form. Allows us to show/hide elements based on field type select value */
add_filter( 'wck_update_container_class_wck_cfc_fields', 'wck_cfc_update_container_class', 10, 4 );
function wck_cfc_update_container_class($wck_update_container_css_class, $meta, $results, $element_id) {
	$wck_element_type = Wordpress_Creation_Kit::wck_generate_slug( $results[$element_id]["field-type"] );
	return "class='update_container_$meta update_container_$wck_element_type element_type_$wck_element_type'";
}

add_filter( 'wck_element_class_wck_cfc_fields', 'wck_cfc_element_class', 10, 4 );
function wck_cfc_element_class($wck_element_class, $meta, $results, $element_id){
	$wck_element_type = Wordpress_Creation_Kit::wck_generate_slug( $results[$element_id]["field-type"] );
	$wck_element_class = "class='element_type_$wck_element_type'";
	return $wck_element_class;
}

/* add refresh to page */
add_action("wck_refresh_list_wck_cfc", "wck_cfc_after_refresh_list");
function wck_cfc_after_refresh_list(){
	echo '<script type="text/javascript">window.location="'. esc_url_raw( get_admin_url() ) . 'admin.php?page=cfc-page&updated=true' .'";</script>';
}

/* hook to create custom meta boxes */
add_action( 'admin_init', 'wck_cfc_create_boxes' );

function wck_cfc_create_boxes_args(){
    $all_box_args = wp_cache_get( 'wck_all_box_args', 'wck' );

    if ( $all_box_args !== false && !empty( $all_box_args ) )
        return $all_box_args;

    $all_box_args = array();

	$args = array(
		'post_type' => 'wck-meta-box',
		'numberposts' => -1
	);

	$all_meta_boxes = get_posts( $args );

	if( !empty( $all_meta_boxes ) ){
		foreach( $all_meta_boxes as $meta_box ){
			$wck_cfc_args = get_post_meta( $meta_box->ID, 'wck_cfc_args', true );
			$wck_cfc_fields = get_post_meta( $meta_box->ID, 'wck_cfc_fields', true );

			$box_title = get_the_title( $meta_box->ID );
			/* treat case where the post has no title */
			if( empty( $box_title ) )
				$box_title = '(no title)';

			$fields_array = array();
			if( !empty( $wck_cfc_fields ) ){
				foreach( $wck_cfc_fields as $wck_cfc_field ){
					$fields_inner_array = array( 'type' => $wck_cfc_field['field-type'], 'title' => $wck_cfc_field['field-title'] );

					if( !empty( $wck_cfc_field['field-slug'] ) )
						$fields_inner_array['slug'] = $wck_cfc_field['field-slug'];
					else
						$fields_inner_array['slug'] = Wordpress_Creation_Kit::wck_generate_slug( $wck_cfc_field['field-title'] );

					if( !empty( $wck_cfc_field['description'] ) )
						$fields_inner_array['description'] = $wck_cfc_field['description'];
					if( !empty( $wck_cfc_field['required'] ) )
						$fields_inner_array['required'] = $wck_cfc_field['required'] == 'false' ? false : true;
					if ( !empty( $wck_cfc_field['cpt'] ) )
						$fields_inner_array['cpt'] = $wck_cfc_field['cpt'];
					if( isset( $wck_cfc_field['default-value'] ) )
						$fields_inner_array['default'] = $wck_cfc_field['default-value'];
                    if( isset( $wck_cfc_field['default-text'] ) && !empty( $wck_cfc_field['default-text'] ) )
                        $fields_inner_array['default'] = $wck_cfc_field['default-text'];
					if( !empty( $wck_cfc_field['options'] ) ){
						$fields_inner_array['options'] = array_map( 'trim', explode( ',', $wck_cfc_field['options'] ) );

						$labels = array(); // reset the $labels variable so it doesn't contain information from other fields.
                        if( !empty( $wck_cfc_field['labels'] ) ){
                            $labels = array_map( 'trim', explode( ',', $wck_cfc_field['labels'] ) );
                        }

						if( !empty( $fields_inner_array['options'] ) ){
							foreach( $fields_inner_array['options'] as  $key => $value ){
								$fields_inner_array['options'][$key] = trim( $value );
                                if( strpos( $value, '%' ) === false && !empty( $labels[$key] ) )
                                    $fields_inner_array['options'][$key] = '%'.$labels[$key].'%'.$value;
							}
						}

					}
					if( !empty( $wck_cfc_field['attach-upload-to-post'] ) )
						$fields_inner_array['attach_to_post'] = $wck_cfc_field['attach-upload-to-post'] == 'yes' ? true : false;

                    if( !empty( $wck_cfc_field['number-of-rows'] ) )
                        $fields_inner_array['number_of_rows'] = trim( $wck_cfc_field['number-of-rows'] );

                    if( !empty( $wck_cfc_field['readonly'] ) )
                        $fields_inner_array['readonly'] = $wck_cfc_field['readonly'] == 'true' ? true : false;

					if( ! empty( $wck_cfc_field['phone-format'] ) ) {
						$phone_format_description = __( 'Required phone number format: ', 'wck' ) . $wck_cfc_field['phone-format'];
						$phone_format_description = apply_filters( 'wck_phone_format_description', $phone_format_description );
						if( $wck_cfc_field['field-type'] === 'phone' ) {
							$fields_inner_array['phone-format'] = $wck_cfc_field['phone-format'];
							if( ! empty( $wck_cfc_field['description'] ) ) {
								$fields_inner_array['description'] .= '<br>' . $phone_format_description;
							} else {
								$fields_inner_array['description'] = $phone_format_description;
							}
						}
					}


                    if( $wck_cfc_field['field-type'] === 'html' && isset( $wck_cfc_field['html-content'] ) ) {
                        $fields_inner_array['html-content'] = $wck_cfc_field['html-content'];
                    }


                    if( isset( $wck_cfc_field['map-default-latitude'] ) )
                        $fields_inner_array['map_default_latitude'] = trim( $wck_cfc_field['map-default-latitude'] );

                    if( isset( $wck_cfc_field['map-default-longitude'] ) )
                        $fields_inner_array['map_default_longitude'] = trim( $wck_cfc_field['map-default-longitude'] );

                    if( !empty( $wck_cfc_field['map-default-zoom'] ) )
                        $fields_inner_array['map_default_zoom'] = trim( $wck_cfc_field['map-default-zoom'] );

                    if( !empty( $wck_cfc_field['map-height'] ) )
                        $fields_inner_array['map_height'] = trim( $wck_cfc_field['map-height'] );

					if( !empty( $wck_cfc_field['min-number-value'] ) || ( isset( $wck_cfc_field['min-number-value'] ) && $wck_cfc_field['min-number-value'] == '0' ) )
						$fields_inner_array['min-number-value'] = trim( $wck_cfc_field['min-number-value'] );

					if( !empty( $wck_cfc_field['max-number-value'] ) || ( isset( $wck_cfc_field['max-number-value'] ) && $wck_cfc_field['max-number-value'] == '0' ) )
						$fields_inner_array['max-number-value'] = trim( $wck_cfc_field['max-number-value'] );

					if( !empty( $wck_cfc_field['number-step-value'] ) )
						$fields_inner_array['number-step-value'] = trim( $wck_cfc_field['number-step-value'] );

					if( $wck_cfc_field['field-type'] === 'datepicker' ) {
						if( !empty( $wck_cfc_field['date-format'] ) )
							$fields_inner_array['date-format'] = $wck_cfc_field['date-format'];
					}

					$fields_array[] = $fields_inner_array;
				}
			}

			if( !empty( $wck_cfc_args ) ){
				foreach( $wck_cfc_args as $wck_cfc_arg ){

					/* metabox_id must be different from meta_name */
					$metabox_id = Wordpress_Creation_Kit::wck_generate_slug( $box_title );
					if( $wck_cfc_arg['meta-name'] == $metabox_id || 'content' == $metabox_id )
						$metabox_id = 'wck-'. $metabox_id;

					$box_args = array(
									'metabox_id' => $metabox_id,
									'metabox_title' => $box_title,
									'post_type' => $wck_cfc_arg['post-type'],
									'meta_name' => $wck_cfc_arg['meta-name'],
									'meta_array' => $fields_array
								);
					if( !empty( $wck_cfc_arg['sortable'] ) )
						$box_args['sortable'] = $wck_cfc_arg['sortable'] == 'false' ? false : true;

					if( !empty( $wck_cfc_arg['repeater'] ) )
						$box_args['single'] = $wck_cfc_arg['repeater'] == 'false' ? true : false;

					if( !empty( $wck_cfc_arg['post-id'] ) )
						$box_args['post_id'] = $wck_cfc_arg['post-id'];

					if( !empty( $wck_cfc_arg['page-template'] ) )
						$box_args['page_template'] = $wck_cfc_arg['page-template'];

					if( !empty( $wck_cfc_arg['box-style'] ) )
						$box_args['box_style'] = $wck_cfc_arg['box-style'];

					$box_args['unserialize_fields'] = apply_filters( 'wck_cfc_unserialize_fields_'.$wck_cfc_arg['meta-name'], false );

					/* nested repeater arg for pro version only */
					if( !empty( $wck_cfc_arg['nested'] ) )
						$box_args['nested'] = $wck_cfc_arg['nested'] == 'false' ? false : true;

					$all_box_args[] = apply_filters( "wck_cfc_box_args_".$wck_cfc_arg['meta-name'], $box_args );
				}
			}
		}
	}
    wp_cache_set( 'wck_all_box_args', $all_box_args, 'wck');
	return $all_box_args;
}

function wck_cfc_create_boxes(){
	$all_box_args = wck_cfc_create_boxes_args();
	if( !empty( $all_box_args ) ){
		foreach( $all_box_args as $box_args ){
			new Wordpress_Creation_Kit( $box_args );
		}
	}
}

/* Meta Name Verification */
add_filter( 'wck_required_test_wck_cfc_args_meta-name', 'wck_cfc_check_meta_name', 10, 8 );
add_filter( 'wck_required_test_wck_cfc_fields_field-slug', 'wck_cfc_check_meta_name', 10, 8 );
function wck_cfc_check_meta_name( $bool, $value, $post_id, $field, $meta, $fields, $values, $elemet_id ){
	global $wpdb;

	if( current_filter() == 'wck_required_test_wck_cfc_args_meta-name' ){
		$wck_cfc_args = get_post_meta( $post_id, 'wck_cfc_args', true );

		if( empty( $wck_cfc_args ) ){
			//this is the add case
			$check_meta_existance = wck_cfc_check_existence_in_database( $value );
		}
		else{
			//this is the update case
			if( $wck_cfc_args[0]['meta-name'] != $value ){
				$check_meta_existance = wck_cfc_check_existence_in_database( $value );
			}
			else
				$check_meta_existance = false;
		}
	}
	else if( current_filter() == 'wck_required_test_wck_cfc_fields_field-slug' ){
		if( !empty( $values['wck-overwrite-slug'] ) && $values['wck-overwrite-slug'] == 'overwrite' )
			$check_meta_existance = false;
		else{
			$wck_cfc_fields = get_post_meta( $post_id, 'wck_cfc_fields', true );
			if( empty( $wck_cfc_fields ) || $elemet_id === false ){
				//this is the add case
				$check_meta_existance = wck_cfc_check_existence_in_database( $value );
			}
			else if( $elemet_id !== false ){
				//this is the update case
				if( !empty( $wck_cfc_fields[$elemet_id]['field-slug'] ) && $wck_cfc_fields[$elemet_id]['field-slug'] != $value ){
					$check_meta_existance = wck_cfc_check_existence_in_database( $value );
				}
				else
					$check_meta_existance = false;
			}
		}
	}

	if( strpos( $value, ' ' ) === false )
		$contains_spaces = false;
	else
		$contains_spaces = true;

	if( trim( strtolower( $value ) ) !== 'content' && trim( strtolower( $value ) ) !== 'action' )
		$restricted_name = false;
	else
		$restricted_name = true;

    if ( strtolower($value) == $value )
        $has_uppercase = false;
    else
        $has_uppercase = true;

	return ( $check_meta_existance || empty($value) || $contains_spaces || $restricted_name || $has_uppercase );
}

add_filter( 'wck_required_message_wck_cfc_args_meta-name', 'wck_cfc_change_meta_message', 10, 3 );
add_filter( 'wck_required_message_wck_cfc_fields_field-slug', 'wck_cfc_change_meta_message', 10, 3 );
function wck_cfc_change_meta_message( $message, $value, $required_field ){

	if( current_filter() == 'wck_required_message_wck_cfc_args_meta-name' )
		$field_name = __( "Group Name", 'wck' );
	else if( current_filter() == 'wck_required_message_wck_cfc_fields_field-slug' )
		$field_name = __( "Field Slug", 'wck' );

	if( empty( $value ) )
		return $message;
	else if( strpos( $value, ' ' ) !== false )
		return sprintf(  __( "Choose a different %s as this one contains spaces\n", "wck" ), $field_name );
	else if( trim( strtolower( $value ) ) === 'content' || trim( strtolower( $value ) ) === 'action' )
		return sprintf(  __( "Choose a different %s as this one is reserved\n", "wck" ), $field_name );
    else if ( strtolower($value) != $value )
        return sprintf(  __( "Choose a different %s as this one contains uppercase letters\n", "wck" ), $field_name );
	else
		return sprintf(  __( "Choose a different %s as this one already exists\n", "wck" ), $field_name );
}

/* function that check if a group name already exists */
function wck_cfc_check_group_name_exists( $name ){

	$wck_meta_boxes_ids = get_option( 'wck_meta_boxes_ids', array() );

	if( !empty( $wck_meta_boxes_ids ) ){
		foreach( $wck_meta_boxes_ids as $wck_meta_boxes_id ){
			$wck_cfc_args = get_post_meta( $wck_meta_boxes_id, 'wck_cfc_args', true );
			if( !empty( $wck_cfc_args ) ){
				/* make sure we compare them as slugs */
				if( Wordpress_Creation_Kit::wck_generate_slug( $wck_cfc_args[0]['meta-name'] ) == Wordpress_Creation_Kit::wck_generate_slug( $name ) ){
					return true;
				}
			}
		}
	}
	return false;
}

/* function that check if a field slug already exists */
function wck_cfc_check_field_slug_exists( $name ){

	$wck_meta_boxes_ids = get_option( 'wck_meta_boxes_ids', array() );

	if( !empty( $wck_meta_boxes_ids ) ){
		foreach( $wck_meta_boxes_ids as $wck_meta_boxes_id ){
			$wck_cfc_fields = get_post_meta( $wck_meta_boxes_id, 'wck_cfc_fields', true );
			if( !empty( $wck_cfc_fields ) ){
				foreach( $wck_cfc_fields as $wck_cfc_field ){
					/* make sure to compare them as slugs */
					if( Wordpress_Creation_Kit::wck_generate_slug( $wck_cfc_field['field-slug'] ) == Wordpress_Creation_Kit::wck_generate_slug( $name ) ){
						return true;
					}
				}
			}
		}
	}
	return false;
}

function wck_cfc_check_existence_in_database( $name ){
	global $wpdb;
	$check_meta_existance = $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(meta_key) FROM $wpdb->postmeta WHERE meta_key = %s", $name ) );
	/* if we did not find anything yet */
	if( !$check_meta_existance ){
		$check_meta_existance = wck_cfc_check_group_name_exists( $name );
	}
	/* if we still did not find anything yet */
	if( !$check_meta_existance ){
		$check_meta_existance = wck_cfc_check_field_slug_exists( $name );
	}

	return $check_meta_existance;
}


/* Field Name Verification */
add_filter( 'wck_required_test_wck_cfc_fields_field-title', 'wck_cfc_ceck_field_title', 10, 6 );
function wck_cfc_ceck_field_title( $bool, $value, $post_id, $field, $meta, $fields ){

	if( trim( strtolower( $value ) ) !== 'content' && trim( strtolower( $value ) ) !== 'action' )
		$restricted_name = false;
	else
		$restricted_name = true;

	return ( empty($value) || $restricted_name );
}

add_filter( 'wck_required_message_wck_cfc_fields_field-title', 'wck_cfc_change_field_title_message', 10, 3 );
function wck_cfc_change_field_title_message( $message, $value, $required_field ){
	if( empty( $value ) )
		return $message;
	else if( trim( strtolower( $value ) ) === 'content' || trim( strtolower( $value ) ) === 'action' )
		return __( "Choose a different Field Title as this one is reserved\n", "wck" );
}

/* Add the separate meta for post type, post id and page template */
add_action( 'wck_before_add_meta', 'wck_cfc_add_separate_meta', 10, 3 );
function wck_cfc_add_separate_meta( $meta, $id, $values ){
	if( $meta == 'wck_cfc_args' ){
		// Post Type
		if( !empty( $values['post-type'] ) ){
			update_post_meta( $id, 'wck_cfc_post_type_arg', $values['post-type'] );
		}

		// Post Id
		if( !empty( $values['post-id'] ) ){
			update_post_meta( $id, 'wck_cfc_post_id_arg', $values['post-id'] );
		}

		// Page Template
		if( !empty( $values['page-template'] ) ){
			update_post_meta( $id, 'wck_cfc_page_template_arg', $values['page-template'] );
		}
	}
}

/* Change meta_key in db if field changed and also update the separate meta for post type, post id and page template */
add_action( 'wck_before_update_meta', 'wck_cfc_change_meta_key', 10, 4 );
function wck_cfc_change_meta_key( $meta, $id, $values, $element_id ){
	global $wpdb;
	if( $meta == 'wck_cfc_args' ){
		$wck_cfc_args = get_post_meta( $id, 'wck_cfc_args', true );
        if( !empty( $wck_cfc_args ) ) {
            if ($wck_cfc_args[0]['meta-name'] != $values['meta-name']) {
                $wpdb->update(
                    $wpdb->postmeta,
                    array('meta_key' => $values['meta-name']),
                    array('meta_key' => $wck_cfc_args[0]['meta-name'])
                );
            }

            // Post Type
            if ($wck_cfc_args[0]['post-type'] != $values['post-type']) {
                update_post_meta($id, 'wck_cfc_post_type_arg', $values['post-type']);
            }

            // Post Id
            if ($wck_cfc_args[0]['post-id'] != $values['post-id']) {
                update_post_meta($id, 'wck_cfc_post_id_arg', $values['post-id']);
            }

            // Page Template
            if( isset( $wck_cfc_args[0]['page-template'] ) && $values['page-template'] ) {
                if ($wck_cfc_args[0]['page-template'] != $values['page-template']) {
                    update_post_meta($id, 'wck_cfc_page_template_arg', $values['page-template']);
                }
            }
        }
	}
}

/* Change Field Title in db if field changed */
add_action( 'wck_before_update_meta', 'wck_cfc_change_field_title', 10, 4 );
function wck_cfc_change_field_title( $meta, $id, $values, $element_id ){
	global $wpdb;
	if( $meta == 'wck_cfc_fields' ){
		$wck_cfc_fields = get_post_meta( $id, 'wck_cfc_fields', true );
        if( !empty( $wck_cfc_fields ) ) {

			if( !empty( $wck_cfc_fields[$element_id]['field-slug'] ) )
				$old_slug = $wck_cfc_fields[$element_id]['field-slug'];
			else
				$old_slug = Wordpress_Creation_Kit::wck_generate_slug( $wck_cfc_fields[$element_id]['field-title'] );

            if ( $old_slug != $values['field-slug']) {

                $wck_cfc_args = get_post_meta($id, 'wck_cfc_args', true);
                $meta_name = $wck_cfc_args[0]['meta-name'];
                $post_id_with_this_meta = $wpdb->get_results($wpdb->prepare("SELECT post_id FROM $wpdb->postmeta WHERE meta_key = %s", $meta_name));

                if (!empty($post_id_with_this_meta)) {
                    foreach ($post_id_with_this_meta as $post) {
                        $results = get_post_meta($post->post_id, $meta_name, true);
                        if (!empty($results)) {
                            foreach ($results as $key => $result) {
                                $results[$key][$values['field-slug']] = $results[$key][$old_slug];

								/* unserialized */
								if( $key == 0 )
									$suffix = '';
								else
									$suffix = '_'.$key;
								add_post_meta( $post->post_id, $values['field-slug'].$suffix, $results[$key][$old_slug] );
								delete_post_meta( $post->post_id, $old_slug.$suffix );


                                unset($results[$key][$old_slug]);
                            }
                        }
                        update_post_meta($post->post_id, $meta_name, $results);
                    }
                }
            }
        }
	}
}

/* Add Custom columns to listing */
add_filter("manage_wck-meta-box_posts_columns", "wck_cfc_edit_columns" );
function wck_cfc_edit_columns($columns){
	$columns['cfc-id'] = __( "Id", "wck" );
	$columns['cfc-post-type'] = __( "Post Type", "wck" );
	$columns['cfc-page-template'] = __( "Page Template", "wck" );

	/* only in pro version */
	if( function_exists( 'wck_nr_add_repeater_boxes' ) ){
		$columns['cfc-nested-repeater'] = __( "Nested Repeater", "wck" );
	}

	return $columns;
}

/* Register the column as sortable */
add_filter( 'manage_edit-wck-meta-box_sortable_columns', 'wck_cfc_register_sortable_columns' );
function wck_cfc_register_sortable_columns( $columns ) {
	$columns['cfc-id'] = 'cfc-id';
	$columns['cfc-post-type'] = 'cfc-post-type';
	$columns['cfc-page-template'] = 'cfc-page-template';

	return $columns;
}

/* Tell WordPress how to handle the sorting */
add_filter( 'request', 'wck_cfc_column_orderby' );
function wck_cfc_column_orderby( $vars ) {
	if ( isset( $vars['orderby'] ) && 'cfc-id' == $vars['orderby'] ) {
		$vars = array_merge( $vars, array(
			'meta_key' => 'wck_cfc_post_id_arg',
			'orderby' => 'meta_value_num'
		) );
	}

	if ( isset( $vars['orderby'] ) && 'cfc-post-type' == $vars['orderby'] ) {
		$vars = array_merge( $vars, array(
			'meta_key' => 'wck_cfc_post_type_arg',
			'orderby' => 'meta_value'
		) );
	}

	if ( isset( $vars['orderby'] ) && 'cfc-page-template' == $vars['orderby'] ) {
		$vars = array_merge( $vars, array(
			'meta_key' => 'wck_cfc_page_template_arg',
			'orderby' => 'meta_value'
		) );
	}

	return $vars;
}

/* Let's set up what to display in the columns */
add_action("manage_wck-meta-box_posts_custom_column",  "wck_cfc_custom_columns", 10, 2);
function wck_cfc_custom_columns( $column_name, $post_id ){
	if( $column_name == 'cfc-id' ){
		$post_id_arg = get_post_meta( $post_id, 'wck_cfc_post_id_arg', true );
		echo esc_html($post_id_arg);
	}

	if( $column_name == 'cfc-post-type' ){
		$post_type_arg = get_post_meta( $post_id, 'wck_cfc_post_type_arg', true );
		echo esc_html( $post_type_arg );
	}

	if( $column_name == 'cfc-page-template' ){
		$page_template_arg = get_post_meta( $post_id, 'wck_cfc_page_template_arg', true );
		echo esc_html( $page_template_arg );
	}

	/* only in pro version */
	if( function_exists( 'wck_nr_add_repeater_boxes' ) ){
		if( $column_name == 'cfc-nested-repeater' ){
			$box_args = get_post_meta( $post_id, 'wck_cfc_args', true );
			if( !empty( $box_args[0]['nested'] ) )
				echo esc_html( $box_args[0]['nested'] );
		}
	}
}

/* Add side metaboxes */
if( !file_exists( dirname(__FILE__).'/wck-stp.php' ) ) {
    add_action('add_meta_boxes', 'wck_cfc_add_side_boxes');
    function wck_cfc_add_side_boxes()
    {
        add_meta_box('wck-cfc-side', __('Wordpress Creation Kit', 'wck'), 'wck_cfc_side_box_one', 'wck-meta-box', 'side', 'low');
    }

    function wck_cfc_side_box_one()
    {
        ?>
        <a href="http://www.cozmoslabs.com/wck-custom-fields-custom-post-types-plugin/?utm_source=wpbackend&utm_medium=clientsite&utm_campaign=WCKFree"><img
                src="<?php echo esc_url( plugins_url('/images/banner_pro.png', __FILE__) ) ?>?v=1" width="254" height="448"
                alt="WCK-PRO"/></a>
    <?php
    }
}

/* add TranslatePress crosspromotion */
add_action('add_meta_boxes', 'wck_cfc_add_trp_side_box');
function wck_cfc_add_trp_side_box()
{
    add_meta_box('wck-cfc-side-trp', __('TranslatePress', 'wck'), 'wck_cfc_side_box_trp', 'wck-meta-box', 'side', 'low');
}

function wck_cfc_side_box_trp()
{
    ?>
    <a href="https://wordpress.org/plugins/translatepress-multilingual/" target="_blank"><img
                src="<?php echo esc_url( plugins_url('/images/banner_trp.png', __FILE__) ) ?>?v=1" width="254"
                alt="TranslatePress"/></a>
	<h4>Easily translate your entire WordPress website</h4>
	<p><a href="https://wordpress.org/plugins/translatepress-multilingual/" target="_blank">Translate</a> your Custom Post Types and Custom Fields with a WordPress translation plugin that anyone can use.<br/><br/>
	It offers a simpler way to translate WordPress sites, with full support for WooCommerce and site builders.</p>
    <?php
}


/* Contextual Help */
add_action('current_screen', 'wck_cfc_help');

function wck_cfc_help () {
    $screen = get_current_screen();
    /*
     * Check if current screen is wck_page_cptc-page
     * Don't add help tab if it's not
     */
    if ( $screen->id != 'wck-meta-box' )
        return;

    // Add help tabs
    $screen->add_help_tab( array(
        'id'	=> 'wck_cfc_overview',
        'title'	=> __( 'Overview', 'wck' ),
        'content'	=> '<p>' . __( 'WCK Custom Fields Creator allows you to easily create custom meta boxes for Wordpress without any programming knowledge.', 'wck' ) . '</p>',
    ) );

	$screen->add_help_tab( array(
        'id'	=> 'wck_cfc_arguments',
        'title'	=> __( 'Meta Box Arguments', 'wck' ),
        'content'	=> '<p>' . __( 'Define here the rules for the meta box. This rules are used to set up where the meta box will appear, it\'s type and also the meta key name stored in the database. The name of the entry (Enter title here) will be used as the meta box title.', 'wck' ) . '</p>',
    ) );

	$screen->add_help_tab( array(
        'id'	=> 'wck_cfc_fields',
        'title'	=> __( 'Meta Box Fields', 'wck' ),
        'content'	=> '<p>' . __( 'Define here the fields contained in the meta box. From "Field Title" a slug will be automatically generated and you will use this slug to display the data in the frontend.', 'wck' ) . '</p>',
    ) );

	$screen->add_help_tab( array(
        'id'	=> 'wck_cfc_example',
        'title'	=> __( 'CFC Frontend Example', 'wck' ),
        'content'	=> '<p>' . __( 'Let\'s consider we have a meta box with the following arguments:<br /> - Meta name: books <br /> - Post Type: post <br />And we also have two fields deffined:<br /> - A text field with the Field Title: Book name <br /> - And another text field with the Field Title: Author name ', 'wck' ) . '</p>' . '<p>' . __( 'You will notice that slugs will automatically be created for the two text fields. For "Book name" the slug will be "book-name" and for "Author name" the slug will be "author-name"', 'wck' ) . '</p>' . '<p>' . __( 'Let\'s see what the code for displaying the meta box values in single.php of your theme would be:', 'wck' ) . '</p>' . '<pre>' . '$books = get_post_meta( $post->ID, \'books\', true ); <br />foreach( $books as $book){<br />	echo $book[\'book-name\'];<br / >	echo $book[\'author-name\'];<br />}' . '</pre>' . '<p>' . __( 'So as you can see the Meta Name "books" is used as the $key parameter of the funtion <a href="http://codex.wordpress.org/Function_Reference/get_post_meta" target="_blank">get_post_meta()</a> and the slugs of the text fields are used as keys for the resulting array. Basically CFC stores the entries as post meta in a multidimensioanl array. In our case the array would be: <br /><pre>array( array( "book-name" => "The Hitchhiker\'s Guide To The Galaxy", "author-name" => "Douglas Adams" ),  array( "book-name" => "Ender\'s Game", "author-name" => "Orson Scott Card" ) );</pre> This is true even for single entries.', 'wck' ) . '</p>'
    ) );
}

/**
 * Get the Page Templates available in the current theme
 *
 * Based on wordpress get_page_templates()
 *
 * @return array Key is the template name, value is the %Template Name%filename string format of the template
 */
function wck_get_page_templates() {

	$page_templates = array();
	$theme_templates = array_flip(wp_get_theme()->get_page_templates());
	if( !empty( $theme_templates ) ){
		foreach( $theme_templates  as $key => $value){
			$page_templates[$key] = "%$key%$value";
		}
	}
	return $page_templates;
}

/* Filter post update message */
add_filter( 'post_updated_messages', 'wck_cfc_filter_post_update_message' );
function wck_cfc_filter_post_update_message($messages){
	$messages['wck-meta-box'] = array(
		0 => '', // Unused. Messages start at index 1.
		1 => __('Metabox updated.', 'wck')
	);
	return $messages;
}

/* Filter Field Types for free version */
add_filter( 'wck_field_types', 'wck_cfc_filter_field_types' );
function wck_cfc_filter_field_types( $field_types ){
	$wck_premium_update = WCK_PLUGIN_DIR.'/update/';
	if ( !file_exists ($wck_premium_update . 'update-checker.php'))
		$field_types = array( 'text', 'textarea', 'select', 'select multiple', 'checkbox', 'radio', 'upload', 'wysiwyg editor', 'heading', 'colorpicker', 'currency select', 'phone', 'timepicker', 'html', 'number' );

	return $field_types;
}

/* Mark as required the 'Options' field for checkboxes, radios, selects .. */
add_filter( 'wck_before_test_required', 'wck_cfc_make_options_required', 10, 4 );
function wck_cfc_make_options_required( $meta_array, $meta, $values, $id ) {
	if( $meta == 'wck_cfc_fields' ) {
		if( $values['field-type'] == 'select' || $values['field-type'] == 'select multiple' || $values['field-type'] == 'radio' || $values['field-type'] == 'checkbox' ) {
			foreach( $meta_array as $key => $field ) {
				if( $field['slug'] == 'options' ) {
					$meta_array[$key]['required'] = true;
				}
			}
		}

        foreach( $meta_array as $key => $field ) {
            if( isset( $field['type'] ) && $field['type'] == 'phone' ) {
                $meta_array[$key]['required'] ? $meta_array[$key]['was_required'] = true : $meta_array[$key]['was_required'] = false;
                $meta_array[$key]['required'] = true;
                add_filter( "wck_required_test_{$meta}_" . Wordpress_Creation_Kit::wck_generate_slug( $field['title'], $field ), 'wck_phone_field_error', 10, 6 );
            }

            if( isset( $field['type'] ) && $field['type'] == 'number' ) {
                $meta_array[$key]['required'] ? $meta_array[$key]['was_required'] = true : $meta_array[$key]['was_required'] = false;
                $meta_array[$key]['required'] = true;
                add_filter( "wck_required_test_{$meta}_" . Wordpress_Creation_Kit::wck_generate_slug( $field['title'], $field ), 'wck_number_field_error', 10, 6 );
            }
        }
    }

	return $meta_array;
}

/* handle Field Slug backwards compatibility */
add_filter( "wck_displayed_value_wck_cfc_fields_field-slug", "wck_cfc_handle_empty_field_slug", 10, 4 );
add_filter( "wck_cfc_filter_edit_form_value_wck_cfc_fields_field-slug", "wck_cfc_handle_empty_field_slug", 10, 4 );
function wck_cfc_handle_empty_field_slug( $value, $results, $element_id, $id ){
	if( empty( $value ) ){
		$value = Wordpress_Creation_Kit::wck_generate_slug( $results[$element_id]['field-title'] );
		$check_meta_existance = wck_cfc_check_group_name_exists( $value );
		if( $check_meta_existance ){
			$wck_cfc_args = get_post_meta( $id, 'wck_cfc_args', true );
			if( !empty( $wck_cfc_args ) ){
				if( current_filter() == 'wck_displayed_value_wck_cfc_fields_field-slug' ){
					$value = '('.$wck_cfc_args[0]['meta-name'].'_)'.$value;
				}
				else
					$value = $wck_cfc_args[0]['meta-name'].'_'.$value;
			}
		}
	}
	else{
		if( current_filter() == 'wck_displayed_value_wck_cfc_fields_field-slug' ) {
			$check_meta_existance = wck_cfc_check_group_name_exists($value);
			if( $check_meta_existance ){
				$wck_cfc_args = get_post_meta( $id, 'wck_cfc_args', true );
				if( !empty( $wck_cfc_args ) ){
					$value = '('.$wck_cfc_args[0]['meta-name'].'_)'.$value;
				}
			}
		}
	}

	return $value;
}

add_filter( "wck_field_before_description", "wck_edit_button_for_field_slug", 10, 3 );
function wck_edit_button_for_field_slug( $element, $meta, $details ){
	if( $meta == 'wck_cfc_fields' && $details['slug'] == 'field-slug' ){
		$element .= '<button type="button" class="wck-cfc-edit-slug button button-small">'. __( "Edit", "wck" ).'</button>';
		$element .= '<span class="wck-overwrite-slug"><input type="checkbox" name="wck-overwrite-slug" value="overwrite" class="mb-field">'. __( "Overwrite Existing", "wck" ).'</span>';
	}
	return $element;
}

add_action( 'wp_ajax_wck_generate_slug', 'wck_generate_slug' );
function wck_generate_slug(){
	if( !empty( $_POST['field_title'] ) ){
		$slug = Wordpress_Creation_Kit::wck_generate_slug( sanitize_text_field( $_POST['field_title'] ) );
		die( esc_html( $slug ) );
	}
	die('failed');
}

function wck_phone_field_error( $bool, $value, $id, $field, $meta, $fields ) {
	foreach( $fields as $key => $field_array ) {
		$field_slug = Wordpress_Creation_Kit::wck_generate_slug( $field_array['title'], $field_array );
		if( $field_slug == $field ) {
			if( ! empty( $field_array['phone-format'] ) && ! empty( $value ) ) {
				$phone_nb = array();
				$length = strlen( $value );

				for( $i=0; $i < $length; $i++ ) {
					$phone_nb[$i] = $value[$i];

					if( $value[$i] == '_' ) {
						add_filter( "wck_required_message_{$meta}_{$field}", "wck_phone_error_message", 10, 3 );
						return true;
					}
				}
			} elseif( isset( $field_array['was_required'] ) && $field_array['was_required'] && empty( $value ) ) {
				return true;
			}
		}
	}
}

function wck_phone_error_message( $message, $value, $required_field ) {
	$message = apply_filters( "wck_invalid_phone_message", __( "Please enter a valid phone number for field ", "wck" ) . "$required_field \n" );

	return $message;
}

function wck_number_field_error( $bool, $value, $id, $field, $meta, $fields ) {
	foreach( $fields as $key => $field_array ) {
		$field_slug = Wordpress_Creation_Kit::wck_generate_slug( $field_array['title'], $field_array );
		if( $field_slug == $field ) {
			if( ! empty( $value ) && ! is_numeric( $value ) ) {

                add_filter( "wck_required_message_{$meta}_{$field_slug}", function ( $message, $value, $required_field ) {
                    return apply_filters( "wck_number_error_message", __( "Please enter numbers only for field ", "wck" ) . "$required_field \n" );
                }, 10, 3 );

				return true;
			}

			if( ! empty( $field_array['number-step-value'] ) && ! empty( $value ) && ( sprintf( round( $value / $field_array['number-step-value'] ) ) != sprintf( $value / $field_array['number-step-value'] ) ) ) {

				add_filter( "wck_required_message_{$meta}_{$field_slug}", function ( $message, $value, $required_field ) use ( $field_array ) {
						$number_step = $field_array['number-step-value'];
						return apply_filters( "wck_number_error_message", "$required_field" . __( " field value must be a multiplier of ", "wck" ) . "$number_step \n" );
					}, 10, 3 );

				return true;
			}

			if( ( ! empty( $field_array['min-number-value'] ) || (isset($field_array['min-number-value']) && $field_array['min-number-value'] == '0' )) && ( ! empty( $value ) || $value == '0' ) && $value < $field_array['min-number-value'] ) {

				add_filter( "wck_required_message_{$meta}_{$field_slug}", function ( $message, $value, $required_field ) use ( $field_array ) {
						$number_min = $field_array['min-number-value'];

						return apply_filters( "wck_number_error_message", "$required_field" . __( " field value must be greater than or equal to ", "wck" ) . "$number_min \n" );
					}, 10, 3 );


				return true;
			}

			if( ( ! empty( $field_array['max-number-value'] ) || (isset($field_array['max-number-value']) && $field_array['max-number-value'] == '0' )) && ( ! empty( $value ) || $value == '0' ) && $value > $field_array['max-number-value'] ) {
				add_filter( "wck_required_message_{$meta}_{$field_slug}", function ( $message, $value, $required_field ) use ( $field_array ) {
						$number_max = $field_array['max-number-value'];

						return apply_filters( "wck_number_error_message", "$required_field" . __( " field value must be less than or equal to ", "wck" ) . "$number_max \n" );
					}, 10, 3 );


				return true;
			}

			if( isset( $field_array['was_required'] ) && $field_array['was_required'] && empty( $value ) && $value != '0' ) {
				return true;
			}
		}
	}
}

/* output a notice that asks the user to go and unserialize the fields */
$wck_update_unserialized = get_option( 'wck_update_to_unserialized', 'yes' );
if( $wck_update_unserialized == 'yes' ) {
	new WCK_Add_Notices('wck_update_unserialized_notice',
		sprintf(__('To update the meta information on posts to the new unserialized structure go to %1$sthis page%2$s and follow the instructions. Please make a backup of your database first! %3$sDismiss%4$s', 'wck'), "<a href='" . admin_url('admin.php?page=wck-unserialized') . "'>", "</a>", "<a href='" . esc_url(add_query_arg('wck_update_unserialized_notice_dismiss_notification', '0')) . "'>", "</a>"),
		'update-nag');
}

/* add an admin page for the unserialized process */
add_action('admin_menu', 'wck_register_update_unserialized_submenu_page');
function wck_register_update_unserialized_submenu_page() {
	add_submenu_page( null,	'WCK Unserialized',	'WCK Unserialized',	'manage_options', 'wck-unserialized', 'wck_unserialized_page_callback' );
}

/**
 * Function callback for the unserilized page
 */
function wck_unserialized_page_callback(){

	/* set number of posts that are processed in a batch !IMPORTANT IT IS ALSO SET IN THE wck_cfc_process_unserialized_batch() FUNCTION */
	$per_batch = 30;
	$step    = isset( $_GET['step'] )        			? absint( $_GET['step'] )   : 0;
	$total   = isset( $_GET['total'] )       			? absint( $_GET['total'] )  : false;
	$finish   = isset( $_GET['wckbatch-complete'] ) 	? sanitize_text_field( $_GET['wckbatch-complete'] )  : false;
	$processed = round( ( $step * $per_batch ), 0 );
	if( $processed > $total )
		$processed = $total;
	?>
	<div class="wrap">
		<h2><?php esc_html_e( 'Processing Unserialized Fields', 'wck' ); ?></h2>

		<?php if( !$finish ): ?>
			<div id="wck-unserialized-processing">
				<p><?php esc_html_e( 'The process has started, please be patient. This could take several minutes. You will be automatically redirected when the process is finished.', 'wck' ); ?></p>
				<?php if( ! empty( $total ) ) : ?>
					<p><strong><?php echo esc_html( sprintf( __( '%d posts of %d processed', 'wck' ), $processed, $total ) ); ?></strong></p>
				<?php endif; ?>
			</div>
			<script type="text/javascript">
				document.location.href = "edit.php?action=wck_unbatch_process&step=<?php echo esc_js( $step ); ?>&total=<?php echo esc_js( $total ); ?>&_wpnonce=<?php echo esc_js( wp_create_nonce( 'wck-unbatch-nonce' ) ); ?>";
			</script>
		<?php else: ?>
			<p><?php esc_html_e( 'The process has finished.', 'wck' ); ?></p>
			<?php update_option( 'wck_update_to_unserialized', 'no' )  ?>
		<?php endif; ?>
	</div>
	<?php
}

/**
 * hook to process each bach on the admin_init
 */
add_action( 'admin_init', 'wck_cfc_process_unserialized_batch' );

/**
 * the function that process each batch
 */
function wck_cfc_process_unserialized_batch() {

	if( empty( $_REQUEST['action'] ) || 'wck_unbatch_process' !== $_REQUEST['action'] ) {
		return;
	}

	if( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	if( !isset( $_GET['_wpnonce'] ) || ! wp_verify_nonce( sanitize_text_field( $_GET['_wpnonce'] ), 'wck-unbatch-nonce' ) ) {
		return;
	}

	ignore_user_abort( true );
	@set_time_limit( 0 );

	/* set number of posts that are processed in a batch !IMPORTANT IT IS ALSO SET IN THE wck_unserialized_page_callback() FUNCTION */
	$per_batch = 30;
	$step  = isset( $_GET['step'] )  ? absint( $_GET['step'] )  : 0;
	$total = isset( $_GET['total'] ) ? absint( $_GET['total'] ) : false;

	/* an array with the post types that have metaboxes */
	$post_types_with_metaboxes = array();
	/* an array that contains all the existing meta names */
	$meta_names = array();

	/* get all metaboxes */
	$args = array(
		'posts_per_page' => -1,
		'numberposts' => -1,
		'post_type' => 'wck-meta-box',
		'post_status' => 'any'
	);
	$meta_boxes = get_posts( $args );
	if( !empty( $meta_boxes ) ){
		foreach( $meta_boxes as $meta_box ){
			$cfc_args = get_post_meta( $meta_box->ID, 'wck_cfc_args', true );
			$meta_names[] = $cfc_args[0]['meta-name'];
			if( !in_array( $cfc_args[0]['post-type'], $post_types_with_metaboxes ) ){
				$post_types_with_metaboxes[] = $cfc_args[0]['post-type'];
			}
		}
	}

	/* if we don't have a total let's count the posts */
	if( empty( $total ) || $total <= 1 ){
		$total = 0;
		if( !empty( $post_types_with_metaboxes ) ){
			foreach( $post_types_with_metaboxes as $post_type ){
				$posts_count = wp_count_posts( $post_type );
				$posts_count = array_sum( get_object_vars( $posts_count ) );
				$total += $posts_count;
			}
		}
	}


	global $wpdb;
	/* turn the arrays into strings to use in mysql */
	$post_types_with_metaboxes = join( "','", $post_types_with_metaboxes );
	$meta_names = join( "','", $meta_names );
	$offset = $step*$per_batch;
	/* mysql query to get all post ids that potentially have meta boxes on them */
	$posts = $wpdb->get_results( "SELECT ID FROM $wpdb->posts	WHERE post_type IN ('$post_types_with_metaboxes') LIMIT $per_batch OFFSET $offset" );

	/* go through all the post ids */
	if( $posts ) {
		foreach( $posts as $post ) {
			/* get all the meta names associated to the post id */
			$meta_boxes = $wpdb->get_results( "SELECT meta_value,meta_key FROM $wpdb->postmeta	WHERE post_id = '$post->ID' AND meta_key IN ('$meta_names')", ARRAY_A );
			/* transform them in unserialized */
			if( !empty( $meta_boxes ) ){
				foreach( $meta_boxes as $meta_box ){
					if( !empty( $meta_box ) ){
						$meta_value = $meta_box['meta_value'];
						$meta_value = maybe_unserialize( $meta_value );
						foreach( $meta_value as $key => $values ){
							if( !empty( $values ) ){
								foreach( $values as $meta_key => $value ){
									if( $key == 0 )
										$suffix = '';
									else
										$suffix = '_'.$key;
									/* check to see if we already have a meta name like this from the old structure to avoid conflicts */
									$meta_key = Wordpress_Creation_Kit::wck_generate_unique_meta_name_for_unserialized_field( $post->ID, $meta_key, $meta_box['meta_key'] );
									update_post_meta( $post->ID, $meta_key.$suffix, $value );
								}
							}
						}
					}
				}
			}
		}

		// comments found so delete them
		$step++;
		$redirect = add_query_arg( array(
			'page'   => 'wck-unserialized',
			'step'   => $step,
			'total'  => $total
		), admin_url( 'admin.php' ) );
		wp_redirect( $redirect ); exit;

	} else {
		// No more comments found, finish up
		wp_redirect( admin_url( 'admin.php?page=wck-unserialized&wckbatch-complete=true' ) ); exit;
	}
}

/* save all the metaboxes id's in an option when we first load the plugin and we don not have the option yet */
add_action( 'init', 'wck_init_save_meta_boxes' );
function wck_init_save_meta_boxes(){
	$wck_meta_boxes_ids = get_option( 'wck_meta_boxes_ids', null );
	if( is_null( $wck_meta_boxes_ids ) ){
		$args = array(
			'posts_per_page' => -1,
			'numberposts' => -1,
			'post_type' => 'wck-meta-box',
			'post_status' => 'any'
		);
		$meta_boxes = get_posts( $args );
		$wck_meta_boxes_ids = array();
		if( !empty( $meta_boxes ) ){
			foreach( $meta_boxes as $meta_box ){
				$wck_meta_boxes_ids[] = $meta_box->ID;
			}
		}
		update_option( 'wck_meta_boxes_ids', $wck_meta_boxes_ids );
	}
}

/* when adding a new metabox or deleting one make the changes in the option */
add_action( 'wp_insert_post', 'wck_cpt_save_meta_boxes_ids', 10, 1 );
add_action( 'before_delete_post', 'wck_cpt_save_meta_boxes_ids' );
function wck_cpt_save_meta_boxes_ids( $post_id ){
	// We check if the global post type isn't ours and just return
	global $post_type;
	if ( $post_type != 'wck-meta-box' ) return;

	$wck_meta_boxes_ids = get_option( 'wck_meta_boxes_ids', array() );
	if( current_filter() == 'wp_insert_post' ){
		if( !in_array( $post_id, $wck_meta_boxes_ids ) )
			$wck_meta_boxes_ids[] = $post_id;
	}

	if( current_filter() == 'before_delete_post' ){
		if( !empty( $wck_meta_boxes_ids ) ){
			foreach( $wck_meta_boxes_ids as $key => $value ){
				if( $value === $post_id )
					unset( $wck_meta_boxes_ids[$key] );
			}
		}
	}

	update_option( 'wck_meta_boxes_ids', $wck_meta_boxes_ids );
}

/**
 * This filter makes sure that we do not read directly from the serialized field and we reconstruct it from the unserialized fields
 * If there are no unserialized then we return the serialized information
 */
add_filter( "get_post_metadata", 'wck_serialized_update_from_unserialized', 10, 4 );
function wck_serialized_update_from_unserialized( $replace, $object_id, $meta_key, $single){

	/* if we don't have a meta_key don't do anything */
	if( empty( $meta_key )  || $meta_key == 'wck_cfc_args' || $meta_key == 'wck_cfc_fields' )
		return $replace;

	$wck_meta_boxes_ids = get_option( 'wck_meta_boxes_ids', array() );

	if( !empty( $wck_meta_boxes_ids ) ){
		foreach( $wck_meta_boxes_ids as $wck_meta_boxes_id ){
			$cfc_args = get_post_meta( $wck_meta_boxes_id, 'wck_cfc_args', true );

			if( !empty( $cfc_args[0] ) && !empty( $cfc_args[0]['meta-name'] ) && $cfc_args[0]['meta-name'] == $meta_key ){

				/* get all post meta for the post id like it is done in get_post_meta() function  */
				$meta_cache = wp_cache_get($object_id, 'post_meta');
				if ( !$meta_cache ) {
					$meta_cache = update_meta_cache( 'post', array( $object_id ) );
					$meta_cache = $meta_cache[$object_id];
				}

				$replace_with = array();

				$cfc_fields = get_post_meta( $wck_meta_boxes_id, 'wck_cfc_fields', true );
				if( !empty( $cfc_fields ) ){
					foreach ( $cfc_fields as $cfc_field ){

						if( !empty( $cfc_field['field-slug'] ) )
							$slug = $cfc_field['field-slug'];
						else
							$slug = Wordpress_Creation_Kit::wck_generate_slug( $cfc_field['field-title'] );

						/* check to see if we already have a meta name like this from the old structure to avoid conflicts */
						$unserialized_key = Wordpress_Creation_Kit::wck_generate_unique_meta_name_for_unserialized_field( $object_id, $slug, $cfc_args[0]['meta-name'] );

						/* I will limit this to maximum 100 repeater field entries */
						$maximum_repeater_count = apply_filters( 'wck_cfc_maximum_repeater_count', 2000 );

						for( $i=0; $i < $maximum_repeater_count; $i++ ){
							/* search for the unseralized form in the db */
							if( $i == 0 )
								$suffix = '';
							else
								$suffix = '_'.$i;

							if ( isset($meta_cache[$unserialized_key.$suffix]) ) {
								$unserialized_value = maybe_unserialize( $meta_cache[$unserialized_key.$suffix][0] );
								$replace_with[$i][$slug] = $unserialized_value;
							}
						}
					}
				}

				if( !empty( $replace_with ) ){
					$replace_with = array( array( $replace_with ) );

					if ( $single ) {
						return $replace_with[0];
					}
					else
						return $replace_with;
				}
			}
		}
	}

	return $replace;
}

/* make wck meta names protected so they are not saved by custom fields */
add_filter( 'is_protected_meta', 'wck_cfc_protect_meta_keys', 10, 3 );
function wck_cfc_protect_meta_keys( $protected, $meta_key, $meta_type ){
	global $wck_objects, $post;

	//they should be available on frontend and customizer
	if( is_customize_preview() || !is_admin() ){
		return $protected;
	}

	if( !empty( $wck_objects ) ){
		foreach( $wck_objects as $wck_object ){
			if( !empty( $wck_object['meta_array'] ) ){
				foreach ( $wck_object['meta_array'] as $field ){
					$field_meta_key = Wordpress_Creation_Kit::wck_generate_slug( $field['title'], $field );
					/* take care of suffixes with pregmatch and we could also have the group name as a prefix to be unique */
					if ( $meta_key == $field_meta_key || preg_match( '/'.$field_meta_key.'_\d+\z/', $meta_key ) || $meta_key == $wck_object['meta_name'].'_'.$field_meta_key || preg_match( '/'.$wck_object['meta_name'].'_'.$field_meta_key.'_\d+\z/', $meta_key ) )
						return true;
				}
			}
		}
	}
	return $protected;
}
?>
