<?php

/**
 * Get Path Helpers
 *
 * @author NYC Opportunity
 */

require_once get_stylesheet_directory() . '/includes/paths.php';

/**
 * Timber Site
 *
 * @author NYC Opportunity
 */

require_once WorkingNYC\timber_post('Site');

new WorkingNYC\Site();

/**
 * Require Includes
 *
 * @author NYC Opportunity
 */

WorkingNYC\require_includes();
