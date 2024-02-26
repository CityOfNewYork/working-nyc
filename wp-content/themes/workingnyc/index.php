<?php

/**
 * Index template and Homepage
 *
 * A fallback list template used if a more specific template is not available
 *
 */

// Use the landing page template but with the homepage

/**
 * Context
 */

 $context = Timber::get_context();

 $post = Timber::get_post(get_option('page_on_front'));
 
 $context['post'] = $post;
 
 $context['talent_portal_landing_page'] = true;
 
 /**
  * Set Meta context
  */
 
 $context['meta'] = new WorkingNYC\Meta($post);
 
 /**
  * Render the view
  */
 
 $compiled = new WorkingNYC\CompileImgPreload('talent-portal-landing-page.twig', $context);
 
 echo $compiled->html;
