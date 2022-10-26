<?php

/**
 * Icon Shortcode Handler
 *
 * @author NYC Opportunity
 */

namespace Shortcode;

/**
 * Class
 */
class Icon extends Shortcode {
  /** The shortcode tag */
  public $tag = 'icon';

  /** The shortcode hint for the selector dropdown */
  public $hint = 'name=""';

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
    $atts = shortcode_atts(array(
      'name' => null,
      'class' => ''
    ), $atts);

    // If name is missing, don't return anything
    if (empty($atts['name'])) {
      return;
    }

    switch ($atts['name']) {
      // NYCO Icon
      case 'accessibility':
        $atts['name'] = 'nyco-accessibility';
        $atts['class'] = 'icon ' . $atts['class'];

        break;

      // NYCO Icon
      case 'languages':
        $atts['name'] = 'nyco-languages';
        $atts['class'] = 'icon-ui ' . $atts['class'];

        break;

      // Lucide Icon
      default:
        $atts['name'] = 'lucide-' . $atts['name'];
        $atts['class'] = 'icon-ui ' . $atts['class'];

        break;
    }

    return '<svg aria-hidden="true" class="'. $atts['class'] . '">' .
      '<use href="#' . $atts['name'] . '"></use>' .
    '</svg>';
  }
}
