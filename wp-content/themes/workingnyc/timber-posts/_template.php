<?php

/**
 * Jobs
 *
 * @link  http://localhost:8080/{{ types }}/
 * @link  http://localhost:8080/wp-json/wp/v2/{{ types }}
 *
 * @author NYC Opportunity
 */

namespace WorkingNYC;

use Timber;

class Templates extends Timber\Post {
  const SINGULAR = 'type';

  /**
   * Constructor
   *
   * @return  Object  Instance of {{ Types }}
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

    return $this;
  }

  /**
   * Items returned in this object determine what is shown in the WP REST API.
   * Called by the 'rest-prepare-posts.php' must use plugin. This will appear
   * in the 'context' attribute.
   *
   * @return  Array  Items to show in the WP REST API
   */
  public function showInRest() {
    return array();
  }

  /**
   * Getters
   */

  // /**
  //  * Get {{ to get }}
  //  *
  //  * @return  {{ to get }}
  //  */
  // public function get{{ ToGet }}() {
  //
  // }
}
