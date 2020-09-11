<?php

/*
* Archive: Programs
*/

$context = Timber::get_context();

$path = '/programs';

$context['page_title'] = Templating\get_title($path);
$context['page_tagline'] = Templating\get_tagline($path);
$context['post_type'] = Templating\get_post_type($path);

$context['filters'] = Templating\get_filters($path);
$context['filters_label'] = Templating\get_filter_label($path);

$context['meta_desc'] = WorkingNYC\get_meta_desc($path);
$context['meta_keywords'] = WorkingNYC\get_meta_keywords($path);
$context['meta_robots'] = WorkingNYC\get_meta_robots($path);

$context['posts'] = Timber::get_posts();

$template = 'programs/archive.twig';

Timber::render($template, $context);