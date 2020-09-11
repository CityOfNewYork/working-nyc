<?php
/**
* Plugin Name: BSD Shortcodes Button
* Description: Adds a shortcode selector to the WYSIWYG editor
* Version: 1.0.0
* Author: Blue State Digital <http://www.bluestatedigital.com>
*
* Adapted from https://paulund.co.uk/add-button-tinymce-shortcodes
*/
class BSD_Shortcode_Button {

  /**
  * Add BSD Shortcode TinyMCE plugin
  *
  * @param $plugin_array  Array of TinyMCE core and custom plugins
  * @return $plugin_array
  */
  public function add_shortcode_mce_plugin($plugin_array) {
    $plugin_array['bsd_shortcode'] = plugins_url( '/js/bsd-shortcode-editor-plugin.js?v0.0.5', __FILE__ );
    return $plugin_array;
  }

  /**
  * Add BSD Shortcode dropdown
  *
  * @param $buttons  Array of TinyMCE editor controls
  * @return $buttons
  */
  public function add_shortcode_button($buttons) {
    array_push( $buttons, 'separator', 'bsd_shortcode' );
    return $buttons;
  }

  /**
  * Add filters to include the new TinyMCE plugin and add the button to the editor
  */
  public function add_shortcode_filters() {
    add_filter( 'mce_external_plugins', array($this, 'add_shortcode_mce_plugin') );
    add_filter( 'mce_buttons', array($this, 'add_shortcode_button') );
  }

  /**
  * Get the list of available shortcodes
  */
  public function get_shortcode_list() {
    $shortcodes = array();
    $shortcodes = apply_filters( 'bsd_shortcode_list', $shortcodes );
    print '<script>var tinymce_shortcodes = ' . json_encode($shortcodes) . '; </script>';
  }

  /**
  * Call the plugin functions when Wordpress initializes the Dashboard
  */
  public function __construct() {
    add_action( 'admin_init', array($this, 'add_shortcode_filters') );
    add_action( 'admin_footer', array($this, 'get_shortcode_list') );
  }
}

new BSD_Shortcode_Button();