<?php
/**
 * /premium/indexing.php
 *
 * @package Relevanssi_Premium
 * @author  Mikko Saari
 * @license https://wordpress.org/about/gpl/ GNU General Public License
 * @see     https://www.relevanssi.com/
 */

/**
 * Indexes user profiles when profile updates.
 *
 * @param object|int $user User object or user ID.
 */
function relevanssi_profile_update( $user ) {
	if ( 'on' === get_option( 'relevanssi_index_users' ) ) {
		$update = true;
		relevanssi_index_user( $user, $update );
	}
}

/**
 * Indexes taxonomy terms when term is updated.
 *
 * @param string $term             The term.
 * @param int    $taxonomy_term_id The term taxonomy ID (not used here).
 * @param string $taxonomy         The taxonomy.
 */
function relevanssi_edit_term( $term, $taxonomy_term_id, $taxonomy ) {
	$update = true;
	relevanssi_do_term_indexing( $term, $taxonomy, $update );
}

/**
 * Indexes taxonomy terms when term is added.
 *
 * @param string $term             The term.
 * @param int    $taxonomy_term_id The term taxonomy ID (not used here).
 * @param string $taxonomy         The taxonomy.
 */
function relevanssi_add_term( $term, $taxonomy_term_id, $taxonomy ) {
	$update = false;
	relevanssi_do_term_indexing( $term, $taxonomy, $update );
}

/**
 * Indexes taxonomy term, if taxonomy term indexing is enabled.
 *
 * @param string  $term     The term.
 * @param string  $taxonomy The taxonomy.
 * @param boolean $update   If true, term is updated; if false, it is added.
 */
function relevanssi_do_term_indexing( $term, $taxonomy, $update ) {
	if ( 'on' === get_option( 'relevanssi_index_taxonomies' ) ) {
		$taxonomies = get_option( 'relevanssi_index_terms' );
		if ( in_array( $taxonomy, $taxonomies, true ) ) {
			relevanssi_index_taxonomy_term( $term, $taxonomy, $update );
		}
	}
}

/**
 * Deletes an user from Relevanssi index.
 *
 * Deletes an user from the Relevanssi index. Attached to the 'delete_user' action.
 *
 * @global $wpdb The WordPress database interface.
 * @global $relevanssi_variables The global Relevanssi variables, used for the database table names.
 *
 * @param int $user User ID to delete.
 */
function relevanssi_delete_user( $user ) {
	global $wpdb, $relevanssi_variables;
	$user = intval( $user );
	$wpdb->query( 'DELETE FROM ' . $relevanssi_variables['relevanssi_table'] . " WHERE item = $user AND type = 'user'" ); // WPCS: unprepared SQL ok. No user-generated input variables.
}

/**
 * Deletes a taxonomy term from Relevanssi index.
 *
 * Deletes a taxonomy term from the Relevanssi index. Attached to the 'delete_term' action.
 *
 * @global $wpdb The WordPress database interface.
 * @global $relevanssi_variables The global Relevanssi variables, used for the database table names.
 *
 * @param int    $term             Term ID to remove.
 * @param int    $term_taxonomy_id Term taxonomy ID (not used).
 * @param string $taxonomy         The taxonomy.
 */
function relevanssi_delete_taxonomy_term( $term, $term_taxonomy_id, $taxonomy ) {
	global $wpdb, $relevanssi_variables;
	$wpdb->query( 'DELETE FROM ' . $relevanssi_variables['relevanssi_table'] . " WHERE item = $term AND type = '$taxonomy'" ); // WPCS: unprepared SQL ok. No user-generated input variables.
}

/**
 * Generates the custom field detail field for indexing.
 *
 * Premium stores more detail about custom field indexing. This function generates the custom field detail.
 *
 * @param array  $insert_data Data used to generate the INSERT queries.
 * @param string $token       The indexed token.
 * @param int    $count       The number of matches.
 * @param string $field       Name of the custom field.
 *
 * @return array $insert_data New source data for the INSERT queries added.
 */
function relevanssi_customfield_detail( $insert_data, $token, $count, $field ) {
	if ( isset( $insert_data[ $token ]['customfield_detail'] ) ) {
		// Custom field detail for this token already exists.
		$custom_field_detail = json_decode( $insert_data[ $token ]['customfield_detail'], true );
	} else {
		// Nothing yet, create new.
		$custom_field_detail = array();
	}
	if ( isset( $custom_field_detail[ $field ] ) ) {
		// Matches in this field already exist, add to those.
		$custom_field_detail[ $field ] += $count;
	} else {
		// No matches, create new.
		$custom_field_detail[ $field ] = $count;
	}
	$insert_data[ $token ]['customfield_detail'] = wp_json_encode( $custom_field_detail );
	return $insert_data;
}

/**
 * Indexes custom MySQL column content.
 *
 * Generates the INSERT query base data for MySQL column content.
 *
 * @global $wpdb The WordPress database interface.
 *
 * @param array  $insert_data Data used to generate the INSERT queries.
 * @param string $post_id     Post ID.
 *
 * @return array $insert_data New source data for the INSERT queries added.
 */
function relevanssi_index_mysql_columns( $insert_data, $post_id ) {
	$custom_columns = get_option( 'relevanssi_mysql_columns' );
	if ( ! empty( $custom_columns ) ) {
		global $wpdb;

		// Get a list of possible column names.
		$column_list = wp_cache_get( 'relevanssi_column_list' );
		if ( false === $column_list ) {
			$column_list = $wpdb->get_results( "SHOW COLUMNS FROM $wpdb->posts" );
			wp_cache_set( 'relevanssi_column_list', $column_list );
		}
		$valid_columns = array();
		foreach ( $column_list as $column ) {
			array_push( $valid_columns, $column->Field );
		}

		// This is to remove problems where the list ends in a comma.
		$custom_column_array      = explode( ',', $custom_columns );
		$custom_column_list_array = array();
		foreach ( $custom_column_array as $column ) {
			$column = trim( $column );
			if ( in_array( $column, $valid_columns, true ) ) {
				$custom_column_list_array[] = $column;
			}
		}
		$custom_column_list = implode( ', ', $custom_column_list_array );

		$custom_column_data = $wpdb->get_row( "SELECT $custom_column_list FROM $wpdb->posts WHERE ID=$post_id", ARRAY_A ); // WPCS: unprepared SQL ok. No user-generated input, column list can only contain valid column names.
		if ( is_array( $custom_column_data ) ) {
			foreach ( $custom_column_data as $data ) {
				$data = relevanssi_tokenize( $data );
				if ( count( $data ) > 0 ) {
					foreach ( $data as $term => $count ) {
						if ( isset( $insert_data[ $term ]['mysqlcolumn'] ) ) {
							$insert_data[ $term ]['mysqlcolumn'] += $count;
						} else {
							$insert_data[ $term ]['mysqlcolumn'] = $count;
						}
					}
				}
			}
		}
	}
	return $insert_data;
}

/**
 * Processes internal links.
 *
 * Process the internal links the way user wants: no indexing, indexing, or stripping.
 *
 * @global $wpdb The WordPress database interface.
 * @global $relevanssi_variables The global Relevanssi variables, used for the database table names.
 *
 * @param string $contents Post content.
 * @param int    $post_id Post ID.
 *
 * @return string $contents Contents, modified.
 */
function relevanssi_process_internal_links( $contents, $post_id ) {
	$internal_links_behaviour = get_option( 'relevanssi_internal_links', 'noindex' );

	if ( 'noindex' !== $internal_links_behaviour ) {
		global $relevanssi_variables, $wpdb;
		$min_word_length = get_option( 'relevanssi_min_word_length', 3 );

		// Index internal links.
		$internal_links = relevanssi_get_internal_links( $contents );

		if ( ! empty( $internal_links ) ) {
			foreach ( $internal_links as $link => $text ) {
				$link_id = url_to_postid( $link );
				if ( ! empty( $link_id ) ) {
					$link_words = relevanssi_tokenize( $text, true, $min_word_length );
					if ( count( $link_words ) > 0 ) {
						foreach ( $link_words as $word => $count ) {
							$wpdb->query( $wpdb->prepare( 'INSERT IGNORE INTO ' . $relevanssi_variables['relevanssi_table'] . ' (doc, term, term_reverse, link, item)
							VALUES (%d, %s, REVERSE(%s), %d, %d)', $link_id, $word, $word, $count, $post_id ) ); // WPCS: unprepared SQL ok. Relevanssi table name.
						}
					}
				}
			}

			if ( 'strip' === $internal_links_behaviour ) {
				$contents = relevanssi_strip_internal_links( $contents );
			}
		}
	}

	return $contents;
}

/**
 * Finds internal links.
 *
 * A function to find all internal links in the parameter text.
 *
 * @param string $text Text where the links are extracted from.
 *
 * @return array $links All links in the post, or false if fails.
 */
function relevanssi_get_internal_links( $text ) {
	$links = array();
	if ( preg_match_all( '@<a[^>]*?href="(' . home_url() . '[^"]*?)"[^>]*?>(.*?)</a>@siu', $text, $m ) ) {
		foreach ( $m[1] as $i => $link ) {
			if ( ! isset( $links[ $link ] ) ) {
				$links[ $link ] = '';
			}
			$links[ $link ] .= ' ' . $m[2][ $i ];
		}
	}
	if ( preg_match_all( '@<a[^>]*?href="(/[^"]*?)"[^>]*?>(.*?)</a>@siu', $text, $m ) ) {
		foreach ( $m[1] as $i => $link ) {
			if ( ! isset( $links[ $link ] ) ) {
				$links[ $link ] = '';
			}
			$links[ $link ] .= ' ' . $m[2][ $i ];
		}
	}
	if ( count( $links ) > 0 ) {
		return $links;
	}
	return false;
}

/**
 * Strips internal links.
 *
 * A function to strip all internal links from the parameter text.
 *
 * @param string $text Text where the links are extracted from.
 *
 * @return array $links The text without the links.
 */
function relevanssi_strip_internal_links( $text ) {
	$text = preg_replace(
		array(
			'@<a[^>]*?href="' . home_url() . '[^>]*?>.*?</a>@siu',
		),
	' ', $text );
	$text = preg_replace(
		array(
			'@<a[^>]*?href="/[^>]*?>.*?</a>@siu',
		),
	' ', $text );
	return $text;
}

/**
 * Applies the thousands separator rule to text.
 *
 * Finds numbers separated by the chosen thousand separator and combine them.
 *
 * @param string $string The string to fix.
 *
 * @return string $string The fixed string.
 */
function relevanssi_apply_thousands_separator( $string ) {
	$thousands_separator = get_option( 'relevanssi_thousand_separator', '' );
	if ( ! empty( $thousands_separator ) ) {
		$pattern = '/(\d+)' . $thousands_separator . '(\d+)/u';
		$string  = preg_replace( $pattern, '$1$2', $string );
	}
	return $string;
}

/**
 * Adds a stemmer-enabling filter.
 *
 * This filter introduces a new filter hook that runs the stemmers.
 *
 * @param string $string The string that is stemmed.
 *
 * @return string $string The string after stemming.
 */
function relevanssi_enable_stemmer( $string ) {
	/**
	 * Applies stemmer to document content and search terms.
	 *
	 * @param string $string The string that is stemmed.
	 *
	 * @return string $string The string after stemming.
	 */
	$string = apply_filters( 'relevanssi_stemmer', $string );
	return $string;
}

/**
 * Does simple English stemming.
 *
 * A simple suffix stripper that can be used to stem English texts.
 *
 * @param string $term Search term to stem.
 *
 * @return string $term The stemmed term.
 */
function relevanssi_simple_english_stemmer( $term ) {
	$len = strlen( $term );

	$end1 = substr( $term, -1, 1 );
	if ( 's' === $end1 && $len > 3 ) {
		$term = substr( $term, 0, -1 );
	}
	$end = substr( $term, -3, 3 );

	if ( 'ing' === $end && $len > 5 ) {
		return substr( $term, 0, -3 );
	}
	if ( 'est' === $end && $len > 5 ) {
		return substr( $term, 0, -3 );
	}

	$end = substr( $end, 1 );
	if ( 'es' === $end && $len > 3 ) {
		return substr( $term, 0, -2 );
	}
	if ( 'ed' === $end && $len > 3 ) {
		return substr( $term, 0, -2 );
	}
	if ( 'en' === $end && $len > 3 ) {
		return substr( $term, 0, -2 );
	}
	if ( 'er' === $end && $len > 3 ) {
		return substr( $term, 0, -2 );
	}
	if ( 'ly' === $end && $len > 4 ) {
		return substr( $term, 0, -2 );
	}

	return $term;
}

/**
 * Adds synonyms to post content and titles for indexing.
 *
 * In order to use synonyms in AND searches, the synonyms must be indexed within the posts.
 * This function adds synonyms for post content and titles when indexing posts.
 *
 * @global $relevanssi_variables The global Relevanssi variables, used for the synonym database.
 *
 * @param object $post The post object.
 *
 * @return object $post The post object, with synonyms.
 */
function relevanssi_add_indexing_synonyms( $post ) {
	global $relevanssi_variables;

	if ( ! isset( $relevanssi_variables['synonyms'] ) ) {
		relevanssi_create_synonym_replacement_array();
	}

	if ( ! empty( $relevanssi_variables['synonyms'] ) ) {
		$search  = array_keys( $relevanssi_variables['synonyms'] );
		$replace = array_values( $relevanssi_variables['synonyms'] );

		$post_content = relevanssi_strtolower( $post->post_content );
		$post_title   = relevanssi_strtolower( $post->post_title );

		$boundary_search = array();
		foreach ( $search as $term ) {
			$boundary_search[] = '/\b' . str_replace( '/', '\/', preg_quote( $term ) ) . '\b/u';
		}

		$post->post_content = preg_replace( $boundary_search, $replace, $post_content );
		$post->post_title   = preg_replace( $boundary_search, $replace, $post_title );
	}

	return $post;
}

/**
 * Creates the synonym replacement array.
 *
 * A helper function that generates a synonym replacement array. The array
 * is then stored in a global variable, so that it only needs to generated
 * once per running the script.
 *
 * @global $relevanssi_variables The global Relevanssi variables, used to
 * store the synonym database.
 */
function relevanssi_create_synonym_replacement_array() {
	global $relevanssi_variables;

	$synonym_data = get_option( 'relevanssi_synonyms' );
	if ( $synonym_data ) {
		$synonyms     = array();
		$synonym_data = relevanssi_strtolower( $synonym_data );
		$pairs        = explode( ';', $synonym_data );

		foreach ( $pairs as $pair ) {
			$parts = explode( '=', $pair );
			$key   = strval( trim( $parts[0] ) );
			$value = trim( $parts[1] );
			if ( ! isset( $synonyms[ $value ] ) ) {
				$synonyms[ $value ] = "$value $key";
			} else {
				$synonyms[ $value ] .= " $key";
			}
		}
		$relevanssi_variables['synonyms'] = $synonyms;
	}
}

/**
 * Adds pinned words to post content.
 *
 * Adds pinned terms to post content to make sure posts are found with the
 * pinned terms.
 *
 * @param string $content Post content.
 * @param object $post    The post object.
 */
function relevanssi_add_pinned_words_to_post_content( $content, $post ) {
	$pin_words = get_post_meta( $post->ID, '_relevanssi_pin', false );
	foreach ( $pin_words as $word ) {
		$content .= " $word";
	}
	return $content;
}

/**
 * Adds ACF repeater fields to the list of custom fields.
 *
 * Goes through custom fields, finds fields that match the fieldname_%_subfieldname
 * pattern, finds the number of fields from the fieldname custom field and then
 * adds the fieldname_0_subfieldname... fields to the list of custom fields. Only
 * works one level deep.
 *
 * @param array $custom_fields The list of custom fields, used as a reference.
 * @param int   $post_id       The post ID of the current post.
 */
function relevanssi_add_repeater_fields( &$custom_fields, $post_id ) {
	$repeater_fields = array();
	foreach ( $custom_fields as $field ) {
		if ( 1 === substr_count( $field, '%' ) ) { // Only one level of repeaters supported.
			$field = str_replace( '/', '\/', $field );
			preg_match( '/([a-z0-9\_\-]+)_\%_([a-z0-9\_\-]+)/i', $field, $matches );
			$field_name    = '';
			$subfield_name = '';
			if ( count( $matches ) > 1 ) {
				$field_name    = $matches[1];
				$subfield_name = $matches[2];
			}
			if ( $field_name ) {
				$num_fields = get_post_meta( $post_id, $field_name, true );
				if ( is_array( $num_fields ) ) {
					$num_fields = count( $num_fields );
				}
				for ( $i = 0; $i < $num_fields; $i++ ) {
					$repeater_fields[] = $field_name . '_' . $i . '_' . $subfield_name;
				}
			}
		} else {
			continue;
		}
	}
	$custom_fields = array_merge( $custom_fields, $repeater_fields );
}

/**
 * Adds the PDF data from child posts to parent posts.
 *
 * Takes the PDF content data from child posts for indexing purposes.
 *
 * @global $wpdb The WordPress database interface.
 *
 * @param array $insert_data The base data for INSERT queries.
 * @param int   $post_id     The post ID.
 *
 * @return array $insert_data The INSERT data with new content added.
 */
function relevanssi_index_pdf_for_parent( $insert_data, $post_id ) {
	$option = get_option( 'relevanssi_index_pdf_parent', '' );
	if ( empty( $option ) || 'off' === $option ) {
		return $insert_data;
	}

	global $wpdb;

	$post_id     = intval( $post_id );
	$pdf_content = $wpdb->get_col( "SELECT meta_value FROM $wpdb->postmeta AS pm, $wpdb->posts AS p WHERE pm.post_id = p.ID AND p.post_parent = $post_id AND meta_key = '_relevanssi_pdf_content'" ); // WPCS: unprepared SQL ok, database table names and sanitized post ID.

	if ( is_array( $pdf_content ) ) {
		foreach ( $pdf_content as $row ) {
			$data = relevanssi_tokenize( $row, true, get_option( 'relevanssi_min_word_length', 3 ) );
			if ( count( $data ) > 0 ) {
				foreach ( $data as $term => $count ) {
					if ( isset( $insert_data[ $term ]['customfield'] ) ) {
						$insert_data[ $term ]['customfield'] += $count;
					} else {
						$insert_data[ $term ]['customfield'] = $count;
					}
					$insert_data = relevanssi_customfield_detail( $insert_data, $term, $count, '_relevanssi_pdf_content' );
				}
			}
		}
	}

	return $insert_data;
}

/**
 * Indexes all users.
 *
 * Runs indexing on all users.
 *
 * @global $wpdb The WordPress database interface.
 * @global $relevanssi_variables The global Relevanssi variables, used for the database table names.
 */
function relevanssi_index_users() {
	global $wpdb, $relevanssi_variables;

	// Delete all users from the Relevanssi index first.
	$wpdb->query( 'DELETE FROM ' . $relevanssi_variables['relevanssi_table'] . " WHERE type = 'user'" ); // WPCS: unprepared SQL ok. Just table names.

	$args = array();

	$index_subscribers = get_option( 'relevanssi_index_subscribers' );
	if ( 'on' !== $index_subscribers ) {
		$args['role__not_in'] = array( 'subscriber' );
	}

	$users_list = get_users( $args );
	$users      = array();
	foreach ( $users_list as $user ) {
		$users[] = get_userdata( $user->ID );
	}

	if ( defined( 'WP_CLI' ) && WP_CLI ) {
		$progress = WP_CLI\Utils\make_progress_bar( 'Indexing users', count( $users ) );
	}

	$update = false;
	foreach ( $users as $user ) {
		/**
		 * Checks if the user can be indexed.
		 *
		 * @param boolean $index Should the user be indexed, default true.
		 * @param object  $user  The user object.
		 *
		 * @return boolean $index If false, do not index the user.
		 */
		$index_this_user = apply_filters( 'relevanssi_user_index_ok', true, $user );

		if ( $index_this_user ) {
			relevanssi_index_user( $user, $update );
		}

		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			$progress->tick();
		}
	}
	if ( defined( 'WP_CLI' ) && WP_CLI ) {
		$progress->finish();
	}
}

/**
 * Indexes users in AJAX context.
 *
 * Runs indexing on all users in AJAX context.
 *
 * @global $wpdb The WordPress database interface.
 * @global $relevanssi_variables The global Relevanssi variables, used for the database table names.
 *
 * @param int $limit  Number of users to index on one go.
 * @param int $offset Indexing offset.
 *
 * @return array $response AJAX response, number of users indexed in the $response['indexed'].
 */
function relevanssi_index_users_ajax( $limit, $offset ) {
	global $wpdb, $relevanssi_variables;

	$args = array(
		'number' => intval( $limit ),
		'offset' => intval( $offset ),
	);

	$index_subscribers = get_option( 'relevanssi_index_subscribers' );
	if ( 'on' !== $index_subscribers ) {
		$args['role__not_in'] = array( 'subscriber' );
	}

	$users_list = get_users( $args );

	if ( empty( $users_list ) ) {
		$response = array(
			'indexed' => 0,
		);
		return $response;
	}

	$users = array();
	foreach ( $users_list as $user ) {
		$users[] = get_userdata( $user->ID );
	}

	$indexed_users = 0;
	foreach ( $users as $user ) {
		$update = false;
		if ( empty( $user->roles ) ) {
			continue;
		}
		/**
		 * Checks if the user can be indexed.
		 *
		 * @param boolean $index Should the user be indexed, default true.
		 * @param object  $user  The user object.
		 *
		 * @return boolean $index If false, do not index the user.
		 */
		$index_this_user = apply_filters( 'relevanssi_user_index_ok', true, $user );
		if ( $index_this_user ) {
			relevanssi_index_user( $user, $update );
			$indexed_users++;
		}
	}

	$response = array(
		'indexed' => $indexed_users,
	);

	return $response;
}

/**
 * Indexes one user.
 *
 * Indexes one user profile.
 *
 * @global $wpdb The WordPress database interface.
 * @global $relevanssi_variables The global Relevanssi variables, used for the database table names.
 *
 * @param object|int $user         The user object or user ID.
 * @param boolean    $remove_first Should the user be deleted first or not, default false.
 */
function relevanssi_index_user( $user, $remove_first = false ) {
	global $wpdb, $relevanssi_variables;

	if ( is_numeric( $user ) ) {
		// Not an object, make it an object.
		$user = get_userdata( $user );
		if ( false === $user ) {
			// Invalid user ID given, no user found. Exit.
			return;
		}
	}

	if ( $remove_first ) {
		relevanssi_delete_user( $user->ID );
	}

	/**
	 * Allows manipulating the user object before indexing.
	 *
	 * This filter can be used to manipulate the user object before it is processed for indexing.
	 * It's possible to add extra data (for example to user description field) or to change the
	 * existing data.
	 *
	 * @param object $user The user object.
	 */
	$user = apply_filters( 'relevanssi_user_add_data', $user );

	$insert_data      = array();
	$min_length       = get_option( 'relevanssi_min_word_length', 3 );
	$remove_stopwords = true;

	$user_meta = get_option( 'relevanssi_index_user_meta' );
	if ( $user_meta ) {
		$user_meta_fields = explode( ',', $user_meta );
		foreach ( $user_meta_fields as $key ) {
			$key    = trim( $key );
			$values = get_user_meta( $user->ID, $key, false );
			foreach ( $values as $value ) {
				$tokens = relevanssi_tokenize( $value, $remove_stopwords, $min_length );
				foreach ( $tokens as $term => $tf ) {
					if ( isset( $insert_data[ $term ]['content'] ) ) {
						$insert_data[ $term ]['content'] += $tf;
					} else {
						$insert_data[ $term ]['content'] = $tf;
					}
				}
			}
		}
	}

	$extra_fields = get_option( 'relevanssi_index_user_fields' );
	if ( $extra_fields ) {
		$extra_fields = explode( ',', $extra_fields );
		$user_vars    = get_object_vars( $user );
		foreach ( $extra_fields as $field ) {
			$field = trim( $field );
			if ( isset( $user_vars[ $field ] ) || isset( $user_vars['data']->$field ) || get_user_meta( $user->ID, $field, true ) ) {
				$to_tokenize = '';
				if ( isset( $user_vars[ $field ] ) ) {
					$to_tokenize = $user_vars[ $field ];
				}
				if ( empty( $to_tokenize ) && isset( $user_vars['data']->$field ) ) {
					$to_tokenize = $user_vars['data']->$field;
				}
				if ( empty( $to_tokenize ) ) {
					$to_tokenize = get_user_meta( $user->ID, $field, true );
				}
				$tokens = relevanssi_tokenize( $to_tokenize, $remove_stopwords, $min_length );
				foreach ( $tokens as $term => $tf ) {
					if ( isset( $insert_data[ $term ]['content'] ) ) {
						$insert_data[ $term ]['content'] += $tf;
					} else {
						$insert_data[ $term ]['content'] = $tf;
					}
				}
			}
		}
	}

	if ( isset( $user->description ) && '' !== $user->description ) {
		$tokens = relevanssi_tokenize( $user->description, $remove_stopwords, $min_length );
		foreach ( $tokens as $term => $tf ) {
			if ( isset( $insert_data[ $term ]['content'] ) ) {
				$insert_data[ $term ]['content'] += $tf;
			} else {
				$insert_data[ $term ]['content'] = $tf;
			}
		}
	}

	if ( isset( $user->first_name ) && '' !== $user->first_name ) {
		$parts = explode( ' ', $user->first_name );
		foreach ( $parts as $part ) {
			if ( isset( $insert_data[ $part ]['title'] ) ) {
				$insert_data[ $part ]['title']++;
			} else {
				$insert_data[ $part ]['title'] = 1;
			}
		}
	}

	if ( isset( $user->last_name ) && ' ' !== $user->last_name ) {
		$parts = explode( ' ', $user->last_name );
		foreach ( $parts as $part ) {
			if ( isset( $insert_data[ $part ]['title'] ) ) {
				$insert_data[ $part ]['title']++;
			} else {
				$insert_data[ $part ]['title'] = 1;
			}
		}
	}

	if ( isset( $user->display_name ) && ' ' !== $user->display_name ) {
		$parts = explode( ' ', $user->display_name );
		foreach ( $parts as $part ) {
			if ( isset( $insert_data[ $part ]['title'] ) ) {
				$insert_data[ $part ]['title']++;
			} else {
				$insert_data[ $part ]['title'] = 1;
			}
		}
	}

	/**
	 * Allows the user insert data to be manipulated.
	 *
	 * This function manipulates the user insert data used to create the INSERT queries.
	 *
	 * @param array  $insert_data The source data for the INSERT queries.
	 * @param object $user        The user object.
	 */
	$insert_data = apply_filters( 'relevanssi_user_data_to_index', $insert_data, $user );

	foreach ( $insert_data as $term => $data ) {
		$fields = array( 'content', 'title', 'comment', 'tag', 'link', 'author', 'category', 'excerpt', 'taxonomy', 'customfield' );
		foreach ( $fields as $field ) {
			if ( ! isset( $data[ $field ] ) ) {
				$data[ $field ] = 0;
			}
		}

		$content     = $data['content'];
		$title       = $data['title'];
		$comment     = $data['comment'];
		$tag         = $data['tag'];
		$link        = $data['link'];
		$author      = $data['author'];
		$category    = $data['category'];
		$excerpt     = $data['excerpt'];
		$taxonomy    = $data['taxonomy'];
		$customfield = $data['customfield'];

		$wpdb->query(
			$wpdb->prepare('INSERT IGNORE INTO ' . $relevanssi_variables['relevanssi_table'] .
				' (item, doc, term, term_reverse, content, title, comment, tag, link, author, category, excerpt, taxonomy, customfield, type, customfield_detail, taxonomy_detail, mysqlcolumn_detail)
			VALUES (%d, %d, %s, REVERSE(%s), %d, %d, %d, %d, %d, %d, %d, %d, %d, %d, %s, %s, %s, %s)',
			$user->ID, -1, $term, $term, $content, $title, $comment, $tag, $link, $author, $category, $excerpt, $taxonomy, $customfield, 'user', '', '', '' )
		); // WPCS: unprepared SQL ok, database table name.
	}
}

/**
 * Counts users.
 *
 * Figures out how many users there are to index.
 *
 * @global $wpdb The WordPress database interface.
 *
 * @return int $count_users Number of users, -1 if user indexing is disabled.
 */
function relevanssi_count_users() {
	$index_users = get_option( 'relevanssi_index_users' );
	if ( empty( $index_users ) || 'off' === $index_users ) {
		return -1;
	}

	global $wpdb;

	$users             = count_users( 'time' );
	$index_subscribers = get_option( 'relevanssi_index_subscribers' );

	$count_users = $users['total_users'];
	if ( empty( $index_subscribers ) || 'off' === $index_subscribers ) {
		$count_users -= $users['avail_roles']['subscriber'];
	}

	// Exclude users with no role in the current blog.
	$count_users -= $users['avail_roles']['none'];

	return $count_users;
}

/**
 * Counts taxonomy terms.
 *
 * Figures out how many taxonomy terms there are to index.
 *
 * @global $wpdb The WordPress database interface.
 *
 * @return int $count_terms Number of taxonomy terms, -1 if taxonomy term indexing is disabled.
 */
function relevanssi_count_taxonomy_terms() {
	$index_taxonomies = get_option( 'relevanssi_index_taxonomies' );
	if ( empty( $index_taxonomies ) || 'off' === $index_taxonomies ) {
		return -1;
	}

	global $wpdb;

	$taxonomies = get_option( 'relevanssi_index_terms' );
	if ( empty( $taxonomies ) ) {
		// No taxonomies chosen for indexing.
		return -1;
	}
	$count_terms = 0;
	foreach ( $taxonomies as $taxonomy ) {
		if ( ! taxonomy_exists( $taxonomy ) ) {
			// Non-existing taxonomy. Shouldn't be possible, but better be sure.
			continue;
		}

		/**
		 * Determines whether empty terms are indexed or not.
		 *
		 * @param boolean $hide_empty_terms If true, empty terms are not indexed. Default true.
		 */
		$hide_empty = apply_filters( 'relevanssi_hide_empty_terms', true );

		$count = '';
		if ( $hide_empty ) {
			$count = 'AND tt.count > 0';
		}

		$terms = $wpdb->get_col( "SELECT t.term_id FROM $wpdb->terms AS t, $wpdb->term_taxonomy AS tt WHERE t.term_id = tt.term_id $count AND tt.taxonomy = '$taxonomy'" ); // WPCS: unprepared SQL ok, $count is not user-generated and $taxonomy can only be a proper taxonomy.

		$count_terms += count( $terms );
	}
	return $count_terms;
}

/**
 * Returns the list of taxonomies chosen for indexing.
 *
 * Returns the list of taxonomies chosen for indexing from the 'relevanssi_index_terms' option.
 *
 * @return array $taxonomies A list of taxonomies chosen to be indexed.
 */
function relevanssi_list_taxonomies() {
	return get_option( 'relevanssi_index_terms' );
}

/**
 * Indexes taxonomy terms in AJAX context.
 *
 * Runs indexing on taxonomy terms in one taxonomy in AJAX context.
 *
 * @global $wpdb The WordPress database interface.
 * @global $relevanssi_variables The global Relevanssi variables, used for the database table names.
 *
 * @param string $taxonomy The taxonomy to index.
 * @param int    $limit    Number of users to index on one go.
 * @param int    $offset   Indexing offset.
 *
 * @return array $response AJAX response, number of taxonomy terms indexed in the
 * $response['indexed'] and a boolean value in $response['taxonomy_completed'] that
 * tells whether the taxonomy is indexed completely or not.
 */
function relevanssi_index_taxonomies_ajax( $taxonomy, $limit, $offset ) {
	global $wpdb, $relevanssi_variables;

	$indexed_terms    = 0;
	$relevanssi_table = $relevanssi_variables['relevanssi_table'];
	$end_reached      = false;

	/**
	 * Determines whether empty terms are indexed or not.
	 *
	 * @param boolean $hide_empty_terms If true, empty terms are not indexed. Default true.
	 */
	$hide_empty = apply_filters( 'relevanssi_hide_empty_terms', true );
	$count      = '';
	if ( $hide_empty ) {
		$count = 'AND tt.count > 0';
	}

	$terms = $wpdb->get_col(
		$wpdb->prepare( "SELECT t.term_id FROM $wpdb->terms AS t, $wpdb->term_taxonomy AS tt WHERE t.term_id = tt.term_id $count AND tt.taxonomy = %s LIMIT %d OFFSET %d", $taxonomy, intval( $limit ), intval( $offset ) )
	); // WPCS: unprepared SQL ok, table names.

	if ( count( $terms ) < $limit ) {
		$end_reached = true;
	}

	foreach ( $terms as $term_id ) {
		$update = false;
		$term   = get_term( $term_id, $taxonomy );
		/**
		 * Allows the term object to be handled before indexing.
		 *
		 * This filter can be used to add data to term objects before indexing, or to manipulate the object somehow.
		 *
		 * @param object $term     The term object.
		 * @param string $taxonomy The taxonomy.
		 */
		$term = apply_filters( 'relevanssi_term_add_data', $term, $taxonomy );
		relevanssi_index_taxonomy_term( $term, $taxonomy, $update );
		$indexed_terms++;
	}

	$response = array(
		'indexed'            => $indexed_terms,
		'taxonomy_completed' => 'not',
	);
	if ( $end_reached ) {
		$response['taxonomy_completed'] = 'done';
	}

	return $response;
}

/**
 * Indexes all taxonomies.
 *
 * Runs indexing on all taxonomies.
 *
 * @global $wpdb The WordPress database interface.
 * @global $relevanssi_variables The global Relevanssi variables, used for the database table names.
 *
 * @param boolean $is_ajax Whether indexing is done in the AJAX context, default false.
 *
 * @return array $response If $is_ajax is true, the function returns indexing status in an array.
 */
function relevanssi_index_taxonomies( $is_ajax = false ) {
	global $wpdb, $relevanssi_variables;

	$wpdb->query( 'DELETE FROM ' . $relevanssi_variables['relevanssi_table'] . " WHERE type = 'taxonomy'" ); // WPCS: unprepared SQL ok.

	$taxonomies    = get_option( 'relevanssi_index_terms' );
	$indexed_terms = 0;
	foreach ( $taxonomies as $taxonomy ) {
		/**
		 * Adjusts the get_terms() arguments for taxonomy indexing.
		 *
		 * Get_terms() is used to get the terms for indexing. By default, no parameters are passed.
		 * This filter can be used to change that.
		 *
		 * @param array $args Arguments to pass to get_terms(). Default empty array.
		 */
		$args  = apply_filters( 'relevanssi_index_taxonomies_args', array() );
		$terms = get_terms( $taxonomy, $args );

		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			$progress = WP_CLI\Utils\make_progress_bar( "Indexing $taxonomy", count( $terms ) );
		}

		$update = false;
		foreach ( $terms as $term ) {
			/**
			 * Allows the term object to be handled before indexing.
			 *
			 * This filter can be used to add data to term objects before indexing, or to manipulate the object somehow.
			 *
			 * @param object $term     The term object.
			 * @param string $taxonomy The taxonomy.
			 */
			$term = apply_filters( 'relevanssi_term_add_data', $term, $taxonomy );
			relevanssi_index_taxonomy_term( $term, $taxonomy, $update );
			$indexed_terms++;
			if ( defined( 'WP_CLI' ) && WP_CLI ) {
				$progress->tick();
			}
		}
		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			$progress->finish();
		}
	}

	if ( $is_ajax ) {
		if ( $indexed_terms > 0 ) {
			// translators: the number of taxonomy terms.
			return sprintf( __( 'Indexed %d taxonomy terms.', 'relevanssi' ), $indexed_terms );
		} else {
			return __( 'No taxonomies to index.', 'relevanssi' );
		}
	}
}

/**
 * Indexes one taxonomy term.
 *
 * @global $wpdb The WordPress database interface.
 * @global $relevanssi_variables The global Relevanssi variables, used for the database table names.
 *
 * @param object|int $term         The term object or term ID.
 * @param string     $taxonomy     The name of the taxonomy.
 * @param boolean    $remove_first Should the term be deleted first or not, default false.
 */
function relevanssi_index_taxonomy_term( $term, $taxonomy, $remove_first = false ) {
	global $wpdb, $relevanssi_variables;

	if ( is_numeric( $term ) ) {
		// Not an object, so let's get the object.
		$term = get_term( $term, $taxonomy );
	}

	$temp_post               = new stdClass();
	$temp_post->post_content = $term->description;
	$temp_post->post_title   = $term->name;

	/**
	 * Allows modifying the fake post for the taxonomy term.
	 *
	 * In order to index taxonomy terms, Relevanssi generates fake posts from the
	 * terms. This filter lets you modify the post object. The term description
	 * is in the post_content and the term name in the post_title.
	 *
	 * @param object $temp_post The post object.
	 * @param object $term      The term object.
	 */
	$temp_post = apply_filters( 'relevanssi_post_to_index', $temp_post, $term );

	$term->description = $temp_post->post_content;
	$term->name        = $temp_post->post_title;

	$index_this_post = true;

	/**
	 * Determines whether a term is indexed or not.
	 *
	 * If this filter returns true, this term should not be indexed.
	 *
	 * @param boolean $block    If true, do not index this post. Default false.
	 * @param object  $term     The term object.
	 * @param string  $taxonomy The term taxonomy.
	 */
	if ( true === apply_filters( 'relevanssi_do_not_index_term', false, $term, $taxonomy ) ) {
		// Filter says no.
		if ( $debug ) {
			relevanssi_debug_echo( 'relevanssi_do_not_index_term returned true.' );
		}
		$index_this_post = false;
	}

	if ( $remove_first ) {
		// The 0 doesn't mean anything, but because of WP hook parameters, it needs to be there
		// so the taxonomy can be passed as the third parameter.
		relevanssi_delete_taxonomy_term( $term->term_id, 0, $taxonomy );
	}

	// This needs to be here, after the call to relevanssi_delete_taxonomy_term(), because otherwise
	// a post that's in the index but shouldn't be there won't get removed.
	if ( ! $index_this_post ) {
		return 'donotindex';
	}

	$insert_data      = array();
	$remove_stopwords = true;

	$min_length = get_option( 'relevanssi_min_word_length', 3 );
	if ( ! isset( $term->description ) ) {
		$term->description = '';
	}
	/**
	 * Allows adding extra content to the term before indexing.
	 *
	 * The term description is passed through this filter, so if you want to add
	 * extra content to the description, you can use this filter.
	 *
	 * @param string $term->description The term description.
	 * @param object $term              The term object.
	 */
	$description = apply_filters( 'relevanssi_tax_term_additional_content', $term->description, $term );
	if ( ! empty( $description ) ) {
		$tokens = relevanssi_tokenize( $description, $remove_stopwords, $min_length );
		foreach ( $tokens as $t_term => $tf ) {
			if ( ! isset( $insert_data[ $t_term ]['content'] ) ) {
				$insert_data[ $t_term ]['content'] = 0;
			}
			$insert_data[ $t_term ]['content'] += $tf;
		}
	}

	if ( isset( $term->name ) && ! empty( $term->name ) ) {
		$tokens = relevanssi_tokenize( $term->name, $remove_stopwords, $min_length );
		foreach ( $tokens as $t_term => $tf ) {
			if ( ! isset( $insert_data[ $t_term ]['title'] ) ) {
				$insert_data[ $t_term ]['title'] = 0;
			}
			$insert_data[ $t_term ]['title'] += $tf;
		}
	}

	foreach ( $insert_data as $t_term => $data ) {
		$fields = array( 'content', 'title', 'comment', 'tag', 'link', 'author', 'category', 'excerpt', 'taxonomy', 'customfield' );
		foreach ( $fields as $field ) {
			if ( ! isset( $data[ $field ] ) ) {
				$data[ $field ] = 0;
			}
		}

		$content     = $data['content'];
		$title       = $data['title'];
		$comment     = $data['comment'];
		$tag         = $data['tag'];
		$link        = $data['link'];
		$author      = $data['author'];
		$category    = $data['category'];
		$excerpt     = $data['excerpt'];
		$taxonomy    = $data['taxonomy'];
		$customfield = $data['customfield'];
		$t_term      = trim( $t_term ); // Numeric terms start with a space.

		$wpdb->query(
			$wpdb->prepare('INSERT IGNORE INTO ' . $relevanssi_variables['relevanssi_table'] .
				' (item, doc, term, term_reverse, content, title, comment, tag, link, author, category, excerpt, taxonomy, customfield, type, customfield_detail, taxonomy_detail, mysqlcolumn_detail)
			VALUES (%d, %d, %s, REVERSE(%s), %d, %d, %d, %d, %d, %d, %d, %d, %d, %d, %s, %s, %s, %s)',
			$term->term_id, -1, $t_term, $t_term, $content, $title, $comment, $tag, $link, $author, $category, $excerpt, '', $customfield, $taxonomy, '', '', '' )
		); // WPCS: unprepared SQL ok, database table name.
	}
}

/**
 * Removes a document from the index.
 *
 * This Premium version also takes care of internal linking keywords, either keeping them (in case of
 * an update) or removing them (if the post is removed).
 *
 * @global $wpdb The WordPress database interface.
 * @global $relevanssi_variables The global Relevanssi variables, used for the database table names.
 *
 * @param int     $post_id               The post ID.
 * @param boolean $keep_internal_linking If true, do not remove internal link keywords from this post.
 */
function relevanssi_premium_remove_doc( $post_id, $keep_internal_linking ) {
	global $wpdb, $relevanssi_variables;

	$post_id = intval( $post_id );
	if ( empty( $post_id ) ) {
		// No post ID specified.
		return;
	}

	$internal_links = '';
	if ( $keep_internal_linking ) {
		$internal_links = 'AND link = 0';
	}

	$wpdb->query( $wpdb->prepare( 'DELETE FROM ' . $relevanssi_variables['relevanssi_table'] . " WHERE doc=%s $internal_links", $post_id ) ); // WPCS: unprepared SQL ok, Relevanssi table name.

	if ( ! $keep_internal_linking ) {
		$wpdb->query( $wpdb->prepare( 'DELETE FROM ' . $relevanssi_variables['relevanssi_table'] . ' WHERE link > 0 AND doc=%s', $post_id ) ); // WPCS: unprepared SQL ok, Relevanssi table name.
	}

	relevanssi_update_doc_count();
}

/**
 * Deletes an item (user or taxonomy term) from the index.
 *
 * @global $wpdb The WordPress database interface.
 * @global $relevanssi_variables The global Relevanssi variables, used for the database table names.
 *
 * @param int    $item_id The item ID number.
 * @param string $type    The item type.
 */
function relevanssi_remove_item( $item_id, $type ) {
	global $wpdb, $relevanssi_variables;

	$item_id = intval( $item_id );

	if ( 0 === $item_id && 'post' === $type ) {
		// Security measures.
		return;
	}

	$wpdb->query( $wpdb->prepare( 'DELETE FROM ' . $relevanssi_variables['relevanssi_table'] . ' WHERE item = %d AND type = %s', $item_id, $type ) ); // WPCS: unprepared SQL ok, Relevanssi table name.
}

/**
 * Checks if post is hidden.
 *
 * Used in indexing process to check if post is hidden. Checks the
 * '_relevanssi_hide_post' custom field.
 *
 * @param int $post_id The post ID to check.
 *
 * @return boolean $hidden Is the post hidden?
 */
function relevanssi_hide_post( $post_id ) {
	$hidden      = false;
	$field_value = get_post_meta( $post_id, '_relevanssi_hide_post', true );
	if ( 'on' === $field_value ) {
		$hidden = true;
	}
	return $hidden;
}
