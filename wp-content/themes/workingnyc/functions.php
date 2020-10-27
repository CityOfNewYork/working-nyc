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

    return $context;
  }
}

new Site();

/**
 * Includes
 */

$includes = [
  '/includes/styles_and_scripts.php',
  '/includes/airtable.php',
  '/includes/date_format.php',
  '/includes/templating.php',
  '/includes/meta.php',
  '/includes/wnyc_shortcodes.php',
  '/includes/wnyc_pages.php',
  '/includes/newsletter.php',
  '/includes/rest/rest.php',
  '/includes/rest/programs.php',
];

for ($i=0; $i < sizeof($includes); $i++) {
  require_once(get_template_directory() . $includes[$i]);
}