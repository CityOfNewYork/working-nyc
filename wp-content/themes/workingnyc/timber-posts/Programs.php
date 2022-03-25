<?php

/**
 * Programs
 *
 * @author NYC Opportunity
 */

namespace WorkingNYC;

use Timber;
use Spatie\SchemaOrg\Schema;

class Programs extends Timber\Post {
  /**
   * Constructor
   *
   * @return  Object  Instance of Programs
   */
  public function __construct($pid = false) {
    if ($pid) {
      parent::__construct($pid);
    } else {
      parent::__construct();
    }

    /**
     * The ID will be null if the post doesn't exist
     */

    if (null === $this->id) {
      return false;
    }

    /**
     * Set Context
     */

    $this->program_plain_language_title = $this->getPlainLanguageTitle();

    $this->program_title = $this->getTitle();

    $this->program_agency = $this->getAgency();

    $this->status = $this->getStatus();

    $this->intro = $this->getIntro();

    $this->populations = $this->getPopulations();

    $this->services = $this->getServices();

    $this->schedule = $this->getSchedule();

    /**
     * Set Schema
     */

    $this->schema = $this->getSchema();

    return $this;
  }

  /**
   * Items returned in this object determine what is shown in the WP REST API.
   * Called by the 'rest-prepare-posts.php' must use plugin.
   *
   * @return  Array  Items to show in the WP REST API
   */
  public function showInRest() {
    return array(
      'program_plain_language_title' => $this->getPlainLanguageTitle(),
      'program_title' => $this->getTitle(),
      'program_agency' => $this->getAgency(),
      'status' => $this->getStatus(),
      'intro' => $this->getIntro(),
      'populations' => $this->getPopulations(),
      'services' => $this->getServices(),
      'schedule' => $this->getSchedule()
    );
  }

  /**
   * Get the plain language title of the program.
   *
   * @return  String  The plain language title
   */
  public function getPlainLanguageTitle() {
    return $this->post_title;
  }

  /**
   * Get the real program title.
   *
   * @return  String  The program title
   */
  public function getTitle() {
    return $this->custom['program_title'];
  }

  /**
   * Get the agency provider's name name.
   * TODO: refactor this to return the Agency taxonomy name (if set).
   *
   * @return  String  The agency name
   */
  public function getAgency() {
    return $this->custom['program_agency'];
  }

  /**
   * Construct the program status for program cards.
   *
   * @return  Boolean/Array  The program status
   */
  public function getStatus() {
    $recruiting = get_the_terms($this->ID, 'recruitment_status');

    $disability = array(
      'name' => __('Disability accommodation details are available.', 'WNYC')
    );

    $language = array(
      'name' => __('Language access details are available.', 'WNYC')
    );

    $s = array(
      'recruiting' => ($recruiting) ? $recruiting[0] : false,
      'disability' => ($this->custom['program_disability'] != '') ? $disability : false,
      'language' => ($this->custom['program_language_access'] != '') ? $language : false
    );

    return ($s['recruiting'] || $s['disability'] || $s['language']) ? $s : false;
  }

  /**
   * Get the program introductory paragraph.
   *
   * @return  String  Program intro
   */
  public function getIntro() {
    return strip_tags(str_replace('-', '', $this->custom['program_intro']));
  }

  /**
   * Construct the population string based on the taxonomy name(s).
   *
   * @return  String  The list of people served in a human readable sentence.
   */
  public function getPopulations() {
    $populations = get_the_terms($this->ID, 'populations');

    if ($populations) {
      $populations = array_map(function($population) {
        return '<b class="text-em">' . $population->name . '</b>';
      }, $populations);

      $populations = implode(', ', $populations);
    } else {
      return '';
    }

    return __('For', 'WNYC') . ' ' . $populations . '.';
  }

  /**
   * Get the services or certifications provided by the program completion.
   *
   * @return  String  List of services in comma separated format
   */
  public function getServices() {
    $services = get_the_terms($this->ID, 'services');

    if ($services) {
      $services = array_map(function($service) {
        return $service->name;
      }, $services);

      $services = implode(', ', $services);
    } else {
      return '';
    }

    return $services;
  }

  /**
   * Construct the schedule.
   *
   * @return  String  Schedule sentence
   */
  public function getSchedule() {
    $duration = get_the_terms($this->ID, 'duration');

    if ($duration) {
      $duration = array_map(function($duration) {
        return $duration->name;
      }, $duration);

      $duration = implode(', ', $duration) . '. ';
    } else {
      $duration = '';
    }

    $schedule = get_the_terms($this->ID, 'schedule');

    if ($schedule) {
      $schedule = array_map(function($schedule) {
        return $schedule->name;
      }, $schedule);

      $schedule = implode(', ', $schedule);
    } else {
      $schedule = '';
    }

    return $duration . $schedule;
  }

  /**
   * GovernmentOrganization Schema
   *
   * @return  Array  Schema
   */
  public function getGovernmentOrganization() {
    $schema = Schema::governmentOrganization()
      ->name($this->program_title);

    return $schema->toArray();
  }

  /**
   * GovernmentService Schema
   *
   * @return  Array  Schema
   */
  public function getGovernmentService() {
    $schema = Schema::governmentService()
      ->name($this->program_title)
      ->serviceType(implode(', ', $this->terms('services')))
      ->serviceOperator(Schema::governmentOrganization()
        ->name($this->program_agency))
      ->areaServed(Schema::administrativeArea()
        ->name('New York'))
      ->audience(Schema::Audience()
        ->name(implode(', ', $this->terms('populations'))));

    return $schema->toArray();
  }

  /**
   * EducationalOrganization Schema
   *
   * @return  Array  Schema
   */
  public function getEducationalOrganization() {
    $schema = Schema::educationalOrganization()
      ->name($this->program_agency != '' ? $this->program_agency : $this->program_provider);

    return $schema->toArray();
  }

  /**
   * Get Schemas for the program
   *
   * @return  Array  Program schemas
   */
  public function getSchema() {
    $schemas = array();

    $arr_ed = array('University', 'College');

    $ed = false;

    foreach ($arr_ed as $value) {
      if (strpos($this->program_agency, $value) !== false || strpos($this->program_provider, $value) !== false) {
        $ed = true;

        break;
      }
    }

    if ($ed == true) {
      array_push(
        $schemas,
        $this->getEducationalOrganization()
      );
    }

    if ($ed == false && $this->program_agency != '') {
      array_push(
        $schemas,
        $this->getGovernmentService(),
        $this->getGovernmentOrganization()
      );
    }

    return $schemas;
  }
}
