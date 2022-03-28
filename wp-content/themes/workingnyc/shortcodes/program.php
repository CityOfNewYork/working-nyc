<?php

/**
 * Program Shortcode Handler. The shortcode accepts the following attributes;
 *
 * @param  Number  id  The program post ID
 *
 * @author NYC Opportunity
 */

namespace Shortcode;

use WorkingNYC;
use Timber;

/**
 * Class
 */
class Program extends Shortcode {
  /** The shortcode tag */
  public $tag = 'program';

  /** The path to the Timber Component */
  public $template = 'programs/program.twig';

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
    require_once WorkingNYC\timber_post('Programs');

    $post = new \WorkingNYC\Programs($atts['id']);

    if (null === $post->id) {
      return "<!-- A program with the ID $post->ID does not exist -->";
    }

    if (isset($atts['learn-more'])) {
      $post->link = $atts['learn-more'];
    }

    if (isset($atts['learn-more-new-window']) && 'true' === $atts['learn-more-new-window']) {
      $post->link_target = '_blank';
    }

    $post->classes = 'mb-4';

    return Timber::compile($this->template, array('post' => $post));
  }
}
