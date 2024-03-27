<?php

namespace WorkingNYC;

use WorkingNYC;
use Timber;

class Collection {
  public $template = 'components/collection.twig';

  /**
   * Construct the collection instance
   *
   * @param   Array  $field  The ACF field data for featured posts
   *
   * @return  Object         Instance of Collection
   */
  public function __construct($field) {
    $this->fields = $field;

    $this->heading = $this->fields['featured_posts_heading'];

    $this->description = $this->fields['featured_posts_description'];

    $this->display = $this->fields['featured_posts_display'];

    $this->posts = $this->getPosts();

    $this->post = (empty($this->posts)) ? false : $this->posts[0];

    $this->types = $this->getTypes();

    $this->archive = $this->getArchive();

    $this->guides = $this->guides();

    $this->cards_information = $this->fields['cards_information'];

    return $this;
  }

  /**
   * Get formatted posts for the collection
   *
   * @return  Array  List of formatted posts
   */
  public function getPosts() {
    require_once WorkingNYC\timber_post('Programs');
    require_once WorkingNYC\timber_post('Jobs');
    require_once WorkingNYC\timber_post('Guides');
    require_once WorkingNYC\timber_post('EmployerPrograms');
    require_once WorkingNYC\timber_post('JobBoards');

    $posts = $this->fields['featured_posts_objects'];

    return (empty($posts)) ? [] : array_map(function($post) {
      switch ($post->post_type) {
        case 'programs':
          $post = new WorkingNYC\Programs($post);

          break;

        case 'jobs':
          $post = new WorkingNYC\Jobs($post);

          break;

        case 'guides':
          $post = new WorkingNYC\Guides($post);

          break;
        
        case 'employer-programs':
          $post = new WorkingNYC\EmployerPrograms($post);

          break;
        case 'job-boards':
          $post = new WorkingNYC\JobBoards($post);

          break;
      }

      return $post;
    }, $posts);
  }

  /**
   * Get the list of post types in the collection
   *
   * @return  Array  An array of unique post types
   */
  public function getTypes() {
    return array_unique(array_map(function($post) {
      return $post->post_type;
    }, $this->posts));
  }

  /**
   * Get the archive link to display after post collection
   *
   * @return  Array  Key, value array with link and label
   */
  public function getArchive() {
    if (false === $this->fields['featured_posts_archive']) {
      return array();
    }

    $archive = (1 === count($this->types)) ? array(
      'link' => get_post_type_archive_link($this->types[0]),
      'label' => __('See all ' . $this->types[0], 'WNYC')
    ) : array();

    $archive['link'] = ($this->fields['featured_posts_archive_link']) ?
      $this->fields['featured_posts_archive_link'] : $archive['link'];

    $archive['link'] = ('callout' === $this->display) ? $this->post->link : $archive['link'];

    $archive['label'] = ($this->fields['featured_posts_archive_label']) ?
      $this->fields['featured_posts_archive_label'] : $archive['label'];

    $archive['external'] = ('yes' === $this->fields['featured_posts_archive_is_external']) ? true : false;

    return $archive;
  }

  /**
   * Determine if this collection consists of Guide post types only
   *
   * @return  Boolean  True if all posts are guides, otherwise false
   */
  public function guides() {
    return (1 === count($this->types) && 'guides' === $this->types[0]);
  }
}
