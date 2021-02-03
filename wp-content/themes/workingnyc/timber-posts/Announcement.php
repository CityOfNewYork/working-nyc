<?php

/**
 * Announcement
 *
 * @author NYC Opportunity
 */

namespace WorkingNYC;

use Timber;

class Announcement extends Timber\Post {
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

    $this->link = $this->getLink();

    $this->shortLink = $this->getShortLink();

    $this->target = ($this->announcement_is_external === 'Yes')
      ? '_blank' : '_self';

    $this->date = $this->getDate();

    $this->status = __('New', 'WNYC');

    $this->statusTitle = __('Updated in the last 7 days', 'WNYC');

    $this->statusPeriod = '-7 days';

    return $this;
  }

  /**
   * Get the appropriate link based on the post external setting
   *
   * @return  String  The announcement URL
   */
  public function getLink() {
    if ($this->announcement_is_external === 'Yes'){
      return $this->announcement_url;
    } else {
      $anchor = ($this->announcement_content_anchor) ? '#' . str_replace(' ', '-', strtolower(($this->announcement_content_anchor))): '';
      return get_permalink($this->announcement_content). $anchor;
    }
  }

  /**
   * Get the appropriate short link based on the post external setting
   *
   * @return  String  The announcement short link
   */
  public function getShortLink() {
    return ($this->announcement_is_external === 'Yes')
      ? $this->announcement_url : wp_get_shortlink($this->announcement_content);
  }

  /**
   * Get the appropriate display date based on the link type
   *
   * @return  String  The announcement date in UTC format
   */
  public function getDate() {
    return ($this->announcement_is_external === 'Yes')
      ? $this->post_modified : $this->get_field('announcement_content')->post_modified;
  }
}
