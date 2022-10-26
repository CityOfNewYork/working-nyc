<?php

namespace WorkingNYC;

use Timber;
use DOMDocument;

class CompileImgPreload {
  const PRELOAD_TAG = '<!-- PRELOAD_TAG -->';

  const PRELOAD_PRIORITY = 2;

  /**
   * Uses Timber to compile the HTML template to a string then uses PHP's DOMDocument()
   * class to fetch image source tags. A block of preload image tags is created then
   * added to the document string.
   *
   * @param   String  $template  The template string to pass to Timber::compile
   * @param   Array   $context   The data used by the template to pass to Timber::compile
   *
   * @return  Object             Instance of CompileImgPreload with html string stored in $this->html
   */
  public function __construct($template, $context) {
    // Add the string that will be replaced with the link tag block to the head of the document
    add_action('wp_head', function() {
      echo self::PRELOAD_TAG;
    }, self::PRELOAD_PRIORITY);

    $this->html = Timber::compile($template, $context);

    try {
      $domDocument = new DOMDocument();

      libxml_use_internal_errors(true); // Disable format warnings that could get logged to output

      $domDocument->loadHTML($this->html);

      $imgSourceSet = array_unique(array_map(function($img) {
        return $img->getAttribute('src');
      }, iterator_to_array($domDocument->getElementsByTagName('img'))));

      $imgLinkSet = implode('', array_map(function($img) {
        return '<link as="image" href="' . $img . '" rel="preload">';
      }, $imgSourceSet));

      $this->html = str_replace(self::PRELOAD_TAG, $imgLinkSet, $this->html);
    } catch (Exception $ex) {
      error_log(var_export($ex->getMessage(), true));
    }

    return $this;
  }
}
