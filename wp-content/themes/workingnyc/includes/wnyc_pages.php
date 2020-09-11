<?php
/**
 * Updates the columns in Pages Dashboard
 */

add_filter( 'manage_page_posts_columns', 'show_page_attributes' );
function show_page_attributes( $columns ) {
  $columns['template'] = __( 'Template', 'programs' );
  return $columns;
}

function populate_page_columns($column, $post_id){
  
  if(($column == 'template')) {
    $page_template_name = get_post_meta( $post_id, '_wp_page_template', true ); 
    $page_templates = get_page_templates();
    if (in_array($page_template_name,$page_templates)) {
      foreach($page_templates as $key => $value) {
        if($page_template_name == $value) {
          echo $key;    
        }
      }   
    } else {
      echo 'Default';
    }
  }
}
add_action('manage_page_posts_custom_column','populate_page_columns',10,2);