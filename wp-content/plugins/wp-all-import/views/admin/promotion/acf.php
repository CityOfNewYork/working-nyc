<div class="wpallimport-collapsed closed pmai_options">
	<div class="wpallimport-content-section">
		<div class="wpallimport-collapsed-header">
			<h3><?php _e('Advanced Custom Fields Add-On','wp_all_import_acf_add_on');?></h3>
		</div>
		<div class="wpallimport-collapsed-content" style="padding: 0;">
			<div class="wpallimport-collapsed-content-inner">
                <div class="wpallimport-free-edition-notice" style="text-align:center; margin-top:0; margin-bottom: 40px;">
                    <a href="https://www.wpallimport.com/checkout/?edd_action=add_to_cart&download_id=2707192&edd_options%5Bprice_id%5D=1&utm_source=import-plugin-free&utm_medium=upgrade-notice&utm_campaign=import-acf" target="_blank" class="upgrade_link"><?php _e('ACF Import Add-On required to Import Advanced Custom Fields', 'pmxi_plugin');?></a>
                </div>
				<table class="form-table" style="max-width:none;">
					<tr>
						<td colspan="3">
							<?php if (!empty($groups)): ?>
								<p><strong><?php _e("Please choose your Field Groups.",'wp_all_import_acf_add_on');?></strong></p>
								<ul>
									<?php
									foreach ($groups as $key => $group) {
										$is_show_acf_group = apply_filters('wp_all_import_acf_is_show_group', true, $group);
										?>
										<li>
											<input type="hidden" name="acf[<?php echo esc_attr($group['ID']);?>]" value="<?php echo $is_show_acf_group ? '0' : '1'?>"/>
											<?php if ($is_show_acf_group): ?>
											<input id="acf_<?php echo esc_attr($post_type . '_' . $group['ID']);?>" type="checkbox" name="acf[<?php echo esc_attr($group['ID']);?>]" disabled="disabled" value="1" rel="<?php echo esc_attr($group['ID']);?>" class="pmai_acf_group"/>
											<label for="acf_<?php echo esc_attr($post_type . '_' . $group['ID']); ?>"><?php echo esc_html($group['title']); ?></label>
											<?php endif; ?>
										</li>
										<?php
									}
									?>
								</ul>
								<div class="acf_groups"></div>
								<?php
							else:
								?>
								<p><strong><?php _e("Please create Field Groups.",'wp_all_import_acf_add_on');?></strong></p>
								<?php
							endif;
							?>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</div>