<?php
/**
 * Capturing Meta Tags assigned to Pages and Posts
 */

namespace WorkingNYC;

const META_DESC = 'field_5efa4326ea712';
const META_KEYWORDS = 'field_5efa4334ea713';
const META_ROBOTS = 'field_5f07332db6a31';

/**
 * Get the id of the page or post thru path or id
 * @return integer The ID of the post/page
 */
function get_controller_id($val) {
  if (is_string($val)){
    return get_page(icl_object_id(get_page_by_path($val)->ID, 'page', true, ICL_LANGUAGE_CODE));
  } else {
    return $val;
  }
}

/**
 * Get the meta description for the post/page
 * @return string The meta description
 */
function get_meta_desc($val) {
  $id = get_controller_id($val);
  return get_field('meta_desc', $id);
}

/**
 * Get the meta keywords for the post/page
 * @return string The meta keywords
 */
function get_meta_keywords($val) {
  $id = get_controller_id($val);
  return get_field('meta_keywords', $id);
}

/**
 * Get the meta robots conditions for the page/post
 * @return string The robots rules
 */
function get_meta_robots($val) {
  $id = get_controller_id($val);
  return get_field('meta_robots', $id);
}