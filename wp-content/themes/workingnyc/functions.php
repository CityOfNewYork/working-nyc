<?php

/**
 * Timber Site
 *
 * @author NYC Opportunity
 */

require_once get_stylesheet_directory() . '/timber-posts/Site.php';

new WorkingNYC\Site();

/**
 * Includes
 *
 * @author NYC Opportunity
 */

$includes_dir = get_stylesheet_directory() . '/includes/';
$includes = preg_grep('~\.(php)$~', scandir($includes_dir));

foreach ($includes as $i => $inc) {
  require_once($includes_dir. $inc);
}
