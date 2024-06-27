<?php
/**
 * @param $post_type
 * @param $post
 */
function pmxi_pmxi_extend_options_custom_fields($post_type, $post) {
	if ( ! is_plugin_active('wpai-acf-add-on/wpai-acf-add-on.php') ) {

		global $acf;
		
		$savedGroups = array();

		if ( version_compare($acf->settings['version'], '5.0.0') >= 0 ) {
			$savedGroups = get_posts(array(
				'posts_per_page' => -1,
				'post_type' => 'acf-field-group',
				'order' => 'ASC',
				'orderby' => 'title'
			));
			$groups = [];
			if (function_exists('acf_local')) {
				$groups = acf_local()->groups;
			}
			if (empty($groups) && function_exists('acf_get_local_field_groups')) {
				$groups = acf_get_local_field_groups();
			}
		} else {
			$groups = apply_filters('acf/get_field_groups', array());
		}

		if (!empty($savedGroups)) {
			foreach ($savedGroups as $key => $group) {
				if ( version_compare($acf->settings['version'], '5.0.0') >= 0 ) {
					$groupData = acf_get_field_group($group);
					// Prepare validation rules.
					if (!empty($groupData['location'])) {
						foreach ($groupData['location'] as $i => $locations) {
							foreach ($locations as $j => $location) {
								if ($location['param'] !== 'post_type') {
									unset($groupData['location'][$i][$j]);
								}
							}
						}
					}
					// Only render visible field groups.
					if (in_array($post_type, array('taxonomies', 'import_users')) || acf_get_field_group_visibility($groupData, array('post_type' => $post_type)) || empty($groupData['location'][0])) {
						if (!isset($groups[$group->post_name])) {
							$groups[] = array(
								'ID' => $group->ID,
								'title' => $group->post_title,
								'slug' => $group->post_excerpt
							);
						} else {
							$groups[$group->post_name]['ID'] = $group->ID;
						}
					}
				} else {
					if (!isset($groups[$group->post_name])) {
						$groups[] = array(
							'ID' => $group->ID,
							'title' => $group->post_title,
							'slug' => $group->post_excerpt
						);
					} else {
						$groups[$group->post_name]['ID'] = $group->ID;
					}
				}
			}
		}

		if (!empty($groups)) {
			foreach ($groups as $key => $group) {
				if (empty($group['ID']) && !empty($group['id'])) {
					$groups[$key]['ID'] = $group['id'];
				} elseif (empty($group['ID']) && !empty($group['key'])) {
					$groups[$key]['ID'] = $group['key'];
				}
			}
		}

		require_once WP_ALL_IMPORT_ROOT_DIR . '/views/admin/promotion/acf.php';
	}
}
