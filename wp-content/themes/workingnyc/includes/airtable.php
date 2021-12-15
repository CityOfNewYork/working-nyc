<?php

namespace Airtable;

/**
 * Airtable functions to populate query parameters of an airtable form
 */

/**
 * Returns the user's browser
 */
function get_current_browser() {
  if (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false) {
    return 'Internet+Explorer';
  } elseif (strpos($_SERVER['HTTP_USER_AGENT'], 'Trident') !== false) {
    return 'Internet+Explorer';
  } elseif (strpos($_SERVER['HTTP_USER_AGENT'], 'Firefox') !== false) {
    return 'Firefox';
  } elseif (strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome') !== false) {
    return 'Chrome';
  } elseif (strpos($_SERVER['HTTP_USER_AGENT'], 'Safari') !== false) {
    return "Safari";
  } else {
    return 'Other';
  }
}

/**
 * Returns Mobile or Desktop
 */
function get_mobile_desktop(){
  if (wp_is_mobile()) {
    return 'Mobile';
  } else {
    return 'Desktop';
  }
}

/**
 * Returns the English Name for the Language
 */
function get_language_name(){
  global $sitepress;
  $details = $sitepress->get_language_details(ICL_LANGUAGE_CODE);
  $language_name = preg_replace('/[[:space:]]+/', '+', $details['english_name']);
  ;
  return $language_name;
}

/**
 * Returns the question formatted based on Airtable prefill requirements
 */
function get_formatted_string($question){
  return preg_replace('/[[:space:]]+/', '+', $question);
}

/**
 * Wraps the question in the Airtable prefill parameter
 */
function prefill($question){
  return 'prefill_'.$question.'=';
}
