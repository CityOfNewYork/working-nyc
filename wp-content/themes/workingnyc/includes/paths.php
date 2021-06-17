<?php

/**
 * Path helpers shorthands for different files
 */

namespace WorkingNYC;

/**
 * Returns the path of a Timber Post file in the /timber-posts directory.
 *
 * @param   String  $name  The name of the Timber Post to retrieve.
 *
 * @return  String         The full path of the Timber Post file.
 */
function timber_post($name) {
  return get_stylesheet_directory() . "/timber-posts/$name.php";
}

/**
 * Includes (PHP Libraries)
 */

/**
 * Returns the path of an include file in the /includes directory.
 *
 * @param   String  $name  The name of the include to retrieve.
 *
 * @return  String         The full path of the include file.
 */
function inc($name = false) {
  if ($name) {
    return get_stylesheet_directory() . "/includes/$name.php";
  } else {
    return get_stylesheet_directory() . '/includes/';
  }
}

/**
 * Require all includes in the /includes directory
 */
function require_includes() {
  foreach (scandir(inc()) as $filename) {
    $path = inc() . $filename;

    if (is_file($path)) {
      require_once $path;
    }
  }
}

/**
 * Gutenberg Blocks
 */

/**
 * Return the path of a Gutenberg Block.
 *
 * @param   String   $name  The name of the block to retrieve.
 * @param   Boolean  $uri   Wether to return the uri (including https://).
 *
 * @return  String          The path to the block.
 */
function block($name = false, $uri = false) {
  if ($name && $uri) {
    return get_stylesheet_directory_uri() . "/blocks/$name";
  } elseif ($name) {
    return get_stylesheet_directory() . "/blocks/$name.php";
  } else {
    return get_stylesheet_directory() . '/blocks/';
  }
}

/**
 * Requires all Gutenberg Blocks in the /blocks directory.
 */
function require_blocks() {
  foreach (scandir(block()) as $filename) {
    $path = block() . $filename;

    if (is_file($path)) {
      require_once $path;
    }
  }
}

/**
 * Shortcodes
 */

 /**
  * Returns the path of a shortcode or the shortcode directory.
  *
  * @param   String $name  The name of the shortcode to return.
  *
  * @return  String        The path of the shortcode or shortcode directory.
  */
function shortcode($name = false) {
  if ($name) {
    return get_stylesheet_directory() . "/shortcodes/$name.php";
  } else {
    return get_stylesheet_directory() . '/shortcodes/';
  }
}

/**
 * Require all shortcodes in the /shortcode directory.
 *
 * @param  String  $base  The base shortcode class for all shortcodes to extend.
 */
function require_shortcodes($base = 'shortcode') {
  require_once shortcode($base);

  foreach (scandir(shortcode()) as $filename) {
    $path = shortcode() . $filename;

    if (is_file($path) && $filename != $base . '.php') {
      require_once $path;
    }
  }
}
