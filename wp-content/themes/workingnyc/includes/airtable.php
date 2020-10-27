<?php
/**
 * Airtable functions to populate query parameters of an airtable form
 */

/**
 * Returns the user's browser
 */
function get_current_browser() {
  if(strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== FALSE){
    return 'Internet+Explorer';
  }
  else if(strpos($_SERVER['HTTP_USER_AGENT'], 'Trident') !== FALSE){
    return 'Internet+Explorer';
  }
  else if(strpos($_SERVER['HTTP_USER_AGENT'], 'Firefox') !== FALSE){
    return 'Firefox';
  }
  else if(strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome') !== FALSE){
    return 'Chrome';
  }
  else if(strpos($_SERVER['HTTP_USER_AGENT'], 'Safari') !== FALSE){
    return "Safari";
  }
  else{
    return 'Other';
  }
}

/**
 * Returns Mobile or Desktop
 */
function get_mobile_desktop(){
  if (wp_is_mobile()){
    return 'Mobile';
  }
  else {
    return 'Desktop';
  }
}

/**
 * Returns the English Name for the Language
 */
function get_language_name(){
  global $sitepress;
  $details = $sitepress->get_language_details(ICL_LANGUAGE_CODE);
  $language_name = preg_replace('/[[:space:]]+/', '+', $details['english_name']);;
  return $language_name;
}