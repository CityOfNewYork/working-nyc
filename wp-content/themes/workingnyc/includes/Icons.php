<?php

namespace WorkingNYC;

class Icons {
  public $taxonomy = 'icons';

  public $label = 'Icons';

  public $singular = 'Icon';

  public $postTypes = [];

  public $terms = [
    array(
      'term' => 'Cash & Expenses',
      'slug' => 'cash-expenses'
    ),
    array(
      'term' => 'Food',
      'slug' => 'food'
    ),
    array(
      'term' => 'Work',
      'slug' => 'work'
    ),
    array(
      'term' => 'Health',
      'slug' => 'health'
    ),
    array(
      'term' => 'People with Disabilities',
      'slug' => 'people-disabilities'
    ),
    array(
      'term' => 'Housing',
      'slug' => 'housing'
    ),
    array(
      'term' => 'Enrichment',
      'slug' => 'enrichment'
    ),
    array(
      'term' => 'Child Care',
      'slug' => 'child-care'
    ),
    array(
      'term' => 'Identification',
      'slug' => 'identification'
    ),
    array(
      'term' => 'Education',
      'slug' => 'education'
    ),
    array(
      'term' => 'Family Services',
      'slug' => 'family-services'
    ),
    array(
      'term' => 'English & Math',
      'slug' => 'english-math'
    ),
    array(
      'term' => 'Career Services',
      'slug' => 'career-services'
    ),
    array(
      'term' => 'Certification',
      'slug' => 'certification'
    )
  ];

  /**
   * Construct the Icons instance, register and insert taxonomy
   *
   * @return  Object  Instance of Icons
   */
  public function __construct($postTypes) {
    $this->postTypes = $postTypes;

    add_action('init', function() {
      $this->registerTaxonomy()->wpInsertTerms();
    });

    return $this;
  }

  /**
   * Insert terms into the database
   *
   * @return  Object  Instance of Icons
   */
  public function wpInsertTerms() {
    foreach ($this->terms as $term) {
      if (null === term_exists($term['slug'], $this->taxonomy)) {
        wp_insert_term($term['term'], $this->taxonomy, [
          'slug' => $term['slug'],
        ]);
      }
    }

    return $this;
  }

  /**
   * Register the icons taxonomy
   *
   * @return  Object  Instance of Icons
   */
  public function registerTaxonomy() {
    /**
     * Taxonomy: Icons
     *
     * @author NYC Opportunity
     */
    register_taxonomy($this->taxonomy, $this->postTypes, array(
      'label' => __($this->label),
      'labels' => array(
        'name' => __($this->label),
        'singular_name' => __($this->singular)
      ),
      'public' => false,
      'publicly_queryable' => false,
      'hierarchical' => true,
      'show_ui' => true,
      'show_in_menu' => false,
      'show_in_nav_menus' => false,
      'query_var' => false,
      'rewrite' => array(
        'slug' => $this->taxonomy,
        'with_front' => true
      ),
      'show_admin_column' => true,
      'show_in_rest' => false, // This must be false to prevent it from showing in front-end filters
      'show_tagcloud' => false,
      'rest_base' => $this->taxonomy,
      'rest_controller_class' => 'WP_REST_Terms_Controller',
      'show_in_quick_edit' => true
    ));

    return $this;
  }
}
