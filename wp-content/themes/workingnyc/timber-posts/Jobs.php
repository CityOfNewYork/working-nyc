<?php

/**
 * Jobs
 *
 * @link  http://localhost:8080/jobs/
 * @link  http://localhost:8080/wp-json/wp/v2/jobs
 *
 * @author NYC Opportunity
 */

namespace WorkingNYC;

use Timber;
use Spatie\SchemaOrg\Schema;

class Jobs extends Timber\Post {
  const DEFAULT_LOCATION = 'New York City';

  /**
   * Constructor
   *
   * @return  Object  Instance of Announcement
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

    $this->sector = $this->getSector();

    $this->organization = $this->getOrganization();

    $this->summary = $this->getSummary();

    $this->populations = $this->getPopulations();

    $this->schedule = $this->getSchedule();

    $this->salary = $this->getSalary();

    $this->location = $this->getLocation();

    $this->source = $this->getSource();

    $this->cardTitle = $this->getCardTitle();

    $this->instructions = $this->getInstructions();

    /**
     * Set the schema
     */

    $this->schema = $this->getSchema();

    return $this;
  }

  /**
   * Items returned in this object determine what is shown in the WP REST API.
   * Called by the 'rest-prepare-posts.php' must use plugin. This will appear
   * in the 'context' attribute.
   *
   * @return  Array  Items to show in the WP REST API
   */
  public function showInRest() {
    return array(
      'sector' => $this->getSector(),
      'organization' => $this->getOrganization(),
      'summary' => $this->getSummary(),
      'populations' => $this->getPopulations(),
      'schedule' => $this->getSchedule(),
      'salary' => $this->getSalary(),
      'location' => $this->getLocation(),
      'source' => $this->getSource(),
      'cardTitle' => $this->getCardTitle(),
      'instructions' => $this->getInstructions()
    );
  }

  /**
   * Construct a sector string based on the sector taxonomy name(s).
   *
   * @return  String  The sector value
   */
  public function getSector() {
    $sectors = get_the_terms($this->ID, 'sectors');

    if ($sectors) {
      $sectors = array_map(function($sector) {
        return $sector->name;
      }, $sectors);

      $sectors = implode(', ', $sectors);
    } else {
      return '';
    }

    return $sectors;
  }

  /**
   * Construct the organization string, it will either be the organization
   * custom text field (default) or it will be an agency taxonomy name(s).
   *
   * @return  String  The organization value
   */
  public function getOrganization() {
    $organization = '';

    if (!empty($this->custom['job_organization'])) {
      return $this->custom['job_organization'];
    }

    $agencies = get_the_terms($this->ID, 'agency');

    if ($agencies) {
      $agencies = array_map(function($agency) {
        return $agency->name;
      }, $agencies);

      $organization = implode(', ', $agencies);
    }

    return $organization;
  }

  /**
   * Get the job summary, based on the description.
   *
   * @return  String  Summary with HTML markup stripped
   */
  public function getSummary($limit = 120) {
    return trim(substr(strip_tags($this->custom['job_description']), 0, $limit)) . '... ';
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
   * Construct the schedule and hours sentence.
   *
   * @return  String  Sentence combining schedule and hours
   */
  public function getSchedule() {
    $schedule = get_the_terms($this->ID, 'schedule');

    if ($schedule) {
      $schedule = array_map(function($schedule) {
        return $schedule->name;
      }, $schedule);

      $schedule = implode(', ', $schedule);
    } else {
      return '';
    }

    if (!empty($this->custom['job_minimum_hours_per_week'])) {
      $schedule = $schedule . ', '
        . $this->custom['job_minimum_hours_per_week'] . ' ' . __('hours per week', 'WNYC');
    }

    return $schedule;
  }

  /**
   * Construct the salary range and unit using minimum and maximum salary
   * values (if available).
   *
   * @return  String  The salary range including dollar signs and salary unit
   */
  public function getSalary() {
    $salary = '$' . $this->custom['job_minimum_base_salary_value'];

    if (!empty($this->custom['job_maximum_base_salary_value'])) {
      $salary = $salary . ' - $' . $this->custom['job_maximum_base_salary_value'];
    }

    $unit = get_the_terms($this->ID, 'salary');

    if ($unit) {
      $unit = array_map(function($unit) {
        return $unit->name;
      }, $unit);

      $unit = implode(', ', $unit);

      $salary = $salary . ' ' . __('per', 'WNYC') . ' ' . strtolower($unit);
    }

    return $salary;
  }

  /**
   * Construct the job location based on the location taxonomy.
   *
   * @return  String  The locations listed by commas
   */
  public function getLocation() {
    $locations = get_the_terms($this->ID, 'locations');

    if ($locations) {
      $locations = array_map(function($location) {
        return $location->name;
      }, $locations);

      $locations = implode(', ', $locations);
    } else {
      return __(self::DEFAULT_LOCATION, 'WNYC');
    }

    return $locations;
  }

  /**
   * Get the job source terms array.
   *
   * @return  Array  Job source term array
   */
  public function getSource() {
    $sources = get_the_terms($this->ID, 'source');

    return ($sources) ? $sources[0] : array();
  }

  /**
   * Get the title for Job cards
   *
   * @return  String  Constructed title for the Job
   */
  public function getCardTitle() {
    return ($this->location == __(self::DEFAULT_LOCATION, 'WNYC'))
      ? $this->post_title : "$this->post_title ($this->location)";
  }

  /**
   * Get the application instructions by combining generic instructions for
   * jobs with the same source and bespoke instructions for this job.
   *
   * @return  String  HTML content for the application
   */
  public function getInstructions() {
    $instructions = '';

    // Get generic instructions
    if (in_array('Generic', $this->custom['job_generic_application_instructions'])) {
      $source = (isset($this->source)) ? $this->source : $this->getSource();

      $posts = Timber::get_posts(array(
        'post_type' => 'instructions',
        'tax_query' => $source
      ));

      $instructions = ($posts) ? $posts[0]->custom['instruction_details'] : '';
    }

    // Get bespoke instructions
    if ($this->custom['job_bespoke_application_instructions']) {
      $instructions = $instructions . $this->custom['job_bespoke_application_instructions'];
    }

    return $instructions;
  }

  /**
   * Build the structured data array. Job posting locality is hard-coded for
   * USD and New York City only. Structure is based on Google's Job Posting
   * schema documentation.
   *
   * @link https://developers.google.com/search/docs/advanced/structured-data/job-posting
   *
   * @return  Array  The post schema array
   */
  public function getSchema() {
    $hiringOrganization = ('confidential' === $this->organization)
      ? $this->organization : Schema::Organization()
        ->name($this->organization)
        ->sameAs($this->job_organization_url);

    $locality = (str_contains($this->location, ', ')) ?
      __('New York City', 'WNYC') : $this->location;

    $address = Schema::PostalAddress()
      ->streetAddress($this->custom['job_street_address'])
      ->addressLocality($locality)
      ->addressRegion('NY')
      ->postalCode($this->custom['job_postal_code'])
      ->addressCountry('US');

    /**
     * Schema base requirements. If none of these things are available then
     * it shouldn't be returned.
     */

    $schema = Schema::JobPosting()
      ->datePosted(date(DATE_W3C, strtotime($this->date)))
      ->description($this->custom['job_description'] . $this->custom['job_requirements'])
      ->hiringOrganization($hiringOrganization)
      ->jobLocation(Schema::Place()->address($address))
      ->title($this->post_title);

    /**
     * Remote position. Locality will always be New York City.
     */

    if (str_contains($this->location, 'Virtual')) {
      $schema->applicantLocationRequirements(
        Schema::City()->name(__('New York City', 'WNYC'))
      )->jobLocationType('TELECOMMUTE');
    }

    // /**
    //  * Salary
    //  *
    //  * TODO: Google states that we cannot provide this value in our schema.
    //  * If we do we need to change the schema type to "Occupation." Need to
    //  * find out why and if this applies to us.
    //  *
    //  * "Note: Only employers can provide baseSalary. If you're a third party
    //  *  job site, you can provide a salary estimate for an occupation type
    //  *  using the Occupation type."
    //  *
    //  * @link https://developers.google.com/search/docs/advanced/structured-data/job-posting#basesalary
    //  */

    // $baseSalaryValue = Schema::QuantitativeValue();

    // if (empty($this->custom['job_maximum_base_salary_value'])) {
    //   $baseSalaryValue->value($this->custom['job_minimum_base_salary_value']);
    // } else {
    //   $baseSalaryValue->minValue($this->custom['job_minimum_base_salary_value']);
    //   $baseSalaryValue->maxValue($this->custom['job_maximum_base_salary_value']);
    // }

    // $unit = get_the_terms($this->ID, 'salary');

    // $unit = ($unit) ? strtoupper($unit[0]->name) : '';

    // $schema->baseSalary(
    //   Schema::MonetaryAmount()
    //     ->currency('USD')
    //     ->value($baseSalaryValue->unitText($unit))
    // );

    /**
     * Unique Identifier
     */

    if (!empty($this->custom['job_unique_identifier'])) {
      $schema->identifier(
        Schema::PropertyValue()
          ->name($this->source->name)
          ->value($this->job_unique_identifier)
      );
    }

    /**
     * Employment type or schedule
     */

    $schedule = get_the_terms($this->ID, 'schedule');

    if ($schedule) {
      $schedule = array_map(function($schedule) {
        $name = str_replace('-', '_', $schedule->name);
        $name = str_replace(' ', '_', $name);

        return strtoupper($name);
      }, $schedule);

      $schema->employmentType($schedule);
    }

    /**
     * Direct apply
     */

    if (in_array('Direct', $this->custom['job_apply_direct'])) {
      $schema->directApply(true);
    }

    return [$schema->toArray()];
  }
}
