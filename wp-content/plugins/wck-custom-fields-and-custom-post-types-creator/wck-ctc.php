<?php
/* Creates Custom Taxonomies for WordPress */

/* Create the CTC Page only for admins ( 'capability' => 'edit_theme_options' ) */
$args = array(
    'page_title' => __( 'WCK Taxonomy Creator', 'wck' ),
    'menu_title' => __( 'Taxonomy Creator', 'wck' ),
    'capability' => 'edit_theme_options',
    'menu_slug' => 'ctc-page',
    'page_type' => 'submenu_page',
    'parent_slug' => 'wck-page',
    'priority' => 9,
    'page_icon' => plugins_url('/images/wck-32x32.png', __FILE__)
);
new WCK_Page_Creator( $args );

/* create the meta box only for admins ( 'capability' => 'edit_theme_options' ) */
add_action( 'init', 'wck_ctc_create_box', 11 );
function wck_ctc_create_box(){
    global $wp_version;
    if( is_admin() && current_user_can( 'edit_theme_options' ) ){
        $args = array(
            'public'   => true
        );
        $output = 'objects'; // or objects
        $post_types = get_post_types($args,$output);
        $post_type_names = array();
        if( !empty( $post_types ) ){
            foreach ( $post_types  as $post_type ) {
                if ( $post_type->name != 'attachment' && $post_type->name != 'wck-meta-box' && $post_type->name != 'wck-frontend-posting' && $post_type->name != 'wck-option-page' && $post_type->name != 'wck-option-field' && $post_type->name != 'wck-swift-template' )
                    $post_type_names[] = $post_type->name;
            }
        }


        $ct_creation_fields = array(
            array( 'type' => 'text', 'title' => __( 'Taxonomy', 'wck' ), 'slug' => 'taxonomy', 'description' => __( '(The name of the taxonomy. Name must not contain capital letters or spaces.)', 'wck' ), 'required' => true ),
            array( 'type' => 'text', 'title' => __( 'Singular Label', 'wck' ), 'slug' => 'singular-label', 'required' => true, 'description' => __( 'ex. Writer', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Plural Label', 'wck' ), 'slug' => 'plural-label', 'required' => true, 'description' => __( 'ex. Writers', 'wck' ) ),
            array( 'type' => 'checkbox', 'title' => __( 'Attach to', 'wck' ), 'slug' => 'attach-to', 'options' => $post_type_names ),
            array( 'type' => 'select', 'title' => __( 'Hierarchical', 'wck' ), 'slug' => 'hierarchical', 'options' => array( 'false', 'true' ), 'default' => 'false', 'description' => __( 'Is this taxonomy hierarchical (have descendants) like categories or not hierarchical like tags.', 'wck' ) ),

            array( 'type' => 'text', 'title' => __( 'Search Items', 'wck' ), 'slug' => 'search-items', 'description' => __( 'ex. Search Writers', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Popular Items', 'wck' ), 'slug' => 'popular-items', 'description' => __( 'ex. Popular Writers', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'All Items', 'wck' ), 'slug' => 'all-items', 'description' => __( 'ex. All Writers', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Parent Item', 'wck' ), 'slug' => 'parent-item', 'description' => __( 'ex. Parent Genre', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Parent Item Colon', 'wck' ), 'slug' => 'parent-item-colon', 'description' => __( 'ex. Parent Genre:', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Edit Item', 'wck' ), 'slug' => 'edit-item', 'description' => __( 'ex. Edit Writer', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Update Item', 'wck' ), 'slug' => 'update-item', 'description' => __( 'ex. Update Writer', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Add New Item', 'wck' ), 'slug' => 'add-new-item', 'description' => __( 'ex. Add New Writer', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'New Item Name', 'wck' ), 'slug' => 'new-item-name', 'description' => __( 'ex. New Writer Name', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Separate Items With Commas', 'wck' ), 'slug' => 'separate-items-with-commas', 'description' => __( 'ex. Separate writers with commas', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Add Or Remove Items', 'wck' ), 'slug' => 'add-or-remove-items', 'description' => __( 'ex. Add or remove writers', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Choose From Most Used', 'wck' ), 'slug' => 'choose-from-most-used', 'description' => __( 'ex. Choose from the most used writers', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Menu Name', 'wck' ), 'slug' => 'menu-name' ),
        );

        if( version_compare( $wp_version, '4.3', '>=' ) ) {
            $label_v43 = array( 'type' => 'text', 'title' => __( 'No Terms', 'wck' ), 'slug' => 'no_terms', 'description' => __( 'ex. No Terms', 'wck' ) );

            array_push( $ct_creation_fields, $label_v43 );
        }

        if( version_compare( $wp_version, '4.4', '>=' ) ) {
            $labels_v44 = array(
                array( 'type' => 'text', 'title' => __( 'Items List Navigation', 'wck' ), 'slug' => 'items_list_navigation', 'description' => __( 'ex. Items List Navigation', 'wck' ) ),
                array( 'type' => 'text', 'title' => __( 'Items List', 'wck' ), 'slug' => 'items_list', 'description' => __( 'ex. Items List', 'wck' ) ),
            );

            foreach( $labels_v44 as $label_v44 ) {
                array_push( $ct_creation_fields, $label_v44 );
            }
        }

        $ct_creation_fields2 = array(
            array( 'type' => 'select', 'title' => __( 'Public', 'wck' ), 'slug' => 'public', 'options' => array( 'false', 'true' ), 'default' => 'true', 'description' => __( 'Meta argument used to define default values for publicly_queriable, show_ui, show_in_nav_menus and exclude_from_search', 'wck' ) ),
            array( 'type' => 'select', 'title' => __( 'Show UI', 'wck' ), 'slug' => 'show-ui', 'options' => array( 'false', 'true' ), 'default' => 'true', 'description' => __( 'Whether to generate a default UI for managing this post type.', 'wck' ) ),
            array( 'type' => 'select', 'title' => __( 'Show Tagcloud', 'wck' ), 'slug' => 'show-tagcloud', 'options' => array( 'false', 'true' ), 'default' => 'true', 'description' => __( 'Whether to allow the Tag Cloud widget to use this taxonomy.', 'wck' ) ),
            array( 'type' => 'select', 'title' => __( 'Show Admin Column', 'wck' ), 'slug' => 'show-admin-column', 'options' => array( 'false', 'true' ), 'default' => 'false', 'description' => __( 'Whether to allow automatic creation of taxonomy columns on associated post-types.', 'wck' ) ),
            array( 'type' => 'select', 'title' => __( 'Sortable Admin Column', 'wck' ), 'slug' => 'sortable-admin-column', 'options' => array( 'false', 'true' ), 'default' => 'false', 'description' => __( 'Whether to make the columns sortable or not. WARNING: on a large number of posts the performance can be severely affected', 'wck' ) ),
            array( 'type' => 'select', 'title' => __( 'Show in Quick Edit', 'wck' ), 'slug' => 'show-in-quick-edit', 'options' => array( 'false', 'true' ), 'default' => 'false', 'description' => __( 'Whether to show the taxonomy in the quick/bulk edit panel.', 'wck' ) ),
            array( 'type' => 'select', 'title' => __( 'Show in REST API', 'wck'), 'slug' => 'show-in-rest', 'options' => array( 'false', 'true'), 'default' => 'false', 'description' => __('Make this taxonomy available via WP REST API ', 'wck' ) ),
            array( 'type' => 'select', 'title' => __( 'Rewrite', 'wck' ), 'slug' => 'rewrite', 'options' => array( 'true', 'false' ), 'default' => 'true', 'description' => __( 'Rewrite permalinks.', 'wck' ) ),
            array( 'type' => 'select', 'title' => __( 'With Front', 'wck' ), 'slug' => 'with_front', 'options' => array( 'true', 'false' ), 'default' => 'true', 'description' => __( 'Use the defined base for permalinks.', 'wck' ) ),
            array( 'type' => 'text', 'title' => __( 'Rewrite Slug', 'wck' ), 'slug' => 'rewrite-slug', 'description' => __( 'Defaults to post type name.', 'wck' ) ),
        );

        foreach( $ct_creation_fields2 as $ct_creation_field ) {
            array_push( $ct_creation_fields, $ct_creation_field );
        }

        $args = array(
            'metabox_id' => 'ctc_creation_box',
            'metabox_title' => __( 'Custom Taxonomy Creation', 'wck' ),
            'post_type' => 'ctc-page',
            'meta_name' => 'wck_ctc',
            'meta_array' => $ct_creation_fields,
            'context' 	=> 'option',
            'sortable' => false
        );


        new Wordpress_Creation_Kit( $args );
    }
}

add_action( 'init', 'wck_ctc_create_taxonomy', 8 );

function wck_ctc_create_taxonomy(){
    global $wp_version;
    $cts = get_option('wck_ctc');
    if( !empty( $cts ) ){
        foreach( $cts as $ct ){

            $labels = array(
                'name' => _x( $ct['plural-label'], 'taxonomy general name', "wck" ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'singular_name' => _x( $ct['singular-label'], 'taxonomy singular name', "wck"), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'search_items' => __( $ct['search-items'] ? $ct['search-items'] : 'Search '.$ct['plural-label'], 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'popular_items' => __( $ct['popular-items'] ? $ct['popular-items'] : "Popular ".$ct['plural-label'], 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'all_items' => __( $ct['all-items'] ? $ct['all-items'] : "All ".$ct['plural-label'], 'wck' ) , //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'parent_item' => __( $ct['parent-item'] ? $ct['parent-item'] : "Parent ".$ct['singular-label'], 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'parent_item_colon' => __( $ct['parent-item-colon'] ? $ct['parent-item-colon'] : "Parent ".$ct['singular-label'].':', 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'edit_item' => __( $ct['edit-item'] ? $ct['edit-item'] : "Edit ".$ct['singular-label'], 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'update_item' => __( $ct['update-item'] ? $ct['update-item'] : "Update ".$ct['singular-label'], 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'add_new_item' =>  __( $ct['add-new-item'] ? $ct['add-new-item'] : "Add New ". $ct['singular-label'], 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'new_item_name' => __( $ct['new-item-name'] ? $ct['new-item-name'] :  "New ". $ct['singular-label']. ' Name', 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'separate_items_with_commas' => __( $ct['separate-items-with-commas'] ? $ct['separate-items-with-commas'] :  "Separate  ". strtolower( $ct['plural-label'] ). ' with commas', 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'add_or_remove_items' => __( $ct['add-or-remove-items'] ? $ct['add-or-remove-items'] : "Add or remove " .strtolower( $ct['plural-label'] ), 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'choose_from_most_used' => __( $ct['choose-from-most-used'] ? $ct['choose-from-most-used'] : "Choose from the most used " .strtolower( $ct['plural-label'] ), 'wck' ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                'menu_name' => $ct['menu-name'] ? $ct['menu-name'] : $ct['plural-label'] //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
            );

            if( version_compare( $wp_version, '4.3', '>=' ) ) {
                $labels_v43 = array( 'no_terms' => __( !empty( $ct['no_terms'] ) ? $ct['no_terms'] : "No Terms", "wck" ) ); //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations

                array_push( $labels, $labels_v43 );
            }

            if( version_compare( $wp_version, '4.4', '>=' ) ) {
                $labels_v44 = array(
                    'items_list_navigation' => __( !empty( $ct['items_list_navigation'] ) ? $ct['items_list_navigation'] : "Items List Navigation", "wck" ), //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                    'items_list' => __( !empty( $ct['items_list'] ) ? $ct['items_list'] : "Items List", "wck" ) //phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText --we want to allow translations
                );

                foreach( $labels_v44 as $label_v44 ) {
                    array_push( $labels, $label_v44 );
                }
            }

            $args = array(
                'labels' => $labels,
                'public' => $ct['public'] == 'false' ? false : true,
                'show_ui' => $ct['show-ui'] == 'false' ? false : true,
                'hierarchical' => $ct['hierarchical'] == 'false' ? false : true,
                'show_tagcloud' => $ct['show-tagcloud'] == 'false' ? false : true,
                'show_in_rest' => !empty($ct['show-in-rest']) ? $ct['show-in-rest'] : false,
                'rewrite' => apply_filters( 'wck_ctc_register_taxonomy_rewrite_arg', true, $ct ),
            );

            if( !empty( $ct['show-admin-column'] ) ){
                $args['show_admin_column'] = $ct['show-admin-column'] == 'false' ? false : true;
            }

            if( !empty( $ct['show-in-quick-edit'] ) ){
                $args['show_in_quick_edit'] = $ct['show-in-quick-edit'] == 'false' ? false : true;
            }

            if( !empty( $ct['attach-to'] ) )
                $object_type = explode( ', ', $ct['attach-to'] );
            else
                $object_type = '';

            if( !empty( $ct['rewrite'] ) ) {
                if ($ct['rewrite'] == 'false') {
                    $args['rewrite'] = $ct['rewrite'] == 'false' ? false : true;
                }
                else {
                    $rewrite_array = array();

                    if( !empty( $ct['rewrite-slug'] ) )
                        $rewrite_array['slug'] = $ct['rewrite-slug'];

                    if( !empty( $ct['with_front']) && $ct['with_front'] == 'false' )
                        $rewrite_array['with_front'] = false;

                    if ( count( $rewrite_array ) > 0 ) {
                        $args['rewrite'] = $rewrite_array;
                    }
                }
            }

            register_taxonomy( $ct['taxonomy'], $object_type, apply_filters( 'wck_ctc_register_taxonomy_args', $args, $ct['taxonomy'] ) );

            if( !empty( $object_type ) && !empty( $args['show_admin_column'] ) && $args['show_admin_column'] == true && !empty( $ct['sortable-admin-column'] ) && $ct['sortable-admin-column'] === 'true' ) {

                foreach( $object_type as $post_type ) {
                        add_filter("manage_edit-{$post_type}_sortable_columns", function ( $columns ) use ( $ct ) {
                            $columns['taxonomy-' . $ct['taxonomy']] = 'taxonomy-' . $ct['taxonomy'];

                            return $columns;
                        });
                    }

                    add_filter( 'posts_clauses', function ( $clauses, $wp_query ) use ( $ct ) {
                        global $wpdb;

                        if ( is_admin() && isset( $wp_query->query['orderby']) && 'taxonomy-' . $ct['taxonomy'] == $wp_query->query['orderby'] ) {
                            $clauses['join'] .= 'LEFT OUTER JOIN '.$wpdb->term_relationships.' ON '.$wpdb->posts.'.ID='.$wpdb->term_relationships.'.object_id';
                            $clauses['join'] .= ' LEFT OUTER JOIN '.$wpdb->term_taxonomy.' USING (term_taxonomy_id)';
                            $clauses['join'] .= ' LEFT OUTER JOIN '.$wpdb->terms.' USING (term_id)';

                            $clauses['where'] .= ' AND (taxonomy = \'' . $ct["taxonomy"] . '\' OR taxonomy IS NULL)';
                            $clauses['groupby'] = 'object_id';
                            $clauses['orderby'] = 'GROUP_CONCAT('.$wpdb->terms.'.name ORDER BY name ASC) ';
                            $clauses['orderby'] .= ( 'ASC' == strtoupper( $wp_query->get('order') ) ) ? 'ASC' : 'DESC';
                        }

                        return $clauses;
                    }, 10, 2);


            }
        }
    }
}

/* Taxonomy Name Verification */

add_filter( 'wck_required_test_wck_ctc_taxonomy', 'wck_ctc_check_taxonomy', 10, 8 );
function wck_ctc_check_taxonomy( $bool, $value, $post_id, $field, $meta, $fields, $values, $elemet_id ){
    //Make sure it doesn't contain capital letters or spaces
    $no_spaces_value = str_replace(' ', '', $value);
    $lowercase_value = strtolower($value);

    /* make sure it's not reserved and avoid doing this on the update case for backwards compatibility */
    $old_values = get_option( 'wck_ctc' );
    $reserved_vars = array();
    if( empty( $old_values[$elemet_id]['taxonomy'] ) || $value != $old_values[$elemet_id]['taxonomy']  )
        $reserved_vars = wck_ctc_get_reserved_names();

    if ( ( $no_spaces_value == $value ) && ( $lowercase_value == $value ) && !in_array( $value, $reserved_vars ) )
        $checked = false;
    else
        $checked = true;

    return ( empty($value) || $checked );

}

add_filter( 'wck_required_message_wck_ctc_taxonomy', 'wck_ctc_change_taxonomy_message', 10, 3 );
function wck_ctc_change_taxonomy_message( $message, $value, $required_field ){
    // change error message
    $no_spaces_value = str_replace(' ', '', $value);
    $lowercase_value = strtolower($value);
    $reserved_vars = wck_ctc_get_reserved_names();

    if( empty( $value ) )
        return $message;
    else if( $no_spaces_value != $value )
        return __("Taxonomy name must not contain any spaces\n", "wck" );
    else if ($lowercase_value != $value)
        return __( "Tanomony name must not contain any capital letters\n", "wck" );
    else if( in_array( $value, $reserved_vars ) )
        return __( "Please chose a different Tanomony name as this one is reserved\n", "wck" );
}

function wck_ctc_get_reserved_names(){
    $reserved_vars = Wordpress_Creation_Kit::wck_get_reserved_variable_names();
    /* add to reserved names existing taxonomy slugs created with wck */
    $wck_post_types = get_option( 'wck_cptc' );
    if( !empty( $wck_post_types ) ){
        foreach ($wck_post_types as $wck_post_type) {
            $reserved_vars[] = $wck_post_type['post-type'];
        }
    }

    return $reserved_vars;
}

/* Flush rewrite rules */
add_action('init', 'ctc_flush_rules', 20);
function ctc_flush_rules(){
    if( isset( $_GET['page'] ) && $_GET['page'] === 'ctc-page' && isset( $_GET['updated'] ) && $_GET['updated'] === 'true' )
        flush_rewrite_rules( false  );
}

/* add refresh to page */
add_action("wck_refresh_list_wck_ctc", "wck_ctc_after_refresh_list");
add_action("wck_refresh_entry_wck_ctc", "wck_ctc_after_refresh_list");
function wck_ctc_after_refresh_list(){
    echo '<script type="text/javascript">window.location="'. esc_url_raw( get_admin_url() ) . 'admin.php?page=ctc-page&updated=true' .'";</script>';
}

/* advanced labels container for add form */
add_action( "wck_before_add_form_wck_ctc_element_5", 'wck_ctc_form_label_wrapper_start' );
function wck_ctc_form_label_wrapper_start(){
    echo '<li><a href="javascript:void(0)" onclick="jQuery(\'#ctc-advanced-label-options-container\').toggle(); if( jQuery(this).text() == \''. esc_html__( 'Show Advanced Label Options', 'wck' ) .'\' ) jQuery(this).text(\''. esc_html__( 'Hide Advanced Label Options', 'wck' ) .'\');  else if( jQuery(this).text() == \''. esc_html__( 'Hide Advanced Label Options', 'wck' ) .'\' ) jQuery(this).text(\''. esc_html__( 'Show Advanced Label Options', 'wck' ) .'\');">'. esc_html__( 'Show Advanced Label Options', 'wck' ) .'</a></li>';
    echo '<li id="ctc-advanced-label-options-container" style="display:none;"><ul>';
}

add_action( "wck_after_add_form_wck_ctc_element_20", 'wck_ctc_form_label_wrapper_end' );
function wck_ctc_form_label_wrapper_end(){
    echo '</ul></li>';
}

/* advanced options container for add form */
add_action( "wck_before_add_form_wck_ctc_element_21", 'wck_ctc_form_wrapper_start' );
function wck_ctc_form_wrapper_start(){
    echo '<li><a href="javascript:void(0)" onclick="jQuery(\'#ctc-advanced-options-container\').toggle(); if( jQuery(this).text() == \''. esc_html__( 'Show Advanced Options', 'wck' ) .'\' ) jQuery(this).text(\''. esc_html__( 'Hide Advanced Options', 'wck' ) .'\');  else if( jQuery(this).text() == \''. esc_html__( 'Hide Advanced Options', 'wck' ) .'\' ) jQuery(this).text(\''. esc_html__( 'Show Advanced Options', 'wck' ) .'\');">'. esc_html__( 'Show Advanced Options', 'wck' ) .'</a></li>';
    echo '<li id="ctc-advanced-options-container" style="display:none;"><ul>';
}

add_action( "wck_after_add_form_wck_ctc_element_29", 'wck_ctc_form_wrapper_end' );
function wck_ctc_form_wrapper_end(){
    echo '</ul></li>';
}

/* advanced label options container for update form */
add_filter( "wck_before_update_form_wck_ctc_element_5", 'wck_ctc_update_form_label_wrapper_start', 10, 2 );
function wck_ctc_update_form_label_wrapper_start( $form, $i ){
    $form .=  '<li><a href="javascript:void(0)" onclick="jQuery(\'#ctc-advanced-label-options-update-container-'.$i.'\').toggle(); if( jQuery(this).text() == \''. __( 'Show Advanced Label Options', 'wck' ) .'\' ) jQuery(this).text(\''. __( 'Hide Advanced Label Options', 'wck' ) .'\');  else if( jQuery(this).text() == \''. __( 'Hide Advanced Label Options', 'wck' ) .'\' ) jQuery(this).text(\''. __( 'Show Advanced Label Options', 'wck' ) .'\');">'. __( 'Show Advanced Label Options', 'wck' ) .'</a></li>';
    $form .= '<li id="ctc-advanced-label-options-update-container-'.$i.'" style="display:none;"><ul>';
    return $form;
}

add_filter( "wck_after_update_form_wck_ctc_element_20", 'wck_ctc_update_form_label_wrapper_end', 10, 2 );
function wck_ctc_update_form_label_wrapper_end( $form, $i ){
    $form .=  '</ul></li>';
    return $form;
}

/* advanced options container for update form */
add_filter( "wck_before_update_form_wck_ctc_element_21", 'wck_ctc_update_form_wrapper_start', 10, 2 );
function wck_ctc_update_form_wrapper_start( $form, $i ){
    $form .=  '<li><a href="javascript:void(0)" onclick="jQuery(\'#ctc-advanced-options-update-container-'.$i.'\').toggle(); if( jQuery(this).text() == \''. __( 'Show Advanced Options', 'wck' ) .'\' ) jQuery(this).text(\''. __( 'Hide Advanced Options', 'wck' ) .'\');  else if( jQuery(this).text() == \''. __( 'Hide Advanced Options', 'wck' ) .'\' ) jQuery(this).text(\''. __( 'Show Advanced Options', 'wck' ) .'\');">'. __( 'Show Advanced Options', 'wck' ) .'</a></li>';
    $form .= '<li id="ctc-advanced-options-update-container-'.$i.'" style="display:none;"><ul>';
    return $form;
}

add_filter( "wck_after_update_form_wck_ctc_element_29", 'wck_ctc_update_form_wrapper_end', 10, 2 );
function wck_ctc_update_form_wrapper_end( $form, $i ){
    $form .=  '</ul></li>';
    return $form;
}


/* advanced label options container for display */
add_filter( "wck_before_listed_wck_ctc_element_5", 'wck_ctc_display_label_wrapper_start', 10, 2 );
function wck_ctc_display_label_wrapper_start( $form, $i ){
    $form .=  '<li><a href="javascript:void(0)" onclick="jQuery(\'#ctc-advanced-label-options-display-container-'.$i.'\').toggle(); if( jQuery(this).text() == \''. __( 'Show Advanced Labels', 'wck' ) .'\' ) jQuery(this).text(\''. __( 'Hide Advanced Labels', 'wck' ) .'\');  else if( jQuery(this).text() == \''. __( 'Hide Advanced Labels', 'wck' ) .'\' ) jQuery(this).text(\''. __( 'Show Advanced Labels', 'wck' ) .'\');">'. __( 'Show Advanced Labels', 'wck' ) .'</a></li>';
    $form .= '<li id="ctc-advanced-label-options-display-container-'.$i.'" style="display:none;"><ul>';
    return $form;
}

add_filter( "wck_after_listed_wck_ctc_element_20", 'wck_ctc_display_label_wrapper_end', 10, 2 );
function wck_ctc_display_label_wrapper_end( $form, $i ){
    $form .=  '</ul></li>';
    return $form;
}

/* advanced options container for display */
add_filter( "wck_before_listed_wck_ctc_element_21", 'wck_ctc_display_adv_wrapper_start', 10, 2 );
function wck_ctc_display_adv_wrapper_start( $form, $i ){
    $form .=  '<li><a href="javascript:void(0)" onclick="jQuery(\'#ctc-advanced-options-display-container-'.$i.'\').toggle(); if( jQuery(this).text() == \''. __( 'Show Advanced Options', 'wck' ) .'\' ) jQuery(this).text(\''. __( 'Hide Advanced Options', 'wck' ) .'\');  else if( jQuery(this).text() == \''. __( 'Hide Advanced Options', 'wck' ) .'\' ) jQuery(this).text(\''. __( 'Show Advanced Options', 'wck' ) .'\');">'. __( 'Show Advanced Options', 'wck' ) .'</a></li>';
    $form .= '<li id="ctc-advanced-options-display-container-'.$i.'" style="display:none;"><ul>';
    return $form;
}

add_filter( "wck_after_listed_wck_ctc_element_29", 'wck_ctc_display_adv_wrapper_end', 10, 2 );
function wck_ctc_display_adv_wrapper_end( $form, $i ){
    $form .=  '</ul></li>';
    return $form;
}

/* Add side metaboxes */
if( !file_exists( dirname(__FILE__).'/wck-stp.php' ) ) {
    add_action('add_meta_boxes', 'wck_ctc_add_side_boxes');
    function wck_ctc_add_side_boxes()
    {
        add_meta_box('wck-ctc-side', __('Wordpress Creation Kit', 'wck'), 'wck_ctc_side_box_one', 'wck_page_ctc-page', 'side', 'high');
    }

    function wck_ctc_side_box_one()
    {
        ?>
        <a href="http://www.cozmoslabs.com/wck-custom-fields-custom-post-types-plugin/?utm_source=wpbackend&utm_medium=clientsite&utm_campaign=WCKFree"><img
                    src="<?php echo esc_url( plugins_url('/images/banner_pro.png', __FILE__) ) ?>?v=1" width="254" height="448"
                    alt="WCK-PRO"/></a>
        <?php
    }
}

/* add TranslatePress crosspromotion */
add_action('add_meta_boxes', 'wck_ctc_add_trp_side_box');
function wck_ctc_add_trp_side_box()
{
    add_meta_box('wck-ctc-side-trp', __('TranslatePress', 'wck'), 'wck_ctc_side_box_trp', 'wck_page_ctc-page', 'side', 'low');
}

function wck_ctc_side_box_trp()
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
add_action('load-wck_page_ctc-page', 'wck_ctc_help');

function wck_ctc_help () {
    $screen = get_current_screen();

    /*
     * Check if current screen is wck_page_cptc-page
     * Don't add help tab if it's not
     */
    if ( $screen->id != 'wck_page_ctc-page' )
        return;

    // Add help tabs
    $screen->add_help_tab( array(
        'id'	=> 'wck_ctc_overview',
        'title'	=> __( 'Overview', 'wck' ),
        'content'	=> '<p>' . __( 'WCK Custom Taxonomy Creator allows you to easily create custom taxonomy for Wordpress without any programming knowledge.<br />Most of the common options for creating a taxonomy are displayed by default while the advanced and label options are just one click away.', 'wck' ) . '</p>',
    ) );

    $screen->add_help_tab( array(
        'id'	=> 'wck_ctc_labels',
        'title'	=> __( 'Labels', 'wck' ),
        'content'	=> '<p>' . __( 'For simplicity you are required to introduce only the Singular Label and Plural Label from wchich the rest of the labels will be formed.<br />For a more detailed control of the labels you just have to click the "Show Advanced Label Options" link and all the availabel labels will be displayed', 'wck' ) . '</p>',
    ) );

    $screen->add_help_tab( array(
        'id'	=> 'wck_ctc_advanced',
        'title'	=> __( 'Advanced Options', 'wck' ),
        'content'	=> '<p>' . __( 'The Advanced Options are set to the most common defaults for taxonomies. To display them click the "Show Advanced Options" link.', 'wck' ) . '</p>',
    ) );
}


/* when renaming a taxonomy make sure the terms get ported as well */
add_action( 'wck_before_update_meta', 'wck_ctc_update_taxonomies', 10, 4 );
function wck_ctc_update_taxonomies( $meta, $id, $values, $element_id ){
    if( $meta == 'wck_ctc' ){
        $old_values = get_option( $meta );
        if( !empty( $old_values[$element_id] ) ){
            if( $old_values[$element_id]['taxonomy'] != $values['taxonomy'] ){
                global $wpdb;
                $wpdb->update(
                    $wpdb->term_taxonomy,
                    array(
                        'taxonomy' => $values['taxonomy'],	// string
                    ),
                    array( 'taxonomy' => $old_values[$element_id]['taxonomy'] ),
                    array(
                        '%s',
                    )
                );
            }
        }
    }
}
