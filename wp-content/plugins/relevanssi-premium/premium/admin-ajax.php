<?php
/**
 * /premium/admin-ajax.php
 *
 * @package Relevanssi_Premium
 * @author  Mikko Saari
 * @license https://wordpress.org/about/gpl/ GNU General Public License
 * @see     https://www.relevanssi.com/
 */

add_action( 'wp_ajax_relevanssi_list_pdfs', 'relevanssi_list_pdfs_action' );
add_action( 'wp_ajax_relevanssi_wipe_pdfs', 'relevanssi_wipe_pdfs_action' );
add_action( 'wp_ajax_relevanssi_index_pdfs', 'relevanssi_index_pdfs_action' );
add_action( 'wp_ajax_relevanssi_send_pdf', 'relevanssi_send_pdf' );
add_action( 'wp_ajax_relevanssi_send_url', 'relevanssi_send_url' );
add_action( 'wp_ajax_relevanssi_get_pdf_errors', 'relevanssi_get_pdf_errors_action' );
add_action( 'wp_ajax_relevanssi_index_taxonomies', 'relevanssi_index_taxonomies_ajax_wrapper' );
add_action( 'wp_ajax_relevanssi_count_taxonomies', 'relevanssi_count_taxonomies_ajax_wrapper' );
add_action( 'wp_ajax_relevanssi_index_users', 'relevanssi_index_users_ajax_wrapper' );
add_action( 'wp_ajax_relevanssi_count_users', 'relevanssi_count_users_ajax_wrapper' );
add_action( 'wp_ajax_relevanssi_list_taxonomies', 'relevanssi_list_taxonomies_wrapper' );

/**
 * Performs the "list PDF files" AJAX action.
 *
 * Uses relevanssi_get_posts_with_attachments() to get a list of posts with files
 * attached to them.
 *
 * @since 2.0.0
 */
function relevanssi_list_pdfs_action() {
	check_ajax_referer( 'relevanssi-list-pdfs', 'security' );
	$limit = 0;
	if ( isset( $_POST['limit'] ) ) { // WPCS: input var ok.
		$limit = intval( wp_unslash( $_POST['limit'] ) ); // WPCS: input var ok.
	}
	$pdfs = relevanssi_get_posts_with_attachments();
	echo wp_json_encode( $pdfs );

	wp_die();
}

/**
 * Performs the "wipe PDF content" AJAX action.
 *
 * Removes all '_relevanssi_pdf_content' and '_relevanssi_pdf_error' post meta fields from the wp_postmeta table.
 *
 * @since 2.0.0
 */
function relevanssi_wipe_pdfs_action() {
	check_ajax_referer( 'relevanssi-wipe-pdfs', 'security' );

	$deleted_content = delete_post_meta_by_key( '_relevanssi_pdf_content' );
	$deleted_errors  = delete_post_meta_by_key( '_relevanssi_pdf_error' );

	$response                    = array();
	$response['deleted_content'] = false;
	$response['deleted_errors']  = false;

	if ( $deleted_content ) {
		$response['deleted_content'] = true;
	}
	if ( $deleted_errors ) {
		$response['deleted_errors'] = true;
	}

	echo wp_json_encode( $response );

	wp_die();
}

/**
 * Performs the "index PDFs" AJAX action.
 *
 * Reads in the PDF content for PDF files fetched using the relevanssi_get_posts_with_attachments() function.
 *
 * @since 2.0.0
 */
function relevanssi_index_pdfs_action() {
	check_ajax_referer( 'relevanssi-index-pdfs', 'security' );

	$pdfs = relevanssi_get_posts_with_attachments( 3 );

	if ( ! isset( $_POST['completed'] ) || ! isset( $_POST['total'] ) ) { // WPCS: input var ok.
		wp_die();
	}

	$post_data = $_POST; // WPCS: input var ok.

	$completed = absint( $post_data['completed'] );
	$total     = absint( $post_data['total'] );

	$response             = array();
	$response['feedback'] = '';

	if ( empty( $pdfs ) ) {
		$response['feedback']   = __( 'Indexing complete!', 'relevanssi' );
		$response['completed']  = 'done';
		$response['percentage'] = 100;
	} else {
		foreach ( $pdfs as $post_id ) {
			$echo_and_die = false;
			$send_files   = get_option( 'relevanssi_send_pdf_files' );
			if ( 'off' === $send_files ) {
				$send_files = false;
			}

			$index_response = relevanssi_index_pdf( $post_id, $echo_and_die, $send_files );
			$completed++;

			if ( $index_response['success'] ) {
				// translators: placeholder is the post ID.
				$response['feedback'] .= sprintf( esc_html__( 'Successfully indexed attachment id %d.', 'relevanssi' ), esc_html( $post_id ) ) . "\n";
			} else {
				// translators: the numeric placeholder is the post ID, the string is the error message.
				$response['feedback'] .= sprintf( esc_html__( 'Failed to index attachment id %1$d: %2$s', 'relevanssi' ), esc_html( $post_id ), esc_html( $index_response['error'] ) ) . "\n";
			}
		}
		$response['completed'] = $completed;
		if ( $total > 0 ) {
			$response['percentage'] = round( $completed / $total * 100, 0 );
		} else {
			$response['percentage'] = 0;
		}
	}

	echo wp_json_encode( $response );

	wp_die();
}

/**
 * Performs the "send PDF" AJAX action.
 *
 * Reads in the PDF content for one PDF file, based on the 'post_id' parameter, sending the PDF over.
 *
 * @since 2.0.0
 */
function relevanssi_send_pdf() {
	check_ajax_referer( 'relevanssi_send_pdf', 'security' );

	if ( ! isset( $_REQUEST['post_id'] ) ) { // WPCS: input var ok.
		wp_die();
	}
	$post_id      = intval( wp_unslash( $_REQUEST['post_id'] ) ); // WPCS: input var ok.
	$echo_and_die = true;
	$send_file    = true;
	relevanssi_index_pdf( $post_id, $echo_and_die, $send_file );

	// Just for sure; relevanssi_index_pdf() should echo necessary responses and die, so don't expect this to ever happen.
	wp_die();
}

/**
 * Performs the "send URL" AJAX action.
 *
 * Reads in the PDF content for one PDF file, based on the 'post_id' parameter, using the PDF URL.
 *
 * @since 2.0.0
 */
function relevanssi_send_url() {
	check_ajax_referer( 'relevanssi_send_pdf', 'security' );

	if ( ! isset( $_REQUEST['post_id'] ) ) { // WPCS: input var ok.
		wp_die();
	}
	$post_id      = intval( wp_unslash( $_REQUEST['post_id'] ) ); // WPCS: input var ok.
	$echo_and_die = true;
	$send_file    = false;
	relevanssi_index_pdf( $post_id, $echo_and_die, $send_file );

	// Just for sure; relevanssi_index_pdf() should echo necessary responses and die, so don't expect this to ever happen.
	wp_die();
}

/**
 * Reads all PDF errors.
 *
 * Gets a list of all PDF errors in the database and prints out a list of them.
 *
 * @global $wpdb The WordPress database interface, used to fetch the meta fields.
 *
 * @since 2.0.0
 */
function relevanssi_get_pdf_errors_action() {
	global $wpdb;

	$errors        = $wpdb->get_results( "SELECT post_id, meta_value FROM $wpdb->postmeta WHERE meta_key = '_relevanssi_pdf_error'" );
	$error_message = array();
	foreach ( $errors as $error ) {
		$row             = __( 'Attachment ID', 'relevanssi' ) . ' ' . $error->post_id . ': ' . $error->meta_value;
		$row             = str_replace( 'PDF Processor error: ', '', $row );
		$error_message[] = $row;
	}

	echo wp_json_encode( implode( "\n", $error_message ) );
	wp_die();
}

/**
 * Reads a list of taxonomies.
 *
 * Gets a list of taxonomies selected for indexing from the relevanssi_list_taxonomies() function.
 *
 * @since 2.0.0
 */
function relevanssi_list_taxonomies_wrapper() {
	$taxonomies = array();
	if ( function_exists( 'relevanssi_list_taxonomies' ) ) {
		$taxonomies = relevanssi_list_taxonomies();
	}
	echo wp_json_encode( $taxonomies );
	wp_die();
}

/**
 * Indexes taxonomy terms for AJAX indexing.
 *
 * Reads in the parameters, indexes taxonomy terms and reports the results.
 *
 * @since 2.0.0
 */
function relevanssi_index_taxonomies_ajax_wrapper() {
	check_ajax_referer( 'relevanssi_taxonomy_indexing_nonce', 'security' );

	if ( ! isset( $_POST['completed'] ) || ! isset( $_POST['total'] ) || ! isset( $_POST['taxonomy'] ) || ! isset( $_POST['offset'] ) || ! isset( $_POST['limit'] ) ) { // WPCS: input var ok.
		wp_die();
	}

	$post_data = $_POST; // WPCS: input var ok.

	$completed = absint( $post_data['completed'] );
	$total     = absint( $post_data['total'] );
	$taxonomy  = $post_data['taxonomy'];
	$offset    = $post_data['offset'];
	$limit     = $post_data['limit'];

	$response = array();

	$indexing_response = relevanssi_index_taxonomies_ajax( $taxonomy, $limit, $offset );

	$completed += $indexing_response['indexed'];
	if ( $completed === $total ) {
		$response['completed']   = 'done';
		$response['total_posts'] = $completed;
		$response['percentage']  = 100;
		// translators: number of terms indexed on this go, total indexed terms, total number of terms.
		$response['feedback'] = sprintf( _n( '%1$d taxonomy term, total %2$d / %3$d.', '%1$d taxonomy terms, total %2$d / %3$d.', $indexing_response['indexed'], 'relevanssi' ), $indexing_response['indexed'], $completed, $total ) . "\n";
	} else {
		$response['completed'] = $completed;
		// translators: number of terms indexed on this go, total indexed terms, total number of terms.
		$response['feedback'] = sprintf( _n( '%1$d taxonomy term, total %2$d / %3$d.', '%1$d taxonomy terms, total %2$d / %3$d.', $indexing_response['indexed'], 'relevanssi' ), $indexing_response['indexed'], $completed, $total ) . "\n";

		if ( $total > 0 ) {
			$response['percentage'] = $completed / $total * 100;
		} else {
			$response['percentage'] = 0;
		}

		$response['new_taxonomy'] = false;
		if ( 'done' === $indexing_response['taxonomy_completed'] ) {
			$response['new_taxonomy'] = true;
		}
	}
	$response['offset'] = $offset + $limit;

	echo wp_json_encode( $response );
	wp_die();
}

/**
 * Indexes users for AJAX indexing.
 *
 * Reads in the parameters, indexes users and reports the results.
 *
 * @since 2.0.0
 */
function relevanssi_index_users_ajax_wrapper() {
	check_ajax_referer( 'relevanssi_user_indexing_nonce', 'security' );

	if ( ! isset( $_POST['completed'] ) || ! isset( $_POST['total'] ) || ! isset( $_POST['limit'] ) ) { // WPCS: input var ok.
		wp_die();
	}

	$post_data = $_POST; // WPCS: input var ok.

	$completed = absint( $post_data['completed'] );
	$total     = absint( $post_data['total'] );
	$limit     = $post_data['limit'];
	if ( isset( $post_data['offset'] ) ) {
		$offset = $post_data['offset'];
	} else {
		$offset = 0;
	}

	$response = array();

	$indexing_response = relevanssi_index_users_ajax( $limit, $offset );

	$completed += $indexing_response['indexed'];
	$processed  = $offset;

	if ( $completed === $total || $processed > $total ) {
		$response['completed']   = 'done';
		$response['total_posts'] = $completed;
		$response['percentage']  = 100;
		$processed               = $total;
	} else {
		$response['completed'] = $completed;
		$offset                = $offset + $limit;

		if ( $total > 0 ) {
			$response['percentage'] = $completed / $total * 100;
		} else {
			$response['percentage'] = 0;
		}
	}

	// translators: number of users indexed on this go, total indexed users, total processed users, total number of users.
	$response['feedback'] = sprintf( _n( 'Indexed %1$d user (total %2$d), processed %3$d / %4$d.', 'Indexed %1$d users (total %2$d), processed %3$d / %4$d.', $indexing_response['indexed'], 'relevanssi' ), $indexing_response['indexed'], $completed, $processed, $total ) . "\n";
	$response['offset']   = $offset;

	echo wp_json_encode( $response );
	wp_die();
}

/**
 * Counts the users.
 *
 * Counts the users for indexing purposes using the relevanssi_count_users() function.
 *
 * @since 2.0.0
 */
function relevanssi_count_users_ajax_wrapper() {
	$count = -1;
	if ( function_exists( 'relevanssi_count_users' ) ) {
		$count = relevanssi_count_users();
	}
	echo wp_json_encode( $count );
	wp_die();
}

/**
 * Counts the taxonomy terms.
 *
 * Counts the taxonomy terms for indexing purposes using the relevanssi_count_taxonomy_terms() function.
 *
 * @since 2.0.0
 */
function relevanssi_count_taxonomies_ajax_wrapper() {
	$count = -1;
	if ( function_exists( 'relevanssi_count_taxonomy_terms' ) ) {
		$count = relevanssi_count_taxonomy_terms();
	}
	echo wp_json_encode( $count );
	wp_die();
}
