<?php
/**
 * Adds a shortcode selector to the WYSIWYG editor. Adapted from
 * @source https://paulund.co.uk/add-button-tinymce-shortcodes
 *
 * @author Blue State Digital <http://www.bluestatedigital.com>
 */

namespace BSD;

class ShortCodeButton {
  /**
   * Add BSD Shortcode TinyMCE plugin
   *
   * @param   Array  TinyMCE core and custom plugins
   *
   * @return  Array  Modified plugin array
   */
  public function addShortcodeMcePlugin($plugin_array) {
    $plugin_array['bsd_shortcode'] = plugins_url('/js/bsd-shortcode-editor-plugin.js?v0.0.5', __FILE__);

    return $plugin_array;
  }

  /**
   * Add BSD Shortcode dropdown
   *
   * @param  Array  Array of TinyMCE editor controls
   *
   * @return Array  $buttons
   */
  public function addShortcodeButton($buttons) {
    array_push($buttons, 'separator', 'bsd_shortcode');

    return $buttons;
  }

  /**
   * Add filters to include the new TinyMCE plugin and add the button to the editor
   */
  public function addShortcodeFilters() {
    add_filter('mce_external_plugins', array($this, 'addShortcodeMcePlugin'));
    add_filter('mce_buttons', array($this, 'addShortcodeButton'));
  }

  /**
   * Get the list of available shortcodes
   */
  public function getShortcodeList() {
    $shortcodes = array();
    $shortcodes = apply_filters('bsd_shortcode_list', $shortcodes);

    print '<script>var tinymce_shortcodes = ' . json_encode($shortcodes) . '; </script>';
  }

  /**
  * Call the plugin functions when Wordpress initializes the Dashboard
  */
  public function __construct() {
    add_action('admin_init', array($this, 'addShortcodeFilters'));
    add_action('admin_footer', array($this, 'getShortcodeList'));
  }
}
