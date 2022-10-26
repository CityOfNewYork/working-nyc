<?php

/**
 * Accordion Shortcode Handler. The shortcode accepts the following attributes
 * in addition to the content body;
 *
 * @param  String/HTML  header                   The header text/html to display.
 *                                               This is always visible
 * @param  Blank        active                   Presence determines wether the
 *                                               accordion is open or not. Does
 *                                               not need to be set to value
 * @param  String       call-to-action           The url for the call-to-action
 * @param  Blank        call-to-action-external  Wether the call-to-action is external
 *
 * @author NYC Opportunity
 */

namespace Shortcode;

use Timber;
use DOMDocument;

/**
 * Class
 */
class Accordion extends Shortcode {
  /** The shortcode tag */
  public $tag = 'accordion';

  /** The path to the Timber Component */
  public $template = 'components/accordion.twig';

  /** Hint to display in the shortcode dropdown */
  public $hint = 'header="" active call-to-action="" call-to-action-external';

  /** If the short-code has a closing "tag" */
  public $closes = true;

  /** Potentially focusable elements that need to be removed from tabbing order in closed accordions */
  public $focusable = [
    'a', 'button', 'input', 'select', 'textarea', 'object', 'embed', 'form',
    'fieldset', 'legend', 'label', 'area', 'audio', 'video', 'iframe', 'svg',
    'details', 'table', '[tabindex]', '[contenteditable]', '[usemap]'
  ];

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

    $linkLabel = __('Learn more', 'WNYC');

    if (isset($atts['call-to-action']) && in_array('call-to-action-external', $atts)) {
      $url = parse_url($atts['call-to-action']);

      $linkLabel = __('Go to', 'WNYC') . ' ' . $url['host'];
    }

    // If the accordion is closed, remove potentially focusable elements from the tabbing order
    if (false === in_array('active', $atts)) {
      $domDocument = new DOMDocument();

      libxml_use_internal_errors(true);

      $domDocument->loadHTML('<html>' . $content . '</html>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

      foreach ($this->focusable as $element) {
        $domElements = $domDocument->getElementsByTagName($element);

        foreach ($domElements as $domElement) {
          $domElement->setAttribute('tabindex', '-1');
        }
      }

      $content = str_replace(array('<html>','</html>'), '', $domDocument->saveHTML());
    }

    return Timber::compile(
      $this->template,
      array(
        'this' => array(
          'id' => $id,
          'classes' => 'mb-4',
          'active' => in_array('active', $atts),
          'header' => $atts['header'],
          'body' => $content,
          'link' => (isset($atts['call-to-action'])) ? $atts['call-to-action'] : false,
          'link_target' => (in_array('call-to-action-external', $atts)) ? '_blank' : '',
          'link_label' => $linkLabel
        )
      )
    );
  }
}
