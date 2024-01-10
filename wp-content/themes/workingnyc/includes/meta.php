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
   * @param   Object  $post  The post to construct Meta data for.
   *
   * @return  Object         Instance of Meta
   */
  public function __construct($post) {
    $this->post = $post;

    $this->is_homepage = (get_option('page_on_front') == $this->post->ID);

    $this->description = $this->getDescription();

    $this->keywords = $this->getKeywords();

    $this->robots = $this->getRobots();

    $this->og_type = (defined('META_OG_TYPE')) ? META_OG_TYPE : '';

    $this->og_title = $this->getOgTitle();

    $this->og_description = $this->getOgDescription();

    $this->og_image_url = $this->getOgImageUrl();

    $this->og_image_alt = $this->getOgImageAlt();

    $this->twitter_card_type = $this->getTwitterCardType();

    $this->twitter_site = (defined('META_TWITTER_SITE')) ? META_TWITTER_SITE : '';

    // unset($this->post);

    return $this;
  }

  /**
   * Get the meta description for the post. Falls back to Blog info, Program,
   * or Announcement content if blank.
   *
   * @return  String  The meta description
   */
  public function getDescription() {
    $description = get_field(self::FIELD_DESCRIPTION, $this->post->id);

    if (empty($description)) {
      switch ($this->post->post_type) {
        case 'page':
          $description = ($this->is_homepage) ? get_bloginfo('description') : $description;

          break;

        case 'announcements':
          $description = $this->post->announcement_details;

          break;

        case 'programs':
          $description = $this->post->preview;

          break;

        case 'employer-programs':
          $description = 'Test employer programs meta';

          break;

        case 'jobs':
          $description = $this->post->summary;

          break;

        case 'guides':
          $description = $this->post->preview;

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
    return get_field(self::FIELD_KEYWORDS, $this->post->id);
  }

  /**
   * Get the meta robots conditions for the page/post
   *
   * @return  String  The robots rules
   */
  public function getRobots() {
    return get_field(self::FIELD_ROBOTS, $this->post->id);
  }

  /**
   * Get the OG title field value for the page/post. Falls back to Blog
   * info, Program, or Announcement content if blank. Falls back to the
   * post title if blank.
   *
   * @return  String  The OG title value
   */
  public function getOgTitle() {
    $title = get_field(self::FIELD_OG_TITLE, $this->post->id);

    if (empty($title)) {
      switch ($this->post->post_type) {
        case 'page':
          $title = ($this->is_homepage) ? get_bloginfo('name') : $this->post->post_title;

          break;

        case 'announcements':
          $title = $this->post->announcement_title;

          break;

        case 'programs':
          $title = $this->post->program_plain_language_title;

          break;

        case 'guides':
          $title = $this->post->title;

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
    $description = get_field(self::FIELD_OG_DESCRIPTION, $this->post->id);

    if (empty($description)) {
      switch ($this->post->post_type) {
        case 'page':
          $description = ($this->is_homepage) ? get_bloginfo('description') : $description;

          break;

        case 'announcements':
          $description = $this->post->announcement_details;

          break;

        case 'programs':
          $description = $this->post->preview;

          break;

        case 'jobs':
          $description = $this->post->summary;

          break;

        case 'guides':
          $description = $this->post->preview;

          break;
      }
    }

    return strip_tags($description);
  }

  /**
   * If the default Open Graph Image is set return the URL for open graph images
   *
   * @return  String  URL to the Open Graph Image endpoint
   */
  public function getOgImageUrl() {
    $dir = WPMU_PLUGIN_DIR . '/wp-og-images';

    if (false === file_exists($dir)) {
      return false;
    }

    $default = get_field(self::FIELD_OG_IMAGE_DEFAULT, 'option');

    $endpoint = get_page_by_path('open-graph-image');

    return ($default && $endpoint) ? get_permalink($endpoint) . '?wnyc_ogi=' . $this->post->ID : false;
  }

  /**
   * Get the alt description for the background of the Open Graph Image
   *
   * @return  String  Alternative text for the image
   */
  public function getOgImageAlt() {
    $dir = WPMU_PLUGIN_DIR . '/wp-og-images';

    if (false === file_exists($dir)) {
      return false;
    }

    $customBackground = get_field(self::FIELD_OG_IMAGE, $this->post->id);

    $backgroundId = ($customBackground) ? $customBackground : get_field(self::FIELD_OG_IMAGE_DEFAULT, 'option');

    return get_post_meta($backgroundId, '_wp_attachment_image_alt', true);
  }

  /**
   * Construct the Open Graph image based on CMS values for different post types.
   * Uses an Must Use plugin under the hood to compose and arrange layers. Refer
   * to the source for details on default font and image settings.
   *
   * @return  Image  GD Image object
   */
  public function getOgImage() {
    $dir = WPMU_PLUGIN_DIR . '/wp-og-images';

    if (false === file_exists($dir)) {
      return false;
    }

    require_once $dir . '/OgImage.php';

    $ogImage = new \NYCO\OgImage();

    /**
     * Get and set the background and logo for the image
     */

    $customBackground = get_field(self::FIELD_OG_IMAGE, $this->post->id);

    $backgroundId = ($customBackground) ? $customBackground : get_field(self::FIELD_OG_IMAGE_DEFAULT, 'option');

    $ogImage->backgroundImg = get_attached_file($backgroundId);

    $customLogo = get_field(self::FIELD_OG_IMAGE_LOGO, $this->post->id);

    $logoId = ($customLogo) ? $customLogo : get_field(self::FIELD_OG_IMAGE_LOGO_DEFAULT, 'option');

    $ogImage->logoImg = get_attached_file($logoId);

    $postTypeObject = get_post_type_object($this->post->post_type);

    /**
     * Get and set text customizations for the image
     */

    switch ($this->post->post_type) {
      case 'programs':
        $ogImage->title = $this->og_title;
        $ogImage->subtitleBold = $this->post->program_title;
        $ogImage->subtitle = $this->post->program_agency ? __('by', 'WNYC') . ' ' . $this->post->program_agency : '';
        $ogImage->verticalAlign = 'middle';

        break;

      case 'jobs':
        $ogImage->title = $this->og_title;
        $ogImage->subtitleBold = ($this->post->sector) ? $this->post->sector : '';

        $subtitle = ($this->post->sector) ? __('with', 'WNYC') . ' ' : '';
        $subtitle = ($this->post->organization) ? $subtitle . $this->post->organization : '';
        $ogImage->subtitle = $subtitle;
        $ogImage->verticalAlign = 'middle';

        break;

      case 'guides':
        $ogImage->title = $this->og_title;
        $ogImage->subtitleBold = '';
        $ogImage->subtitle = $this->og_description;

        $ogImage->fontSizeLarge = 41;
        $ogImage->wrapLarge = 22;
        $ogImage->verticalAlign = 'middle';

        break;

      case 'announcements':
        $ogImage->title = $this->og_title;
        $ogImage->subtitleBold = '';
        $ogImage->subtitle = $this->og_description;

        $ogImage->fontSizeLarge = 41;
        $ogImage->wrapLarge = 22;
        $ogImage->verticalAlign = 'middle';

        break;

      case 'page':
        if ($this->is_homepage) {
          $ogImage->title = $this->og_description;
          $ogImage->subtitleBold = '';
          $ogImage->subtitle = '';

          $ogImage->fontSizeLarge = 40;
          $ogImage->wrapLarge = 26;
        } else {
          $ogImage->title = $this->og_title;
          $ogImage->subtitleBold = '';
          $ogImage->subtitle = $this->og_description;

          $ogImage->fontSizeLarge = 56;
          $ogImage->wrapLarge = 15;
          $ogImage->verticalAlign = 'middle';
        }

        break;
    }

    $ogImage->create();

    return $ogImage;
  }

  /**
   * Constructs the Twitter card type based on the value of the OG Image
   *
   * @return  String  Twitter card image type
   */
  public function getTwitterCardType() {
    return (empty($this->og_image_url)) ? 'summary' : 'summary_large_image';
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

  const FIELD_OG_IMAGE_LOGO = 'field_6372b8e133918';

  const FIELD_OG_IMAGE_LOGO_DEFAULT = 'field_6372aa9ca0fff';
}
