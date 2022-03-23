<?php

namespace WorkingNYC;

use Timber;

/**
 * Constructs a view's Meta instance, fetching the custom field values for the post by ID or permalink slug
 *
 * @author NYC Opportunity
 */
class Meta {
  /**
   * Constructor
   *
   * @param   String/Number  $pid  Either the post permalink to use with get_page_by_path or the post ID
   *
   * @return  Object               Instance of Meta
   */
  public function __construct($pid) {
    if (is_string($pid)) {
      $this->id = defined('ICL_LANGUAGE_CODE')
        ? icl_object_id(get_page_by_path($path)->ID, 'page', true, ICL_LANGUAGE_CODE) : get_page_by_path($path)->ID;
    } else {
      $this->id = $pid;
    }

    $this->post = Timber::get_post($this->id);

    $this->is_homepage = (is_page_template('template-home-page.php') || is_front_page());

    $this->description = $this->getDescription();

    $this->keywords = $this->getKeywords();

    $this->robots = $this->getRobots();

    $this->og_type = (defined('META_OG_TYPE')) ? META_OG_TYPE : '';

    $this->og_title = $this->getOgTitle();

    $this->og_description = $this->getOgDescription();

    $this->og_image = $this->getOgImage();

    $this->twitter_card_type = $this->getTwitterCardType();

    $this->twitter_site = (defined('META_TWITTER_SITE')) ? META_TWITTER_SITE : '';

    return $this;
  }

  /**
   * Get the meta description for the post. Falls back to Blog info, Program,
   * or Announcement content if blank.
   *
   * @return  String  The meta description
   */
  public function getDescription() {
    $description = get_field(self::FIELD_DESCRIPTION, $this->id);

    if (empty($description)) {
      switch ($this->post->post_type) {
        case 'page':
          $description = ($this->is_homepage) ? get_bloginfo('description') : $description;

          break;

        case 'announcements':
          $description = get_field(self::FIELD_ANNOUNCEMENT_DETAILS, $this->id);

          break;

        case 'programs':
          $description = get_field(self::FIELD_PROGRAM_INTRO, $this->id);

          break;

        case 'jobs':
          $description = get_field(self::FIELD_JOB_DESCRIPTION, $this->id);

          $description = trim(substr(strip_tags($description), 0, 120)) . '... ';

          break;
      }
    }

    return strip_tags($description);
  }

  /**
   * Get the meta keywords for the post/page
   *
   * @return  String  The meta keywords
   */
  public function getKeywords() {
    return get_field(self::FIELD_KEYWORDS, $this->id);
  }

  /**
   * Get the meta robots conditions for the page/post
   *
   * @return  String  The robots rules
   */
  public function getRobots() {
    return get_field(self::FIELD_ROBOTS, $this->id);
  }

  /**
   * Get the OG title field value for the page/post. Falls back to Blog
   * info, Program, or Announcement content if blank. Falls back to the
   * post title if blank.
   *
   * @return  String  The OG title value
   */
  public function getOgTitle() {
    $title = get_field(self::FIELD_OG_TITLE, $this->id);

    if (empty($title)) {
      switch ($this->post->post_type) {
        case 'page':
          $title = ($this->is_homepage) ? get_bloginfo('name') : $title;

          break;

        case 'announcements':
          $title = get_field(self::FIELD_ANNOUNCEMENT_TITLE, $this->id);

          break;

        case 'programs':
          $title = get_field(self::FIELD_PROGRAM_TITLE, $this->id);

          break;
      }
    }

    if (empty($title)) {
      $title = $this->post->post_title;
    }

    return $title;
  }

  /**
   * Get the OG Description field for the post. Falls back to Blog info,
   * Program, or Announcement content if blank.
   *
   * @return  String  The OG description value
   */
  public function getOgDescription() {
    $description = get_field(self::FIELD_OG_DESCRIPTION, $this->id);

    if (empty($description)) {
      switch ($this->post->post_type) {
        case 'page':
          $description = ($this->is_homepage) ? get_bloginfo('description') : $description;

          break;

        case 'announcements':
          $description = get_field(self::FIELD_ANNOUNCEMENT_DETAILS, $this->id);

          break;

        case 'programs':
          $description = get_field(self::FIELD_PROGRAM_INTRO, $this->id);

          break;

        case 'jobs':
          $description = get_field(self::FIELD_JOB_DESCRIPTION, $this->id);

          $description = trim(substr(strip_tags($description), 0, 120)) . '... ';

          break;
      }
    }

    return strip_tags($description);
  }

  /**
   * Gets the post image attachment values needed for the OG image meta tags.
   * Falls back to the default image in the site settings if blank.
   *
   * @return  Array/String  Returns an array of the image ID, url, and alt text.
   *                        Blank string if there is no image.
   */
  public function getOgImage() {
    $custom = get_field(self::FIELD_OG_IMAGE, $this->id);

    $id = ($custom) ? $custom : get_field(self::FIELD_OG_IMAGE_DEFAULT, 'option');

    return (empty($id)) ? '' : array(
      'id' => $id,
      'url' => wp_get_attachment_image_src($id, 'full', false, 'src')[0],
      'alt' => get_post_meta($id, '_wp_attachment_image_alt', true)
    );
  }

  /**
   * Constructs the Twitter card type based on the value of the OG Image
   *
   * @return  String  Twitter card image type
   */
  public function getTwitterCardType() {
    return (empty($this->og_image)) ? 'summary' : 'summary_large_image';
  }

  /**
   * Constants
   */

  const FIELD_DESCRIPTION = 'field_5efa4326ea712';

  const FIELD_KEYWORDS = 'field_5efa4334ea713';

  const FIELD_ROBOTS = 'field_5f07332db6a31';

  const FIELD_OG_TITLE = 'field_5eb97fb30adde';

  const FIELD_OG_DESCRIPTION = 'field_5eb97ff40addf';

  const FIELD_OG_IMAGE = 'field_5eb980150ade0';

  const FIELD_OG_IMAGE_DEFAULT = 'field_60ca172bfebdf';

  const FIELD_PROGRAM_INTRO = 'field_5ef375d688d7e';

  const FIELD_PROGRAM_TITLE = 'field_5ef25f691edae';

  const FIELD_ANNOUNCEMENT_TITLE = 'field_5fc55e19cfde8';

  const FIELD_ANNOUNCEMENT_DETAILS = 'field_5fc55e34cfde9';

  const FIELD_JOB_DESCRIPTION = 'field_622b9692c9dff';
}
