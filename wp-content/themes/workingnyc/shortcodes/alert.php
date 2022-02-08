<?php

/**
 * Alert Shortcode Handler. The shortcode accepts the following attributes
 * in addition to the content body;
 *
 * @param  String  status  The Alert color; primary, secondary, tertiary,
 *                         correlates to status classes; status-primary,
 *                         status-secondary, status-tertiary
 * @param  String  icon    The Alert Feather icon type; info, alert-circle,
 *                         alert-octogon, alert-triangle
 *                         @link https://feathericons.com/
 *
 * @author NYC Opportunity
 */

namespace Shortcode;

use Timber;

/**
 * Class
 */
class Alert extends Shortcode {
  /** The shortcode tag */
  public $tag = 'alert';

  /** The path to the Timber Component */
  public $template = 'components/alert.twig';

  /** The shortcode hint for the selector dropdown */
  public $hint = 'status="" icon="info"';

  /** Wether the shortcode should have a closing tag or not */
  public $closes = true;

  /**
   * Shortcode Callback
   *
   * @param   Array   $atts           Attributes added to the shortcode
   * @param   String  $content        Content within shortcode tags
   * @param   String  $shortcode_tag  The full shortcode tag
   *
   * @return  String                  A compiled component string
   */
  public function shortcode($atts, $content, $shortcode_tag) {
    $atts = shortcode_atts(array(
      'id' => $this->tag . '-' . uniqid(),
      'classes' => 'mb-4',
      'status' => null,
      'icon' => 'info',
      'body' => do_shortcode($content)
    ), $atts);

    // Add the status class prefix to desired type
    $atts['status'] = (isset($atts['status'])) ? 'status-' . $atts['status'] : '';

    return Timber::compile(
      $this->template, array(
        'this' => $atts
      )
    );
  }
}
