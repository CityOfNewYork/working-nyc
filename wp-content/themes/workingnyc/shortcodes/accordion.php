<?php

/**
 * Accordion Shortcode Handler. The shortcode accepts the following attributes
 * in addition to the content body;
 *
 * @param  String/HTML  header               The header text/html to display.
 *                                           This is always visible.
 * @param  Blank        active               Presence determines wether the
 *                                           accordion is open or not. Does
 *                                           not need to be set to value.
 * @param  String       call-to-action       The url for the call-to-action.
 * @param  String       call-to-action-text  The text for the call-to-action.
 *
 * @author NYC Opportunity
 */

namespace Shortcode;

use Timber;

/**
 * Class
 */
class Accordion extends Shortcode {
  /** The shortcode tag */
  public $tag = 'accordion';

  /** The path to the Timber Component */
  public $template = 'components/accordion.twig';

  public $hint = 'header="" call-to-action="" call-to-action-text="" active';

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
    $id = sanitize_title($atts['header']). '-' . uniqid();

    return Timber::compile(
      $this->template,
      array(
        'this' => array(
          'id' => $id,
          'classes' => 'mb-4',
          'active' => in_array('active', $atts),
          'header' => $atts['header'],
          'body' => $content,
          'cta' => ($atts['call-to-action']) ?
            array(
              'href' => $atts['call-to-action'],
              'text' => ($atts['call-to-action-text']) ?
                $atts['cta-text'] : __('Learn more', 'WNYC')
            ) : false
        )
      )
    );
  }
}
