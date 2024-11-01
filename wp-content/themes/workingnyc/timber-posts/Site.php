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
      '/jobseekers/newsletter' : '/' . ICL_LANGUAGE_CODE . '/jobseekers/newsletter';

    $context['direction'] = (ICL_LANGUAGE_CODE === 'ar' || ICL_LANGUAGE_CODE === 'ur') ?
      'rtl' : 'ltr';

    $context['site'] = $this;

    /**
     * Menus
     */

    $context['job_seeker_header_right_menu'] = new TimberMenu('job_seeker_header_right_menu');

    $context['employer_header_right_menu'] = new TimberMenu('employer_header_right_menu');

    $context['job_seeker_footer_menu'] = new TimberMenu('job_seeker_footer_menu');

    $context['job_seeker_footer_menu_secondary'] = new TimberMenu('job_seeker_footer_menu_secondary'); // not in use

    $context['job_seeker_footer_menu_tertiary'] = new TimberMenu('job_seeker_footer_menu_tertiary');

    $context['employer_footer_menu'] = new TimberMenu('employer_footer_menu');

    $context['global_footer_menu'] = new TimberMenu('global_footer_menu');

    $context['job_seeker_header_left_menu'] = new TimberMenu('job_seeker_header_left_menu');

    $context['employer_header_left_menu'] = new TimberMenu('employer_header_left_menu');

    /**
     * WKNYC Settings
     */

    $defaultLanguage = 'en';
    add_filter('acf/settings/current_language', function() use ($defaultLanguage) {
      return $defaultLanguage;
    }, 10, 1);
    $context['options'] = get_fields('options');
    remove_filter('acf/settings/current_language', function() use ($defaultLanguage) {
      return $defaultLanguage;
    }, 10, 1);

    /**
     * SVG Sprite Paths
     */

    $context['sprites'] = array(
      'svgs' => strstr(glob(get_template_directory() . '/assets/svg/svgs-*')[0], '/wp-content'),
      'elements' => strstr(glob(get_template_directory() . '/assets/svg/pattern-elements-*')[0], '/wp-content'),
      'lucide' => strstr(glob(get_template_directory() . '/assets/svg/lucide-*')[0], '/wp-content'),
      'wknyc' => strstr(glob(get_template_directory() . '/assets/svg/wknyc-*')[0], '/wp-content'),
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
