<?php
/**
 * /premium/interface.php
 *
 * @package Relevanssi_Premium
 * @author  Mikko Saari
 * @license https://wordpress.org/about/gpl/ GNU General Public License
 * @see     https://www.relevanssi.com/
 */

/**
 * Prints out the form fields for entering the API key.
 *
 * Prints out table rows and form fields for entering the API key, or if API key is set, controls to remove it.
 *
 * @since 2.0.0
 *
 * @param string $api_key API key value.
 */
function relevanssi_form_api_key( $api_key ) {
	if ( ! empty( $api_key ) ) :
?>
	<tr>
		<th scope="row">
			<?php esc_html_e( 'API key', 'relevanssi' ); ?>
		</th>
		<td>
			<strong><?php esc_html_e( 'API key is set', 'relevanssi' ); ?></strong>.<br />
			<input type='checkbox' id='relevanssi_remove_api_key' name='relevanssi_remove_api_key' /> <label for='relevanssi_remove_api_key'><?php esc_html_e( 'Remove the API key.', 'relevanssi' ); ?></label>
			<p class="description"><?php esc_html_e( 'A valid API key is required to use the automatic update feature and the PDF indexing. Otherwise the plugin will work just fine without an API key. Get your API key from Relevanssi.com.', 'relevanssi' ); ?></p>
		</td>
	</tr>
<?php
	else :
?>
	<tr>
		<th scope="row">
			<?php esc_html_e( 'API key', 'relevanssi' ); ?>
		</th>
		<td>
			<label for='relevanssi_api_key'><?php esc_html_e( 'Set the API key:', 'relevanssi' ); ?>
			<input type='text' id='relevanssi_api_key' name='relevanssi_api_key' value='' /></label>
			<p class="description"><?php esc_html_e( 'A valid API key is required to use the automatic update feature and the PDF indexing. Otherwise the plugin will work just fine without an API key. Get your API key from Relevanssi.com.', 'relevanssi' ); ?></p>
		</td>
	</tr>
<?php
	endif;
}

/**
 * Prints out the form fields for controlling internal links.
 *
 * Prints out the form fields that control how the internal links are handled in indexing.
 *
 * @param string $internal_links_noindex Setting value for no special processing for internal links.
 * @param string $internal_links_strip Setting value for stripping the internal links.
 * @param string $internal_links_dont_strip Setting value for not stripping the internal links.
 */
function relevanssi_form_internal_links( $internal_links_noindex, $internal_links_strip, $internal_links_dont_strip ) {
?>
	<tr>
		<th scope="row">
			<label for='relevanssi_internal_links'><?php esc_html_e( 'Internal links', 'relevanssi' ); ?></label>
		</th>
		<td>
			<select name='relevanssi_internal_links' id='relevanssi_internal_links'>
				<option value='noindex' <?php echo esc_attr( $internal_links_noindex ); ?>><?php esc_html_e( 'No special processing for internal links', 'relevanssi' ); ?></option>
				<option value='strip' <?php echo esc_attr( $internal_links_strip ); ?>><?php esc_html_e( 'Index internal links for target documents only', 'relevanssi' ); ?></option>
				<option value='nostrip' <?php echo esc_attr( $internal_links_dont_strip ); ?>><?php esc_html_e( 'Index internal links for both target and source', 'relevanssi' ); ?></option>
			</select>
			<p class="description"><?php esc_html_e( 'Internal link anchor tags can be indexed for target document, both target and source or source only. See Help for more details.', 'relevanssi' ); ?></p>
		</td>
	</tr>
<?php
}

/**
 * Prints out the form fields for hiding post controls.
 *
 * Prints out the form fields that hide the post controls on edit pages, or allow them for admins.
 *
 * @since 2.0.0
 *
 * @param string $hide_post_controls Should the post controls be hidden.
 * @param string $show_post_controls_for_admins Should the post controls be shown to admin users.
 */
function relevanssi_form_hide_post_controls( $hide_post_controls, $show_post_controls_for_admins ) {
	$show_post_controls_class = 'screen-reader-text';
	if ( ! empty( $hide_post_controls ) ) {
		$show_post_controls_class = '';
	}
?>
	<tr>
		<th scope="row">
			<label for='relevanssi_hide_post_controls'><?php esc_html_e( 'Hide Relevanssi', 'relevanssi' ); ?></label>
		</th>
		<td>
		<fieldset>
			<legend class="screen-reader-text"><?php esc_html_e( 'Hide Relevanssi on edit pages', 'relevanssi' ); ?></legend>
			<label for='relevanssi_hilite_title'>
				<input type='checkbox' name='relevanssi_hide_post_controls' id='relevanssi_hide_post_controls' <?php echo esc_attr( $hide_post_controls ); ?> />
				<?php esc_html_e( 'Hide Relevanssi on edit pages', 'relevanssi' ); ?>
			</label>
		</fieldset>
		<p class="description"><?php esc_html_e( 'Enabling this option hides Relevanssi on all post edit pages.', 'relevanssi' ); ?></p>
		</td>
	</tr>
	<tr id="show_post_controls" class="<?php echo esc_attr( $show_post_controls_class ); ?>">
		<th scope="row">
			<label for='relevanssi_show_post_controls'><?php esc_html_e( 'Show Relevanssi for admins', 'relevanssi' ); ?></label>
		</th>
		<td>
		<fieldset>
			<legend class="screen-reader-text"><?php esc_html_e( 'Show Relevanssi for admins on edit pages', 'relevanssi' ); ?></legend>
			<label for='relevanssi_hilite_title'>
				<input type='checkbox' name='relevanssi_show_post_controls' id='relevanssi_show_post_controls' <?php echo esc_attr( $show_post_controls_for_admins ); ?> />
				<?php esc_html_e( 'Show Relevanssi on edit pages for admins', 'relevanssi' ); ?>
			</label>
		</fieldset>
		<?php /* translators: first placeholder has the capability used for determining admins, second has the filter hook name to change that */ ?>
		<p class="description"><?php printf( esc_html__( 'If Relevanssi is hidden on post edit pages, enabling this option will show Relevanssi features for admin-level users. Admin-level users are those with %1$s capabilities, but if you want to use a different capability, you can use the %2$s filter to modify that.', 'relevanssi' ), '<code>manage_options</code>', '<code>relevanssi_options_capability</code>' ); ?></p>
		</td>
	</tr>
<?php
}

/**
 * Prints out the form field for link weight boost.
 *
 * Prints out the form field for adjusting the link weight.
 *
 * @param float $link_boost The link weight boost value.
 */
function relevanssi_form_link_weight( $link_boost ) {
?>
	<tr>
		<td>
			<?php esc_html_e( 'Internal links', 'relevanssi' ); ?>
		</td>
		<td class="col-2">
			<input type='text' id='relevanssi_link_boost' name='relevanssi_link_boost' size='4' value='<?php echo esc_attr( $link_boost ); ?>' />
		</td>
	</tr>
<?php
}

/**
 * Prints out the form fields for post type weights.
 *
 * Prints out the form fields for adjusting the post type weights. Automatically skips 'nav_menu_item' and 'revision'.
 *
 * @param array $post_type_weights The post type weights, post type as key and weight as a value.
 */
function relevanssi_form_post_type_weights( $post_type_weights ) {
	$post_types = get_post_types();
	foreach ( $post_types as $type ) {
		if ( 'nav_menu_item' === $type ) {
			continue;
		}
		if ( 'revision' === $type ) {
			continue;
		}
		if ( isset( $post_type_weights[ $type ] ) ) {
			$value = $post_type_weights[ $type ];
		} else {
			$value = 1;
		}
		/* translators: name of the post type */
		$label = sprintf( __( "Post type '%s':", 'relevanssi' ), $type );

?>
	<tr>
		<td>
			<?php echo esc_html( $label ); ?>
		</td>
		<td class="col-2">
			<input type='text' id='relevanssi_weight_<?php echo esc_attr( $type ); ?>' name='relevanssi_weight_<?php echo esc_attr( $type ); ?>' size='4' value='<?php echo esc_attr( $value ); ?>' />
		</td>
	</tr>
<?php
	}
}

/**
 * Prints out the form fields for taxonomy weights.
 *
 * Prints out the form fields for adjusting the taxonomy weights. Automatically skips 'nav_menu', 'post_format' and 'link_category' taxonomies.
 *
 * @param array $taxonomy_weights The taxonomy weights, taxonomy as key and weight as a value.
 */
function relevanssi_form_taxonomy_weights( $taxonomy_weights ) {
	$taxonomies = get_taxonomies( '', 'names' );
	foreach ( $taxonomies as $type ) {
		if ( in_array( $type, array( 'nav_menu', 'post_format', 'link_category' ), true ) ) {
			continue;
		}
		if ( isset( $taxonomy_weights[ $type ] ) ) {
			$value = $taxonomy_weights[ $type ];
		} else {
			$value = 1;
		}

		/* translators: name of the taxonomy */
		$label = sprintf( __( "Taxonomy '%s':", 'relevanssi' ), $type );

?>
	<tr>
	<td>
		<?php echo esc_html( $label ); ?>
	</td>
	<td class="col-2">
		<input type='text' id='relevanssi_weight_<?php echo esc_attr( $type ); ?>' name='relevanssi_weight_<?php echo esc_attr( $type ); ?>' size='4' value='<?php echo esc_attr( $value ); ?>' />
	</td>
</tr>
<?php
	}
}

/**
 * Prints out the form fields for recency weight.
 *
 * Prints out the form fields for adjusting the recency weight bonus.
 *
 * @param float $recency_bonus The recency weight bonus.
 */
function relevanssi_form_recency_weight( $recency_bonus ) {
	?>
		<tr>
			<td>
				<label for='relevanssi_recency_bonus'><?php esc_html_e( 'Recent posts bonus weight:', 'relevanssi' ); ?></label>
			</td>
			<td class="col-2">
				<input type='text' id='relevanssi_recency_bonus' name='relevanssi_recency_bonus' size='4' value="<?php echo esc_attr( $recency_bonus ); ?>" />
			</td>
		</tr>
	<?php
}

/**
 * Prints out the form fields for recency cutoff.
 *
 * Prints out the form fields for adjusting the recency date cutoff.
 *
 * @param int $recency_bonus_days Number of days for the recency bonus cutoff.
 */
function relevanssi_form_recency_cutoff( $recency_bonus_days ) {
?>
	<tr>
		<th scope="row">
			<label for='relevanssi_recency_days'><?php esc_html_e( 'Recent posts bonus cutoff', 'relevanssi' ); ?></label>
		</th>
		<td>
			<input type='text' id='relevanssi_recency_days' name='relevanssi_recency_days' size='4' value="<?php echo esc_attr( $recency_bonus_days ); ?>" /> <?php esc_html_e( 'days', 'relevanssi' ); ?>
			<p class="description"><?php esc_html_e( 'Posts newer than the day cutoff specified here will have their weight multiplied with the bonus above.', 'relevanssi' ); ?></p>
		</td>
	</tr>
<?php
}

/**
 * Prints out the form fields for hiding Relevanssi branding.
 *
 * Prints out the form fields for hiding the Relevanssi branding on user searches screen.
 *
 * @param string $hide_branding Should the branding be hidden or not.
 */
function relevanssi_form_hide_branding( $hide_branding ) {
?>
	<tr>
		<th scope="row">
			<label for='relevanssi_hide_branding'><?php esc_html_e( 'Hide Relevanssi branding', 'relevanssi' ); ?></label>
		</th>
		<td>
		<fieldset>
			<?php /* translators: title of the User Searches page */ ?>
			<legend class="screen-reader-text"><?php printf( esc_html__( "Don't show Relevanssi branding on the '%s' screen.", 'relevanssi' ), esc_html__( 'User Searches', 'relevanssi' ) ); ?></legend>
			<label for='relevanssi_hide_branding'>
				<input type='checkbox' name='relevanssi_hide_branding' id='relevanssi_hide_branding' checked='<?php echo esc_attr( $hide_branding ); ?>' />
				<?php /* translators: title of the User Searches page */ ?>
				<?php printf( esc_html__( "Don't show Relevanssi branding on the '%s' screen.", 'relevanssi' ), esc_html__( 'User Searches', 'relevanssi' ) ); ?>
			</label>
		</fieldset>
		</td>
	</tr>
<?php
}

/**
 * Prints out the form fields for external search highlighting.
 *
 * Prints out the form fields for adjusting the highlighting from external searches.
 *
 * @param string $highlight_documents_from_external_searches Should the highlighting be enabled or not.
 * @param string $relevanssi_generates_excerpts If this is empty, the option will be disabled.
 */
function relevanssi_form_highlight_external( $highlight_documents_from_external_searches, $relevanssi_generates_excerpts ) {
?>
	<tr>
		<th scope="row">
			<label for='relevanssi_highlight_docs_external'><?php esc_html_e( 'Highlight from external searches', 'relevanssi' ); ?></label>
		</th>
		<td>
		<fieldset>
			<legend class="screen-reader-text"><?php esc_html_e( 'Highlight query terms in documents from external searches', 'relevanssi' ); ?></legend>
			<label for='relevanssi_hilite_title'>
				<input type='checkbox' name='relevanssi_highlight_docs_external' id='relevanssi_highlight_docs_external' <?php echo esc_attr( $highlight_documents_from_external_searches ); ?>
				<?php
				if ( empty( $relevanssi_generates_excerpts ) ) {
					echo 'disabled';
				}
				?>
				/>
				<?php esc_html_e( 'Highlight query terms in documents from external searches', 'relevanssi' ); ?>
			</label>
		</fieldset>
		<p class="description"><?php esc_html_e( 'Highlights hits when user arrives from an external search. Currently supports Bing, Ask, Yahoo and AOL Search. Google hides the keyword information.', 'relevanssi' ); ?></p>
		</td>
	</tr>
<?php
}

/**
 * Prints out the form fields for thousand separator.
 *
 * Prints out the form fields for adjusting the thousands separator in indexing.
 *
 * @param string $thousand_separator The thousands separator setting.
 */
function relevanssi_form_thousands_separator( $thousand_separator ) {
?>
	<tr>
		<th scope="row">
			<label for='relevanssi_thousand_separator'><?php esc_html_e( 'Thousands separator', 'relevanssi' ); ?></label>
		</th>
		<td>
			<input type='text' name='relevanssi_thousand_separator' id='relevanssi_thousand_separator' size='3' value='<?php echo esc_attr( $thousand_separator ); ?>' />
			<p class="description"><?php esc_html_e( "If Relevanssi sees this character between numbers, it'll stick the numbers together no matter how the character would otherwise be handled. Especially useful if a space is used as a thousands separator.", 'relevanssi' ); ?></p>
		</td>
	</tr>
<?php
}

/**
 * Prints out the form fields for disabling shortcodes.
 *
 * Prints out the form fields for adjusting the disabled shortcodes setting.
 *
 * @param string $disable_shortcodes Comma-separated list of shortcodes to disable.
 */
function relevanssi_form_disable_shortcodes( $disable_shortcodes ) {
?>
	<tr>
		<th scope="row">
			<label for='relevanssi_disable_shortcodes'><?php esc_html_e( 'Disable these shortcodes', 'relevanssi' ); ?></label>
		</th>
		<td>
			<input type='text' name='relevanssi_disable_shortcodes' id='relevanssi_disable_shortcodes' size='60' value='<?php echo esc_attr( $disable_shortcodes ); ?>' />
			<p class="description"><?php esc_html_e( 'Enter a comma-separated list of shortcodes. These shortcodes will not be expanded if expand shortcodes above is enabled. This is useful if a particular shortcode is causing problems in indexing.', 'relevanssi' ); ?></p>
		</td>
	</tr>
<?php
}

/**
 * Prints out the form fields for indexing MySQL columns.
 *
 * Prints out the form fields for adjusting the MySQL column indexing setting.
 *
 * @global $wpdb The WordPress database interface.
 *
 * @param string $mysql_columns Comma-separated list of MySQL columns to index.
 */
function relevanssi_form_mysql_columns( $mysql_columns ) {
	global $wpdb;
	$column_list = wp_cache_get( 'relevanssi_column_list' );
	if ( false === $column_list ) {
		$column_list = $wpdb->get_results( "SHOW COLUMNS FROM $wpdb->posts" );
		wp_cache_set( 'relevanssi_column_list', $column_list );
	}
	$columns = array();
	foreach ( $column_list as $column ) {
		array_push( $columns, $column->Field );
	}
	$columns = implode( ', ', $columns );

?>
	<tr>
		<th scope="row">
			<label for='relevanssi_mysql_columns'><?php esc_html_e( 'MySQL columns', 'relevanssi' ); ?></label>
		</th>
		<td>
			<input type='text' name='relevanssi_mysql_columns' id='relevanssi_mysql_columns' size='60' value='<?php echo esc_attr( $mysql_columns ); ?>' />
			<p class="description">
			<?php
				/* translators: the placeholder has the wp_posts table name */
				printf( esc_html__( 'A comma-separated list of %s MySQL table columns to include in the index. Following columns are available: ', 'relevanssi' ), '<code>wp_posts</code>' );
				echo esc_html( $columns );
			?>
			</p>
		</td>
	</tr>
<?php
}

/**
 * Prints out the form fields for searchblogs setting.
 *
 * Prints out the form fields for adjusting the global searchblogs setting.
 *
 * @param string $searchblogs_all Should all searches include all subsites.
 * @param string $searchblogs If not, a comma-separated list of blog IDs.
 */
function relevanssi_form_searchblogs_setting( $searchblogs_all, $searchblogs ) {
	if ( is_multisite() ) :
?>
	<tr>
		<th scope="row">
			<label for='relevanssi_searchblogs_all'><?php esc_html_e( 'Search all subsites', 'relevanssi' ); ?></label>
		</th>
		<td>
			<fieldset>
				<legend class="screen-reader-text"><?php esc_html_e( 'Search all subsites.', 'relevanssi' ); ?></legend>
				<label for='relevanssi_searchblogs_all'>
					<input type='checkbox' name='relevanssi_searchblogs_all' id='relevanssi_searchblogs_all' <?php echo esc_attr( $searchblogs_all ); ?> />
					<?php esc_html_e( 'Search all subsites', 'relevanssi' ); ?>
				</label>
				<p class="description"><?php esc_html_e( 'If this option is checked, multisite searches will include all subsites. Warning: if you have dozens of sites in your network, the searches may become too slow. This can be overridden from the search form.', 'relevanssi' ); ?></p>
			</fieldset>
		</td>
	</tr>
	<tr>
		<th scope="row">
			<label for='relevanssi_searchblogs'><?php esc_html_e( 'Search some subsites', 'relevanssi' ); ?></label>
		</th>
		<td>
			<input type='text' name='relevanssi_searchblogs' id='relevanssi_searchblogs' size='60' value='<?php echo esc_attr( $searchblogs ); ?>'
			<?php
			if ( ! empty( $searchblogs_all ) ) {
				echo 'disabled';
			}
			?>
			/>
			<p class="description"><?php esc_html_e( 'Add a comma-separated list of blog ID values to have all search forms on this site search these multisite subsites. This can be overridden from the search form.', 'relevanssi' ); ?></p>
		</td>
	</tr>
<?php
	endif;
}

/**
 * Prints out the form fields for indexing user profiles.
 *
 * Prints out the form fields for adjusting the user indexing settings.
 *
 * @param string $index_users Should users be indexed.
 * @param string $index_subscribers Should subscribers be indexed.
 * @param string $index_user_fields Comma-separated list of user fields to index.
 */
function relevanssi_form_index_users( $index_users, $index_subscribers, $index_user_fields ) {
	$fields_display = 'class="screen-reader-text"';
	if ( ! empty( $index_users ) ) {
		$fields_display = '';
	}
?>
	<h2><?php esc_html_e( 'Indexing user profiles', 'relevanssi' ); ?></h2>

	<table class="form-table">
	<tr>
		<th scope="row">
			<label for='relevanssi_index_users'><?php esc_html_e( 'Index user profiles', 'relevanssi' ); ?></label>
		</th>
		<td>
		<fieldset>
			<legend class="screen-reader-text"><?php esc_html_e( 'Index user profiles.', 'relevanssi' ); ?></legend>
			<label for='relevanssi_index_users'>
				<input type='checkbox' name='relevanssi_index_users' id='relevanssi_index_users' <?php echo esc_attr( $index_users ); ?> />
				<?php esc_html_e( 'Index user profiles.', 'relevanssi' ); ?>
			</label>
			<p class="description"><?php esc_html_e( 'Relevanssi will index user profiles. This includes first name, last name, display name and user description.', 'relevanssi' ); ?></p>
			<p class="description important screen-reader-text" id="user_profile_notice"><?php esc_html_e( 'This may require changes to search results template, see the contextual help.', 'relevanssi' ); ?></p>
		</fieldset>
		</td>
	</tr>
	<tr id="index_subscribers" <?php echo esc_attr( $fields_display ); ?>>
		<th scope="row">
			<label for='relevanssi_index_subscribers'><?php esc_html_e( 'Index subscribers', 'relevanssi' ); ?></label>
		</th>
		<td>
		<fieldset>
			<legend class="screen-reader-text"><?php esc_html_e( 'Index also subscriber profiles.', 'relevanssi' ); ?></legend>
			<label for='relevanssi_index_subscribers'>
				<input type='checkbox' name='relevanssi_index_subscribers' id='relevanssi_index_subscribers' <?php echo esc_attr( $index_subscribers ); ?> />
				<?php esc_html_e( 'Index also subscriber profiles.', 'relevanssi' ); ?>
			</label>
			<p class="description"><?php esc_html_e( 'By default, Relevanssi indexes authors, editors, contributors and admins, but not subscribers. You can change that with this option.', 'relevanssi' ); ?></p>
		</fieldset>
		</td>
	</tr>

	<tr id="user_extra_fields" <?php echo esc_attr( $fields_display ); ?>>
		<th scope="row">
			<label for='relevanssi_index_user_fields'><?php esc_html_e( 'Extra fields', 'relevanssi' ); ?></label>
		</th>
		<td>
			<input type='text' name='relevanssi_index_user_fields' id='relevanssi_index_user_fields' size='60' value='<?php echo esc_attr( $index_user_fields ); ?>' /></label><br />
			<p class="description"><?php esc_html_e( 'A comma-separated list of extra user fields to include in the index. These can be user fields or user meta.', 'relevanssi' ); ?></p>
		</td>
	</tr>
	</table>
<?php
}

/**
 * Prints out the form fields for indexing synonyms.
 *
 * Prints out the form fields for adjusting the synonym indexing settings.
 *
 * @param string $index_synonyms Should synonyms be indexed.
 */
function relevanssi_form_index_synonyms( $index_synonyms ) {
?>
	<h3><?php esc_html_e( 'Indexing synonyms', 'relevanssi' ); ?></h3>
	<table class="form-table">
	<tr>
		<th scope="row">
			<label for='relevanssi_index_synonyms'><?php esc_html_e( 'Index synonyms', 'relevanssi' ); ?></label>
		</th>
		<td>
		<fieldset>
			<legend class="screen-reader-text"><?php esc_html_e( 'Index synonyms for AND searches.', 'relevanssi' ); ?></legend>
			<label for='relevanssi_index_synonyms'>
				<input type='checkbox' name='relevanssi_index_synonyms' id='relevanssi_index_synonyms' <?php echo esc_attr( $index_synonyms ); ?> />
				<?php esc_html_e( 'Index synonyms for AND searches.', 'relevanssi' ); ?>
			</label>
		</fieldset>
		<p class="description"><?php esc_html_e( 'If checked, Relevanssi will use the synonyms in indexing. If you add <code>dog = hound</code> to the synonym list and enable this feature, every time the indexer sees <code>hound</code> in post content or post title, it will index it as <code>hound dog</code>. Thus, the post will be found when searching with either word. This makes it possible to use synonyms with AND searches, but will slow down indexing, especially with large databases and large lists of synonyms. This only works for post titles and post content. You can use multi-word keys and values, but phrases do not work.', 'relevanssi' ); ?></p>
		</td>
	</tr>
	</table>

	<br /><br />
<?php
}

/**
 * Prints out the form fields for indexing PDF content.
 *
 * Prints out the form fields for adjusting the way the PDF content is indexed for parent posts.
 *
 * @param string $index_pdf_parent Should PDF content be indexed for parent posts.
 * @param array  $index_post_types Array of post types to index.
 */
function relevanssi_form_index_pdf_parent( $index_pdf_parent, $index_post_types ) {
?>
	<h2><?php esc_html_e( 'Indexing PDF content', 'relevanssi' ); ?></h2>

	<table class="form-table">
	<tr>
	<th scope="row">
		<label for='relevanssi_index_pdf_parent'><?php esc_html_e( 'Index for parent', 'relevanssi' ); ?></label>
	</th>
	<td>
	<fieldset>
		<legend class="screen-reader-text"><?php esc_html_e( 'Index PDF contents for parent post', 'relevanssi' ); ?></legend>
		<label for='relevanssi_index_pdf_parent'>
			<input type='checkbox' name='relevanssi_index_pdf_parent' id='relevanssi_index_pdf_parent' <?php echo esc_attr( $index_pdf_parent ); ?> />
			<?php esc_html_e( 'Index PDF contents for parent post', 'relevanssi' ); ?>
		</label>
		<?php /* translators: name of the attachment post type */ ?>
		<p class="description"><?php printf( esc_html__( 'If checked, Relevanssi indexes the PDF content both for the attachment post and the parent post. You can control the attachment post visibility by indexing or not indexing the post type %s.', 'relevanssi' ), '<code>attachment</code>' ); ?></p>
		<?php if ( ! in_array( 'attachment', $index_post_types, true ) && empty( $index_pdf_parent ) ) : ?>
		<?php /* translators: name of the attachment post type */ ?>
		<p class="description important"><?php printf( esc_html__( "You have not chosen to index the post type %s. You won't see any PDF content in the search results, unless you check this option.", 'relevanssi' ), '<code>attachment</code>' ); ?></p>
		<?php endif; ?>
		<?php if ( in_array( 'attachment', $index_post_types, true ) && ! empty( $index_pdf_parent ) ) : ?>
		<?php /* translators: name of the attachment post type */ ?>
		<p class="description important"><?php printf( esc_html__( 'Searching for PDF contents will now return both the attachment itself and the parent post. Are you sure you want both in the results?', 'relevanssi' ), '<code>attachment</code>' ); ?></p>
		<?php endif; ?>
	</fieldset>
	</td>
	</tr>
	</table>
<?php
}

/**
 * Prints out the form fields for indexing taxonomy terms.
 *
 * Prints out the form fields for choosing which taxonomies are indexed.
 *
 * @param string $index_taxonomies Should taxonomy terms be indexed.
 * @param array  $index_these_taxonomies Array of taxonomies to index.
 */
function relevanssi_form_index_taxonomies( $index_taxonomies, $index_these_taxonomies ) {
	$fields_display = 'class="screen-reader-text"';
	if ( ! empty( $index_taxonomies ) ) {
		$fields_display = '';
	}

?>
	<h2><?php esc_html_e( 'Indexing taxonomy terms', 'relevanssi' ); ?></h2>

	<table class="form-table">
	<tr>
		<th scope="row">
			<label for='relevanssi_index_taxonomies'><?php esc_html_e( 'Index taxonomy terms', 'relevanssi' ); ?></label>
		</th>
		<td>
		<fieldset>
			<legend class="screen-reader-text"><?php esc_html_e( 'Index taxonomy terms.', 'relevanssi' ); ?></legend>
			<label for='relevanssi_index_taxonomies'>
				<input type='checkbox' name='relevanssi_index_taxonomies' id='relevanssi_index_taxonomies' <?php echo esc_attr( $index_taxonomies ); ?> />
				<?php esc_html_e( 'Index taxonomy terms.', 'relevanssi' ); ?>
			</label>
			<p class="description"><?php esc_html_e( 'Relevanssi will index taxonomy terms (categories, tags and custom taxonomies). Searching for taxonomy term name will return the taxonomy term page.', 'relevanssi' ); ?></p>
		</fieldset>
		</td>
	</tr>
	<tr id="taxonomies" <?php echo esc_attr( $fields_display ); ?>>
		<th scope="row">
			<?php esc_html_e( 'Taxonomies', 'relevanssi' ); ?>
		</th>
		<td>
			<table class="widefat" id="index_terms_table">
			<thead>
				<tr>
					<th><?php esc_html_e( 'Taxonomy', 'relevanssi' ); ?></th>
					<th><?php esc_html_e( 'Index', 'relevanssi' ); ?></th>
					<th><?php esc_html_e( 'Public?', 'relevanssi' ); ?></th>
				</tr>
			</thead>
	<?php
	$taxos = get_taxonomies( '', 'objects' );
	foreach ( $taxos as $taxonomy ) {
		if ( in_array( $taxonomy->name, array( 'nav_menu', 'link_category' ), true ) ) {
			continue;
		}
		if ( in_array( $taxonomy->name, $index_these_taxonomies, true ) ) {
			$checked = 'checked';
		} else {
			$checked = '';
		}

		if ( $taxonomy->public ) {
			$public = __( 'yes', 'relevanssi' );
		} else {
			$public = __( 'no', 'relevanssi' );
		}

		$label = sprintf( '%s', $taxonomy->name );
		$type  = $taxonomy->name;

?>
	<tr>
		<td>
			<?php echo esc_html( $label ); ?>
		</td>
		<td>
			<input type='checkbox' name='relevanssi_index_terms_<?php echo esc_attr( $type ); ?>' id='relevanssi_index_terms_<?php echo esc_attr( $type ); ?>' <?php echo esc_attr( $checked ); ?> />
		</td>
		<td>
			<?php echo esc_html( $public ); ?>
		</td>
	</tr>
<?php
	}
?>
			</table>
		</td>
	</tr>
	</table>
<?php
}

/**
 * Prints out the form fields for importing and exporting options.
 *
 * @param string $serialized_options All options in serialized format.
 */
function relevanssi_form_importexport( $serialized_options ) {
?>
	<h2 id="options"><?php esc_html_e( 'Import or export options', 'relevanssi' ); ?></h2>

	<p><?php esc_html_e( 'Here you find the current Relevanssi Premium options in a text format. Copy the contents of the text field to make a backup of your settings. You can also paste new settings here to change all settings at the same time. This is useful if you have default settings you want to use on every system.', 'relevanssi' ); ?></p>

	<table class="form-table">
	<tr>
		<th scope="row"><?php esc_html_e( 'Current Settings', 'relevanssi' ); ?></th>
		<td>
			<p><textarea name='relevanssi_settings' rows='4' cols='80'><?php echo esc_html( $serialized_options ); ?></textarea></p>

			<input type='submit' name='import_options' id='import_options' value='<?php esc_html_e( 'Import settings', 'relevanssi' ); ?>' class='button' />
		</td>
	</tr>
	</table>

	<p><?php esc_html_e( "Note! Make sure you've got correct settings from a right version of Relevanssi. Settings from a different version of Relevanssi may or may not work and may or may not mess your settings.", 'relevanssi' ); ?></p>
<?php
}

/**
 * Prints out the attachment indexing tab content.
 *
 * @global $wpdb The WordPress database interface.
 *
 * @param array  $index_post_types Array of post types that are indexed.
 * @param string $index_pdf_parent Should PDF content be indexed for the parent post.
 */
function relevanssi_form_attachments( $index_post_types, $index_pdf_parent ) {
	global $wpdb;
	$read_new_files = '';
	$send_pdf_files = '';
	$link_pdf_files = '';
	$us_selected    = '';
	$eu_selected    = '';

	if ( 'on' === get_option( 'relevanssi_read_new_files' ) ) {
		$read_new_files = 'checked';
	}
	if ( 'on' === get_option( 'relevanssi_send_pdf_files' ) ) {
		$send_pdf_files = 'checked';
	}
	if ( 'on' === get_option( 'relevanssi_link_pdf_files' ) ) {
		$link_pdf_files = 'checked';
	}
	if ( 'us' === get_option( 'relevanssi_server_location' ) ) {
		$us_selected = 'selected';
	}
	if ( 'eu' === get_option( 'relevanssi_server_location' ) ) {
		$eu_selected = 'selected';
	}

	$indexing_attachments = false;
	if ( in_array( 'attachment', $index_post_types, true ) ) {
		$indexing_attachments = true;
	}

?>
	<table class="form-table">
	<tr>
		<th scope="row">
			<input type='button' id='index' value='<?php esc_html_e( 'Read all unread attachments', 'relevanssi' ); ?>' class='button-primary' /><br /><br />
		</th>
		<td>
			<p class="description" id="indexing_button_instructions">
				<?php /* translators: the placeholder has the name of the custom field for PDF content */ ?>
				<?php printf( esc_html__( 'Clicking the button will read the contents of all the unread attachments files and store the contents to the %s custom field for future indexing. Attachments with errors will be skipped, except for the files with timeout and connection related errors: those will be attempted again.', 'relevanssi' ), '<code>_relevanssi_pdf_content</code>' ); ?>
			</p>
			<div id='relevanssi-progress' class='rpi-progress'><div></div></div>
			<div id='relevanssi-timer'><?php esc_html_e( 'Time elapsed', 'relevanssi' ); ?>: <span id="relevanssi_elapsed">0:00:00</span> | <?php esc_html_e( 'Time remaining', 'relevanssi' ); ?>: <span id="relevanssi_estimated"><?php esc_html_e( 'some time', 'relevanssi' ); ?></span></div>
			<textarea id='relevanssi_results' rows='10' cols='80'></textarea>
		</td>
	</tr>
	<tr>
		<th scope="row"><?php esc_html_e( 'State of the attachments', 'relevanssi' ); ?></td>
		<?php
		$pdf_count = wp_cache_get( 'relevanssi_pdf_count' );
		if ( false === $pdf_count ) {
			$pdf_count = $wpdb->get_var( "SELECT COUNT(*) FROM $wpdb->postmeta WHERE meta_key = '_relevanssi_pdf_content' AND meta_value != ''" );
			wp_cache_set( 'relevanssi_pdf_count', $pdf_count );

		}
		$pdf_error_count = wp_cache_get( 'relevanssi_pdf_error_count' );
		if ( false === $pdf_error_count ) {
			$pdf_error_count = $wpdb->get_var( "SELECT COUNT(*) FROM $wpdb->postmeta WHERE meta_key = '_relevanssi_pdf_error' AND meta_value != ''" );
			wp_cache_set( 'relevanssi_pdf_error_count', $pdf_error_count );
		}
		?>
		<td id="stateofthepdfindex">
			<p><?php echo esc_html( $pdf_count ); ?> <?php echo esc_html( _n( 'document has read attachment content.', 'documents have read attachment content.', $pdf_count, 'relevanssi' ) ); ?></p>
			<p><?php echo esc_html( $pdf_error_count ); ?> <?php echo esc_html( _n( 'document has an attachment reading error.', 'documents have attachment reading errors.', $pdf_error_count, 'relevanssi' ) ); ?>
			<?php if ( $pdf_error_count > 0 ) : ?>
				<span id="relevanssi_show_pdf_errors"><?php esc_html_e( 'Show errors', 'relevanssi' ); ?></span>.
			<?php endif; ?></p>
			<textarea id="relevanssi_pdf_errors" rows="4" cols="120"></textarea>
		</td>
	</tr>
	<tr>
		<th scope="row"><?php esc_html_e( 'Server location', 'relevanssi' ); ?></th>
		<td>
			<select name="relevanssi_server_location" id="relevanssi_server_location">
				<option value="us" <?php echo esc_html( $us_selected ); ?>><?php esc_html_e( 'United States', 'relevanssi' ); ?></option>
				<option value="eu" <?php echo esc_html( $eu_selected ); ?>><?php esc_html_e( 'European Union', 'relevanssi' ); ?></option>
			</select>
		</td>
	</tr>
	<tr>
		<th scope="row"><?php esc_html_e( 'Reset attachment content', 'relevanssi' ); ?></td>
		<td>
			<input type="button" id="reset" value="<?php esc_html_e( 'Reset all attachment data from posts', 'relevanssi' ); ?>" class="button-primary" />
			<?php /* translators: the placeholders are the names of the custom fields */ ?>
			<p class="description"><?php printf( esc_html__( "This will remove all %1\$s and %2\$s custom fields from all posts. If you want to reread all attachment files, use this to clean up; clicking the reading button doesn't wipe the slate clean like it does in regular indexing.", 'relevanssi' ), '<code>_relevanssi_pdf_content</code>', '<code>_relevanssi_pdf_error</code>' ); ?></p>
		</td>
	</tr>
	<tr>
		<th scope="row">
			<label for='relevanssi_read_new_files'><?php esc_html_e( 'Read new files', 'relevanssi' ); ?></label>
		</th>
		<td>
		<fieldset>
			<legend class="screen-reader-text"><?php esc_html_e( 'Read new files automatically', 'relevanssi' ); ?></legend>
			<label for='relevanssi_read_new_files'>
				<input type='checkbox' name='relevanssi_read_new_files' id='relevanssi_read_new_files' <?php echo esc_attr( $read_new_files ); ?> />
				<?php esc_html_e( 'Read new files automatically', 'relevanssi' ); ?>
			</label>
			<p class="description"><?php esc_html_e( 'If this option is enabled, Relevanssi will automatically read the contents of new attachments as they are uploaded. This may cause unexpected delays in uploading posts. If this is not enabled, new attachments are not read automatically and need to be manually read and reindexed.', 'relevanssi' ); ?></p>
		</fieldset>
		</td>
	</tr>
	<tr>
		<th scope="row">
			<label for='relevanssi_send_pdf_files'><?php esc_html_e( 'Upload files', 'relevanssi' ); ?></label>
		</th>
		<td>
		<fieldset>
			<legend class="screen-reader-text"><?php esc_html_e( 'Upload files for reading', 'relevanssi' ); ?></legend>
			<label for='relevanssi_send_pdf_files'>
				<input type='checkbox' name='relevanssi_send_pdf_files' id='relevanssi_send_pdf_files' <?php echo esc_attr( $send_pdf_files ); ?> />
				<?php esc_html_e( 'Upload files for reading', 'relevanssi' ); ?>
			</label>
			<p class="description"><?php esc_html_e( "By default, Relevanssi only sends a link to the attachment to the attachment reader. If your files are not accessible (for example your site is inside an intranet, password protected, or a local dev site, and the files can't be downloaded if given the URL of the file), check this option to upload the whole file to the reader.", 'relevanssi' ); ?></p>
		</fieldset>
		</td>
	</tr>
	<tr>
		<th scope="row">
			<label for='relevanssi_link_pdf_files'><?php esc_html_e( 'Link to files', 'relevanssi' ); ?></label>
		</th>
		<td>
		<fieldset>
			<legend class="screen-reader-text"><?php esc_html_e( 'Link search results directly to the files', 'relevanssi' ); ?></legend>
			<label for='relevanssi_link_pdf_files'>
				<input type='checkbox' name='relevanssi_link_pdf_files' id='relevanssi_link_pdf_files' <?php echo esc_attr( $link_pdf_files ); ?> />
				<?php esc_html_e( 'Link search results directly to the files', 'relevanssi' ); ?>
			</label>
			<p class="description"><?php esc_html_e( 'If this option is checked, attachment results in search results will link directly to the file. Otherwise the results will link to the attachment page.', 'relevanssi' ); ?></p>
			<?php if ( ! $indexing_attachments ) : ?>
			<?php /* translators: the placeholder has name of the post type */ ?>
			<p class="important description"><?php printf( esc_html__( "You're not indexing the %s post type, so this setting doesn't have any effect.", 'relevanssi' ), '<code>attachment</code>' ); ?>
			<?php endif; ?>
			<?php if ( ! $indexing_attachments && ! $index_pdf_parent ) : ?>
			<?php /* translators: the placeholder has name of the post type */ ?>
			<p class="important description"><?php printf( esc_html__( "You're not indexing the %s post type and haven't connected the files to the parent posts in the indexing settings. You won't be seeing any files in the results.", 'relevanssi' ), '<code>attachment</code>' ); ?>
			<?php endif; ?>
		</fieldset>
		</td>
	</tr>
	<tr>
		<th scope="row"><?php esc_html_e( 'Instructions', 'relevanssi' ); ?></th>
		<td>
			<?php /* translators: placeholder has the name of the custom field */ ?>
			<p><?php printf( esc_html__( 'When Relevanssi reads attachment content, the text is extracted and saved in the %s custom field for the attachment post. This alone does not add the attachment content in the Relevanssi index; it just makes the contents of the attachments easily available for the regular Relevanssi indexing process.', 'relevanssi' ), '<code>_relevanssi_pdf_content</code>' ); ?></p>
			<?php /* translators: placeholder has the name of the post type */ ?>
			<p><?php printf( esc_html__( 'There are two ways to index the attachment content. If you choose to index the %s post type, Relevanssi will show the attachment posts in the results.', 'relevanssi' ), '<code>attachment</code>' ); ?></p>
			<p><?php esc_html_e( "You can also choose to index the attachment content for the parent post, in which case Relevanssi will show the parent post in the results (this setting can be found on the indexing settings). Obviously this does not find the content in attachments that are not attached to another post – if you just upload a file to the WordPress Media Library, it is not attached and won't be found unless you index the attachment posts.", 'relevanssi' ); ?></p>
			<p><?php esc_html_e( 'In any case, in order to see attachments in the results, you must read the attachment content here first, then build the index on the Indexing tab.', 'relevanssi' ); ?></p>
			<p><?php esc_html_e( "If you need to reread a file, you can do read individual files from Media Library. Choose an attachment and click 'Edit more details' to read the content.", 'relevanssi' ); ?></p>
		</td>
	</tr>
	<tr>
		<th scope="row"><?php esc_html_e( 'Key not valid?', 'relevanssi' ); ?></th>
		<td>
			<p><?php esc_html_e( "Are you a new Relevanssi customer and seeing 'Key xxxxxx is not valid' error messages? New API keys are delivered to the server once per hour, so if try again an hour later, the key should work.", 'relevanssi' ); ?></p>
		</td>
	</tr>
	<tr>
		<th scope="row"><?php esc_html_e( 'Important!', 'relevanssi' ); ?></th>
		<td>
			<p><?php esc_html_e( "In order to read the contents of the files, the files are sent over to Relevanssiservices.com, a processing service hosted on a Digital Ocean Droplet. There are two servers: one in the US and another in the EU. The service creates a working copy of the files. The copy is removed after the file has been processed, but there are no guarantees that someone with an access to the server couldn't see the files. Do not read files with confidential information in them. In order to block individual files from reading, use the Relevanssi post controls on attachment edit page to exclude attachment posts from indexing.", 'relevanssi' ); ?></p>
		</td>
	</tr>
	</table>
<?php
}

/**
 * Adds the Relevanssi metaboxes for post edit pages.
 *
 * Adds the Relevanssi Post Controls meta box on the post edit pages. Will skip ACF pages.
 */
function relevanssi_add_metaboxes() {
	global $post;
	if ( null === $post ) {
		return;
	}
	if ( in_array( $post->post_type, array( 'acf', 'acf-field-group' ), true ) ) {
		return;
		// No metaboxes for Advanced Custom Fields pages.
	}
	add_meta_box(
		'relevanssi_hidebox',
		__( 'Relevanssi post controls', 'relevanssi' ),
		'relevanssi_post_metabox',
		array( $post->post_type, 'edit-category' )
	);
}

/**
 * Prints out the Relevanssi Post Controls meta box.
 *
 * Prints out the Relevanssi Post Controls meta box that is displayed on the post edit pages.
 *
 * @global array $relevanssi_variables The Relevanssi global variables array, used to get the file name for nonce.
 */
function relevanssi_post_metabox() {
	global $relevanssi_variables;
	wp_nonce_field( plugin_basename( $relevanssi_variables['file'] ), 'relevanssi_hidepost' );

	global $post;
	$hide_post = checked( 'on', get_post_meta( $post->ID, '_relevanssi_hide_post', true ), false );

	$pins = get_post_meta( $post->ID, '_relevanssi_pin', false );
	$pin  = implode( ', ', $pins );

	$unpins = get_post_meta( $post->ID, '_relevanssi_unpin', false );
	$unpin  = implode( ', ', $unpins );

	// The actual fields for data entry.
?>
	<input type="hidden" id="relevanssi_metabox" name="relevanssi_metabox" value="true" />
	<input type="checkbox" id="relevanssi_hide_post" name="relevanssi_hide_post" <?php echo esc_attr( $hide_post ); ?> />
	<label for="relevanssi_hide_post">
		<?php esc_html_e( 'Exclude this post or page from the index.', 'relevanssi' ); ?>
	</label>

	<p><strong><?php esc_html_e( 'Pin this post', 'relevanssi' ); ?></strong></p>
	<p><?php esc_html_e( 'A comma-separated list of single word keywords or multi-word phrases. If any of these keywords are present in the search query, this post will be moved on top of the search results.', 'relevanssi' ); ?></p>
	<textarea type="text" id="relevanssi_pin" name="relevanssi_pin" cols="80" rows="2"><?php echo esc_html( $pin ); ?></textarea/>

	<p><strong><?php esc_html_e( 'Exclude this post', 'relevanssi' ); ?></strong></p>
	<p><?php esc_html_e( 'A comma-separated list of single word keywords or multi-word phrases. If any of these keywords are present in the search query, this post will be removed from the search results.', 'relevanssi' ); ?></p>
	<textarea type="text" id="relevanssi_unpin" name="relevanssi_unpin" cols="80" rows="2"><?php echo esc_html( $unpin ); ?></textarea/>
<?php
}

/**
 * Adds the Premium contextual help messages.
 *
 * Adds the Premium only contextual help messages to the WordPress contextual help menu.
 */
function relevanssi_premium_admin_help() {
	$screen = get_current_screen();
	$screen->add_help_tab( array(
		'id'      => 'relevanssi-boolean',
		'title'   => __( 'Boolean operators', 'relevanssi' ),
		'content' => '<ul>' .
			'<li>' . __( 'Relevanssi Premium offers limited support for Boolean logic. In addition of setting the default operator from Relevanssi settings, you can use AND and NOT operators in searches.', 'relevanssi' ) . '</li>' .
			'<li>' . __( 'To use the NOT operator, prefix the search term with a minus sign:', 'relevanssi' ) .
			sprintf( '<pre>%s</pre>', __( 'cats -dogs', 'relevanssi' ) ) .
			__( "This would only show posts that have the word 'cats' but not the word 'dogs'.", 'relevanssi' ) . '</li>' .
			'<li>' . __( 'To use the AND operator, set the default operator to OR and prefix the search term with a plus sign:', 'relevanssi' ) .
			sprintf( '<pre>%s</pre>', __( '+cats dogs mice', 'relevanssi' ) ) .
			__( "This would show posts that have the word 'cats' and either 'dogs' or 'mice' or both, and would prioritize posts that have all three.", 'relevanssi' ) . '</li>' .
			'</ul>',
	));
	$screen->add_help_tab( array(
		'id'      => 'relevanssi-title-user-profiles',
		'title'   => __( 'User profiles', 'relevanssi' ),
		'content' => '<ul>' .
			/* translators:  first placeholder is the_permalink(), the second is relevanssi_the_permalink() */
			'<li>' . sprintf( esc_html__( "Permalinks to user profiles may not always work on search results templates. %1\$s should work, but if it doesn't, you can replace it with %2\$s.", 'relevanssi' ), '<code>the_permalink()</code>', '<code>relevanssi_the_permalink()</code>' ) . '</li>' .
			/* translators:  the placeholder is the name of the relevanssi_index_user_fields option */
			'<li>' . sprintf( esc_html__( 'To control which user meta fields are indexed, you can use the %s option. It should have a comma-separated list of user meta fields. It can be set like this (you only need to run this code once):', 'relevanssi' ), '<code>relevanssi_index_user_fields</code>' ) .
			"<pre>update_option( 'relevanssi_index_user_fields', 'field_a,field_b,field_c' );</pre></li>" .
			/* translators: the placeholder is the URL for the link */
			'<li>' . sprintf( esc_html__( "For more details on user profiles and search results templates, see <a href='%s'>this knowledge base entry</a>.", 'relevanssi' ), 'https://www.relevanssi.com/knowledge-base/user-profile-search/' ) . '</li>' .
			'</ul>',
	));
	$screen->add_help_tab( array(
		'id'      => 'relevanssi-internal-links',
		'title'   => __( 'Internal links', 'relevanssi' ),
		'content' => '<ul>' .
			'<li>' . __( 'This option sets how Relevanssi handles internal links that point to your own site.', 'relevanssi' ) . '</li>' .
			'<li>' . __( "If you choose 'No special processing', Relevanssi doesn’t care about links and indexes the link anchor (the text of the link) like it is any other text.", 'relevanssi' ) . '</li>' .
			'<li>' . __( "If you choose 'Index internal links for target documents only', then the link is indexed like the link anchor text were the part of the link target, not the post where the link is.", 'relevanssi' ) . '</li>' .
			'<li>' . __( "If you choose 'Index internal links for target and source', the link anchor text will count for both posts.", 'relevanssi' ) . '</li>' .
			'</ul>',
	));
	$screen->add_help_tab( array(
		'id'      => 'relevanssi-stemming',
		'title'   => __( 'Stemming', 'relevanssi' ),
		'content' => '<ul>' .
			'<li>' . __( "By default Relevanssi doesn't understand anything about singular word forms, plurals or anything else. You can, however, add a stemmer that will stem all the words to their basic form, making all different forms equal in searching.", 'relevanssi' ) . '</li>' .
			'<li>' . __( 'To enable the English-language stemmer, add this to the theme functions.php:', 'relevanssi' ) .
			"<pre>add_filter( 'relevanssi_stemmer', 'relevanssi_simple_english_stemmer' );</pre>" . '</li>' .
			'<li>' . __( 'After you add the code, rebuild the index to get correct results.', 'relevanssi' ) . '</li>' .
			'</ul>',
	));
	$screen->add_help_tab( array(
		'id'      => 'relevanssi-wpcli',
		'title'   => __( 'WP CLI', 'relevanssi' ),
		'content' => '<ul>' .
			/* translators: the placeholder has the WP CLI command */
			'<li>' . sprintf( esc_html__( 'If you have WP CLI installed, Relevanssi Premium has some helpful commands. Use %s to get a list of available commands.', 'relevanssi' ), '<code>wp help relevanssi</code>' ) . '</li>' .
			/* translators: the first placeholder opens the link, the second closes the link */
			'<li>' . sprintf( esc_html__( 'You can also see %1$sthe user manual page%2$s.', 'relevanssi' ), "<a href='https://www.relevanssi.com/user-manual/wp-cli/'>", '</a>' ) . '</li>' .
			'</ul>',
	));

	$screen->set_help_sidebar(
		'<p><strong>' . __( 'For more information:', 'relevanssi' ) . '</strong></p>' .
		'<p><a href="http://www.relevanssi.com/support/" target="_blank">' . __( 'Plugin support page', 'relevanssi' ) . '</a></p>' .
		'<p><a href="http://wordpress.org/tags/relevanssi?forum_id=10" target="_blank">' . __( 'WordPress.org forum', 'relevanssi' ) . '</a></p>' .
		'<p><a href="mailto:support@relevanssi.zendesk.com">Support email</a></p>' .
		'<p><a href="http://www.relevanssi.com/knowledge-base/" target="_blank">' . __( 'Plugin knowledge base', 'relevanssi' ) . '</a></p>'
	);
}

/**
 * Adds the Premium page actions.
 *
 * Adds the Premium contextual help in the load-{page} hook and the Premium admin JS to admin_footer-{page} hook.
 *
 * @param string $plugin_page The plugin page name for the hooks.
 */
function relevanssi_premium_plugin_page_actions( $plugin_page ) {
	add_action( 'load-' . $plugin_page, 'relevanssi_premium_admin_help' );
	add_action( 'admin_footer-' . $plugin_page, 'relevanssi_pdf_action_javascript' );
}

/**
 * Adds admin PDF scripts for Relevanssi Premium.
 *
 * Adds the admin-side Javascript for Relevanssi Premium PDF controls and includes some script localizations.
 *
 * @global Object $post The global post object.
 *
 * @param string $hook The current page hook.
 */
function relevanssi_premium_add_admin_scripts( $hook ) {
	global $relevanssi_variables;

	$plugin_dir_url = plugin_dir_url( $relevanssi_variables['file'] );

	// These are the only page hooks Relevanssi admin scripts will hook into.
	$post_hooks = array( 'post.php', 'post-new.php' );
	if ( in_array( $hook, $post_hooks, true ) ) {
		global $post;
		// Only add the scripts for attachment posts.
		if ( 'attachment' === $post->post_type ) {
			$api_key = get_site_option( 'relevanssi_api_key' );
			wp_enqueue_script( 'relevanssi_admin_pdf_js', $plugin_dir_url . 'premium/admin_pdf_scripts.js', array( 'jquery' ) );
			wp_localize_script( 'relevanssi_admin_pdf_js', 'admin_pdf_data',
				array(
					'send_pdf_nonce' => wp_create_nonce( 'relevanssi_send_pdf' ),
				)
			);
		}
	}

	$nonce = array(
		'taxonomy_indexing_nonce' => wp_create_nonce( 'relevanssi_taxonomy_indexing_nonce' ),
		'user_indexing_nonce'     => wp_create_nonce( 'relevanssi_user_indexing_nonce' ),
		'indexing_nonce'          => wp_create_nonce( 'relevanssi_indexing_nonce' ),
	);

	wp_localize_script( 'relevanssi_admin_js_premium', 'nonce', $nonce );
}

/**
 * Imports Relevanssi Premium options.
 *
 * Takes the options array and does the actual updating of options using update_options().
 *
 * @param array $options Key has the option name, value the option value.
 */
function relevanssi_import_options( $options ) {
	$unserialized = json_decode( stripslashes( $options ) );
	foreach ( $unserialized as $key => $value ) {
		if ( in_array( $key, array( 'relevanssi_post_type_weights', 'relevanssi_recency_bonus', 'relevanssi_punctuation' ), true ) ) {
			// The options are associative arrays that are translated to objects in JSON and need to be changed back to arrays.
			$value = (array) $value;
		}
		update_option( $key, $value );
	}

	echo "<div id='relevanssi-warning' class='updated fade'>" . esc_html__( 'Options updated!', 'relevanssi' ) . '</div>';
}

/**
 * Updates Relevanssi Premium options.
 *
 * @global array $relevanssi_variables Relevanssi global variables, used to access the plugin file name.
 *
 * Reads in the options from $_REQUEST and updates the correct options, depending on which tab has been active.
 */
function relevanssi_update_premium_options() {
	global $relevanssi_variables;
	check_admin_referer( plugin_basename( $relevanssi_variables['file'] ), 'relevanssi_options' );

	$request = $_REQUEST; // WPCS: Input var okay.

	if ( ! isset( $request['tab'] ) ) {
		$request['tab'] = '';
	}

	if ( isset( $request['relevanssi_link_boost'] ) ) {
		$boost = floatval( $request['relevanssi_link_boost'] );
		update_option( 'relevanssi_link_boost', $boost );
	}

	if ( empty( $request['relevanssi_api_key'] ) ) {
		unset( $request['relevanssi_api_key'] );
	}

	if ( 'overview' === $request['tab'] ) {
		if ( ! isset( $request['relevanssi_hide_post_controls'] ) ) {
			$request['relevanssi_hide_post_controls'] = 'off';
		}
		if ( ! isset( $request['relevanssi_show_post_controls'] ) ) {
			$request['relevanssi_show_post_controls'] = 'off';
		}
	}

	if ( 'indexing' === $request['tab'] ) {
		if ( ! isset( $request['relevanssi_index_users'] ) ) {
			$request['relevanssi_index_users'] = 'off';
		}

		if ( ! isset( $request['relevanssi_index_synonyms'] ) ) {
			$request['relevanssi_index_synonyms'] = 'off';
		}

		if ( ! isset( $request['relevanssi_index_taxonomies'] ) ) {
			$request['relevanssi_index_taxonomies'] = 'off';
		}

		if ( ! isset( $request['relevanssi_index_subscribers'] ) ) {
			$request['relevanssi_index_subscribers'] = 'off';
		}

		if ( ! isset( $request['relevanssi_index_pdf_parent'] ) ) {
			$request['relevanssi_index_pdf_parent'] = 'off';
		}
	}

	if ( 'attachments' === $request['tab'] ) {
		if ( ! isset( $request['relevanssi_read_new_files'] ) ) {
			$request['relevanssi_read_new_files'] = 'off';
		}

		if ( ! isset( $request['relevanssi_send_pdf_files'] ) ) {
			$request['relevanssi_send_pdf_files'] = 'off';
		}

		if ( ! isset( $request['relevanssi_link_pdf_files'] ) ) {
			$request['relevanssi_link_pdf_files'] = 'off';
		}
	}

	if ( 'searching' === $request['tab'] ) {
		if ( isset( $request['relevanssi_recency_bonus'] ) && isset( $request['relevanssi_recency_days'] ) ) {
			$relevanssi_recency_bonus          = array();
			$relevanssi_recency_bonus['bonus'] = floatval( $request['relevanssi_recency_bonus'] );
			$relevanssi_recency_bonus['days']  = intval( $request['relevanssi_recency_days'] );
			update_option( 'relevanssi_recency_bonus', $relevanssi_recency_bonus );
		}

		if ( ! isset( $request['relevanssi_searchblogs_all'] ) ) {
			$request['relevanssi_searchblogs_all'] = 'off';
		}
	}

	if ( 'logging' === $request['tab'] ) {
		if ( ! isset( $request['relevanssi_hide_branding'] ) ) {
			$request['relevanssi_hide_branding'] = 'off';
		}
	}

	if ( 'excerpts' === $request['tab'] ) {
		if ( ! isset( $request['relevanssi_highlight_docs_external'] ) ) {
			$request['relevanssi_highlight_docs_external'] = 'off';
		}
	}

	if ( isset( $request['relevanssi_remove_api_key'] ) ) {
		update_option( 'relevanssi_api_key', '' );
	}
	if ( isset( $request['relevanssi_api_key'] ) ) {
		$value = sanitize_text_field( wp_unslash( $request['relevanssi_api_key'] ) );
		update_option( 'relevanssi_api_key', $value );
	}
	if ( isset( $request['relevanssi_highlight_docs_external'] ) ) {
		'off' !== $request['relevanssi_highlight_docs_external'] ? $value = 'on' : $value = 'off';
		$value = 'off';
		if ( 'off' !== $request['relevanssi_read_new_files'] ) {
			$value = 'on';
		}
		update_option( 'relevanssi_highlight_docs_external', $value );
	}
	if ( isset( $request['relevanssi_index_synonyms'] ) ) {
		$value = 'off';
		if ( 'off' !== $request['relevanssi_index_synonyms'] ) {
			$value = 'on';
		}
		update_option( 'relevanssi_index_synonyms', $value );
	}
	if ( isset( $request['relevanssi_index_users'] ) ) {
		$value = 'off';
		if ( 'off' !== $request['relevanssi_index_users'] ) {
			$value = 'on';
		}
		update_option( 'relevanssi_index_users', $value );
	}
	if ( isset( $request['relevanssi_index_subscribers'] ) ) {
		$value = 'off';
		if ( 'off' !== $request['relevanssi_index_subscribers'] ) {
			$value = 'on';
		}
		update_option( 'relevanssi_index_subscribers', $value );
	}
	if ( isset( $request['relevanssi_index_user_fields'] ) ) {
		$value = sanitize_text_field( wp_unslash( $request['relevanssi_index_user_fields'] ) );
		update_option( 'relevanssi_index_user_fields', $value );
	}
	if ( isset( $request['relevanssi_internal_links'] ) ) {
		$value = sanitize_text_field( wp_unslash( $request['relevanssi_internal_links'] ) );
		update_option( 'relevanssi_internal_links', $value );
	}
	if ( isset( $request['relevanssi_hide_branding'] ) ) {
		$value = 'off';
		if ( 'off' !== $request['relevanssi_hide_branding'] ) {
			$value = 'on';
		}
		update_option( 'relevanssi_hide_branding', $value );
	}
	if ( isset( $request['relevanssi_hide_post_controls'] ) ) {
		$value = 'off';
		if ( 'off' !== $request['relevanssi_hide_post_controls'] ) {
			$value = 'on';
		}
		update_option( 'relevanssi_hide_post_controls', $value );
	}
	if ( isset( $request['relevanssi_show_post_controls'] ) ) {
		$value = 'off';
		if ( 'off' !== $request['relevanssi_show_post_controls'] ) {
			$value = 'on';
		}
		update_option( 'relevanssi_show_post_controls', $value );
	}
	if ( isset( $request['relevanssi_index_taxonomies'] ) ) {
		$value = 'off';
		if ( 'off' !== $request['relevanssi_index_taxonomies'] ) {
			$value = 'on';
		}
		update_option( 'relevanssi_index_taxonomies', $value );
	}
	if ( isset( $request['relevanssi_thousand_separator'] ) ) {
		$value = sanitize_text_field( wp_unslash( $request['relevanssi_thousand_separator'] ) );
		update_option( 'relevanssi_thousand_separator', $value );
	}
	if ( isset( $request['relevanssi_disable_shortcodes'] ) ) {
		$value = sanitize_text_field( wp_unslash( $request['relevanssi_disable_shortcodes'] ) );
		update_option( 'relevanssi_disable_shortcodes', $value );
	}
	if ( isset( $request['relevanssi_mysql_columns'] ) ) {
		$value = sanitize_text_field( wp_unslash( $request['relevanssi_mysql_columns'] ) );
		update_option( 'relevanssi_mysql_columns', $value );
	}
	if ( isset( $request['relevanssi_searchblogs'] ) ) {
		$value = sanitize_text_field( wp_unslash( $request['relevanssi_searchblogs'] ) );
		update_option( 'relevanssi_searchblogs', $value );
	}
	if ( isset( $request['relevanssi_searchblogs_all'] ) ) {
		$value = 'off';
		if ( 'off' !== $request['relevanssi_searchblogs_all'] ) {
			$value = 'on';
		}
		update_option( 'relevanssi_searchblogs_all', $value );
	}
	if ( isset( $request['relevanssi_read_new_files'] ) ) {
		$value = 'off';
		if ( 'off' !== $request['relevanssi_read_new_files'] ) {
			$value = 'on';
		}
		update_option( 'relevanssi_read_new_files', $value );
	}
	if ( isset( $request['relevanssi_send_pdf_files'] ) ) {
		$value = 'off';
		if ( 'off' !== $request['relevanssi_send_pdf_files'] ) {
			$value = 'on';
		}
		update_option( 'relevanssi_send_pdf_files', $value );
	}
	if ( isset( $request['relevanssi_index_pdf_parent'] ) ) {
		$value = 'off';
		if ( 'off' !== $request['relevanssi_index_pdf_parent'] ) {
			$value = 'on';
		}
		update_option( 'relevanssi_index_pdf_parent', $value );
	}
	if ( isset( $request['relevanssi_link_pdf_files'] ) ) {
		$value = 'off';
		if ( 'off' !== $request['relevanssi_link_pdf_files'] ) {
			$value = 'on';
		}
		update_option( 'relevanssi_link_pdf_files', $value );
	}
	if ( isset( $request['relevanssi_server_location'] ) ) {
		$value = 'us';
		if ( 'eu' === $request['relevanssi_server_location'] ) {
			$value = 'eu';
		}
		update_option( 'relevanssi_server_location', $value );
	}
}

/**
 * Saves Relevanssi metabox data.
 *
 * When a post is saved, this function saves the Relevanssi Post Controls metabox data.
 *
 * @param int $post_id The post ID that is being saved.
 */
function relevanssi_save_postdata( $post_id ) {
	global $relevanssi_variables;
	// Verify if this is an auto save routine.
	// If it is, our form has not been submitted, so we dont want to do anything.
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	// Verify the nonce.
	if ( isset( $_POST['relevanssi_hidepost'] ) ) { // WPCS: input var okey.
		if ( ! wp_verify_nonce( sanitize_key( $_POST['relevanssi_hidepost'] ), plugin_basename( $relevanssi_variables['file'] ) ) ) { // WPCS: input var okey.
			return;
		}
	}

	$post = $_POST; // WPCS: input var okey.

	// If relevanssi_metabox is not set, it's a quick edit.
	if ( ! isset( $post['relevanssi_metabox'] ) ) {
		return;
	}

	// Check permissions.
	if ( isset( $post['post_type'] ) ) {
		if ( 'page' === $post['post_type'] ) {
			if ( ! current_user_can( 'edit_page', $post_id ) ) {
				return;
			}
		} else {
			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				return;
			}
		}
	}

	if ( isset( $post['relevanssi_hide_post'] ) && 'on' === $post['relevanssi_hide_post'] ) {
		$hide = 'on';
	} else {
		$hide = '';
	}

	if ( 'on' === $hide ) {
		// Post is marked hidden, so remove it from the index.
		relevanssi_remove_doc( $post_id );
	}

	if ( 'on' === $hide ) {
		update_post_meta( $post_id, '_relevanssi_hide_post', $hide );
	} else {
		delete_post_meta( $post_id, '_relevanssi_hide_post' );
	}

	if ( isset( $post['relevanssi_pin'] ) ) {
		delete_post_meta( $post_id, '_relevanssi_pin' );
		$pins = explode( ',', sanitize_text_field( wp_unslash( $post['relevanssi_pin'] ) ) );
		foreach ( $pins as $pin ) {
			$pin = trim( $pin );
			add_post_meta( $post_id, '_relevanssi_pin', $pin );
		}
	} else {
		delete_post_meta( $post_id, '_relevanssi_pin' );
	}

	if ( isset( $post['relevanssi_unpin'] ) ) {
		delete_post_meta( $post_id, '_relevanssi_unpin' );
		$pins = explode( ',', sanitize_text_field( wp_unslash( $post['relevanssi_pin'] ) ) );
		foreach ( $pins as $pin ) {
			$pin = trim( $pin );
			add_post_meta( $post_id, '_relevanssi_unpin', $pin );
		}
	} else {
		delete_post_meta( $post_id, '_relevanssi_unpin' );
	}
}

/**
 * Adds the network level menu for Relevanssi Premium.
 *
 * @global array $relevanssi_variables The Relevanssi variables array, used for the plugin file name.
 */
function relevanssi_network_menu() {
	global $relevanssi_variables;
	RELEVANSSI_PREMIUM ? $name = 'Relevanssi Premium' : $name = 'Relevanssi';
	add_menu_page(
		$name,
		$name,
		/**
		 * Capability required to see the Relevanssi network options.
		 *
		 * The capability level required to see the Relevanssi Premium network options.
		 *
		 * @since Unknown
		 *
		 * @param string $capability The capability required. Default 'manage_options'.
		 */
		apply_filters( 'relevanssi_options_capability', 'manage_options' ),
		$relevanssi_variables['file'],
		'relevanssi_network_options'
	);
}

/**
 * Prints out the Relevanssi Premium network options.
 *
 * @global array $relevanssi_variables The Relevanssi variables array, used for the plugin file name.
 */
function relevanssi_network_options() {
	global $relevanssi_variables;

	echo sprintf( '<div class="wrap"><h2>%s</h2>', esc_html__( 'Relevanssi network options', 'relevanssi' ) );

	if ( ! empty( $_POST ) ) { // WPCS: Input var okay.
		if ( isset( $_REQUEST['submit'] ) ) { // WPCS: Input var okay.
			check_admin_referer( plugin_basename( $relevanssi_variables['file'] ), 'relevanssi_network_options' );
			relevanssi_update_network_options();
		}
		if ( isset( $_REQUEST['copytoall'] ) ) { // WPCS: Input var okay.
			check_admin_referer( plugin_basename( $relevanssi_variables['file'] ), 'relevanssi_network_options' );
			relevanssi_copy_options_to_subsites( $_REQUEST ); // WPCS: Input var okay.
		}
	}

	$this_page = '?page=relevanssi/relevanssi.php';
	if ( RELEVANSSI_PREMIUM ) {
		$this_page = '?page=relevanssi-premium/relevanssi.php';
	}

	echo sprintf( "<form method='post' action='admin.php%s'>", esc_attr( $this_page ) );

	wp_nonce_field( plugin_basename( $relevanssi_variables['file'] ), 'relevanssi_network_options' );

	$api_key = get_site_option( 'relevanssi_api_key' );

?>
	<table class="form-table">
<?php
	relevanssi_form_api_key( $api_key );
?>
	</table>
	<input type='submit' name='submit' value='<?php esc_attr_e( 'Save the options', 'relevanssi' ); ?>' class='button button-primary' />
</form>

<h2><?php esc_html_e( 'Copy options from one site to other sites', 'relevanssi' ); ?></h2>
<p><?php esc_html_e( "Choose a blog and copy all the options from that blog to all other blogs that have active Relevanssi Premium. Be careful! There's no way to undo the procedure!", 'relevanssi' ); ?></p>

<form id='copy_config' method='post' action='admin.php?page=relevanssi-premium/relevanssi.php'>
<?php wp_nonce_field( plugin_basename( $relevanssi_variables['file'] ), 'relevanssi_network_options' ); ?>

<table class="form-table">
<tr>
	<th scope="row"><?php esc_html_e( 'Copy options', 'relevanssi' ); ?></th>
	<td>
	<?php

	$raw_blog_list = get_sites( array( 'number' => 2000 ) );
	$blog_list     = array();
	foreach ( $raw_blog_list as $blog ) {
		$details                         = get_blog_details( $blog->blog_id );
		$blog_list[ $details->blogname ] = $blog->blog_id;
	}
	ksort( $blog_list );
	echo "<select id='sourceblog' name='sourceblog'>";
	foreach ( $blog_list as $name => $id ) {
		echo "<option value='" . esc_attr( $id ) . "'>" . esc_html( $name ) . '</option>';
	}
	echo '</select>';

?>
	<input type='submit' name='copytoall' value='<?php esc_attr_e( 'Copy options to all other subsites', 'relevanssi' ); ?>' class='button button-primary' />
	</td>
</tr>
</table>
</form>
</div>
<?php
}

/**
 * Saves the network options.
 *
 * @global array $relevanssi_variables Relevanssi global variables, used to check the plugin file name.
 *
 * Saves the Relevanssi Premium network options.
 */
function relevanssi_update_network_options() {
	global $relevanssi_variables;

	if ( empty( $_REQUEST['relevanssi_api_key'] ) ) { // WPCS: Input var okay, CSRF ok. Nonce verification done before this function.
		unset( $_REQUEST['relevanssi_api_key'] ); // WPCS: Input var okay.
	}

	if ( isset( $_REQUEST['relevanssi_remove_api_key'] ) ) { // WPCS: Input var okay, CSRF ok.
		update_site_option( 'relevanssi_api_key', '' );
	}
	if ( isset( $_REQUEST['relevanssi_api_key'] ) ) { // WPCS: Input var okay, CSRF ok.
		$value = sanitize_text_field( wp_unslash( $_REQUEST['relevanssi_api_key'] ) ); // WPCS: Input var okay, CSRF ok.
		update_site_option( 'relevanssi_api_key', $value );
	}
}

/**
 * Copies options from one subsite to other subsites.
 *
 * @global $wpdb The WordPress database interface.
 *
 * @param array $data Copy parameters.
 */
function relevanssi_copy_options_to_subsites( $data ) {
	if ( ! isset( $data['sourceblog'] ) ) {
		return;
	}
	$sourceblog = $data['sourceblog'];
	if ( ! is_numeric( $sourceblog ) ) {
		return;
	}
	$sourceblog = esc_sql( $sourceblog );

	/* translators: %s has the source blog ID */
	printf( '<h2>' . esc_html__( 'Copying options from blog %s', 'relevanssi' ) . '</h2>', esc_html( $sourceblog ) );
	global $wpdb;
	switch_to_blog( $sourceblog );
	$q = "SELECT * FROM $wpdb->options WHERE option_name LIKE 'relevanssi%'";
	restore_current_blog();

	$results = $wpdb->get_results( $q ); // WPCS: unprepared SQL ok.

	$blog_list = get_sites( array( 'number' => 2000 ) );
	foreach ( $blog_list as $blog ) {
		if ( $blog->blog_id === $sourceblog ) {
			continue;
		}
		switch_to_blog( $blog->blog_id );

		/* translators: %s is the blog ID */
		printf( '<p>' . esc_html__( 'Processing blog %s:', 'relevanssi' ) . '<br />', esc_html( $blog->blog_id ) );
		if ( ! is_plugin_active( 'relevanssi-premium/relevanssi.php' ) ) {
			echo esc_html__( 'Relevanssi is not active in this blog.', 'relevanssi' ) . '</p>';
			continue;
		}
		foreach ( $results as $option ) {
			if ( is_serialized( $option->option_value ) ) {
				$value = unserialize( $option->option_value ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions
			} else {
				$value = $option->option_value;
			}
			update_option( $option->option_name, $value );
		}
		echo esc_html__( 'Options updated.', 'relevanssi' ) . '</p>';
		restore_current_blog();
	}
}
