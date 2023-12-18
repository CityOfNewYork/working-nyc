<?php

/**
 * EmployerPrograms
 *
 * @link  http://localhost:8080/employer-programs/
 * @link  http://localhost:8080/wp-json/wp/v2/employer-programs
 *
 * @author NYC Opportunity
 */

namespace WorkingNYC;

use Timber;
use Spatie\SchemaOrg\Schema;

class EmployerPrograms extends Timber\Post {
  const SINGULAR = 'employer-program'; // todo: see where this is used
  const SECTION_ID = 'field_657c7258fba7a';

  /**
   * Constructor
   *
   * @return  Object  Instance of EmployerPrograms
   */
  public function __construct($pid = false) {
    if ($pid) {
      parent::__construct($pid);
    } else {
      parent::__construct();
    }

    /**
     * The ID will be null if the post doesn't exist
     */

    if (null === $this->id) {
      return false;
    }

    /**
     * Set Context
     */

    $this->singular = self::SINGULAR;

    $this->employer_program_title = $this->getTitle();

    $this->archive = get_post_type_archive_link('employer-programs');

    $this->link = $this->getLink();

    $this->link_label = $this->getLinkLabel();

    $this->schema = $this->getSchema();

    $this->sections = $this->getSections();

    return $this;
  }

  /**
   * Items returned in this object determine what is shown in the WP REST API.
   * Called by the 'rest-prepare-posts.php' must use plugin.
   *
   * @return  Array  Items to show in the WP REST API
   */
  public function showInRest() {
    return array(
      'employer_program_title' => $this->getTitle(),
      'link' => $this->getLink(),
      'link_label' => $this->getLinkLabel()
    );
  }

  /**
   * Get the real program title.
   *
   * @return  String  The program title
   */
  public function getTitle() {
    return $this->post_title;
  }

  /**
   * Get the link based on wether the resource is external or not
   *
   * @return  String  The full URL string to the resource
   */
  public function getLink() {
    return get_permalink($this->ID);
  }

  /**
   * Get the external button link label for the program which is the domain
   * of the link it is going to.
   * TODO: update this
   *
   * @return  String  The link label
   */
  public function getLinkLabel() {
    return 'test link label!';
  }

  /**
   * Get Schemas for the program
   *
   * @return  Array  Program schemas
   */
  public function getSchema() {
    $schemas = array();

    // TODO: implement this. see Programs.php for an example

    return $schemas;
  }

  public function getSections() {
    return get_field(SECTION_ID, $this->id);
  }
}
