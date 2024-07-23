<?php

/**
 * Button Shortcode Handler
 *
 * @param  String  link              If the button is a link, the hyperlink.
 * @param  String  link-is-external  If the button link is external.
 * @param  String  function          If the button is functional or exposes a
 *                                   feature of the site, which function?
 *                                   May be languages, theme, menu, or share
 * @param  String  type              The button type; default (none), primary,
 *                                   secondary, or small
 *
 * @author NYC Opportunity
 */

namespace Shortcode;

use Timber;

/**
 * Class
 */
class Button extends Shortcode {
  /** The shortcode tag */
  public $tag = 'button';

  /** The path to the Timber Component */
  public $template = 'components/button.twig';

  /** The shortcode hint for the selector dropdown */
  public $hint = 'link="" link-is-external function=""';

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
    $id = $this->tag . '-' . uniqid();

    $button = array(
      'id' => $id,
      'label' => do_shortcode($content),
      'hyperlink' => array_key_exists('link', $atts) ? array(
        'href' => $atts['link'],
        'external' => in_array('link-is-external', $atts)
      ) : false,
      'function' => array_key_exists('function', $atts) ? $atts['function'] : false,
      'type' => array_key_exists('type', $atts) ? $atts['type'] : false,
    );

    return Timber::compile(
      $this->template, array(
        'this' => array_merge($button, $atts)
      )
    );
  }
}
