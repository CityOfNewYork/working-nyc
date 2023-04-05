<?php
/**
 * /premium/pdf-upload.php
 *
 * @package Relevanssi_Premium
 * @author  Mikko Saari
 * @license https://wordpress.org/about/gpl/ GNU General Public License
 * @see     https://www.relevanssi.com/
 */

add_action( 'add_meta_boxes_attachment', 'relevanssi_add_pdf_metaboxes' );
add_filter( 'relevanssi_index_custom_fields', 'relevanssi_add_pdf_customfield' );
add_action( 'add_attachment', 'relevanssi_read_attachment', 10 );
add_filter( 'relevanssi_pre_excerpt_content', 'relevanssi_add_pdf_content_to_excerpt', 10, 2 );

/**
 * Reads the attachment content when an attachment is saved.
 *
 * Uses relevanssi_index_pdf() to read in the attachment content whenever an
 * attachment is saved. Works on the 'add_attachment' filter hook.
 *
 * @param int $post_id The post ID for the attachment.
 *
 * @since 2.0.0
 */
function relevanssi_read_attachment( $post_id ) {
	$post_status = get_post_status( $post_id );
	if ( 'auto-draft' === $post_status ) {
		return;
	}

	if ( 'on' !== get_option( 'relevanssi_read_new_files' ) ) {
		return;
	}

	$mime_type  = get_post_mime_type( $post_id );
	$mime_parts = explode( '/', $mime_type );
	if ( ! in_array( $mime_parts[0], array( 'image', 'video' ), true ) ) {
		$result = relevanssi_index_pdf( $post_id );
		if ( is_array( $result ) && isset( $result['success'] ) && true === $result['success'] ) {
			// Remove the usual relevanssi_publish action because
			// relevanssi_index_pdf() already indexes the post.
			remove_action( 'add_attachment', 'relevanssi_publish', 12 );
		}
	}
}

/**
 * Includes the PDF content custom field in the list of custom fields.
 *
 * This function works on 'relevanssi_index_custom_fields' filter and makes sure the
 * '_relevanssi_pdf_content' custom field is included.
 *
 * @since 2.0.0
 *
 * @param array $custom_fields The custom fields array.
 *
 * @return array $custom_fields The custom fields array.
 */
function relevanssi_add_pdf_customfield( $custom_fields ) {
	if ( ! is_array( $custom_fields ) ) {
		$custom_fields = array();
	}
	if ( ! in_array( '_relevanssi_pdf_content', $custom_fields, true ) ) {
		$custom_fields[] = '_relevanssi_pdf_content';
	}
	return $custom_fields;
}

/**
 * Includes the PDF content custom field for excerpt-building.
 *
 * This function works on 'relevanssi_pre_excerpt_content' filter and makes sure the
 * '_relevanssi_pdf_content' custom field content is included when excerpts are built.
 *
 * @since 2.0.0
 *
 * @param string $content The post content.
 * @param object $post    The post object.
 *
 * @return string $content The post content.
 */
function relevanssi_add_pdf_content_to_excerpt( $content, $post ) {
	$pdf_content = get_post_meta( $post->ID, '_relevanssi_pdf_content', true );
	$content    .= ' ' . $pdf_content;
	return $content;
}

/**
 * Adds the PDF control metabox.
 *
 * Adds the PDF control metaboxes on post edit pages for posts in the
 * 'attachment' post type, with a MIME type that is not 'image/*' or
 * 'video/*'.
 *
 * @since 2.0.0
 *
 * @param object $post    The post object.
 */
function relevanssi_add_pdf_metaboxes( $post ) {
	// Do not display on image pages.
	$mime_parts = explode( '/', $post->post_mime_type );
	if ( in_array( $mime_parts[0], array( 'image', 'video' ), true ) ) {
		return;
	}

	add_meta_box(
		'relevanssi_pdf_box',
		__( 'Relevanssi attachment controls', 'relevanssi' ),
		'relevanssi_attachment_metabox',
		$post->post_type
	);
}

/**
 * Prints out the attachment control metabox.
 *
 * Prints out the attachment control metabox used for reading attachments and
 * examining the read attachment content.
 *
 * @global object $post The global post object.
 *
 * @since 2.0.0
 */
function relevanssi_attachment_metabox() {
	global $post;
	$url         = wp_get_attachment_url( $post->ID );
	$id          = $post->ID;
	$button_text = __( 'Index attachment content', 'relevanssi' );
	$api_key     = get_site_option( 'relevanssi_api_key' );
	$admin_url   = esc_url( admin_url( 'admin-post.php' ) );
	$action      = 'sendUrl';
	$explanation = __( 'Indexer will fetch the file from your server.', 'relevanssi' );
	if ( 'on' === get_option( 'relevanssi_send_pdf_files' ) ) {
		$action      = 'sendPdf';
		$explanation = __( 'The file will be uploaded to the indexer.', 'relevanssi' );
	}

	if ( ! $api_key ) {
		printf( '<p>%s</p>', esc_html__( 'No API key set. API key is required for attachment indexing.', 'relevanssi' ) );
	} else {
		printf( '<p><input type="button" id="%s" value="%s" class="button-primary button-large" data-api_key="%s" data-post_id="%d" data-url="%s" title="%s"/></p>',
		esc_attr( $action ), esc_attr( $button_text ), esc_attr( $api_key ), intval( $id ), esc_attr( $url ), esc_attr( $explanation ) );

		$pdf_content = get_post_meta( $post->ID, '_relevanssi_pdf_content', true );
		if ( $pdf_content ) {
			$pdf_content_title = __( 'Attachment content', 'relevanssi' );
			printf( '<h3>%s</h3> <p><textarea cols="80" rows="4" readonly>%s</textarea></p>', esc_html( $pdf_content_title ), esc_html( $pdf_content ) );
		}

		$pdf_error = get_post_meta( $post->ID, '_relevanssi_pdf_error', true );
		if ( $pdf_error ) {
			$pdf_error_title = __( 'Attachment error message', 'relevanssi' );
			printf( '<h3>%s</h3> <p><textarea cols="80" rows="4" readonly>%s</textarea></p>', esc_html( $pdf_error_title ), esc_html( $pdf_error ) );
		}

		if ( empty( $pdf_content ) && empty( $pdf_error ) ) {
			printf( '<p>%s</p>', esc_html__( 'This page will reload after indexing and you can see the response from the attachment extracting server.', 'relevanssi' ) );
		}
	}
}

/**
 * Reads in attachment content from a attachment file.
 *
 * Reads in the attachment content, either by sending an URL or the file itself to
 * the Relevanssi attachment reading service.
 *
 * @param int     $post_id   The attachment post ID.
 * @param boolean $ajax      Is this in AJAX context? Default false.
 * @param string  $send_file Should the file be sent ('on'), or just the URL ('off')?
 * Default null.
 *
 * @since 2.0.0
 */
function relevanssi_index_pdf( $post_id, $ajax = false, $send_file = null ) {
	$hide_post = get_post_meta( $post_id, '_relevanssi_hide_post', true );
	if ( $hide_post ) {
		$error = 'Post excluded from the index by the user.';
		delete_post_meta( $post_id, '_relevanssi_pdf_content' );
		update_post_meta( $post_id, '_relevanssi_pdf_error', $error );

		$result = array(
			'success' => false,
			'error'   => $error,
		);

		return $result;
	}

	if ( is_null( $send_file ) ) {
		$send_file = get_option( 'relevanssi_send_pdf_files' );
	} else {
		if ( $send_file ) {
			$send_file = 'on';
		}
	}

	$api_key    = get_site_option( 'relevanssi_api_key' );
	$server_url = relevanssi_get_server_url();

	if ( 'on' === $send_file ) {
		$file_name = get_attached_file( $post_id );

		$file = fopen( $file_name, 'r' ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		if ( false === $file ) {
			$response = new WP_Error( 'fopen', 'Could not open the file for reading.' );
		} else {
			$file_size = filesize( $file_name );
			$file_data = fread( $file, $file_size ); // phpcs:ignore WordPress.WP.AlternativeFunctions
			$args      = array(
				'headers' => array(
					'accept'       => 'application/json',   // The API returns JSON.
					'content-type' => 'application/binary', // Set content type to binary.
				),
				'body'    => $file_data,
				/**
				 * Changes the default reading timeout.
				 *
				 * By default, the timeout period is 45 seconds. If that's not
				 * enough, you can adjust the timeout period with this filter.
				 *
				 * @param int $timeout The timeout in seconds, default 45.
				 */
				'timeout' => apply_filters( 'relevanssi_pdf_read_timeout', 45 ),
			);
			$response = wp_safe_remote_post( $server_url . 'index.php?key=' . $api_key . '&upload=true', $args );
		}
	} else {
		$url = wp_get_attachment_url( $post_id );

		$args = array(
			'body'    => array(
				'key' => $api_key,
				'url' => $url,
			),
			'method'  => 'POST',
			/**
			 * Changes the default reading timeout.
			 *
			 * By default, the timeout period is 45 seconds. If that's not
			 * enough, you can adjust the timeout period with this filter.
			 *
			 * @param int $timeout The timeout in seconds, default 45.
			 */
			'timeout' => apply_filters( 'relevanssi_pdf_read_timeout', 45 ),
		);

		$response = wp_safe_remote_post( $server_url, $args );
	}

	$result = relevanssi_process_server_response( $response, $post_id );

	if ( $ajax ) {
		echo wp_json_encode( $result );
		wp_die();
	}

	return $result;
}

/**
 * Processes the attachment reading server response.
 *
 * Takes in the response from the attachment reading server and stores the attachment
 * content or the error message to the appropriate custom fields.
 *
 * @param array $response The server response.
 * @param int   $post_id  The attachment post ID.
 *
 * @since 2.0.0
 */
function relevanssi_process_server_response( $response, $post_id ) {
	$success        = null;
	$response_error = '';
	if ( is_wp_error( $response ) ) {
		$error_message   = $response->get_error_message();
		$response_error .= $error_message . '\n';

		delete_post_meta( $post_id, '_relevanssi_pdf_content' );
		update_post_meta( $post_id, '_relevanssi_pdf_error', $error_message );
		$success = false;
	} else {
		if ( isset( $response['body'] ) ) {
			$content = $response['body'];
			$content = json_decode( $content );

			if ( isset( $content->error ) ) {
				delete_post_meta( $post_id, '_relevanssi_pdf_content' );
				update_post_meta( $post_id, '_relevanssi_pdf_error', $content->error );

				$response_error .= $content->error;
				$success         = false;
			} else {
				delete_post_meta( $post_id, '_relevanssi_pdf_error' );
				update_post_meta( $post_id, '_relevanssi_pdf_content', $content );
				relevanssi_index_doc( $post_id, false, relevanssi_get_custom_fields(), true );

				$success = true;
			}
		}
	}

	$response = array(
		'success' => $success,
		'error'   => $response_error,
	);

	return $response;
}

/**
 * Gets the posts with attachments.
 *
 * Finds the posts with non-image attachments that don't have read content or errors,
 * including those with timeout or connection errors.
 *
 * @since 2.0.0
 *
 * @param int $limit The number of posts to fetch, default 1.
 *
 * @return array The posts with attachments.
 */
function relevanssi_get_posts_with_attachments( $limit = 1 ) {
	global $wpdb;

	$meta_query_args = array(
		'relation' => 'AND',
		array(
			'key'     => '_relevanssi_pdf_content',
			'compare' => 'NOT EXISTS',
		),
		array(
			'relation' => 'OR',
			array(
				'key'     => '_relevanssi_pdf_error',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => '_relevanssi_pdf_error',
				'compare' => 'LIKE',
				'value'   => 'cURL error 7:',
			),
			array(
				'key'     => '_relevanssi_pdf_error',
				'compare' => 'LIKE',
				'value'   => 'cURL error 28:',
			),
		),
	);
	$meta_query      = new WP_Meta_Query( $meta_query_args );
	$meta_query_sql  = $meta_query->get_sql( 'post', $wpdb->posts, 'ID' );
	$meta_join       = '';
	$meta_where      = '';
	if ( $meta_query_sql ) {
		$meta_join  = $meta_query_sql['join'];
		$meta_where = $meta_query_sql['where'];
	}

	$posts = $wpdb->get_col(
		$wpdb->prepare( "SELECT DISTINCT(ID) FROM $wpdb->posts $meta_join WHERE post_type = 'attachment' AND post_status = 'inherit' AND post_mime_type LIKE %s $meta_where LIMIT %d", 'application/%', $limit )
	); // WPCS: unprepared SQL ok.

	return $posts;
}

/**
 * Prints out the Javascript for PDF content reading.
 *
 * @since 2.0.0
 */
function relevanssi_pdf_action_javascript() {
	$list_pdfs_nonce  = wp_create_nonce( 'relevanssi-list-pdfs' );
	$wipe_pdfs_nonce  = wp_create_nonce( 'relevanssi-wipe-pdfs' );
	$index_pdfs_nonce = wp_create_nonce( 'relevanssi-index-pdfs' );

	?>
	<script type="text/javascript" >
	var time = 0;
	var intervalID = 0;

	function relevanssiUpdateClock( ) {
		time++;
		var time_formatted = rlv_format_time(Math.round(time));
		document.getElementById("relevanssi_elapsed").innerHTML = time_formatted;
	}

	jQuery(document).ready(function($ ) {
		$("#index").click(function( ) {
			$("#relevanssi-progress").show();
			$("#relevanssi_results").show();
			$("#relevanssi-timer").show();
			$("#stateofthepdfindex").html(relevanssi.reload_state);

			intervalID = window.setInterval(relevanssiUpdateClock, 1000);

			var data = {
				'action': 'relevanssi_list_pdfs',
				'security': '<?php echo esc_html( $list_pdfs_nonce ); ?>'
			};

			console.log("Getting a list of pdfs.");

			var pdf_ids;

			jQuery.post(ajaxurl, data, function(response ) {
				pdf_ids = JSON.parse(response);
				console.log(pdf_ids);
				console.log("Fetching response: " + response);
				console.log("Heading into step 0");
				console.log(pdf_ids.length);
				process_step(0, pdf_ids.length, 0);
			});
		});
		$("#reset").click(function($ ) {
			if (confirm( relevanssi.pdf_reset_confirm ) ) {
				var data = {
					'action': 'relevanssi_wipe_pdfs',
					'security': '<?php echo esc_html( $wipe_pdfs_nonce ); ?>'
				}
				jQuery.post(ajaxurl, data, function(response ) {
					alert( relevanssi.pdf_reset_done );
					jQuery("#stateofthepdfindex").html(relevanssi.reload_state);
				});
			}
			else {
				return false;
			}
		});
	});

	function process_step(completed, total, total_seconds ) {
		var t0 = performance.now();
		jQuery.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'relevanssi_index_pdfs',
				security: '<?php echo esc_html( $index_pdfs_nonce ); ?>',
				completed: completed,
				total: total,
			},
			dataType: 'json',
			success: function(response ) {
				console.log(response);
				var relevanssi_results = document.getElementById("relevanssi_results");
				if (response.completed == 'done' ) {
					relevanssi_results.value += response.feedback;
					jQuery( '.rpi-progress div').animate({
						width: response.percentage + '%',
						}, 50, function( ) {
						// Animation complete.
					});

					clearInterval(intervalID);
				}
				else {
					var t1 = performance.now();
					var time_seconds = (t1 - t0) / 1000;
					time_seconds = Math.round(time_seconds * 100) / 100;
					total_seconds += time_seconds;

					var estimated_time = rlv_format_approximate_time(Math.round(total_seconds / response.percentage * 100 - total_seconds));
					document.getElementById("relevanssi_estimated").innerHTML = estimated_time;

					relevanssi_results.value += response.feedback;
					relevanssi_results.scrollTop = relevanssi_results.scrollHeight;
					jQuery( '.rpi-progress div').animate({
						width: response.percentage + '%',
						}, 50, function( ) {
						// Animation complete.
					});
					console.log("Heading into step " + response.completed);
					process_step(parseInt(response.completed), total, total_seconds);                 
				}
			}
		})        
	}

	</script>
<?php
}
