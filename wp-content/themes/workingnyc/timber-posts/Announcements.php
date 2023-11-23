<?php

/**
 * Announcements
 *
 * @author NYC Opportunity
 */

namespace WorkingNYC;

use Timber;

class Announcements extends Timber\Post {
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
     * The ID will be null if the post doesn't exist
     */

    if (null === $this->id) {
      return false;
    }

    /**
     * Set Context
     */

    $this->link = $this->getLink();

    $this->short_link = $this->getShortLink();

    $this->target = ($this->announcement_is_external === 'Yes')
      ? '_blank' : '_self';

    $this->date_updated = $this->getDateUpdated();

    $this->status = __('New', 'WNYC');

    $this->status_title = __('Updated in the last 7 days', 'WNYC');

    $this->status_period = '-7 days';

    $this->archive = get_home_url() . '/#announcements';

    return $this;
  }

  /**
   * Get the appropriate link based on the post external setting
   *
   * @return  String  The announcement URL
   */
  public function getLink() {
    $href = '';

    switch ($this->announcement_is_external) {
      case 'Yes':
        $href = $this->announcement_url;
        break;

      case 'No':
        $anchor = ($this->announcement_content_anchor) ?
          '#' . str_replace(' ', '-', strtolower(($this->announcement_content_anchor))) : '';

        $href = get_permalink($this->announcement_content) . $anchor;
        break;

      default:
        $href = get_permalink($this->ID);
    }

    return $href;
  }

  /**
   * Get the appropriate short link based on the post external setting
   *
   * @return  String  The announcement short link
   */
  public function getShortLink() {
    switch ($this->announcement_is_external) {
      case 'Yes':
        $href = $this->announcement_url;
        break;

      case 'No':
        $href = wp_get_shortlink($this->announcement_content);
        break;

      default:
        $href = wp_get_shortlink($this->ID);
    }

    return $href;
  }

  /**
   * Get the date the post was updated
   *
   * @return  String  The date the post was updated in UTC format
   */
  public function getDateUpdated() {
    return $this->post_modified;
  }
}
