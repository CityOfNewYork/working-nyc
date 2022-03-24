<?php

/**
 * Single Announcement template
 *
 * @author NYC Opportunity
 */

require_once WorkingNYC\timber_post('Announcements');

/**
 * Set the Timber view context
 *
 * @author NYC Opportunity
 */

$context = Timber::get_context();

$post = Timber::get_post();

$context['post'] = new WorkingNYC\Announcements($post);

$context['meta'] = new WorkingNYC\Meta($post->ID);

/**
 * Render the view
 *
 * @author NYC Opportunity
 */

Timber::render('announcement.twig', $context);
