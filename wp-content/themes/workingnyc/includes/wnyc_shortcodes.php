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
  ), $attr );

  // If name is missing, don't return anything
  if ( empty( $atts['url'] ) || empty( $atts['text'] ) ) {
    return;
  }

  // Compile the query parameters
  $params = array();
  if ($atts["device"] == "true"){
    $device = 'prefill_Your+device='.get_mobile_desktop();
    array_push($params, $device);
  }
  if ($atts["browser"] == "true"){
    $browser = 'prefill_Your+browser='.get_current_browser();
    array_push($params, $browser);
  }
  if ($atts["lang"] == "true"){
    $lang = 'prefill_Your+preferred+language='.get_language_name();
    array_push($params, $lang);
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
  $shortcodes['Airtable Link'] = '[link url="" text="" device="true" browser="true" lang="true"]';
  return $shortcodes;
}
add_filter( 'bsd_shortcode_list', 'add_custom_shortcodes' );
