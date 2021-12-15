<?php

/**
 * Config and functions for working with ACF Flexible Content
 */

namespace Templating;

/**
 * Constants
 */

const SECTION_ID = 'field_5efa3bc7b2e45';
const POST_TYPE = 'field_5f1749717b140';
const FILTERS = 'field_5f1747cb7b13d';
const FILTERS_LABEL = 'field_5f1f45154ceb5';
const FEATURED_POSTS_ID = 'field_5f298dc24e4dc';
const QUESTIONNAIRE_POST_TYPE = 'field_5f2a065e594db';
const QUESTIONNAIRE_THRESHOLD = 'field_5f2c6ee0454a2';
const QUESTIONNAIRE_QS = 'field_5f2a0535594d6';

/**
 * Functions
 */

/**
 * Gets the sections by ACF field id
 * @return array The collection of sections for the post.
 */
function get_sections($id = null) {
  $sections = get_field(SECTION_ID, $id);

  return $sections;
}

/**
 * Gets featured posts
 * @return array The collection of featured posts.
 */
function get_featured_posts($id = null) {
  $featured = get_field(FEATURED_POSTS_ID, $id);

  return $featured;
}

/**
 * Gets questionnaire post type
 * @return string post type slug.
 */
function get_questionnaire_post_type($id = null) {
  $post_type = get_field(QUESTIONNAIRE_POST_TYPE, $id);

  return $post_type;
}

/**
 * Gets questionnaire post threshold
 * @return integer min number of posts.
 */
function get_questionnaire_threshold($id = null) {
  $threshold = get_field(QUESTIONNAIRE_THRESHOLD, $id);

  return $threshold;
}

/**
 * Gets get questionnaire fields
 * @return array The collection of questions.
 */
function get_questionnaire_qs($id = null) {
  $questions = get_field(QUESTIONNAIRE_QS, $id);

  return $questions;
}

/**
 * Get the id of the post through the page path. Requires a page
 * of the same slug as above to be created.
 * @return integer The ID of the post
 */
function get_controller_id($path) {
  return get_page(icl_object_id(get_page_by_path($path)->ID, 'page', true, ICL_LANGUAGE_CODE));
}

/**
 * Get the tagline from the post/page content
 * @return string The page tagline
 */
function get_content($path) {
  return get_post_field('post_content', get_controller_id($path));
}

/**
 * Get the title from the post/page
 * @return string The page title
 */
function get_title($path) {
  return get_the_title(get_controller_id($path));
}

/**
 * Gets the post type based on the path
 * @return string the post type
 */
function get_post_type($path) {
  $post_type = get_field_object(POST_TYPE, get_controller_id($path));

  return array_keys($post_type['choices'])[0];
}

/**
 * Gets the filters in the order that the user would like to present them
 * @return string taxonomies comma delimited
 */
function get_filters($path) {
  $arr = get_field(FILTERS, get_controller_id($path));
  $filters = array_column($arr, 'filter_name');

  foreach ($filters as $index => $filter) {
    $filters[$index] = $filter.':'.get_taxonomy($filter)->label;
  }
  $filters = implode(",", $filters);

  return $filters;
}

/**
 * Gets the label for filters
 * @return string taxonomies comma delimited
 */
function get_filter_label($path) {
  $label = get_field(FILTERS_LABEL, get_controller_id($path));

  if ($label == '') {
    $label = __('Filters', 'WNYC-Date');
  }

  return $label;
}
