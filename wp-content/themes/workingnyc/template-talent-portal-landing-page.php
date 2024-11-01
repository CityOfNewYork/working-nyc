<?php

/**
 * Template Name: Talent Portal Landing Page
 *
 * @author NYC Opportunity
 */

/**
 * Context
 */

$context = Timber::get_context();

$post = Timber::get_post();

$context['post'] = $post;

$context['hide_jobseeker_and_employer_navigation'] = true;

/**
 * Set Meta context
 */

$context['meta'] = new WorkingNYC\Meta($post);

$current_page_title = $post->page_title;

/**
 * Update the Document title.
 * add_filter function is not getting invoked to update the doc title. So, removed the title render action and add action to set title.
 */


if (!empty($current_page_title)) {
  remove_action('wp_head', '_wp_render_title_tag', 1);
  add_action('wp_head', function() use ($current_page_title) {
    echo "<title>".esc_html($current_page_title)."</title>";
  }, 1);
}

/**
 * Render the view
 */

$compiled = new WorkingNYC\CompileImgPreload('talent-portal-landing-page.twig', $context);

echo $compiled->html;
