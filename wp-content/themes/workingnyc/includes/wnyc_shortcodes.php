<?php
/**
 * Adds options to TinyMCE shortcodes select
 */

/**
* Update the blockquote wrapper
*/
function custom_blockquote( $attr ) {
  $atts = shortcode_atts( array(
    'text' => null,
  ), $attr );

  // If text is missing, don't return anything
  if ( empty( $atts['text'] ) ) {
    return;
  }
  return '<blockquote class="text-alt mt-0"><span aria-hidden="true" class="blockquote__mark">—</span><p>' . $atts['text'] . '</p></blockquote>';
}
add_shortcode( 'blockquote', 'custom_blockquote' );

/**
* Add the custom shortcodes to the TinyMCE dropdown
*/
function add_custom_shortcodes($shortcodes) {
  $shortcodes['Blockquote'] = '[blockquote text=""]';
  return $shortcodes;
}
add_filter( 'bsd_shortcode_list', 'add_custom_shortcodes' );
