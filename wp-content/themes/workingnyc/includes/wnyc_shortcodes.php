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
* Add icon
*/
function add_icon( $attr ) {
  $atts = shortcode_atts( array(
    'name' => null,
  ), $attr );

  // If name is missing, don't return anything
  if ( empty( $atts['name'] ) ) {
    return;
  }

  return '<svg aria-hidden="true" class="icon-wnyc-ui"><use xlink:href="#icon-wnyc-ui-'. $atts['name'] .'"></use></svg>';
}
add_shortcode( 'icon', 'add_icon' );

/**
* Add parameters to the Airtable link
*/
function add_airtable( $attr ) {
  $atts = shortcode_atts( array(
    'url' => null,
    'text' => null,
    "device" => null,
    "browser" => null,
    "lang" => null,
    'program_name' => null,
    'program_link' => null,
  ), $attr );

  // If name is missing, don't return anything
  if ( empty( $atts['url'] ) || empty( $atts['text'] ) ) {
    return;
  }

  if (!empty($atts["program_name"]) | !empty($atts["program_link"])){
    $post = get_page_by_path(basename($_SERVER['REQUEST_URI']), OBJECT, 'programs');    
  }

  // Compile the query parameters
  $params = array();
  if (!empty($atts["device"])){
    $device = Airtable\prefill(Airtable\get_formatted_string($atts['device'])).Airtable\get_mobile_desktop();
    array_push($params, $device);
  }
  if (!empty($atts["browser"])){
    $browser = Airtable\prefill(Airtable\get_formatted_string($atts['browser'])).Airtable\get_current_browser();
    array_push($params, $browser);
  }
  if (!empty($atts["lang"])){
    $lang = Airtable\prefill(Airtable\get_formatted_string($atts['lang'])).Airtable\get_language_name();
    array_push($params, $lang);
  }
  if (!empty($atts["program_name"])){
    $program_name = Airtable\prefill(Airtable\get_formatted_string($atts['program_name'])).Airtable\get_formatted_string($post->post_title);
    array_push($params, $program_name);
  }
  if (!empty($atts["program_link"])){
    $program_link = Airtable\prefill(Airtable\get_formatted_string($atts['program_link'])).get_permalink($post->id);
    array_push($params, $program_link);
  }
  
  $url = $atts['url'].'?'.implode("&", $params);

  return '<a class="btn btn-text text-inherit underline" href="'.$url.'" target="_blank"><span>'.$atts['text'].'</span><svg aria-hidden="true" class="icon-wnyc-ui" style="margin-left:5px;"><use xlink:href="#icon-wnyc-ui-external-link"></use></svg></a>';

}
add_shortcode( 'link', 'add_airtable' );

/**
* Add the custom shortcodes to the TinyMCE dropdown
*/
function add_custom_shortcodes($shortcodes) {
  $shortcodes['Blockquote'] = '[blockquote text=""]';
  $shortcodes['Icon'] = '[icon name=""]';
  $shortcodes['Airtable Link'] = '[link url="" text="" device="" browser="" lang="" program_name="" program_link=""]';
  return $shortcodes;
}
add_filter( 'bsd_shortcode_list', 'add_custom_shortcodes' );
