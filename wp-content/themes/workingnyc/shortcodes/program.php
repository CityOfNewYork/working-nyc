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
class Program extends Shortcode {
  /** The shortcode tag */
  public $tag = 'program';

  /** The path to the Timber Component */
  public $template = 'components/program.twig';

  /** The shortcode hint for the selector dropdown */
  public $hint = 'id=""';

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
    $post = new Timber\Post($atts['id']);

    if (isset($atts['learn-more'])) {
      $post->link = $atts['learn-more'];
    }

    if (isset($atts['learn-more-new-window']) && 'true' === $atts['learn-more-new-window']) {
      $post->link_target = '_blank';
    }

    $post->classes = 'mb-4';

    return (null === $post->id) ?
      "<!-- A post with the ID $post->ID does not exist -->" :
      Timber::compile($this->template, array('post' =>  $post));
  }
}
