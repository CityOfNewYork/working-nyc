<?php

namespace WorkingNYC;

use Timber;

class Questionnaire {
  public $template = 'components/questionnaire.twig';

  const FIELD_HEADING = 'field_636024ab4107b';

  const FIELD_DESCRIPTION = 'field_636024be4107c';

  const FIELD_POST_TYPE = 'field_5f2a065e594db';

  const FIELD_THRESHOLD = 'field_5f2c6ee0454a2';

  const FIELD_QUESTIONS = 'field_5f2a0535594d6';

  const FIELD_IMAGE = 'field_635a9d1cd13d4';

  const FIELD_POSITION = 'field_635a9c2ad13d3';

  /**
   * Questionnaire Constructor
   *
   * @param   Object  $post  The post the questionnaire is attached to.
   *
   * @return  Object         Instance of Questionnaire
   */
  public function __construct($post) {
    $this->post = $post;

    $this->heading = $this->getHeading();

    $this->description = $this->getDescription();

    $this->type = $this->getPostType();

    $this->threshold = $this->getThreshold();

    $this->questions = $this->getQuestions();

    $this->thumbnail = $this->getThumbnail();

    $this->position = $this->getPosition();

    return $this;
  }

  /**
   * Get the questionnaire section heading
   *
   * @return  String  Section heading
   */
  public function getHeading() {
    $heading = get_field(self::FIELD_HEADING, $this->post->post_id);

    return $heading;
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
   * Gets questionnaire post type
   *
   * @return String  post type slug.
   */
  public function getPostType() {
    $postType = get_field(self::FIELD_POST_TYPE, $this->post->post_id);

    return $postType;
  }

  /**
   * Gets Questionnaire post threshold
   *
   * @return  Integer  Min number of posts
   */
  public function getThreshold() {
    $threshold = get_field(self::FIELD_THRESHOLD, $this->post->id);

    return $threshold;
  }

  /**
   * Gets get Questionnaire fields
   *
   * @return  Array  The collection of questions
   */
  public function getQuestions($id = null) {
    $questions = get_field(self::FIELD_QUESTIONS, $this->post->id);

    return $questions;
  }

  /**
   * Get the background image for the Questionnaire
   *
   * @return  Object  Instance of Timber\Image
   */
  public function getThumbnail() {
    $id = get_field(self::FIELD_IMAGE, $this->post->id);

    if (false === $id) {
      return false;
    }

    $thumbnail = new Timber\Image($id);

    return (null == $thumbnail->ID) ? false : $thumbnail;
  }

  /**
   * Get the position for the questionnaire
   *
   * @return  Number  The index where the questionnaire will display
   */
  public function getPosition() {
    $position = get_field(self::FIELD_POSITION, $this->post->id);

    return $position;
  }
}
