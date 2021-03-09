<?php

class Site extends TimberSite {

  function __construct() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'menus' );
    add_filter( 'timber_context', array( $this, 'add_to_context' ) );

    parent::__construct();
  }

  /**
   * Timber Context Object
   */
  function add_to_context ( $context ) {
    $context['language_code'] = ICL_LANGUAGE_CODE;
    $context['newsletter_link'] = ICL_LANGUAGE_CODE == 'en'? '/newsletter' : '/'.ICL_LANGUAGE_CODE.'/newsletter';
    $context['direction'] = (ICL_LANGUAGE_CODE === 'ar' || ICL_LANGUAGE_CODE === 'ur') ? 'rtl' : 'ltr';
    $context['site'] = $this;

    $context['programs_archive'] = get_post_type_archive_link('programs');

    $context['header_menu'] = new TimberMenu('header_menu');
    $context['footer_menu'] = new TimberMenu('footer_menu');

    // WNYC Settings
    $context['options'] = get_fields('options');

    // Icons path
    $matches = glob(get_template_directory().'/assets/svg/icons-*');
    $context['icons_path'] = strstr($matches[0], '/wp-content');

    return $context;
  }
}

new Site();

/**
 * Includes
 */

$includes_dir    = get_template_directory() .'/includes/';
$includes = preg_grep('~\.(php)$~', scandir($includes_dir));

foreach ($includes as $i => $inc) {
  require_once($includes_dir. $inc);
}