<?php
/* @param string $meta Meta name.
 * @param array $details Contains the details for the field.
 * @param string $value Contains input value;
 * @param string $context Context where the function is used. Depending on it some actions are preformed.;
 * @return string $element input element html string. */

$item_title = esc_attr( $details['title'] );
$element .= '<h3>' . $item_title . '</h3>';
?>