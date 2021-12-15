<?php

/**
 * Determine if browser is IE
 *
 * @return  Boolean if the browser is IE
 */
function is_ie() {
  $IE = 'Trident';
  $IS_IE = strpos($_SERVER['HTTP_USER_AGENT'], $IE);

  return $IS_IE;
}
