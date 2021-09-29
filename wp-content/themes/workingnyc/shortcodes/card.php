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
  public $hint = 'title="" subtitle="" body=""';

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

    $card = array(
      'id' => $id,
      'classes' => 'static mb-4',
      'body' => $content
    );

    return Timber::compile(
      $this->template, array(
        'this' => array_merge($card, $atts)
      )
    );
  }
}
