<?php

/**
 * Site
 *
 * @author NYC Opportunity
 */

namespace WorkingNYC;

use TimberSite;
use TimberMenu;
use Spatie\SchemaOrg\Schema;

class Site extends TimberSite {
  /**
   * Extends TimberSite constructor
   */
  public function __construct() {
    add_theme_support('title-tag');

    add_theme_support('menus');

    add_filter('timber_context', array($this, 'addToContext'));

    parent::__construct();
  }

  /**
   * Timber Context Object
   *
   * @return  Array  The site context
   */
  public function addToContext($context) {
    $context['language_code'] = ICL_LANGUAGE_CODE;

    $context['newsletter_link'] = (ICL_LANGUAGE_CODE === 'en') ?
      '/newsletter' : '/' . ICL_LANGUAGE_CODE . '/newsletter';

    $context['direction'] = (ICL_LANGUAGE_CODE === 'ar' || ICL_LANGUAGE_CODE === 'ur') ?
      'rtl' : 'ltr';

    $context['site'] = $this;

    $context['programs_archive'] = get_post_type_archive_link('programs');

    $context['jobs_archive'] = get_post_type_archive_link('jobs');

    /**
     * Menus
     */

    $context['header_menu'] = new TimberMenu('header_menu');

    $context['footer_menu'] = new TimberMenu('footer_menu');

    $context['footer_menu_secondary'] = new TimberMenu('footer_menu_secondary');

    $context['footer_menu_tertiary'] = new TimberMenu('footer_menu_tertiary');

    /**
     * WKNYC Settings
     */

    $context['options'] = get_fields('options');

    /**
     * SVG Sprite Paths
     */

    $context['sprites'] = array(
      'wnyc' => strstr(glob(get_template_directory() . '/assets/svg/icons-*')[0], '/wp-content'),
      'feather' => strstr(glob(get_template_directory() . '/assets/svg/feather-*')[0], '/wp-content'),
      'favicon' => strstr(glob(get_template_directory() . '/assets/svg/favicon-*')[0], '/wp-content')
    );

    /**
     * A/B testing variant
     */

    $context['variant'] = get_query_var('wnyc_v', false);

    /**
     * Set default site schema
     */

    $context['schema'] = json_encode($this->getSchema(), JSON_UNESCAPED_SLASHES);

    return $context;
  }

  /**
   * Get website schema
   *
   * @return  Array  Schema
   */
  public function getWebsite() {
    $schema = Schema::webSite()
      ->url(get_bloginfo('url'))
      ->description(get_bloginfo('description'));

    return $schema->toArray();
  }

  /**
   * Get organization schema
   *
   * @return  Array  Schema
   */
  public function getOrganization() {
    $schema = Schema::organization()
      ->name(get_bloginfo('name'))
      ->email(get_bloginfo('admin_email'))
      ->url(get_bloginfo('url'))
      ->logo(get_stylesheet_directory_uri() . '/assets/svg/logo-wnyc-standard.svg');

    return $schema->toArray();
  }

  /**
   * Get Site schemas
   *
   * @return  Array  Schema
   */
  public function getSchema() {
    $schemas = array();

    array_push(
      $schemas,
      $this->getWebsite(),
      $this->getOrganization()
    );

    return $schemas;
  }
}
