<?php

namespace WNYCSchema;

use Spatie\SchemaOrg\Schema;

/**
 * Website Schema
 */
function website() {
  $schema = Schema::webSite()
    ->url(get_bloginfo('url'))
    ->description(get_bloginfo('description'));

  return $schema->toArray();
}

/**
 * Organization Schema
 */
function organization() {
  $schema = Schema::organization()
    ->name(get_bloginfo('name'))
    ->email(get_bloginfo('admin_email'))
    ->url(get_bloginfo('url'))
    ->logo(get_bloginfo('url').'/wp-content/themes/workingnyc/assets/svg/logo-wnyc-standard.svg');

  return $schema->toArray();
}

/**
 * GovernmentOrganization Schema
 */
function government_organization($program = null) {
  $schema = Schema::governmentOrganization()
    ->name($program->program_title);

  return $schema->toArray();
}

/**
 * GovernmentService Schema
 */
function government_service($program = null) {
  $schema = Schema::governmentService()
    ->name($program->program_title)
    ->serviceType(implode(', ', $program->terms('services')))
    ->serviceOperator(Schema::governmentOrganization()
      ->name($program->program_agency)
    )
    ->areaServed(Schema::administrativeArea()
      ->name('New York')
    )
    ->audience(Schema::Audience()
      ->name(implode(', ', $program->terms('populations')))
);

  return $schema->toArray();
}

/**
 * EducationalOrganization Schema
 */
function educational_organization($program = null) {
  $schema = Schema::educationalOrganization()
    ->name($program->program_agency !=''? $program->program_agency: $program->program_provider);

  return $schema->toArray();
}