<?php

use NYCO\WpAssets as WpAssets;
 
/**
 * Enqueue a hashed style based on it's name and language prefix.
 * @param  [string] $name the name of the stylesheet source
 * @return null
 */
function enqueue_language_style($name) {
  $WpAssets = new WpAssets();

  $languages = array('ar', 'es', 'ko', 'ur', 'zh-hant');
  $lang = (!in_array(ICL_LANGUAGE_CODE, $languages))
    ? 'default' : ICL_LANGUAGE_CODE;

  $style = $WpAssets->addStyle("$name-$lang", true, [], null, 'all', '');

}

/**
 * Enqueue a hashed script based on it's name.
 * Enqueue the minified version based on debug mode.
 * @param  [string]  $name The name of the script source.
 * @param  [boolean] $cors Add the crossorigin="anonymous" attribute.
 * @return null
 */
function enqueue_script($name, $cors = false) {
  $WpAssets = new WpAssets();
  $WpAssets->scripts = 'js/';

  $script = $WpAssets->addScript($name, true, array(), null, true, '');

  if ($cors) {
    $WpAssets->addCrossoriginAttr($name);
  }
}