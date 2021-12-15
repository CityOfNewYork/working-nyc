<?php

// phpcs:disable
/**
 * Plugin Name: Configure TinyMCE Settings
 * Description: Configuration for the classic WordPress text editor. Adds p, h2, h3, h4, and h5 block options to the TinyMCE editor. Removes the blockquote block. Removes underline, alignjustify, and forecolor from advanced toolbar. Removes the TinyMCE Emoji Plugin.
 * Author: NYC Opportunity
 */
// phpcs:enable

/**
 * Configure TinyMCE settings
 *
 * @param   Array  $init  Array with TinyMCE config
 *
 * @return  Array         Updated array
 */

add_filter('tiny_mce_before_init', function ($init) {
  $style_formats = array(
    array(
      'title' => 'Blockquote',
      'block' => 'blockquote',
      'classes' => 'text-alt mt-0',
      'wrapper' => false,
    ),
    array(
      'title' => 'Blockquote Mark',
      'block' => 'span',
      'classes' => 'blockquote__mark',
      'attributes' => array(
        'aria-hidden' => 'true',
      ),
      'wrapper' => false,
    ),
  );

  $init['style_formats'] = json_encode($style_formats);

  $init['block_formats'] = 'Paragraph=p; Heading 4=h4; Heading 5=h5; Heading 6=h6';

  $init['extended_valid_elements'] = '*[*]';

  return $init;
});

/**
 * Remove buttons from the primary toolbar
 * @param  array $button Array of buttons
 * @return array         Difference between the two arrays
 */
add_filter('mce_buttons', function ($buttons) {
  $remove = array(
    'alignleft',
    'alignright',
    'aligncenter',
    'strikethrough',
    'hr',
    'wp_more'
  );
  return array_diff($buttons, $remove);
});

/**
 * Remove buttons from the advanced toolbar
 * @param  array $button Array of buttons
 * @return array         Difference between the two arrays
 */
add_filter('mce_buttons_2', function ($buttons) {
  $remove = array(
    'underline',
    'alignjustify',
    'forecolor',
    'pastetext',
    'charmap',
    'outdent',
    'indent',
    'undo',
    'redo',
    'wp_help'
  );
  array_unshift($buttons, 'styleselect');

  return array_diff($buttons, $remove);
});

/**
 * Filter function used to remove the tinymce emoji plugin.
 * Taken from https://wordpress.org/plugins/disable-emojis/
 * @param  array $plugins
 * @return array Difference between the two arrays
 */
add_filter('tiny_mce_plugins', function ($plugins) {
  if (is_array($plugins)) {
    return array_diff($plugins, array( 'wpemoji' ));
  } else {
    return array();
  }
});
