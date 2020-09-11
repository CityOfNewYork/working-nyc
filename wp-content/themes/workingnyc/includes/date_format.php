<?php
/**
 * Formatting dates
 */

namespace WorkingNYC;

/**
 * Dependencies
 */
use DateTime;

/**
 * Formats the modified date for the page
 * @return string The formatted date
 */
function modified_date_formatted($id) {

  $mod_date = new DateTime(get_the_modified_date( 'Y-m-d', $id ));
  $cur_date = new DateTime(date("Y-m-d"));
  $interval = $mod_date->diff($cur_date);

  if ($interval->d == 0){
    return __('today');
  } else if ($interval->d < 5){
    if ($interval->d == 1) {
      return $interval->d.__(' day ago', 'WNYC-Date');
    } else {
      return $interval->d.__(' days ago', 'WNYC-Date');
    }
  } else {
    return __('on', 'WNYC-Date').$mod_date->format('M d, Y');
  }
}