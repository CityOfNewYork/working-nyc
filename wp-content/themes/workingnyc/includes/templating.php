<?php

/**
 * Config and functions for working with ACF Flexible Content
 */

namespace Templating;

/**
 * Constants
 */

const SECTION_ID = 'field_5efa3bc7b2e45';
const UPCOMING_EVENTS_ID = 'field_667076fb35544';
const EVENTS_HEADER_ID = 'field_6661febd61135';
const EVENTS_FORM_ID = 'field_66620011a8efb';
const POST_TYPE = 'field_5f1749717b140';
const FILTERS = 'field_5f1747cb7b13d';
const FILTERS_LABEL = 'field_5f1f45154ceb5';
const FEATURED_POSTS_ID = 'field_5f298dc24e4dc';
const EMPLOYER_PROGRAM_TAGS = 'field_656906e8673b1';

/**
 * Functions
 */

/**
 * Gets the sections by ACF field id
 *
 * @return  Array  The collection of sections for the post.
 */
function get_sections($id = null) {
  $sections = get_field(SECTION_ID, $id);

  return $sections;
}

/**
 * Gets the Job Events Form data by ACF field id
 *
 * @return  Array  The collection of upcoming events for the post.
 */
function get_events_form($id = null) {
  $events_form_data = get_field(EVENTS_FORM_ID, $id);

  return $events_form_data;
}

/**
 * Gets the Job Events Header by ACF field id
 *
 * @return  Array  The collection of upcoming events for the post.
 */
function get_events_header($id = null) {
  $events_header = get_field(EVENTS_HEADER_ID, $id);

  return $events_header;
}

/**
 * Gets the upcoming events by ACF field id
 *
 * @return  Array  The collection of upcoming events for the post.
 */
function get_upcoming_events($id = null) {
  $upcoming_events = get_field(UPCOMING_EVENTS_ID, $id);

  return $upcoming_events;
}

/**
 * Gets featured posts
 *
 * @return  Array  The collection of featured posts.
 */
function get_featured_posts($id = null) {
  $featured = get_field(FEATURED_POSTS_ID, $id);

  return $featured;
}

/**
 * Get the id of the post through the page path. Requires a page
 * of the same slug as above to be created.
 *
 * @return  Integer  The ID of the post
 */
function get_controller_id($path) {
  return get_page(icl_object_id(get_page_by_path($path)->ID, 'page', true, ICL_LANGUAGE_CODE));
}

/**
 * Get the tagline from the post/page content
 *
 * @return String  The page tagline
 */
function get_content($path) {
  return get_post_field('post_content', get_controller_id($path));
}

/**
 * Get the title from the post/page
 *
 * @return String  The page title
 */
function get_title($path) {
  return get_the_title(get_controller_id($path));
}

/**
 * Gets the post type based on the path
 *
 * @return String  the post type
 */
function get_post_type($path) {
  $post_type = get_field_object(POST_TYPE, get_controller_id($path));

  return array_keys($post_type['choices'])[0];
}

/**
 * Gets the filters in the order that the user would like to present them
 *
 * @return String  taxonomies comma delimited
 */
function get_filters($path) {
  $arr = get_field(FILTERS, get_controller_id($path));

  $filters = array_column($arr, 'filter_name');

  foreach ($filters as $index => $filter) {
    $filters[$index] = $filter . ':' . get_taxonomy($filter)->label;
  }

  $filters = implode(',', $filters);

  return $filters;
}

/**
 * Gets the label for filters
 *
 * @return String  taxonomies comma delimited
 */
function get_filter_label($path) {
  $label = get_field(FILTERS_LABEL, get_controller_id($path));

  if ($label == '') {
    $label = __('Filters', 'WNYC-Date');
  }

  return $label;
}

/**
 * Gets the tags for an employer program by ACF field id
 *
 * @return  Array  The collection of tags for the program.
 */
function get_employer_program_tags($id = null) {
  $tags = get_field(EMPLOYER_PROGRAM_TAGS, $id);

  return $tags;
}
