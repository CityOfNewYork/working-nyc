<?php

/**
 * Blockquote Shortcode Handler
 *
 * @author NYC Opportunity
 */

namespace Shortcode;

/**
 * Class
 */
class Blockquote extends Shortcode {
  /** The shortcode tag */
  public $tag = 'blockquote';

  /** The shortcode hint for the selector dropdown */
  public $hint = '';

  /** Wether the shortcode should have a closing tag or not */
  public $closes = true;

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
    return '<blockquote class="text-alt mt-0">' .
        '<span aria-hidden="true" class="blockquote__mark">—</span>' .
        '<p>' . ((isset($atts['text'])) ? $atts['text'] : $content) . '</p>' .
      '</blockquote>';
  }
}
