<?php

/**
 * Card Shortcode Handler. The shortcode accepts the following attributes
 * in addition to the content body;
 *
 * @param  String  title     The Card title
 * @param  String  subtitle  The Card subtitle
 *
 * @author NYC Opportunity
 */

namespace Shortcode;

use Timber;

/**
 * Class
 */
class Card extends Shortcode {
  /** The shortcode tag */
  public $tag = 'card';

  /** The path to the Timber Component */
  public $template = 'components/card.twig';

  /** The shortcode hint for the selector dropdown */
  public $hint = 'title="" subtitle="" call-to-action="" call-to-action-external';

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
    $id = $this->tag . '-' . uniqid();

    $linkLabel = __('Learn more', 'WNYC');

    if (isset($atts['call-to-action']) && in_array('call-to-action-external', $atts)) {
      $url = parse_url($atts['call-to-action']);

      $linkLabel = __('Go to', 'WNYC') . ' ' . $url['host'];
    }

    $card = array(
      'id' => $id,
      'classes' => 'mb-4',
      'body' => $content,
      'link' => (isset($atts['call-to-action'])) ? $atts['call-to-action'] : false,
      'link_target' => (in_array('call-to-action-external', $atts)) ? '_blank' : '',
      'link_label' => $linkLabel
    );

    return Timber::compile(
      $this->template, array(
        'this' => array_merge($card, $atts)
      )
    );
  }
}
