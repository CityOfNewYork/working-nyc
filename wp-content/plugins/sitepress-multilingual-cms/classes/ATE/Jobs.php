<?php

namespace WPML\TM\ATE;


use WPML\Element\API\Languages;
use WPML\FP\Cast;
use WPML\FP\Fns;
use WPML\FP\Lst;
use WPML\FP\Obj;
use WPML\TM\ATE\Review\ReviewStatus;

class Jobs {
	const LONGSTANDING_AT_ATE_SYNC_COUNT = 100;

	/**
	 * @param bool $includeLongstanding A long-standing job is an automatic ATE job which we already tried to sync LONGSTANDING_AT_ATE_SYNC_COUNT or more times.
	 * @return int
	 */
	public function getCountOfAutomaticInProgress( $includeLongstanding = true ) {
		global $wpdb;

		$sql = "
				SELECT COUNT(jobs.job_id)
				FROM {$wpdb->prefix}icl_translate_job jobs
				INNER JOIN {$wpdb->prefix}icl_translation_status translation_status ON translation_status.rid = jobs.rid
				INNER JOIN {$wpdb->prefix}icl_translations translations ON translations.translation_id = translation_status.translation_id
				WHERE jobs.job_id IN (
					SELECT MAX(jobs.job_id) FROM {$wpdb->prefix}icl_translate_job jobs			
					GROUP BY jobs.rid
				) 
				AND jobs.automatic = 1  
				AND jobs.editor = %s
				AND translation_status.status = %d				
				AND translations.source_language_code = %s
		";

		if ( ! $includeLongstanding ) {
			$sql .= " AND jobs.ate_sync_count < %d";

			return (int) $wpdb->get_var( $wpdb->prepare( $sql, \WPML_TM_Editors::ATE, ICL_TM_IN_PROGRESS, Languages::getDefaultCode(), self::LONGSTANDING_AT_ATE_SYNC_COUNT ) );
		}

		return (int) $wpdb->get_var( $wpdb->prepare( $sql, \WPML_TM_Editors::ATE, ICL_TM_IN_PROGRESS, Languages::getDefaultCode() ) );
	}

	/**
	 * @return int
	 */
	public function getCountOfInProgress() {
		global $wpdb;

		$sql = "
				SELECT COUNT(jobs.job_id)
				FROM {$wpdb->prefix}icl_translate_job jobs
				INNER JOIN {$wpdb->prefix}icl_translation_status translation_status ON translation_status.rid = jobs.rid
				WHERE jobs.job_id IN (
					SELECT MAX(jobs.job_id) FROM {$wpdb->prefix}icl_translate_job jobs			
					GROUP BY jobs.rid
				) 
				AND jobs.editor = %s
				AND translation_status.status = %d				
		";

		return (int) $wpdb->get_var( $wpdb->prepare( $sql, \WPML_TM_Editors::ATE, ICL_TM_IN_PROGRESS ) );
	}

	/**
	 * @return int
	 */
	public function getCountOfNeedsReview() {
		global $wpdb;

		$sql = "
			SELECT COUNT(translation_status.translation_id) 
			FROM {$wpdb->prefix}icl_translation_status translation_status
			WHERE translation_status.review_status = %s OR translation_status.review_status = %s
		";

		return (int) $wpdb->get_var( $wpdb->prepare( $sql, ReviewStatus::NEEDS_REVIEW, ReviewStatus::EDITING ) );
	}


	/**
	 * It checks whether we have ANY jobs in the DB. It doesn't matter what kind of jobs they are. It can be a job from ATE, CTE or even the Translation Proxy.
	 *
	 * @return bool
	 * @todo This method should not be here as the current class relates solely to ATE jobs, while this method asks for ANY jobs.
	 */
	public function hasAny() {
		global $wpdb;

		$noOfRowsToFetch = 1;

		$sql = $wpdb->prepare( "SELECT EXISTS(SELECT %d FROM {$wpdb->prefix}icl_translate_job)", $noOfRowsToFetch );

		return boolval( $wpdb->get_var( $sql ) );
	}

	/**
	 * @return bool True if there is at least one job to sync.
	 */
	public function hasAnyToSync() {
		global $wpdb;

		$sql = "
				SELECT jobs.job_id
				FROM {$wpdb->prefix}icl_translate_job jobs
				INNER JOIN {$wpdb->prefix}icl_translation_status translation_status ON translation_status.rid = jobs.rid
				WHERE jobs.job_id IN (
					SELECT MAX(jobs.job_id) FROM {$wpdb->prefix}icl_translate_job jobs			
					GROUP BY jobs.rid
				) 
				AND jobs.editor = %s
				AND translation_status.status = %d
				LIMIT 1
		";

		return (bool) $wpdb->get_var( $wpdb->prepare( $sql, \WPML_TM_Editors::ATE, ICL_TM_IN_PROGRESS ) );
	}

	/**
	 * This is optimized query for getting the ate job ids to sync.
	 *
	 * @param bool $includeManualAndLongstandingJobs
	 * @return int[]
	 */
	public function getATEJobIdsToSync( $includeManualAndLongstandingJobs = true ) {
		global $wpdb;

		$sql = "
				SELECT jobs.editor_job_id
				FROM {$wpdb->prefix}icl_translate_job jobs
			    INNER JOIN {$wpdb->prefix}icl_translation_status translation_status ON translation_status.rid = jobs.rid
				WHERE jobs.job_id IN (
	                SELECT MAX(jobs.job_id) FROM {$wpdb->prefix}icl_translate_job jobs			
					GROUP BY jobs.rid
				) 
	            AND jobs.editor = %s
				AND ( translation_status.status = %d OR translation_status.status = %d )
		";

		if ( ! $includeManualAndLongstandingJobs ) {
			$sql .= " AND jobs.ate_sync_count < %d AND jobs.automatic = 1";

			return $wpdb->get_col( $wpdb->prepare( $sql, \WPML_TM_Editors::ATE, ICL_TM_IN_PROGRESS, ICL_TM_WAITING_FOR_TRANSLATOR, self::LONGSTANDING_AT_ATE_SYNC_COUNT ) );
		}

		return $wpdb->get_col( $wpdb->prepare( $sql, \WPML_TM_Editors::ATE, ICL_TM_IN_PROGRESS, ICL_TM_WAITING_FOR_TRANSLATOR ) );
	}
}
