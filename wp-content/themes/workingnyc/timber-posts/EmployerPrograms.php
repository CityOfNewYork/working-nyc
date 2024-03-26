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
  const SINGULAR = 'employer-program'; // used to render card in collection.twig

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

    $this->schema = $this->getSchema();

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
   * Get Schemas for the program
   *
   * @return  Array  Program schemas
   */
  public function getSchema() {
    $schemas = array();

    // TODO: implement this. see Programs.php for an example

    return $schemas;
  }
}
