<?php

use LLAR\Core\Helpers;

if( !defined( 'ABSPATH' ) ) exit();

$countries_list = Helpers::get_countries_list();
?>

<div class="llar-block-country-wrap" style="display:none;">
    <div class="llar-table-header">
        <h3 class="title_page">
            <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/icon-filter.png">
            <?php _e( 'Country Access Rules', 'limit-login-attempts-reloaded' ); ?>
        </h3>
    </div>
    <div class="llar-preloader-wrap">
        <div class="llar-block-country-section">
            <div class="llar-block-country-selected-wrap">
                <div class="llar-block-country-mode">
                    <span><?php _e( 'these countries:', 'limit-login-attempts-reloaded' ); ?></span>
                </div>
                <div class="llar-block-country-list llar-all-countries-selected"></div>
                <a href="#" class="llar-toggle-countries-list">
                    <?php _e( 'Add', 'limit-login-attempts-reloaded' ); ?>
                </a>
            </div>
            <div class="llar-block-country-list llar-all-countries-list"></div>
        </div>
    </div>
</div>
<script type="text/javascript">
	;(function($){
		const countries = <?php echo json_encode( ( !empty( $countries_list ) ) ? $countries_list : array() ); ?>;
		$(document).ready(function(){

		    var $country_wrap = $('.llar-block-country-wrap'),
                $preloader_wrap = $country_wrap.find('.llar-preloader-wrap');

            $preloader_wrap.addClass('loading');

			$.post(ajaxurl, {
				action: 'app_load_country_access_rules',
				sec: '<?php echo wp_create_nonce( "llar-app-load-country-access-rules" ); ?>'
			}, function(response){

                $preloader_wrap.removeClass('loading');

				if(response.success && response.data.codes) {

				    const rule = response.data.rule || 'deny';

				    $('.llar-block-country-mode').prepend(`<select class="input_border">
                        <option value="deny"`+(rule === 'deny' ? 'selected' : '')+`><?php esc_html_e( 'Deny', 'limit-login-attempts-reloaded' ); ?></option>
                        <option value="allow"`+(rule === 'allow' ? 'selected' : '')+`><?php esc_html_e( 'Allow only', 'limit-login-attempts-reloaded' ); ?></option>
                    </select>`);

					let selected_countries = '';
					let all_countries = '';

                    for(const code in countries) {

                    	const is_selected = response.data.codes.includes(code);

                    	if(is_selected) {
							selected_countries += `<div class="llar-country" data-country="${countries[code]}"><label><input type="checkbox" value="${code}" checked>${countries[code]}</label></div>`;
                        }

						all_countries += `<div class="llar-country llar-country-${code}"`+(is_selected ? ` style="display:none;"` : ``)+`><label><input type="checkbox" value="${code}">${countries[code]}</label></div>`;
                    }

					$('.llar-all-countries-selected').html(selected_countries);
					$('.llar-all-countries-list').html(all_countries);
					$country_wrap.show();
				}
			});

			$('.llar-toggle-countries-list').on('click', function(e){
				e.preventDefault();

				$('.llar-all-countries-list').toggleClass('visible');
			})

			$('.llar-block-country-list').on('change', 'input[type="checkbox"]', function(){

                $preloader_wrap.addClass('loading');

				const $this = $(this);
				const is_checked = $this.prop('checked');
				const country_code = $this.val();

				if(!is_checked) {
					$('.llar-all-countries-list').find('.llar-country-'+country_code).replaceWith(`<div class="llar-country llar-country-${country_code}"><label><input type="checkbox" value="${country_code}">${countries[country_code]}</label></div>`);
					$(this).closest('.llar-country').remove();
				} else {

					$this.closest('.llar-country').hide();

					const $selected_countries_div = $('.llar-all-countries-selected');

					$selected_countries_div.append(`<div class="llar-country" data-country="${countries[country_code]}"><label><input type="checkbox" value="${country_code}" checked>${countries[country_code]}</label></div>`);

					const sort_items = $selected_countries_div.find('.llar-country').get();

					sort_items.sort(function(a, b) {
						return $(a).attr('data-country').toUpperCase().localeCompare($(b).attr('data-country').toUpperCase());
					});

					$.each(sort_items, function(index, item) {
						$selected_countries_div.append(item);
					});

                }

				$.post(ajaxurl, {
					action: 'app_toggle_country',
					code: country_code,
					type: (is_checked) ? 'add' : 'remove',
					sec: '<?php echo wp_create_nonce( "llar-app-toggle-country" ); ?>'
				}, function(response){

                    $preloader_wrap.removeClass('loading');
				});
			})

            $('.llar-block-country-mode').on('change', 'select', function(){

                $preloader_wrap.addClass('loading');

				const $this = $(this);

				$.post(ajaxurl, {
					action: 'app_country_rule',
					rule: $this.val(),
					sec: '<?php echo wp_create_nonce( "llar-app-country-rule" ); ?>'
				}, function(response){

                    $preloader_wrap.removeClass('loading');
				});
			})

		});
	})(jQuery)
</script>
