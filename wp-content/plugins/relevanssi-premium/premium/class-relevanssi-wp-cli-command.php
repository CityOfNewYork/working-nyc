<?php
/**
 * /premium/class-relevanssi-wp-cli-command.php
 *
 * @package Relevanssi_Premium
 * @author  Mikko Saari
 * @license https://wordpress.org/about/gpl/ GNU General Public License
 * @see     https://www.relevanssi.com/
 */

/**
 * Relevanssi Premium WP CLI command.
 *
 * Implements the WP CLI support for Relevanssi Premium.
 */
class Relevanssi_WP_CLI_Command extends WP_CLI_Command {

	/**
	 * Rebuilds the index or reindexes one post.
	 *
	 * ## OPTIONS
	 *
	 * [--target=<target>]
	 * : What to index. No value means everything. Valid values are
	 * "taxonomies" and "users" to index taxonomy terms and user profiles
	 * respectively.
	 * ---
	 * options:
	 *   - taxonomies
	 *   - users
	 * ---
	 *
	 * [--post=<post_ID>]
	 * : Post ID, if you only want to reindex one post.
	 *
	 * [--limit=<limit>]
	 * : Number of posts you want to index at one go. If you are extending
	 * the indexing, the relevanssi_index_limit option is used for limit
	 * if this value is left empty.
	 *
	 * [--extend=<extend>]
	 * : If true, do not truncate the index or index users and taxonomies.
	 * If false, first truncate the index, then index user profiles and
	 * taxonomy terms.
	 * ---
	 * default: false
	 * options:
	 *   - true
	 *   - false
	 * ---
	 *
	 * [--index_debug=<debug>]
	 * : If true, display debugging information when indexing a single post.
	 * ---
	 * default: false
	 * options:
	 *   - true
	 *   - false
	 * ---
	 *
	 * ## EXAMPLES
	 *
	 *     wp relevanssi index
	 *     wp relevanssi index --post=1
	 *     wp relevanssi index --target=taxonomies
	 *     wp relevanssi index --target=users
	 *     wp relevanssi index --post=1 --index_debug=true
	 *     wp relevanssi index --limit=100
	 *     wp relevanssi index --extend=true --limit=100
	 *
	 * @param array $args       Command arguments (not used).
	 * @param array $assoc_args Command arguments as associative array.
	 */
	public function index( $args, $assoc_args ) {
		$post_id = null;
		if ( isset( $assoc_args['post'] ) ) {
			$post_id = $assoc_args['post'];
		}

		$limit = null;
		if ( isset( $assoc_args['limit'] ) ) {
			$limit = $assoc_args['limit'];
		}

		$extend = false;
		if ( isset( $assoc_args['extend'] ) ) {
			$extend = $assoc_args['extend'];
		}

		$debug = false;
		if ( isset( $assoc_args['index_debug'] ) ) {
			$debug = $assoc_args['index_debug'];
		}

		$target = null;
		if ( isset( $assoc_args['target'] ) ) {
			$target = $assoc_args['target'];
		}

		if ( 'taxonomies' === $target ) {
			relevanssi_index_taxonomies();
			WP_CLI::success( 'Done!' );
		} elseif ( 'users' === $target ) {
			relevanssi_index_users();
			WP_CLI::success( 'Done!' );
		} else {
			if ( isset( $post_id ) ) {
				$n = relevanssi_index_doc( $post_id, true, relevanssi_get_custom_fields(), true, $debug );
				switch ( $n ) {
					case -1:
						WP_CLI::error( "No such post: $post_id!" );
						break;
					case 'hide':
						WP_CLI::error( "Post $post_id is excluded from indexing." );
						break;
					case 'donotindex':
						WP_CLI::error( "Post $post_id is excluded from indexing by the relevanssi_do_not_index filter." );
						break;
					default:
						WP_CLI::success( "Reindexed post $post_id!" );
				}
			} else {
				$verbose              = false;
				list( $complete, $n ) = relevanssi_build_index( $extend, $verbose, $limit );

				$completion = 'Index is not complete yet.';
				if ( $complete ) {
					$completion = 'Index is complete.';
				}

				WP_CLI::success( "$n posts indexed. $completion" );
			}
		}
	}

	/**
	 * Empties the Relevanssi index.
	 *
	 * ## EXAMPLES
	 *
	 *     wp relevanssi truncate_index
	 *
	 * @param array $args       Command arguments (not used).
	 * @param array $assoc_args Command arguments as associative array.
	 */
	public function truncate_index( $args, $assoc_args ) {
		$result = relevanssi_truncate_index();
		switch ( $result ) {
			case false:
				WP_CLI::error( "Couldn't truncate the Relevanssi database!" );
				break;
			default:
				WP_CLI::success( 'Relevanssi database truncated.' );
		}
	}

	/**
	 * Adds a stopword to the list of stopwords and removes it from the index.
	 *
	 * ## OPTIONS
	 *
	 * <stopword>...
	 * : Stopwords to add.
	 *
	 * ## EXAMPLES
	 *
	 *     wp relevanssi add_stopword stop halt seis
	 *
	 * @param array $args       Command arguments (not used).
	 * @param array $assoc_args Command arguments as associative array.
	 */
	public function add_stopword( $args, $assoc_args ) {
		if ( is_array( $args ) ) {
			foreach ( $args as $stopword ) {
				if ( relevanssi_add_single_stopword( $stopword ) ) {
					WP_CLI::success( "Stopword added: $stopword" );
				} else {
					WP_CLI::error( "Couldn't add stopword: $stopword!" );
				}
			}
		} else {
			WP_CLI::error( 'No stopwords listed.' );
		}
	}

	/**
	 * Removes a stopword from the list of stopwords. Reindex to get it back to the index.
	 *
	 * ## OPTIONS
	 *
	 * <stopword>...
	 * : Stopwords to remove.
	 *
	 * ## EXAMPLES
	 *
	 *     wp relevanssi remove_stopword stop halt seis
	 *
	 * @param array $args       Command arguments (not used).
	 * @param array $assoc_args Command arguments as associative array.
	 */
	public function remove_stopword( $args, $assoc_args ) {
		$verbose = false;
		if ( is_array( $args ) ) {
			foreach ( $args as $stopword ) {
				if ( relevanssi_remove_stopword( $stopword, $verbose ) ) {
					WP_CLI::success( "Stopword removed: $stopword" );
				} else {
					WP_CLI::error( "Couldn't remove stopword: $stopword!" );
				}
			}
		} else {
			WP_CLI::error( 'No stopwords listed.' );
		}
	}

	/**
	 * Empties the Relevanssi logs.
	 *
	 * ## EXAMPLES
	 *
	 *     wp relevanssi reset_log
	 *
	 * @param array $args       Command arguments (not used).
	 * @param array $assoc_args Command arguments as associative array.
	 */
	public function reset_log( $args, $assoc_args ) {
		$verbose = false;
		$result  = relevanssi_truncate_logs( $verbose );
		switch ( $result ) {
			case false:
				WP_CLI::error( "Couldn't reset the logs!" );
				break;
			default:
				WP_CLI::success( 'Relevanssi log truncated.' );
		}
	}

	/**
	 * Shows common words in the index.
	 *
	 * ## OPTIONS
	 *
	 * [--limit=<limit>]
	 * : How many words to show. Defaults to 25.
	 *
	 * ## EXAMPLES
	 *
	 *     wp relevanssi common
	 *
	 * @param array $args       Command arguments (not used).
	 * @param array $assoc_args Command arguments as associative array.
	 */
	public function common( $args, $assoc_args ) {
		$wp_cli = true;
		$limit  = 25;
		if ( isset( $assoc_args['limit'] ) && is_numeric( $assoc_args['limit'] ) ) {
			$limit = $assoc_args['limit'];
		}

		$words = relevanssi_common_words( $limit, $wp_cli );
		if ( is_array( $words ) ) {
			foreach ( $words as $word ) {
				WP_CLI::log( sprintf( '%s (%d)', $word->term, $word->cnt ) );
			}
		} else {
			WP_CLI::error( 'No words returned.' );
		}
	}

	/**
	 * Wipes clean the PDF content from posts and rereads the PDF content.
	 *
	 * ## EXAMPLES
	 *
	 *      wp relevanssi index_pdfs
	 *
	 * @param array $args       Command arguments (not used).
	 * @param array $assoc_args Command arguments as associative array.
	 */
	public function index_pdfs( $args, $assoc_args ) {
		delete_post_meta_by_key( '_relevanssi_pdf_content' );
		delete_post_meta_by_key( '_relevanssi_pdf_error' );

		$pdf_attachments = relevanssi_get_posts_with_attachments();
		foreach ( $pdf_attachments as $post_id ) {
			$exit_and_die = false;
			$response     = relevanssi_index_pdf( $post_id, $exit_and_die );
			if ( $response['success'] ) {
				WP_CLI::log( "Successfully read the content for post $post_id." );
			} else {
				WP_CLI::log( "Couldn't read the post $post_id: " . $response['error'] );
			}
		}
	}

}

WP_CLI::add_command( 'relevanssi', 'Relevanssi_WP_Cli_Command' );

/**
 * Generates a WP CLI progress bar.
 *
 * If WP CLI is enabled, creates a progress bar using WP_CLI\Utils\make_progress_bar().
 *
 * @param string $title Title of the progress bar.
 * @param int    $count Total count for the bar.
 */
function relevanssi_generate_progress_bar( $title, $count ) {
	$progress = null;
	if ( defined( 'WP_CLI' ) && WP_CLI ) {
		$progress = WP_CLI\Utils\make_progress_bar( $title, $count );
	}
	return $progress;
}
