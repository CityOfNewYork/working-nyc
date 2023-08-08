<?php
/* Creates Custom Post Types for WordPress */


$args = array(
    'page_title'  => __( 'WCK Post Type Creator', 'wck' ),
    'menu_title'  => __( 'Post Type Creator', 'wck' ),
    'capability'  => 'edit_theme_options',
    'menu_slug'   => 'cptc-page',
    'page_type'   => 'submenu_page',
    'parent_slug' => 'wck-page',
    'priority'    => 8,
    'page_icon'   => plugins_url('/images/wck-32x32.png', __FILE__)
);
$cptc_page = new WCK_Page_Creator( $args );


/* Add Scripts */
add_action('admin_enqueue_scripts', 'wck_cptc_print_scripts' );
function wck_cptc_print_scripts($hook){
    if( 'wck_page_cptc-page' == $hook ){
        wp_register_style('wck-cptc-css', plugins_url('/css/wck-cptc.css', __FILE__));
        wp_enqueue_style('wck-cptc-css');
    }
}

/* create the meta box only for admins ( 'capability' => 'edit_theme_options' ) */
add_action( 'init', 'wck_cptc_create_box', 11 );
function wck_cptc_create_box(){
    global $wp_version;
    if( is_admin() && current_user_can( 'edit_theme_options' ) ){
        /* get registered taxonomies */
        $args = array(
            'public'   => true
        );
        $output = 'objects';
        $taxonomies = get_taxonomies($args,$output);
        $taxonomie_names = array();

        if( !empty( $taxonomies ) ){
            foreach ($taxonomies  as $taxonomie ) {
                if ( $taxonomie->name != 'nav_menu' && $taxonomie->name != 'post_format')
                    $taxonomie_names[] = $taxonomie->name;
            }
        }

        /* set up the fields array */
        $cpt_creation_fields = array(
            array( 'type' => 'text', 'title' => __( 'Post type', 'wck' ), 'slug' => 'post-type', 'description' => __( '(max. 20 characters, can not contain capital letters, hyphens, or spaces)', 'wck' ), 'required' => true ),
            array( 'type' => 'textarea', 'title' => __( 'Description', 'wck' ), 'slug' => 'description', 'description' => __( 'A short descriptive summary of what the post type is.', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Singular Label', 'wck' ), 'slug' => 'singular-label', 'required' => true, 'description' => __( 'ex. Book', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Plural Label', 'wck' ), 'slug' => 'plural-label', 'required' => true, 'description' => __( 'ex. Books', 'wck' ) ),
            array( 'type' => 'select', 'title' => __( 'Hierarchical', 'wck' ), 'slug' => 'hierarchical', 'options' => array( 'false', 'true' ), 'default' => 'false', 'description' => __( 'Whether the post type is hierarchical. Allows Parent to be specified.', 'wck' ) ),
            array( 'type' => 'select', 'title' => __( 'Has Archive', 'wck' ), 'slug' => 'has-archive', 'options' => array( 'false', 'true' ), 'default' => 'false', 'description' => __( 'Enables post type archives. Will use string as archive slug. Will generate the proper rewrite rules if rewrite is enabled.', 'wck' ) ),
            array( 'type' => 'checkbox', 'title' => __( 'Supports', 'wck' ), 'slug' => 'supports', 'options' => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'trackbacks', 'custom-fields', 'comments', 'revisions', 'page-attributes', 'post-formats' ), 'default' =>'title, editor' ),


            array( 'type' => 'text', 'title' => __( 'Add New', 'wck' ), 'slug' => 'add-new', 'description' => __( 'ex. Add New', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Add New Item', 'wck' ), 'slug' => 'add-new-item', 'description' => __( 'ex. Add New Book', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Edit Item', 'wck' ), 'slug' => 'edit-item', 'description' => __( 'ex. Edit Book', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'New Item', 'wck' ), 'slug' => 'new-item', 'description' => __( 'ex. New Book', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'All Items', 'wck' ), 'slug' => 'all-items', 'description' => __( 'ex. All Books', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'View Items', 'wck' ), 'slug' => 'view-items', 'description' => __( 'ex. View Books', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Search Items', 'wck' ), 'slug' => 'search-items', 'description' => __( 'ex. Search Books', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Not Found', 'wck' ), 'slug' => 'not-found', 'description' => __( 'ex. No Books Found', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Not Found In Trash', 'wck' ), 'slug' => 'not-found-in-trash', 'description' => __( 'ex. No Books found in Trash', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Parent Item Colon', 'wck' ), 'slug' => 'parent-item-colon', 'description' => __( 'the parent text. This string isn\'t used on non-hierarchical types. In hierarchical ones the default is Parent Page ', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Menu Name', 'wck' ), 'slug' => 'menu-name' ),
        );

        if( version_compare( $wp_version, '4.3', '>=' ) ) {
            $labels_v43 = array(
                array( 'type' => 'text', 'title' => __( 'Featured Image', 'wck' ), 'slug' => 'featured_image', 'description' => __( 'ex. Featured Image', 'wck' ) ),
                array( 'type' => 'text', 'title' => __( 'Set Featured Image', 'wck' ), 'slug' => 'set_featured_image', 'description' => __( 'ex. Set Featured Image', 'wck' ) ),
                array( 'type' => 'text', 'title' => __( 'Remove Featured Image', 'wck' ), 'slug' => 'remove_featured_image', 'description' => __( 'ex. Remove Featured Image', 'wck' ) ),
                array( 'type' => 'text', 'title' => __( 'Use Featured Image', 'wck' ), 'slug' => 'use_featured_image', 'description' => __( 'ex. Use Featured Image', 'wck' ) )
            );

            foreach( $labels_v43 as $label_v43 ) {
                array_push( $cpt_creation_fields, $label_v43 );
            }
        }

        if( version_compare( $wp_version, '4.4', '>=' ) ) {
            $labels_v44 = array(
                array( 'type' => 'text', 'title' => __( 'Archives', 'wck' ), 'slug' => 'archives', 'description' => __( 'ex. Archives', 'wck' ) ),
                array( 'type' => 'text', 'title' => __( 'Inser Into Item', 'wck' ), 'slug' => 'insert_into_item', 'description' => __( 'ex. Inser Into Item', 'wck' ) ),
                array( 'type' => 'text', 'title' => __( 'Uploaded to this Item', 'wck' ), 'slug' => 'uploaded_to_this_item', 'description' => __( 'ex. Uploaded to this Item', 'wck' ) ),
                array( 'type' => 'text', 'title' => __( 'Filter Items List', 'wck' ), 'slug' => 'filter_items_list', 'description' => __( 'ex. Filter Items List', 'wck' ) ),
                array( 'type' => 'text', 'title' => __( 'Items List Navigation', 'wck' ), 'slug' => 'items_list_navigation', 'description' => __( 'ex. Items List Navigation', 'wck' ) ),
                array( 'type' => 'text', 'title' => __( 'Items List', 'wck' ), 'slug' => 'items_list', 'description' => __( 'ex. Items List', 'wck' ) ),
            );

            foreach( $labels_v44 as $label_v44 ) {
                array_push( $cpt_creation_fields, $label_v44 );
            }
        }

        $cpt_creation_fields2 = array(
            array( 'type' => 'select', 'title' => __( 'Public', 'wck' ), 'slug' => 'public', 'options' => array( 'false', 'true' ), 'default' => 'true', 'description' => __( 'Meta argument used to define default values for publicly_queriable, show_ui, show_in_nav_menus and exclude_from_search', 'wck' ) ),
            array( 'type' => 'select', 'title' => __( 'Show UI', 'wck' ), 'slug' => 'show-ui', 'options' => array( 'false', 'true' ), 'default' => 'true', 'description' => __( 'Whether to generate a default UI for managing this post type.', 'wck' ) ),
            array( 'type' => 'select', 'title' => __( 'Show In Nav Menus', 'wck' ), 'slug' => 'show-in-nav-menus', 'options' => array( 'false', 'true' ), 'default' => 'true', 'description' => __( 'Whether post_type is available for selection in navigation menus.', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Show In Menu', 'wck' ), 'slug' => 'show-in-menu', 'default' => 'true', 'description' => __( 'Whether to show the post type in the admin menu. show_ui must be true. "false" - do not display in the admin menu, "true" - display as a top level menu, "some string" - If an existing top level page such as "tools.php" or "edit.php?post_type=page", the post type will be placed as a sub menu of that.', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Menu Position', 'wck' ), 'slug' => 'menu-position', 'description' => __( 'The position in the menu order the post type should appear.', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Menu Icon', 'wck' ), 'slug' => 'menu-icon', 'description' => __( 'The url to the icon to be used for this menu.', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Capability Type', 'wck' ), 'slug' => 'capability-type', 'description' => __( 'The string to use to build the read, edit, and delete capabilities.', 'wck' ), 'default' => 'post' ),
            array( 'type' => 'checkbox', 'title' => __( 'Taxonomies', 'wck' ), 'slug' => 'taxonomies', 'options' => $taxonomie_names ),
            array( 'type' => 'select', 'title' => __( 'Rewrite', 'wck' ), 'slug' => 'rewrite', 'options' => array( 'false', 'true' ), 'default' => 'true', 'description' => __( 'Rewrite permalinks.', 'wck' ) ),
            array( 'type' => 'select', 'title' => __( 'With Front', 'wck' ), 'slug' => 'with_front', 'options' => array( 'true', 'false' ), 'default' => 'true', 'description' => __( 'Use the defined base for permalinks.', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Rewrite Slug', 'wck' ), 'slug' => 'rewrite-slug', 'description' => __( 'Defaults to post type name.', 'wck' ) ),
            array( 'type' => 'select', 'title' => __( 'Show in REST API', 'wck'), 'slug' => 'show-in-rest', 'options' => array( 'false', 'true'), 'default' => 'false', 'description' => __('Make this post type available via WP REST API ', 'wck' ) )
        );

        foreach( $cpt_creation_fields2 as $cpt_creation_field ) {
            array_push( $cpt_creation_fields, $cpt_creation_field );
        }

        /* set up the box arguments */
        $args = array(
            'metabox_id'    => 'option_page',
            'metabox_title' => __( 'Custom Post Type Creation', 'wck' ),
            'post_type'     => 'cptc-page',
            'meta_name'     => 'wck_cptc',
            'meta_array'    => $cpt_creation_fields,
            'context'       => 'option',
            'sortable'      => false
        );

        /* create the box */
        new Wordpress_Creation_Kit( $args );
    }
}

/* hook to create custom post types */
add_action( 'init', 'wck_cptc_create_cpts', 8 );

function wck_cptc_create_cpts(){
    global $wp_version;

    $cpts = get_option('wck_cptc');

    if( !empty( $cpts ) ){
        foreach( $cpts as $cpt ){

            $labels = array(
                'name'               => _x( $cpt['plural-label'], 'post type general name', "wck"), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'singular_name'      => _x( $cpt['singular-label'], 'post type singular name', "wck"), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'add_new'            => _x( $cpt['add-new'] ? $cpt['add-new'] : 'Add New', 'post type label', "wck" ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'add_new_item'       => __( $cpt['add-new-item'] ? $cpt['add-new-item'] : "Add New ".$cpt['singular-label'], "wck"), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'edit_item'          => __( $cpt['edit-item'] ? $cpt['edit-item'] : "Edit ".$cpt['singular-label'], 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'new_item'           => __( $cpt['new-item'] ? $cpt['new-item'] : "New ".$cpt['singular-label'], 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'all_items'          => __( $cpt['all-items'] ? $cpt['all-items'] : "All ".$cpt['plural-label'] , 'wck'), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'view_item'          => __( !empty( $cpt['view-item'] ) ? $cpt['view-item'] : "View ".$cpt['singular-label'] , 'wck'), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'search_items'       => __( $cpt['search-items'] ? $cpt['search-items'] : "Search ".$cpt['plural-label'], 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'not_found'          => __( $cpt['not-found'] ? $cpt['not-found'] : "No ". strtolower( $cpt['plural-label'] ) ." found", 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'not_found_in_trash' => __( $cpt['not-found-in-trash'] ? $cpt['not-found-in-trash'] :  "No ". strtolower( $cpt['plural-label'] ) ." found in Trash", 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'parent_item_colon'  => __( !empty( $cpt['parent-item-colon'] ) ? $cpt['parent-item-colon'] :  "Parent Page", 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'menu_name'          => $cpt['menu-name'] ? $cpt['menu-name'] : $cpt['plural-label']
            );

            if( version_compare( $wp_version, '4.3', '>=' ) ) {
                $labels_v43 = array(
                    'featured_image'        => __( !empty( $cpt['featured_image'] ) ? $cpt['featured_image'] : "Featured Image", "wck" ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                    'set_featured_image'    => __( !empty( $cpt['set_featured_image'] ) ? $cpt['set_featured_image'] : "Set featured image", "wck" ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                    'remove_featured_image' => __( !empty( $cpt['remove_featured_image'] ) ? $cpt['remove_featured_image'] : "Remove featured image", "wck" ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                    'use_featured_image'    => __( !empty( $cpt['use_featured_image'] ) ? $cpt['use_featured_image'] : "Use as featured image", "wck" ) //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                );

                foreach( $labels_v43 as $label_v43 ) {
                    array_push( $labels, $label_v43 );
                }
            }

            if( version_compare( $wp_version, '4.4', '>=' ) ) {
                $labels_v44 = array(
                    'archives'              => __( !empty( $cpt['archives'] ) ? $cpt['archives'] : $cpt['singular-label'] . " Archives", "wck" ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                    'insert_into_item'      => __( !empty( $cpt['insert_into_item'] ) ? $cpt['insert_into_item'] : "Insert Into " . $cpt['singular-label'], "wck" ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                    'uploaded_to_this_item' => __( !empty( $cpt['uploaded_to_this_item'] ) ? $cpt['uploaded_to_this_item'] : "Uploaded to this " . $cpt['singular-label'], "wck" ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                    'filter_items_list'     => __( !empty( $cpt['filter_items_list'] ) ? $cpt['filter_items_list'] : "Filter Items List", "wck" ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                    'items_list_navigation' => __( !empty( $cpt['items_list_navigation'] ) ? $cpt['items_list_navigation'] : "Items List Navigation", "wck" ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                    'items_list'            => __( !empty( $cpt['items_list'] ) ? $cpt['items_list'] : "Items List", "wck" ) //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                );

                foreach( $labels_v44 as $label_v44 ) {
                    array_push( $labels, $label_v44 );
                }
            }

            $args = array(
                'labels'            => $labels,
                'public'            => $cpt['public'] == 'false' ? false : true,
                'description'       => $cpt['description'],
                'show_ui'           => $cpt['show-ui'] == 'false' ? false : true,
                'show_in_nav_menus' => !empty( $cpt['show-in-nav-menus'] ) && $cpt['show-in-nav-menus'] == 'false' ? false : true,
                'has_archive'       => $cpt['has-archive'] == 'false' ? false : true,
                'hierarchical'      => $cpt['hierarchical'] == 'false' ? false : true,
                'supports'          => explode( ', ', $cpt['supports'] ),
                'show_in_rest'      => !empty($cpt['show-in-rest']) ? $cpt['show-in-rest'] : false,
            );

            if( !empty( $cpt['show-in-menu'] ) ){
                $args['show_in_menu'] = $cpt['show-in-menu'] == 'true' ? true : $cpt['show-in-menu'];
            }

            if( !empty( $cpt['menu-position'] ) )
                $args['menu_position'] = intval( $cpt['menu-position'] );

            if( has_filter( "wck_cptc_capabilities_{$cpt['post-type']}" ) )
                $args['capabilities'] = apply_filters( "wck_cptc_capabilities_{$cpt['post-type']}", $cpt['capability-type'] );
            else
                $args['capability_type'] = $cpt['capability-type'];

            if( !empty( $cpt['taxonomies'] ) )
                $args['taxonomies'] = explode( ', ', $cpt['taxonomies'] );

            if( !empty( $cpt['menu-icon'] ) )
                $args['menu_icon'] = $cpt['menu-icon'];

            if( $cpt['rewrite'] == 'false' )
                $args['rewrite'] = $cpt['rewrite'] == 'false' ? false : true;
            else{
                $rewrite_array = array();

                if( !empty( $cpt['rewrite-slug'] ) )
                    $rewrite_array['slug'] = $cpt['rewrite-slug'];

                if( !empty( $cpt['with_front'] ) && $cpt['with_front'] == 'false' )
                    $rewrite_array['with_front'] = false;

                if ( count( $rewrite_array ) > 0 ) {
                    $args['rewrite'] = $rewrite_array;
                }
            }

            register_post_type( $cpt['post-type'], apply_filters( 'wck_cptc_register_post_type_args', $args, $cpt['post-type'] ) );
        }
    }
}

/* Flush rewrite rules */
add_action('init', 'cptc_flush_rules', 20);
function cptc_flush_rules(){
    if( isset( $_GET['page'] ) && $_GET['page'] === 'cptc-page' && isset( $_GET['updated'] ) && $_GET['updated'] === 'true' )
        flush_rewrite_rules( false  );
}

/* advanced labels container for add form */
add_action( "wck_before_add_form_wck_cptc_element_7", 'wck_cptc_form_label_wrapper_start' );
function wck_cptc_form_label_wrapper_start(){
    echo '<li><a href="javascript:void(0)" onclick="jQuery(\'#cptc-advanced-label-options-container\').toggle(); if( jQuery(this).text() == \''. esc_html__( 'Show Advanced Label Options', 'wck' ) .'\' ) jQuery(this).text(\''. esc_html__( 'Hide Advanced Label Options', 'wck' ) .'\');  else if( jQuery(this).text() == \''. esc_html__( 'Hide Advanced Label Options', 'wck' ) .'\' ) jQuery(this).text(\''. esc_html__( 'Show Advanced Label Options', 'wck' ) .'\');">'. esc_html__('Show Advanced Label Options', 'wck' ) .'</a></li>';
    echo '<li id="cptc-advanced-label-options-container" style="display:none;"><ul>';
}

add_action( "wck_after_add_form_wck_cptc_element_27", 'wck_cptc_form_label_wrapper_end' );
function wck_cptc_form_label_wrapper_end(){
    echo '</ul></li>';
}

/* advanced options container for add form */
add_action( "wck_before_add_form_wck_cptc_element_28", 'wck_cptc_form_wrapper_start' );
function wck_cptc_form_wrapper_start(){
    echo '<li><a href="javascript:void(0)" onclick="jQuery(\'#cptc-advanced-options-container\').toggle(); if( jQuery(this).text() == \''. esc_html__('Show Advanced Options', 'wck' ) .'\' ) jQuery(this).text(\'Hide Advanced Options\');  else if( jQuery(this).text() == \''. esc_html__('Hide Advanced Options', 'wck' ) .'\' ) jQuery(this).text(\''. esc_html__('Show Advanced Options', 'wck' ) .'\');">'. esc_html__('Show Advanced Options', 'wck' ) .'</a></li>';
    echo '<li id="cptc-advanced-options-container" style="display:none;"><ul>';
}

add_action( "wck_after_add_form_wck_cptc_element_38", 'wck_cptc_form_wrapper_end' );
function wck_cptc_form_wrapper_end(){
    echo '</ul></li>';
}

/* advanced label options container for update form */
add_filter( "wck_before_update_form_wck_cptc_element_7", 'wck_cptc_update_form_label_wrapper_start', 10, 2 );
function wck_cptc_update_form_label_wrapper_start( $form, $i ){
    $form .=  '<li><a href="javascript:void(0)" onclick="jQuery(\'#cptc-advanced-label-options-update-container-'.$i.'\').toggle(); if( jQuery(this).text() == \''. __( 'Show Advanced Label Options', 'wck' ) .'\' ) jQuery(this).text(\''. __( 'Hide Advanced Label Options', 'wck' ) .'\');  else if( jQuery(this).text() == \''. __( 'Hide Advanced Label Options', 'wck' ) .'\' ) jQuery(this).text(\''. __( 'Show Advanced Label Options', 'wck' ) .'\');">'. __( 'Show Advanced Label Options', 'wck' ) .'</a></li>';
    $form .= '<li id="cptc-advanced-label-options-update-container-'.$i.'" style="display:none;"><ul>';
    return $form;
}

add_filter( "wck_after_update_form_wck_cptc_element_27", 'wck_cptc_update_form_label_wrapper_end', 10, 2 );
function wck_cptc_update_form_label_wrapper_end( $form, $i ){
    $form .=  '</ul></li>';
    return $form;
}

/* advanced options container for update form */
add_filter( "wck_before_update_form_wck_cptc_element_28", 'wck_cptc_update_form_wrapper_start', 10, 2 );
function wck_cptc_update_form_wrapper_start( $form, $i ){
    $form .=  '<li><a href="javascript:void(0)" onclick="jQuery(\'#cptc-advanced-options-update-container-'.$i.'\').toggle(); if( jQuery(this).text() == \''. __( 'Show Advanced Options', 'wck' ) .'\' ) jQuery(this).text(\''. __( 'Hide Advanced Options', 'wck' ) .'\');  else if( jQuery(this).text() == \''. __( 'Hide Advanced Options', 'wck' ) .'\' ) jQuery(this).text(\''. __( 'Show Advanced Options', 'wck' ) .'\');">'. __( 'Show Advanced Options', 'wck' ) .'</a></li>';
    $form .= '<li id="cptc-advanced-options-update-container-'.$i.'" style="display:none;"><ul>';
    return $form;
}

add_filter( "wck_after_update_form_wck_cptc_element_38", 'wck_cptc_update_form_wrapper_end', 10, 2 );
function wck_cptc_update_form_wrapper_end( $form, $i ){
    $form .=  '</ul></li>';
    return $form;
}


/* advanced label options container for display */
add_filter( "wck_before_listed_wck_cptc_element_7", 'wck_cptc_display_label_wrapper_start', 10, 2 );
function wck_cptc_display_label_wrapper_start( $form, $i ){
    $form .=  '<li><a href="javascript:void(0)" onclick="jQuery(\'#cptc-advanced-label-options-display-container-'.$i.'\').toggle(); if( jQuery(this).text() == \''. __( 'Show Advanced Labels', 'wck' ) .'\' ) jQuery(this).text(\''. __( 'Hide Advanced Labels', 'wck' ) .'\');  else if( jQuery(this).text() == \''. __( 'Hide Advanced Labels', 'wck' ) .'\' ) jQuery(this).text(\''. __( 'Show Advanced Labels', 'wck' ) .'\');">'. __( 'Show Advanced Labels', 'wck' ) .'</a></li>';
    $form .= '<li id="cptc-advanced-label-options-display-container-'.$i.'" style="display:none;"><ul>';
    return $form;
}

add_filter( "wck_after_listed_wck_cptc_element_27", 'wck_cptc_display_label_wrapper_end', 10, 2 );
function wck_cptc_display_label_wrapper_end( $form, $i ){
    $form .=  '</ul></li>';
    return $form;
}

/* advanced options container for display */
add_filter( "wck_before_listed_wck_cptc_element_28", 'wck_cptc_display_adv_wrapper_start', 10, 2 );
function wck_cptc_display_adv_wrapper_start( $form, $i ){
    $form .=  '<li><a href="javascript:void(0)" onclick="jQuery(\'#cptc-advanced-options-display-container-'.$i.'\').toggle(); if( jQuery(this).text() == \''. __( 'Show Advanced Options', 'wck' ) .'\' ) jQuery(this).text(\''. __( 'Hide Advanced Options', 'wck' ) .'\');  else if( jQuery(this).text() == \''. __( 'Hide Advanced Options', 'wck' ) .'\' ) jQuery(this).text(\''. __( 'Show Advanced Options', 'wck' ) .'\');">'. __( 'Show Advanced Options', 'wck' ) .'</a></li>';
    $form .= '<li id="cptc-advanced-options-display-container-'.$i.'" style="display:none;"><ul>';
    return $form;
}

add_filter( "wck_after_listed_wck_cptc_element_38", 'wck_cptc_display_adv_wrapper_end', 10, 2 );
function wck_cptc_display_adv_wrapper_end( $form, $i ){
    $form .=  '</ul></li>';
    return $form;
}

/* add refresh to page */
add_action("wck_refresh_list_wck_cptc", "wck_cptc_after_refresh_list");
add_action("wck_refresh_entry_wck_cptc", "wck_cptc_after_refresh_list");
function wck_cptc_after_refresh_list(){
    echo '<script type="text/javascript">window.location="'. esc_url_raw( get_admin_url() ) . 'admin.php?page=cptc-page&updated=true' .'";</script>';
}

/* Add side metaboxes */
if( !file_exists( dirname(__FILE__).'/wck-stp.php' ) ) {
    add_action('add_meta_boxes', 'wck_cptc_add_side_boxes');
    function wck_cptc_add_side_boxes()
    {
        add_meta_box('wck-cptc-side', __('Wordpress Creation Kit', 'wck'), 'wck_cptc_side_box_one', 'wck_page_cptc-page', 'side', 'high');
    }

    function wck_cptc_side_box_one()
    {
        ?>
        <a href="http://www.cozmoslabs.com/wck-custom-fields-custom-post-types-plugin/?utm_source=wpbackend&utm_medium=clientsite&utm_campaign=WCKFree"><img
                    src="<?php echo esc_url( plugins_url('/images/banner_pro.png', __FILE__) ) ?>?v=1" width="254" height="448"
                    alt="WCK-PRO"/></a>
        <?php
    }
}

/* add TranslatePress crosspromotion */
add_action('add_meta_boxes', 'wck_cptc_add_trp_side_box');
function wck_cptc_add_trp_side_box()
{
    add_meta_box('wck-cptc-side-trp', __('TranslatePress', 'wck'), 'wck_cptc_side_box_trp', 'wck_page_cptc-page', 'side', 'low');
}

function wck_cptc_side_box_trp()
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
add_action('load-wck_page_cptc-page', 'wck_cptc_help');

function wck_cptc_help () {
    $screen = get_current_screen();

    /*
     * Check if current screen is wck_page_cptc-page
     * Don't add help tab if it's not
     */
    if ( $screen->id != 'wck_page_cptc-page' )
        return;

    // Add help tabs
    $screen->add_help_tab( array(
        'id'	=> 'wck_cptc_overview',
        'title'	=> __('Overview', 'wck' ),
        'content'	=> '<p>' . __( 'WCK Custom Post Type Creator allows you to easily create custom post types for Wordpress without any programming knowledge.<br />Most of the common options for creating a post type are displayed by default while the advanced options and label are just one click away.', 'wck' ) . '</p>',
    ) );

    $screen->add_help_tab( array(
        'id'	=> 'wck_cptc_labels',
        'title'	=> __( 'Labels', 'wck' ),
        'content'	=> '<p>' . __( 'For simplicity you are required to introduce only the Singular Label and Plural Label from wchich the rest of the labels will be formed.<br />For a more detailed control of the labels you just have to click the "Show Advanced Label Options" link and all the availabel labels will be displayed.', 'wck' ) . '</p>',
    ) );

    $screen->add_help_tab( array(
        'id'	=> 'wck_cptc_advanced',
        'title'	=> __('Advanced Options', 'wck' ),
        'content'	=> '<p>' . __( 'The Advanced Options are set to the most common defaults for custom post types. To display them click the "Show Advanced Options" link.', 'wck' ) . '</p>',
    ) );
}

add_action( 'init', 'wck_cpt_make_sure_thumbnail_support_works', 11 );
function wck_cpt_make_sure_thumbnail_support_works(){
    global $_wp_theme_features;

    if( isset( $_wp_theme_features["post-thumbnails"] ) && is_array( $_wp_theme_features["post-thumbnails"] ) ){
        $post_types_with_thumbnails = $_wp_theme_features["post-thumbnails"][0];

        $cpts = get_option('wck_cptc');
        if( !empty( $cpts ) ) {
            foreach ($cpts as $cpt) {
                $cpt_supports = explode( ', ', $cpt['supports'] );
                if( in_array( 'thumbnail', $cpt_supports ) ){
                    $post_types_with_thumbnails[] = $cpt['post-type'];
                }
            }
        }

        $_wp_theme_features["post-thumbnails"][0] = $post_types_with_thumbnails;
    }
}

/* when renaming a post type make sure the posts get ported as well */
add_action( 'wck_before_update_meta', 'wck_cptc_update_post_type', 10, 4 );
function wck_cptc_update_post_type( $meta, $id, $values, $element_id ){
    if( $meta == 'wck_cptc' ){
        $old_values = get_option( $meta );
        if( !empty( $old_values[$element_id] ) ){
            if( $old_values[$element_id]['post-type'] != $values['post-type'] ){
                global $wpdb;
                $wpdb->update(
                    $wpdb->posts,
                    array(
                        'post_type' => $values['post-type'],	// string
                    ),
                    array( 'post_type' => $old_values[$element_id]['post-type'] ),
                    array(
                        '%s',
                    )
                );
            }
        }
    }
}

/* Post Type Name Verification */
add_filter( 'wck_required_test_wck_cptc_post-type', 'wck_cptc_check_post_type', 10, 8 );
function wck_cptc_check_post_type( $bool, $value, $post_id, $field, $meta, $fields, $values, $elemet_id ){
    //Make sure it doesn't contain capital letters or spaces
    $no_spaces_value = str_replace(' ', '', $value);
    $no_hyphens_value = str_replace('-', '', $value);
    $lowercase_value = strtolower($value);

    /* make sure it's not reserved and avoid doing this on the update case for backwards compatibility */
    $old_values = get_option( 'wck_cptc' );
    $reserved_vars = array();
    if( empty( $old_values[$elemet_id]['post-type'] ) || $value != $old_values[$elemet_id]['post-type'] )
        $reserved_vars = wck_cpt_get_reserved_names();

    if ( ( $no_spaces_value == $value ) && ( $lowercase_value == $value ) && ( $no_hyphens_value == $value ) && !in_array( $value, $reserved_vars ) )
        $checked = false;
    else
        $checked = true;

    return ( empty($value) || $checked );
}

add_filter( 'wck_required_message_wck_cptc_post-type', 'wck_cptc_change_post_type_message', 10, 3 );
function wck_cptc_change_post_type_message( $message, $value, $required_field ){
    // change error message
    $no_spaces_value = str_replace(' ', '', $value);
    $no_hyphens_value = str_replace('-', '', $value);
    $lowercase_value = strtolower($value);
    $reserved_vars = wck_cpt_get_reserved_names();

    if( empty( $value ) )
        return $message;
    else if( $no_spaces_value != $value )
        return __("Post Type name must not contain any spaces\n", "wck" );
    else if ($lowercase_value != $value)
        return __( "Post Type name must not contain any capital letters\n", "wck" );
    else if ($no_hyphens_value != $value)
        return __( "Post Type name must not contain any hyphens\n", "wck" );
    else if( in_array( $value, $reserved_vars ) )
        return __( "Please chose a different Post Type name as this one is reserved\n", "wck" );
}

function wck_cpt_get_reserved_names(){
    $reserved_vars = Wordpress_Creation_Kit::wck_get_reserved_variable_names();
    /* add to reserved names existing taxonomy slugs created with wck */
    $wck_taxonomies = get_option( 'wck_ctc' );
    if( !empty( $wck_taxonomies ) ){
        foreach ($wck_taxonomies as $wck_taxonomy) {
            $reserved_vars[] = $wck_taxonomy['taxonomy'];
        }
    }

    return $reserved_vars;
}

?>
