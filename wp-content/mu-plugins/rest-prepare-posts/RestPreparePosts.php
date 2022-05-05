<?php

namespace RestPreparePosts;

/**
 * Functions for preparing posts for the WP Rest API
 */
class RestPreparePosts {
  /** Required. The post type of the rest client */
  public $type = '';

  /** The taxonomies of the site */
  public $taxonomies = array();

  /** The Timber Posts context class directory **/
  public $timberContext = 'timber-posts';

  /** Namespace for the Timber Posts context classes */
  public $timberNamespace = 'Context';

  /**
   * This will get public taxonomies of a particular post. For custom taxonomies
   * the "show_in_rest" configuration must be set to true on registration.
   *
   * @param   Number  $id  The Post ID.
   *
   * @return  Array        The post's public, show in rest, terms.
   */
  public function getTerms($id) {
    $terms = array();

    foreach ($this->taxonomies as $taxonomy) {
      $postTerms = get_the_terms($id, $taxonomy->name);

      if ($postTerms) {
        $terms = array_merge($terms, get_the_terms($id, $taxonomy->name));
      }
    }

    return $terms;
  }

  /**
   * Get the Timber Controller and construct a Timber post. Return context
   * that extends the Timber View of the post.
   *
   * @param   Number  $id  ID of the post
   *
   * @return  Array        If REST method exists in post ctrl, return items.
   */
  public function getTimberContext($id) {
    $slug = str_replace('_', '-', $this->type);

    $class = str_replace(' ', '', ucwords(str_replace('-', ' ', $slug)));

    $path = get_stylesheet_directory() .
      '/' . $this->timberContext . '/' . ucwords($slug) . '.php';

    if (file_exists($path)) {
      require_once $path;
    } else {
      return array();
    }

    $cntrlClass = "$this->timberNamespace\\$class";

    $cntrlPost = new $cntrlClass($id);

    return (method_exists($cntrlPost, 'showInRest')) ?
      $cntrlPost->showInRest() : null;
  }
}
