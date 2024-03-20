<?php

/**
 * JobBoards
 *
 * @author NYC Opportunity
 */

namespace WorkingNYC;

use Timber;
use Spatie\SchemaOrg\Schema;

class JobBoards extends Timber\Post {
  const SINGULAR = 'job-board'; // used to render card in collection.twig

  /**
   * Constructor
   *
   * @return  Object  Instance of JobBoards
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

    $this->singular = self::SINGULAR;
    return $this;
  }
}
