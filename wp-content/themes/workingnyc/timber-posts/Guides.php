<?php

/**
 * Guides
 *
 * @link  http://localhost:8080/guides/
 * @link  http://localhost:8080/wp-json/wp/v2/guides
 *
 * @author NYC Opportunity
 */

namespace WorkingNYC;

use Timber;

class Guides extends Timber\Post {
  const SINGULAR = 'guide';

  /**
   * Constructor
   *
   * @return  Object  Instance of Guides
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

    $this->archive = get_post_type_archive_link('guides');

    $this->link = $this->getLink();

    // $this->link_target = $this->getLinkTarget();

    $this->title = $this->getTitle();

    $this->preview = $this->getPreview();

    $this->icon = $this->getIcon();

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
    return array(
      'link' => $this->getLink(),
      // 'link_target' => $this->getLinkTarget(),
      'title' => $this->getTitle(),
      'preview' => $this->getPreview(),
      'icon' => $this->getIcon()
    );
  }

  /**
   * Getters
   */

  /**
   * Get the link for the guide
   *
   * @return  String  Post link
   */
  public function getLink() {
    return get_permalink($this->ID);
  }

  /**
   * Get the title for the guide
   *
   * @return  String  Guide title
   */
  public function getTitle() {
    return $this->post_title;
  }

  /**
   * Get the preview text for the guide
   *
   * @return  String  Preview text
   */
  public function getPreview() {
    return $this->custom['guide_preview'];
  }

  /**
   * Get the icon, based on the icon term taxonomy, for the guide
   *
   * @return  Object  The icon taxonomy term
   */
  public function getIcon() {
    $icons = get_the_terms($this->ID, 'icons');

    return ($icons) ? array_shift($icons) : '';
  }
}
