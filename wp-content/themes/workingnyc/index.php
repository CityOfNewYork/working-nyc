<?php
/**
* Index template and Homepage
*
* A fallback list template used if a more specific template is not available
*
*/

$context = Timber::get_context();

$template = 'index.twig';

Timber::render( $template, $context );