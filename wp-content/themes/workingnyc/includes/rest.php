<?php

$rest_dir = get_template_directory() .'/includes/rest/';

$files = preg_grep('~\.(php)$~', scandir($rest_dir));

foreach ($files as $i => $file) {
  require_once($rest_dir. $file);
}
