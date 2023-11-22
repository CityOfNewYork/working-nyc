<?php

/**
 * Template Name: Open Graph Image
 *
 * @author NYC Opportunity
 */

$dir = WPMU_PLUGIN_DIR . '/wp-og-images';

if (file_exists($dir)) {
  $p = get_query_var('wnyc_ogi', get_option('page_on_front'));

  $post = Timber::get_post($p);

  $post = ($post->post_type) ? $post : Timber::get_post(get_option('page_on_front'));

  $type = ($p) ? ucfirst($post->type) : '';

  if (file_exists(WorkingNYC\timber_post($type))) {
    require_once WorkingNYC\timber_post($type);

    switch ($type) {
      case 'Programs':
        $post = new WorkingNYC\Programs($post);

        break;
      
      case 'EmployerPrograms':
        $post = new WorkingNYC\EmployerPrograms($post);

        break;

      case 'Guides':
        $post = new WorkingNYC\Guides($post);

        break;

      case 'Jobs':
        $post = new WorkingNYC\Jobs($post);

        break;

      case 'Announcements':
        $post = new WorkingNYC\Announcements($post);

        break;

      case 'Page':
        $post = new WorkingNYC\Page($post);

        break;
    }
  }

  $meta = new WorkingNYC\Meta($post);

  $ogImage = $meta->getOgImage();

  header($ogImage->header);

  imagepng($ogImage->image, null, $ogImage->quality);

  $ogImage->destroy();
}
