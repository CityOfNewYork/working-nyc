<?php

/**
 * Shortcode Handler
 *
 * @author NYC Opportunity
 */

namespace Shortcode;

/**
 * Class
 */
class Shortcode {
  /** Prefix for all shortcodes */
  public $prefix = 'wnyc-';

  /** The shortcode tag */
  public $tag = '';

  /** The shortcode hint for the selector dropdown */
  public $hint = '';

  /** Wether the shortcode should have a closing tag or not */
  public $closes = false;

  /**
   * Constructor
   */
  public function __construct() {
    require_once get_stylesheet_directory() . '/includes/paths.php';

    $this->shortcode = $this->prefix . $this->tag;

    add_shortcode($this->shortcode, [$this, 'shortcode']);

    add_filter('bsd_shortcode_list', [$this, 'addToSelector']);
  }

  /**
   * Adds the Short-code to the BSD Tiny MCE selector list.
   *
   * @param   Array  $shortcodes  The full list of short-codes
   *
   * @return  Array               The amended list of short-codes
   */
  public function addToSelector($shortcodes) {
    $key = ucwords(str_replace('-', ' ', $this->tag));

    $shortcodes[$key] = "[$this->shortcode $this->hint]";

    if ($this->closes) {
      $shortcodes[$key] = "$shortcodes[$key]" .
        __('Add text content between these shortcode tags.') .
        "[/$this->shortcode]";
    }

    return $shortcodes;
  }

  /**
   * Add Shortcode Callback
   *
   * @param   Array   $atts           Attributes added to the shortcode
   * @param   String  $content        Content within shortcode tags
   * @param   String  $shortcode_tag  The full shortcode tag
   *
   * @return  String                  A compiled component string
   */
  public function shortcode($atts, $content, $shortcode_tag) {
    return '';
  }
}
