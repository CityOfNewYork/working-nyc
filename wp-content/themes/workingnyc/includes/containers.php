<?php

namespace WorkingNYC;

use Timber;

class Containers {
  public $template = 'components/containers.twig';

  const FIELD_DESCRIPTION = 'field_655cd102a46ad';

  const FIELD_IMAGE = 'field_655cd123a46ae';

  /**
   * Containers Constructor
   *
   * @param   Object  $post  The post the containers is attached to.
   *
   * @return  Object         Instance of Containers
   */
  public function __construct($post) {
  
    $this->post = $post;

    $this->description = $this->getDescription();

    $this->thumbnail = $this->getThumbnail();
  }

  
  /**
   * Get the questionnaire section description
   *
   * @return  String  Formatted section description
   */
  public function getDescription() {
    $description = get_field(self::FIELD_DESCRIPTION, $this->post->post_id);

    return $description;
  }

  /**
   * Get the background image for the Questionnaire
   *
   * @return  Object  Instance of Timber\Image
   */
  public function getThumbnail() {
    $id = get_field(self::FIELD_IMAGE, $this->post->ID);

    if (false === $id) {
      return false;
    }

    $thumbnail = new Timber\Image($id);

    return (null == $thumbnail->ID) ? false : $thumbnail;
  }
}
