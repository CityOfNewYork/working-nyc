<?php

/**
 * Programs
 *
 * @link  http://localhost:8080/programs/
 * @link  http://localhost:8080/wp-json/wp/v2/programs
 *
 * @author NYC Opportunity
 */

namespace WorkingNYC;

use Timber;
use Spatie\SchemaOrg\Schema;

class Programs extends Timber\Post {
  const SINGULAR = 'program'; // used to locate the single template

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

    $this->singular = self::SINGULAR;

    $this->program_plain_language_title = $this->getPlainLanguageTitle();

    $this->program_title = $this->getTitle();

    $this->program_agency = $this->getAgency();

    $this->status = $this->getStatus();

    $this->preview = $this->getPreview();

    $this->intro = $this->getIntro();

    $this->populations = $this->getPopulations();

    $this->services = $this->getServices();

    $this->schedule = $this->getSchedule();

    $this->supports = $this->getSupports();

    $this->archive = get_post_type_archive_link('programs');

    $this->external = $this->getExternal();

    $this->link = $this->getLink();

    $this->link_label = $this->getLinkLabel();

    $this->languages = $this->getLanguages();

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
      'preview' => $this->getPreview(),
      'intro' => $this->getIntro(),
      'populations' => $this->getPopulations(),
      'services' => $this->getServices(),
      'schedule' => $this->getSchedule(),
      'supports' => $this->getSupports(),
      'external' => $this->getExternal(),
      'link' => $this->getLink(),
      'link_label' => $this->getLinkLabel()
    );
  }

  /**
   * Get the plain language title of the program.
   *
   * @return  String  The plain language title
   */
  public function getPlainLanguageTitle() {
    return $this->custom['program_title'];
  }

  /**
   * Get the real program title.
   *
   * @return  String  The program title
   */
  public function getTitle() {
    return $this->post_title;
  }

  /**
   * Get the agency provider's name name.
   * TODO: refactor this to return the Agency taxonomy name (if set).
   *
   * @return  String  The agency name
   */
  public function getAgency() {
    $agencies = get_the_terms($this->ID, 'agency');

    if ($agencies) {
      $agencies = array_map(function($agency) {
        return $agency->name;
      }, $agencies);

      $agencies = implode(' ' . __('and', 'WNYC') . ' ', $agencies);
    } else {
      $agencies = $this->custom['program_agency'];
    }

    return $agencies;
  }

  /**
   * Construct the program status for program cards.
   *
   * @return  Boolean/Array  The program status
   */
  public function getStatus() {
    $recruiting = get_the_terms($this->ID, 'recruitment_status');

    $disability = array(
      'name' => __('Disability accommodation details are available. View this program to learn more.', 'WNYC')
    );

    $language = array(
      'name' => __('Language access details are available. View this program to learn more.', 'WNYC')
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
  public function getPreview() {
    if (array_key_exists('program_preview', $this->custom)) {
      return $this->custom['program_preview'];
    } else {
      return strip_tags($this->custom['program_intro']);
    }
  }

  /**
   * Get the program introductory paragraph.
   *
   * @return  String  Program intro
   */
  public function getIntro() {
    return strip_tags($this->custom['program_intro']);
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
    if (array_key_exists('program_duration_and_schedule_label', $this->custom)) {
      return $this->custom['program_duration_and_schedule_label'];
    }

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
   * Get the wrap around support field label
   *
   * @return  String  Short description for wraparound supports
   */
  public function getSupports() {
    return (array_key_exists('program_wraparound_support', $this->custom))
      ? $this->custom['program_wraparound_support'] : '';
  }

  /**
   * Wether the post call to action is external or not
   *
   * @return  Boolean  Wether the link is external or not
   */
  public function getExternal() {
    $hosting = get_the_terms($this->ID, 'hosting');

    if (false === $hosting) {
      return false;
    }

    $external = array_shift($hosting);

    return ('external' === $external->slug);
  }

  /**
   * Get the link based on wether the resource is external or not
   *
   * @return  String  The full URL string to the resource
   */
  public function getLink() {
    return ($this->external) ? $this->custom['program_learn_more'] : get_permalink($this->ID);
  }

  /**
   * Get the external button link label for the program which is the domain
   * of the link it is going to.
   *
   * @return  String  The link label
   */
  public function getLinkLabel() {
    if (empty($this->custom['program_learn_more'])) {
      return '';
    }

    $url = parse_url($this->custom['program_learn_more']);

    return __('Go to', 'WNYC') . ' ' . $url['host'];
  }

  /**
   * Determines wether to show the languages button in the utility nav
   *
   * @return  Boolean  List of services in comma separated format
   */
  public function getLanguages() {
    $services = get_the_terms($this->ID, 'services');

    if ($services) {
      $services = array_map(function($service) {
        return $service->slug;
      }, $services);

      return in_array('english-skills', $services);
    }

    return $services;
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
