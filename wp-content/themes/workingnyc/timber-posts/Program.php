<?php

/**
 * Program
 *
 * @author NYC Opportunity
 */

namespace WorkingNYC;

use Timber;

class Program extends Timber\Post {
  /**
   * Constructor
   *
   * @return  Object  Instance of Announcement
   */
  public function __construct($pid = false) {
    if ($pid) {
      parent::__construct($pid);
    } else {
      parent::__construct();
    }

    /**
     * Set Context
     */

    $this->status = $this->getStatus();

    return $this;
  }

  /**
   * Construct the program status for program cards
   *
   * @return  Boolean/Array  The program status
   */
  public function getStatus() {
    $s = array(
      'actively_recruiting' => ($this->terms('recruitment_status')[0]->slug === 'actively-recruiting'),
      'disability_info' => ($this->custom['program_disability'] != ''),
      'language_access_info' => ($this->custom['program_language_access'] != '')
    );

    return ($s['actively_recruiting'] || $s['disability_info'] || $s['language_access_info']) ? $s : false;
  }
}
