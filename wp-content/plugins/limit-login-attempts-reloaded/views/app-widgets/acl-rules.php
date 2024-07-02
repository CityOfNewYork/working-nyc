<?php
if( !defined( 'ABSPATH' ) ) exit();
?>

<div class="llar-app-acl-rules">
	<div class="app-rules-col">
        <div class="llar-table-header">
            <h3 class="title_page">
                <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/icon-grow-clients.png">
                <?php _e( 'Login Access Rules', 'limit-login-attempts-reloaded' ); ?>
            </h3>
            <span class="help-link">
                <a href="https://www.limitloginattempts.com/access-rules-explained/" class="link__style_unlink" target="_blank">
                    <?php _e( 'Documentation', 'limit-login-attempts-reloaded' ); ?>
                </a>
            </span>
        </div>

        <div class="llar-preloader-wrap login-rules">
            <div class="llar-table-scroll-wrap llar-app-login-access-rules-infinity-scroll">
                <table class="llar-form-table llar-app-login-access-rules-table">
                    <thead>
                        <tr>
                            <th scope="col"><?php _e( 'Pattern', 'limit-login-attempts-reloaded' ); ?></th>
                            <th scope="col"><?php _e( 'Rule', 'limit-login-attempts-reloaded' ); ?></th>
                            <th class="llar-app-acl-action-col" scope="col"><?php _e( 'Action', 'limit-login-attempts-reloaded' ); ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input class="input_border regular-text llar-app-acl-pattern"
                                       type="text" placeholder="<?php esc_attr_e( 'Pattern', 'limit-login-attempts-reloaded' ); ?>">
                            </td>
                            <td>
                                <select class="input_border llar-app-acl-rule">
                                    <option value="deny" selected><?php esc_html_e( 'Deny',  'limit-login-attempts-reloaded' ); ?></option>
                                    <option value="allow"><?php esc_html_e( 'Allow',  'limit-login-attempts-reloaded' ); ?></option>
                                    <option value="pass"><?php esc_html_e( 'Pass',  'limit-login-attempts-reloaded' ); ?></option>
                                </select>
                            </td>
                            <td class="llar-app-acl-action-col">
                                <button class="button menu__item col button__transparent_orange llar-app-acl-add-rule" data-type="login">
                                    <?php _e( 'Add', 'limit-login-attempts-reloaded' ); ?>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
	</div>


	<div class="app-rules-col">
        <div class="llar-table-header">
            <h3 class="title_page">
                <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/icon-ip.png">
                <?php _e( 'IP Access Rules', 'limit-login-attempts-reloaded' ); ?>
            </h3>
            <span class="help-link">
                <a href="https://www.limitloginattempts.com/access-rules-explained/" class="link__style_unlink" target="_blank">
                    <?php _e( 'Documentation', 'limit-login-attempts-reloaded' ); ?>
                </a>
            </span>
        </div>

        <div class="llar-preloader-wrap ip-rules">
            <div class="llar-table-scroll-wrap llar-app-ip-access-rules-infinity-scroll">
                <table class="llar-form-table llar-app-ip-access-rules-table">
                    <thead>
                        <tr>
                            <th scope="col"><?php _e( 'Pattern', 'limit-login-attempts-reloaded' ); ?></th>
                            <th scope="col"><?php _e( 'Rule', 'limit-login-attempts-reloaded' ); ?></th>
                            <th class="llar-app-acl-action-col" scope="col"><?php _e( 'Action', 'limit-login-attempts-reloaded' ); ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input class="input_border regular-text llar-app-acl-pattern"
                                       type="text" placeholder="<?php esc_attr_e( 'Pattern', 'limit-login-attempts-reloaded' ); ?>">
                            </td>
                            <td>
                                <select class="input_border llar-app-acl-rule">
                                    <option value="deny" selected><?php esc_html_e( 'Deny',  'limit-login-attempts-reloaded' ); ?></option>
                                    <option value="allow"><?php esc_html_e( 'Allow',  'limit-login-attempts-reloaded' ); ?></option>
                                    <option value="pass"><?php esc_html_e( 'Pass',  'limit-login-attempts-reloaded' ); ?></option>
                                </select>
                            </td>
                            <td class="llar-app-acl-action-col">
                                <button class="button menu__item col button__transparent_orange llar-app-acl-add-rule" data-type="ip">
                                    <?php _e( 'Add', 'limit-login-attempts-reloaded' ); ?>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
	</div>
</div>

<script type="text/javascript">
    ;(function($){

        $(document).ready(function () {

            var $app_acl_rules = $('.llar-app-acl-rules'),
                $infinity_box1 = $('.llar-app-login-access-rules-infinity-scroll'),
                $infinity_box2 = $('.llar-app-ip-access-rules-infinity-scroll'),
                $login_preloader_wrap = $('.llar-preloader-wrap.login-rules'),
                $ip_preloader_wrap = $('.llar-preloader-wrap.ip-rules'),
                loading_data1 = false,
                loading_data2 = false,
                page_offset1 = '',
                page_offset2 = '',
                page_limit = 10;

            $infinity_box1.on('scroll', function () {

                if (!loading_data1 && $infinity_box1.get(0).scrollTop + $infinity_box1.get(0).clientHeight >= $infinity_box1.get(0).scrollHeight - 1) {
                    load_rules_data('login');
                }
            });

            $infinity_box2.on('scroll', function () {

                if (!loading_data2 && $infinity_box2.get(0).scrollTop + $infinity_box2.get(0).clientHeight >= $infinity_box2.get(0).scrollHeight - 1) {
                    load_rules_data('ip');
                }
            });

            load_rules_data('login');
            load_rules_data('ip');

            $('.llar-global-reload-btn').on('click', function() {
                page_offset1 = '';
                page_offset2 = '';
                $app_acl_rules.find('tbody > tr').remove();
                load_rules_data('login');
                load_rules_data('ip');
            });

            $app_acl_rules.on('click', '.llar-app-acl-remove', function(e) {
                    e.preventDefault();

                    if(!confirm('Are you sure?')) {
                        return false;
                    }

                    var $this = $(this),
                        pattern = $this.data('pattern');

                    if(!pattern) {

                        console.log('Wrong pattern');
                        return false;
                    }

                    if($this.data('type') === 'ip') {
                        $ip_preloader_wrap.addClass('loading');
                    } else {
                        $login_preloader_wrap.addClass('loading');
                    }

                    $.post(ajaxurl, {
                        action: 'app_acl_remove_rule',
                        pattern: pattern,
                        type: $this.data('type'),
                        sec: '<?php echo esc_js( wp_create_nonce( "llar-app-acl-remove-rule" ) ); ?>'
                    }, function(response){

                        if($this.data('type') === 'ip') {
                            $ip_preloader_wrap.removeClass('loading');
                        } else {
                            $login_preloader_wrap.removeClass('loading');
                        }

                        if(response.success) {

                            $this.closest('tr').fadeOut(300, function(){
                                $this.closest('tr').remove();
                            })

                        }
                    });
                }).on('click', '.llar-app-acl-add-rule', function(e){
                    e.preventDefault();

                    var $this = $(this),
                        pattern = $this.closest('tr').find('.llar-app-acl-pattern').val().trim(),
                        rule = $this.closest('tr').find('.llar-app-acl-rule').val(),
                        type = $this.data('type');

                    $this.closest('tr').find('.llar-app-acl-pattern').val('');

                    if(!pattern) {

                        alert('Pattern can\'t be empty!');
                        return false;
                    }

                    var row_exist = {};
                    $this.closest('table').find('.rule-pattern').each(function(i, el){
                        var res = el.innerText.localeCompare(pattern);
                        if(res === 0) {
                            row_exist = $(el).closest('tr');
                        }
                    });

                    if(row_exist.length) {

                        $this.closest('tr').find('.llar-app-acl-pattern').val('');
                        row_exist.remove();
                    }

                    if(type === 'ip') {
                        $ip_preloader_wrap.addClass('loading');
                    } else {
                        $login_preloader_wrap.addClass('loading');
                    }

                    $.post(ajaxurl, {
                        action: 'app_acl_add_rule',
                        pattern: pattern,
                        rule: rule,
                        type: type,
                        sec: '<?php echo esc_js( wp_create_nonce( "llar-app-acl-add-rule" ) ); ?>'
                    }, function(response){

                        if(type === 'ip') {
                            $ip_preloader_wrap.removeClass('loading');
                        } else {
                            $login_preloader_wrap.removeClass('loading');
                        }

                        if(response.success) {

                            $this.closest('table').find('.empty-row').remove();

                            $this.closest('tr').after('<tr class="llar-app-rule-'+rule+'">' +
                                '<td class="rule-pattern">'+pattern+'</td>' +
                                '<td>'+rule+((type === 'ip') ? '<span class="origin">manual</span>' : '')+'</td>' +
                                '<td class="llar-app-acl-action-col" scope="col"><button class="button llar-app-acl-remove" data-type="'+type+'" data-pattern="'+pattern+'"><span class="dashicons dashicons-no"></span></button></td>' +
                                '</tr>');

                        }

                    });

                });

            function load_rules_data(type) {

                if(type === 'login') {

                    if(page_offset1 === false) {
                        return;
                    }

                    $login_preloader_wrap.addClass('loading');

                    loading_data1 = true;
                } else if(type === 'ip') {

                    if(page_offset2 === false) {
                        return;
                    }

                    $ip_preloader_wrap.addClass('loading');
                    loading_data2 = true;
                }


                $.post(ajaxurl, {
                    action: 'app_load_acl_rules',
                    type: type,
                    limit: page_limit,
                    offset: (type === 'login') ? page_offset1 : page_offset2,
                    sec: '<?php echo wp_create_nonce( "llar-app-load-acl-rules" ); ?>'
                }, function(response){

                    if(type === 'ip') {
                        $ip_preloader_wrap.removeClass('loading');
                    } else {
                        $login_preloader_wrap.removeClass('loading');
                    }

                    if(response.success) {

                        $('.llar-app-'+type+'-access-rules-table').find('tbody').append(response.data.html);

                        if(type === 'login') {

                            if(response.data.offset) {
                                page_offset1 = response.data.offset;
                            } else {
                                page_offset1 = false;
                            }

                        } else if(type === 'ip') {

                            if(response.data.offset) {
                                page_offset2 = response.data.offset;
                            } else {
                                page_offset2 = false;
                            }
                        }
                    }

                    if(type === 'login') {

                        loading_data1 = false;
                    } else if(type === 'ip') {

                        loading_data2 = false;
                    }
                });
            }

        });

    })(jQuery);
</script>

