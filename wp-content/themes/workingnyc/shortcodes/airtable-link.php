<?php

/**
 * Airtable Shortcode Handler
 *
 * @author NYC Opportunity
 */

namespace Shortcode;

use Airtable;

/**
 * Class
 */
class AirtableLink extends Shortcode {
  /** The shortcode tag */
  public $tag = 'airtable-link';

  /** The shortcode hint for the selector dropdown */
  public $hint = 'url="" text="" device="" browser="" lang="" program_name="" program_link=""';

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
        'url' => null,
        'text' => null,
        'device' => null,
        'browser' => null,
        'lang' => null,
        'program_name' => null,
        'program_link' => null,
        'class' => null
      ), $atts);

    // If name is missing, don't return anything
    if (empty($atts['url']) || empty($atts['text'])) {
      return;
    }

    if (!empty($atts['program_name']) | !empty($atts['program_link'])) {
      $post = get_page_by_path(basename($_SERVER['REQUEST_URI']), OBJECT, 'programs');
    }

    // Compile the query parameters
    $params = array();

    if (!empty($atts['device'])) {
      $device = Airtable\prefill(Airtable\get_formatted_string($atts['device'])) . Airtable\get_mobile_desktop();

      array_push($params, $device);
    }

    if (!empty($atts['browser'])) {
      $browser = Airtable\prefill(Airtable\get_formatted_string($atts['browser'])) . Airtable\get_current_browser();

      array_push($params, $browser);
    }

    if (!empty($atts['lang'])) {
      $lang = Airtable\prefill(Airtable\get_formatted_string($atts['lang'])) . Airtable\get_language_name();

      array_push($params, $lang);
    }

    if (!empty($atts['program_name'])) {
      $program_name = Airtable\prefill(Airtable\get_formatted_string($atts['program_name'])) . Airtable\get_formatted_string($post->post_title);

      array_push($params, $program_name);
    }

    if (!empty($atts['program_link'])) {
      $program_link = Airtable\prefill(Airtable\get_formatted_string($atts['program_link'])) . get_permalink($post->id);

      array_push($params, $program_link);
    }

    $url = $atts['url'] . '?' . implode('&', $params);

    return '<a class="'. $atts['class'] . '" href="'. $url . '" target="_blank">' .
      '<span>' . $atts['text'] . '</span>' .
      '<svg aria-hidden="true" class="icon-wnyc-ui" style="margin-left: 5px;">' .
        '<use xlink:href="#external-link"></use>' .
      '</svg>' .
    '</a>';
  }
}
