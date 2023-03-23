<?php
/**
 * /premium/search.php
 *
 * @package Relevanssi_Premium
 * @author  Mikko Saari
 * @license https://wordpress.org/about/gpl/ GNU General Public License
 * @see     https://www.relevanssi.com/
 */

/**
 * Recognizes negative search terms.
 *
 * Finds all the search terms that begin with a -.
 *
 * @param string $q Search query.
 *
 * @return array $negative_terms Array of negative search terms.
 */
function relevanssi_recognize_negatives( $q ) {
	$term           = strtok( $q, ' ' );
	$negative_terms = array();
	while ( false !== $term ) {
		if ( '-' === substr( $term, 0, 1 ) ) {
			array_push( $negative_terms, substr( $term, 1 ) );
		}
		$term = strtok( ' ' );
	}
	return $negative_terms;
}

/**
 * Recognizes positive search terms.
 *
 * Finds all the search terms that begin with a +.
 *
 * @param string $q Search query.
 *
 * @return array $positive_terms Array of positive search terms.
 */
function relevanssi_recognize_positives( $q ) {
	$term           = strtok( $q, ' ' );
	$positive_terms = array();
	while ( false !== $term ) {
		if ( '+' === substr( $term, 0, 1 ) ) {
			$term_part = substr( $term, 1 );
			if ( ! empty( $term_part ) ) { // To avoid problems with just plus signs.
				array_push( $positive_terms, $term_part );
			}
		}
		$term = strtok( ' ' );
	}
	return $positive_terms;
}

/**
 * Creates SQL code for positive and negative terms.
 *
 * Creates the necessary SQL code for positive (AND) and negative (NOT) search terms.
 *
 * @param array  $negative_terms   Negative terms.
 * @param array  $positive_terms   Positive terms.
 * @param string $relevanssi_table Relevanssi table name.
 *
 * @return string $query_restrictions MySQL code for the terms.
 */
function relevanssi_negatives_positives( $negative_terms, $positive_terms, $relevanssi_table ) {
	$query_restrictions = '';
	if ( $negative_terms ) {
		$size = count( $negative_terms );
		for ( $i = 0; $i < $size; $i++ ) {
			$negative_terms[ $i ] = "'" . esc_sql( $negative_terms[ $i ] ) . "'";
		}
		$negatives           = implode( ',', $negative_terms );
		$query_restrictions .= " AND doc NOT IN (SELECT DISTINCT(doc) FROM $relevanssi_table WHERE term IN ( $negatives))";
		// Clean: $negatives is escaped.
	}

	if ( $positive_terms ) {
		$size = count( $positive_terms );
		for ( $i = 0; $i < $size; $i++ ) {
			$positive_term       = esc_sql( $positive_terms[ $i ] );
			$query_restrictions .= " AND doc IN (SELECT DISTINCT(doc) FROM $relevanssi_table WHERE term = '$positive_term')";
			// Clean: $positive_term is escaped.
		}
	}
	return $query_restrictions;
}

/**
 * Gets the recency bonus option.
 *
 * Gets the recency bonus and converts the cutoff day count to time().
 *
 * @return array $recency_bonus Array( recency bonus, cutoff date ).
 */
function relevanssi_get_recency_bonus() {
	$recency_bonus_option = get_option( 'relevanssi_recency_bonus' );
	$recency_bonus        = false;
	$recency_cutoff_date  = false;

	if ( isset( $recency_bonus['bonus'] ) ) {
		$recency_bonus = floatval( $recency_bonus['bonus'] );
	}
	if ( $recency_bonus && isset( $recency_bonus['days'] ) ) {
		$recency_cutoff_date = time() - 60 * 60 * 24 * $recency_bonus['days'];
	}
	return array( $recency_bonus, $recency_cutoff_date );
}

/**
 * Adds the pinned posts to searches.
 *
 * Finds the posts that are pinned to the search terms and adds them to the search
 * results if necessary. This function is triggered from the 'relevanssi_hits_filter'
 * filter hook.
 *
 * @global $wpdb      The WordPress database interface.
 * @global $wp_filter The global filter array.
 *
 * @param array $hits The hits found.
 *
 * @return array $hits The hits, with pinned posts.
 */
function relevanssi_pinning( $hits ) {
	global $wpdb, $wp_filter;

	// Disable all filter functions on 'relevanssi_stemmer'.
	if ( isset( $wp_filter['relevanssi_stemmer'] ) ) {
		$callbacks                                  = $wp_filter['relevanssi_stemmer']->callbacks;
		$wp_filter['relevanssi_stemmer']->callbacks = null;
	}

	$terms = relevanssi_tokenize( $hits[1], false );

	// Re-enable the removed filters.
	if ( isset( $wp_filter['relevanssi_stemmer'] ) ) {
		$wp_filter['relevanssi_stemmer']->callbacks = $callbacks;
	}

	$escaped_terms = array();
	foreach ( array_keys( $terms ) as $term ) {
		$escaped_terms[] = esc_sql( $term );
	}

	$term_list           = array();
	$count_escaped_terms = count( $escaped_terms );
	for ( $length = 1; $length <= $count_escaped_terms; $length++ ) {
		for ( $offset = 0; $offset <= $count_escaped_terms - $length; $offset++ ) {
			$slice       = array_slice( $escaped_terms, $offset, $length );
			$term_list[] = implode( ' ', $slice );
		}
	}

	/*
	If the search query is "foo bar baz", $term_list now contains "foo", "bar",
	"baz", "foo bar", "bar baz", and "foo bar baz".
	*/

	if ( is_array( $term_list ) ) {
		$term_list = implode( "','", $term_list );
		$term_list = "'$term_list'";

		$positive_ids = array();
		$negative_ids = array();

		$pins_fetched = false;
		$pinned_posts = array();
		$other_posts  = array();
		foreach ( $hits[0] as $hit ) {
			$blog_id = 0;
			if ( isset( $hit->blog_id ) ) {
				// Multisite, so switch_to_blog() to correct blog and process
				// the pinned hits per blog.
				$blog_id = $hit->blog_id;
				switch_to_blog( $blog_id );
				if ( ! isset( $pins_fetched[ $blog_id ] ) ) {
					$positive_ids[ $blog_id ] = $wpdb->get_col( 'SELECT post_id FROM ' . $wpdb->prefix . "postmeta WHERE meta_key = '_relevanssi_pin' AND meta_value IN ( $term_list )" ); // WPCS: unprepared SQL ok, $term_list is escaped.
					$negative_ids[ $blog_id ] = $wpdb->get_col( 'SELECT post_id FROM ' . $wpdb->prefix . "postmeta WHERE meta_key = '_relevanssi_unpin' AND meta_value IN ( $term_list )" ); // WPCS: unprepared SQL ok, $term_list is escaped.
					$pins_fetched[ $blog_id ] = true;
				}
				restore_current_blog();
			} else {
				// Single site.
				if ( ! $pins_fetched ) {
					$positive_ids[0] = $wpdb->get_col( "SELECT post_id FROM $wpdb->postmeta WHERE meta_key = '_relevanssi_pin' AND meta_value IN ( $term_list )" ); // WPCS: unprepared SQL ok, $term_list is escaped.
					$negative_ids[0] = $wpdb->get_col( "SELECT post_id FROM $wpdb->postmeta WHERE meta_key = '_relevanssi_unpin' AND meta_value IN ( $term_list )" ); // WPCS: unprepared SQL ok, $term_list is escaped.
					$pins_fetched    = true;
				}
			}
			if ( is_array( $positive_ids[ $blog_id ] ) && count( $positive_ids[ $blog_id ] ) > 0 && in_array( $hit->ID, $positive_ids[ $blog_id ], true ) ) {
				$pinned_posts[] = $hit;
			} else {
				if ( is_array( $negative_ids[ $blog_id ] ) && count( $negative_ids[ $blog_id ] ) > 0 ) {
					if ( ! in_array( $hit->ID, $negative_ids[ $blog_id ], true ) ) {
						$other_posts[] = $hit;
					}
				} else {
					$other_posts[] = $hit;
				}
			}
		}
		$hits[0] = array_merge( $pinned_posts, $other_posts );
	}
	return $hits;
}

/**
 * Does multisite searches.
 *
 * Handles the multisite searching when the "searchblogs" parameter is present.
 * Has slightly limited set of options compared to the single-site searches.
 *
 * @global $wpdb The WordPress database interface.
 * @global $relevanssi_variables The global Relevanssi variables, used for the database table names.
 *
 * @param array $multi_args Multisite search arguments. Possible parameters: 'post_type',
 * 'search_blogs', 'operator', 'meta_query', 'orderby', 'order'.
 *
 * @return array $results Hits found and other information about the result set.
 */
function relevanssi_search_multi( $multi_args ) {
	global $relevanssi_variables, $wpdb;

	/**
	 * Filters the search arguments.
	 *
	 * @param array $multi_args An associative array of the search parameters.
	 */
	$filtered_values = apply_filters( 'relevanssi_search_filters', $multi_args );

	if ( isset( $filtered_values['q'] ) ) {
		$q = $filtered_values['q'];
	} else {
		// No search term, can't proceed.
		return $hits;
	}

	$post_type = '';
	if ( isset( $filtered_values['post_type'] ) ) {
		$post_type = $filtered_values['post_type'];
	}
	$search_blogs = '';
	if ( isset( $filtered_values['search_blogs'] ) ) {
		$search_blogs = $filtered_values['search_blogs'];
	}
	$operator = '';
	if ( isset( $filtered_values['operator'] ) ) {
		$operator = $filtered_values['operator'];
	}
	$meta_query = '';
	if ( isset( $filtered_values['meta_query'] ) ) {
		$meta_query = $filtered_values['meta_query'];
	}
	$orderby = '';
	if ( isset( $filtered_values['orderby'] ) ) {
		$orderby = $filtered_values['orderby'];
	}
	$order = '';
	if ( isset( $filtered_values['order'] ) ) {
		$order = $filtered_values['order'];
	}

	$hits = array();

	$remove_stopwords = false;
	$terms            = relevanssi_tokenize( $q, $remove_stopwords );

	if ( count( $terms ) < 1 ) {
		// Tokenizer killed all the search terms.
		return $hits;
	}
	$terms = array_keys( $terms ); // Don't care about tf in query.

	$total_hits = 0;

	$title_matches   = array();
	$tag_matches     = array();
	$link_matches    = array();
	$comment_matches = array();
	$body_matches    = array();
	$scores          = array();
	$term_hits       = array();
	$hitsbyweight    = array();

	$matching_method = get_option( 'relevanssi_fuzzy' );

	if ( 'all' === $search_blogs ) {
		$raw_blog_list = get_sites( array( 'number' => 2000 ) ); // There's likely flaming death with even lower values of 'number'.
		$blog_list     = array();
		foreach ( $raw_blog_list as $blog ) {
			$blog_list[] = $blog->blog_id;
		}
		$search_blogs = implode( ',', $blog_list );
	}

	$search_blogs = explode( ',', $search_blogs );
	if ( ! is_array( $search_blogs ) ) {
		// No blogs to search, so let's quit.
		return $hits;
	}

	$post_type_weights = get_option( 'relevanssi_post_type_weights' );

	$original_blog = $wpdb->blogid;
	foreach ( $search_blogs as $blogid ) {
		// Only search blogs that are publicly available (unless filter says otherwise).
		$public_status = get_blog_status( $blogid, 'public' );
		if ( null === $public_status ) {
			// Blog doesn't actually exist.
			continue;
		}
		/**
		 * Adjusts the possible values of blog public status.
		 *
		 * By default Relevanssi requires blogs to be public so they can be searched.
		 * If you want a non-public blog in the search results, make this filter
		 * return true.
		 *
		 * @param boolean $public_status Is the blog public?
		 * @param int     $blogid        Blog ID.
		 */
		if ( false === apply_filters( 'relevanssi_multisite_public_status', $public_status, $blogid ) ) {
			continue;
		}

		// Don't search blogs that are marked "spam" or "deleted".
		if ( get_blog_status( $blogid, 'spam' ) ) {
			continue;
		}
		if ( get_blog_status( $blogid, 'delete' ) ) {
			continue;
		}

		// Ok, we should have a valid blog.
		switch_to_blog( $blogid );
		$relevanssi_table = $wpdb->prefix . 'relevanssi';

		// See if Relevanssi tables exist.
		$exists = $wpdb->get_var( "SELECT count(*) FROM information_schema.TABLES WHERE (TABLE_SCHEMA = '" . DB_NAME . "') AND (TABLE_NAME = '$relevanssi_table')" ); // WPCS: unprepared SQL ok, no user-generated input.
		if ( $exists < 1 ) {
			restore_current_blog();
			continue;
		}

		$query_join         = '';
		$query_restrictions = '';

		// If $post_type is not set, see if there are post types to exclude from the search.
		// If $post_type is set, there's no need to exclude, as we only include.
		if ( ! $post_type ) {
			$negative_post_type = relevanssi_get_negative_post_type();
		} else {
			$negative_post_type = null;
		}

		$non_post_post_types_array = array();
		if ( function_exists( 'relevanssi_get_non_post_post_types' ) ) {
			$non_post_post_types_array = relevanssi_get_non_post_post_types();
		}

		$non_post_post_type = null;
		$site_post_type     = null;
		if ( $post_type ) {
			if ( -1 === $post_type ) {
				$post_type = null; // Facetious sets post_type to -1 if not selected.
			}
			if ( ! is_array( $post_type ) ) {
				$post_types = explode( ',', $post_type );
			} else {
				$post_types = $post_type;
			}

			// This array will contain all regular post types involved in the search parameters.
			$post_post_types = array_diff( $post_types, $non_post_post_types_array );

			// This array has the non-post post types involved.
			$non_post_post_types = array_intersect( $post_types, $non_post_post_types_array );

			// Escape both for SQL queries, just in case.
			$non_post_post_types = esc_sql( $non_post_post_types );
			$post_types          = esc_sql( $post_post_types );

			// Implode to a parameter string, or set to NULL if empty.
			if ( count( $non_post_post_types ) ) {
				$non_post_post_type = "'" . implode( "', '", $non_post_post_types ) . "'";
			} else {
				$non_post_post_type = null;
			}
			if ( count( $post_types ) ) {
				$site_post_type = "'" . implode( "', '", $post_types ) . "'";
			} else {
				$site_post_type = null;
			}
		}

		if ( $site_post_type ) {
			// A post type is set: add a restriction.
			// Clean: $site_post_type is escaped.
			$restriction = " AND (
				relevanssi.doc IN (
					SELECT DISTINCT(posts.ID) FROM $wpdb->posts AS posts
					WHERE posts.post_type IN ( $site_post_type)
				) *np*
			)";

			// There are post types involved that are taxonomies or users, so can't
			// match to wp_posts. Add a relevanssi.type restriction.
			if ( $non_post_post_type ) {
				$restriction = str_replace( '*np*', "OR (relevanssi.type IN ( $non_post_post_type))", $restriction );
				// Clean: $non_post_post_types is escaped.
			} else {
				// No non-post post types, so remove the placeholder.
				$restriction = str_replace( '*np*', '', $restriction );
			}
			$query_restrictions .= $restriction;
		} else {
			// No regular post types.
			if ( $non_post_post_type ) {
				// But there is a non-post post type restriction.
				$query_restrictions .= " AND (relevanssi.type IN ( $non_post_post_type))";
				// Clean: $non_post_post_types is escaped.
			}
		}

		if ( $negative_post_type ) {
			$query_restrictions .= " AND ((relevanssi.doc IN (SELECT DISTINCT(posts.ID) FROM $wpdb->posts AS posts
				WHERE posts.post_type NOT IN ( $negative_post_type))) OR (relevanssi.doc = -1))";
			// Clean: $negative_post_type is escaped.
		}

		/**
		 * Filters the query restrictions in Relevanssi.
		 *
		 * Approximately the same purpose as the default 'posts_where' filter hook.
		 * Can be used to add additional query restrictions to the Relevanssi query.
		 *
		 * @param string $query_restrictions MySQL added to the Relevanssi query.
		 *
		 * @author Charles St-Pierre.
		 */
		$query_restrictions = apply_filters( 'relevanssi_where', $query_restrictions );

		// Handle the meta query.
		if ( ! empty( $meta_query ) ) {
			$meta_query_object = new WP_Meta_Query();
			$meta_query_object->parse_query_vars( array( 'meta_query' => $meta_query ) );
			$meta_sql = $meta_query_object->get_sql( 'post', 'relevanssi', 'doc' );
			if ( $meta_sql ) {
				$query_join         .= $meta_sql['join'];
				$query_restrictions .= $meta_sql['where'];
			}
		}
		$distinct_doc_count = $wpdb->get_var( "SELECT COUNT(DISTINCT(doc)) FROM $relevanssi_table" ); // WPCS: unprepared sql ok, Relevanssi table name.

		$no_matches = true;
		if ( 'always' === $matching_method ) {
			$term_query = "(term LIKE '%#term#' OR term LIKE '#term#%') ";
		} else {
			$term_query = " term = '#term#' ";
		}

		$min_length   = get_option( 'relevanssi_min_word_length' );
		$search_again = false;
		do {
			foreach ( $terms as $term ) {
				$term = trim( $term ); // Numeric search terms will start with a space.
				if ( relevanssi_strlen( $term ) < $min_length ) {
					continue;
				}
				$term            = esc_sql( $wpdb->esc_like( $term ) );
				$this_term_query = str_replace( '#term#', $term, $term_query );

				// Clean: $term is escaped, as are $query_restrictions.
				$query = "SELECT *, title + content + comment + tag + link + author + category + excerpt + taxonomy + customfield AS tf
				FROM $relevanssi_table AS relevanssi $query_join WHERE $this_term_query $query_restrictions";
				/**
				 * Filters the Relevanssi search query.
				 *
				 * @param string $query The Relevanssi search MySQL query.
				 */
				$query = apply_filters( 'relevanssi_query_filter', $query );

				$matches = $wpdb->get_results( $query ); // WPCS: unprepared SQL ok, all user inputs are escaped.
				if ( count( $matches ) < 1 ) {
					continue;
				} else {
					$no_matches = false;
				}

				$total_hits += count( $matches );

				// Clean: $term is escaped, as are $query_restrictions.
				$query = "SELECT COUNT(DISTINCT(doc)) FROM $relevanssi_table AS relevanssi $query_join WHERE $this_term_query $query_restrictions";
				/**
				 * Filters the Relevanssi document frequency query.
				 *
				 * @param string $query The Relevanssi document frequency MySQL query.
				 */
				$query = apply_filters( 'relevanssi_df_query_filter', $query );

				$df = $wpdb->get_var( $query ); // WPCS: unprepared SQL ok, all user inputs are escaped.

				if ( $df < 1 && 'sometimes' === $matching_method ) {
					$query = "SELECT COUNT(DISTINCT(doc)) FROM $relevanssi_table AS relevanssi $query_join
						WHERE (term LIKE '%$term' OR term LIKE '$term%') $query_restrictions";
					/**
					 * Filters the Relevanssi document frequency query.
					 *
					 * @param string $query The Relevanssi document frequency MySQL query.
					 */
					$query = apply_filters( 'relevanssi_df_query_filter', $query );
					$df    = $wpdb->get_var( $query ); // WPCS: unprepared SQL ok, all user inputs are escaped.
				}

				$title_boost   = floatval( get_option( 'relevanssi_title_boost' ) );
				$link_boost    = floatval( get_option( 'relevanssi_link_boost' ) );
				$comment_boost = floatval( get_option( 'relevanssi_comment_boost' ) );
				if ( isset( $post_type_weights['post_tag'] ) ) {
					$tag_boost = $post_type_weights['post_tag'];
				} else {
					$tag_boost = 1;
				}

				$doc_weight = array();
				$scores     = array();
				$term_hits  = array();

				$idf = log( $distinct_doc_count / ( 1 + $df ) );
				foreach ( $matches as $match ) {
					if ( 'user' === $match->type ) {
						$match->doc = 'u_' . $match->item;
					} elseif ( ! in_array( $match->type, array( 'post', 'attachment' ), true ) ) {
						$match->doc = '**' . $match->type . '**' . $match->item;
					}

					$match->tf =
						$match->title * $title_boost +
						$match->content +
						$match->comment * $comment_boost +
						$match->tag * $tag_boost +
						$match->link * $link_boost +
						$match->author +
						$match->category +
						$match->excerpt +
						$match->taxonomy +
						$match->customfield;

					$term_hits[ $match->doc ][ $term ] =
						$match->title +
						$match->content +
						$match->comment +
						$match->tag +
						$match->link +
						$match->author +
						$match->category +
						$match->excerpt +
						$match->taxonomy +
						$match->customfield;

					if ( $idf < 1 ) {
						$idf = 1;
					}
					$match->weight = $match->tf * $idf;

					$type = relevanssi_get_post_type( $match->doc );
					if ( ! empty( $post_type_weights[ $type ] ) ) {
						$match->weight = $match->weight * $post_type_weights[ $type ];
					}

					/**
					 * Filters the Relevanssi post matches.
					 *
					 * This powerful filter lets you modify the $match objects, which
					 * are used to calculate the weight of the documents. The object
					 * has attributes which contain the number of hits in different
					 * categories. Post ID is $match->doc, term frequency (TF) is
					 * $match->tf and the total weight is in $match->weight. The
					 * filter is also passed $idf, which is the inverse document
					 * frequency (IDF). The weight is calculated as TF * IDF, which
					 * means you may need the IDF, if you wish to recalculate the
					 * weight for some reason. The third parameter, $term, contains
					 * the search term.
					 *
					 * @param object $match The match object, with includes all
					 * the different categories of post matches.
					 * @param int    $idf   The inverse document frequency, in
					 * case you want to recalculate TF * IDF weights.
					 * @param string $term  The search term.
					 */
					$match = apply_filters( 'relevanssi_match', $match, $idf, $term );

					if ( $match->weight <= 0 ) {
						continue; // The filters killed the match.
					}

					$doc_terms[ $match->doc ][ $term ] = true; // Count how many terms are matched to a doc.
					if ( isset( $doc_weight[ $match->doc ] ) ) {
						$doc_weight[ $match->doc ] += $match->weight;
					} else {
						$doc_weight[ $match->doc ] = $match->weight;
					}
					if ( isset( $scores[ $match->doc ] ) ) {
						$scores[ $match->doc ] += $match->weight;
					} else {
						$scores[ $match->doc ] = $match->weight;
					}

					$body_matches[ $match->doc ]    = $match->content;
					$title_matches[ $match->doc ]   = $match->title;
					$link_matches[ $match->doc ]    = $match->link;
					$tag_matches[ $match->doc ]     = $match->tag;
					$comment_matches[ $match->doc ] = $match->comment;
				}
			}

			if ( $no_matches ) {
				if ( $search_again ) {
					// No hits even with partial matching.
					$search_again = false;
				} else {
					if ( 'sometimes' === $matching_method ) {
						$search_again = true;
						$term_query   = "(term LIKE '%#term#' OR term LIKE '#term#%') ";
					}
				}
			} else {
				$search_again = false;
			}
		} while ( $search_again );

		$strip_stopwords     = true;
		$terms_without_stops = array_keys( relevanssi_tokenize( implode( ' ', $terms ), $strip_stopwords ) );
		$total_terms         = count( $terms_without_stops );

		if ( isset( $doc_weight ) && count( $doc_weight ) > 0 && ! $no_matches ) {
			arsort( $doc_weight );
			$i = 0;
			foreach ( $doc_weight as $doc => $weight ) {
				if ( count( $doc_terms[ $doc ] ) < $total_terms && 'AND' === $operator ) {
					// AND operator in action: $doc didn't match all terms, so it's discarded.
					continue;
				}
				$status  = relevanssi_get_post_status( $doc );
				$post_ok = true;
				if ( 'private' === $status ) {
					$post_ok = false;

					if ( function_exists( 'awp_user_can' ) ) {
						// Role-Scoper.
						$current_user = wp_get_current_user();
						$post_ok      = awp_user_can( 'read_post', $doc, $current_user->ID );
					} else {
						// Basic WordPress version.
						$type = get_post_type( $doc );
						$cap  = 'read_private_' . $type . 's';
						if ( current_user_can( $cap ) ) {
							$post_ok = true;
						}
					}
				} elseif ( 'publish' !== $status ) {
					$post_ok = false;
				}

				/**
				 * Filters whether the user is allowed to see the post.
				 *
				 * Can this post be included in the search results? This is the hook
				 * you’ll use if you want to add support for a membership plugin, for
				 * example. Based on the post ID, your function needs to return tru
				 *  or false.
				 *
				 * @param boolean $post_ok Can the post be shown in results?
				 * @param int     $doc     The post ID.
				 */
				$post_ok = apply_filters( 'relevanssi_post_ok', $post_ok, $doc );
				if ( $post_ok ) {
					$post_object          = relevanssi_get_multisite_post( $blogid, $doc );
					$post_object->blog_id = $blogid;

					$object_id                  = $blogid . '|' . $doc;
					$hitsbyweight[ $object_id ] = $weight;
					$post_objects[ $object_id ] = $post_object;
				}
			}
		}
		restore_current_blog();
	}

	arsort( $hitsbyweight );
	$i = 0;
	foreach ( $hitsbyweight as $hit => $weight ) {
		$hit                                   = $post_objects[ $hit ];
		$hits[ intval( $i ) ]                  = $hit;
		$hits[ intval( $i ) ]->relevance_score = round( $weight, 2 );
		$i++;
	}

	if ( count( $hits ) < 1 ) {
		if ( 'AND' === $operator && 'on' !== get_option( 'relevanssi_disable_or_fallback' ) ) {
			$or_args             = $multi_args;
			$or_args['operator'] = 'OR';
			$return              = relevanssi_search_multi( $or_args );
			$hits                = $return['hits'];
			$body_matches        = $return['body_matches'];
			$title_matches       = $return['title_matches'];
			$tag_matches         = $return['tag_matches'];
			$comment_matches     = $return['comment_matches'];
			$scores              = $return['scores'];
			$term_hits           = $return['term_hits'];
			$query               = $return['query'];
			$link_matches        = $return['link_matches'];
		}
	}

	global $wp;
	$default_order = get_option( 'relevanssi_default_orderby', 'relevance' );
	if ( empty( $orderby ) ) {
		$orderby = $default_order;
	}

	if ( is_array( $orderby ) ) {
		/**
		 * Filters the orderby parameter before Relevanssi sorts posts.
		 *
		 * @param array|string $orderby The orderby parameter, accepts both string
		 * and array format
		 */
		$orderby = apply_filters( 'relevanssi_orderby', $orderby );
		relevanssi_object_sort( $hits, $orderby );
	} else {
		if ( empty( $order ) ) {
			$order = 'desc';
		}

		$order                 = strtolower( $order );
		$order_accepted_values = array( 'asc', 'desc' );
		if ( ! in_array( $order, $order_accepted_values, true ) ) {
			$order = 'desc';
		}
		/**
		 * This filter is documented in premium/search.php.
		 */
		$orderby = apply_filters( 'relevanssi_orderby', $orderby );

		/**
		 * Filters the order parameter before Relevanssi sorts posts.
		 *
		 * @param string $order The order parameter, either 'asc' or 'desc'.
		 * Default 'desc'.
		 */
		$order = apply_filters( 'relevanssi_order', $order );

		if ( 'relevance' !== $orderby ) {
			// Results are by default sorted by relevance, so no need to sort for that.
			$orderby_array = array( $orderby => $order );
			relevanssi_object_sort( $hits, $orderby_array );
		}
	}

	$return = array(
		'hits'            => $hits,
		'body_matches'    => $body_matches,
		'title_matches'   => $title_matches,
		'tag_matches'     => $tag_matches,
		'comment_matches' => $comment_matches,
		'scores'          => $scores,
		'term_hits'       => $term_hits,
		'query'           => $q,
		'link_matches'    => $link_matches,
	);

	return $return;
}

/**
 * Introduces the query variables for Relevanssi Premium.
 *
 * @param array $qv The WordPress query variable array.
 */
function relevanssi_premium_query_vars( $qv ) {
	$qv[] = 'searchblogs';
	$qv[] = 'customfield_key';
	$qv[] = 'customfield_value';
	$qv[] = 'operator';
	$qv[] = 'include_attachments';
	return $qv;
}

/**
 * Sets the operator parameter.
 *
 * The operator parameter is taken from $query->query_vars['operator'],
 * or from the implicit operator setting.
 *
 * @param object $query The query object.
 */
function relevanssi_set_operator( $query ) {
	if ( isset( $query->query_vars['operator'] ) ) {
		$operator = $query->query_vars['operator'];
	} else {
		$operator = get_option( 'relevanssi_implicit_operator' );
	}
	return $operator;
}

/**
 * Forms a tax_query from the taxonomy parameters.
 *
 * Improved handling of taxonomy parameters to support multiple taxonomies and terms.
 *
 * @param string $taxonomy      Taxonomies, with multiple taxonomies separated by '|'.
 * @param string $taxonomy_term Terms, with multiple terms separated by '|'.
 * @param array  $tax_query     The tax_query array.
 */
function relevanssi_process_taxonomies( $taxonomy, $taxonomy_term, $tax_query ) {
	$taxonomies = explode( '|', $taxonomy );
	$terms      = explode( '|', $taxonomy_term );

	$i = 0;
	foreach ( $taxonomies as $taxonomy ) {
		$term_tax_id    = null;
		$taxonomy_terms = explode( ',', $terms[ $i ] );
		foreach ( $taxonomy_terms as $taxonomy_term ) {
			if ( ! empty( $taxonomy_term ) ) {
				$tax_query[] = array(
					'taxonomy' => $taxonomy,
					'field'    => 'slug',
					'terms'    => $taxonomy_term,
				);
			}
		}
		$i++;
	}
	return $tax_query;
}
