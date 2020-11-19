<?php
/**
 * Extract the fields from a Mailchimp HTML embed form
 */

namespace WorkingNYC;

/**
 * Dependencies
 */
use DOMDocument;
use DOMXPath;
use stdClass;

/**
 * Parse the form fields
 * Returns an array of objects back to the user
 */
function parse_fields($str){

  $DOM = new DOMDocument();
  $DOM->loadHTML($str);

  $xpath = new DOMXPath($DOM);

  // gets all the inputs in the mailchimp form
  $fields = $xpath->query('//input[contains(@id,"mce-")]');

  // loop through all of the fields
  $array_objs = [];
  $fieldset_group = '';
  foreach($fields as $field){
    $new_field = new stdClass();
    $new_fieldset = new stdClass();

    $value = $field->getAttribute("value");
    $name = $field->getAttribute("name");
    $type = $field->getAttribute("type");
    $id = $field->getAttribute("id");
    $class = $field->getAttribute("class");
    $label = $field->parentNode->nodeValue;

    if ($type != 'checkbox') {
    
      $new_field = create_obj($value, $name, $type, $id, $label, $class);
      
      array_push($array_objs, $new_field);

    } else {

      preg_match('/\[(.*?)\]/', $id, $matches);
      $group = $matches[1];

      $nested_field = new stdClass();

      // create the array of objects or appends object to existing array
      if ($group != $fieldset_group) {
        $labels = $field->parentNode->parentNode->parentNode->nodeValue;
        $labels = explode(PHP_EOL, $labels);

        // get the label of the fieldset
        foreach($labels as $fl){
          if ($fl != '') {
            $field_label = $fl;
            break;
          }
        }

        $new_field->type = $type;
        $new_field->legend = $field_label;
        $new_field->group = $group;
        $new_field->fields = array();
        $fieldset_group = $group;

        $nested_field=create_obj($value, $name, $type, $id, $label, $class);
        
        array_push($new_field->fields, $nested_field);
        array_push($array_objs, $new_field);
        
      } else {
        $nested_field=create_obj($value, $name, $type, $id, $label, $class);
        
        $last_index = count($array_objs) - 1;
        
        array_push($array_objs[$last_index]->fields, $nested_field);
      }
    }
  }

  return $array_objs;
}

/**
 * Creates an object with keys for element
 */
function create_obj($value, $name, $type, $id, $label, $class) {
  $obj = new stdClass();
  $obj->type = $type;
  $obj->name = $name;
  $obj->value = $value;
  $obj->id = $id;
  $obj->for = $id;
  $obj->label = $label;
  
  // determine required
  if (strpos($class, 'required') !== false) {
    $obj->required = 'true';
  } else {
    $obj->required = 'false';
  }

  return $obj;
  
}
