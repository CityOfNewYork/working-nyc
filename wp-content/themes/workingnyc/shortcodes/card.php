<?php

/**
 * Program Shortcode Handler. The shortcode accepts the following attributes;
 *
 * @param  Number  id  The program post ID
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
      'classes' => 'static mb-4'
    );

    return Timber::compile(
      $this->template, array(
        'this' => array_merge($card, $atts)
      )
    );
  }
}
