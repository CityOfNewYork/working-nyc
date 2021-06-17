<?php

/**
 * Page
 *
 * @author NYC Opportunity
 */

namespace WorkingNYC;

use Timber;

class Page extends Timber\Post {
  /**
   * Constructor
   *
   * @return  Object  Instance of Page
   */
  public function __construct($pid = false) {
    if ($pid) {
      parent::__construct($pid);
    } else {
      parent::__construct();
    }
  }
}