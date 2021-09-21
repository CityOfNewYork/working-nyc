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

  /**
   * Constructor
   */
  public function __construct() {
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
    $shortcodes[ucwords(str_replace('-', ' ', $this->tag))] = "[$this->shortcode $this->hint]";

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
