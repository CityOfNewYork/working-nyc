<?php
/**
 * Dashboard
 *
 * @var string $setup_code
 * @var bool $is_active_app_custom
 * @var string $upgrade_premium_url
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

$limit = 10;
?>

<?php if ( isset( $is_tab_dashboard ) && $is_tab_dashboard ) :

    $limit = 5; ?>

    <div class="section-title__new">
        <div class="title">
			<?php _e( 'Successful Login Attempts', 'limit-login-attempts-reloaded' ) ?>
        </div>
        <div class="view">
            <a class="link__style_unlink llar_turquoise" href="/wp-admin/admin.php?page=limit-login-attempts&tab=logs-custom">
		        <?php _e( ' View more', 'limit-login-attempts-reloaded' ) ?>
            </a>
        </div>
    </div>

<?php else : ?>

    <div class="llar-table-header">
        <h3 class="title_page">
            <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/icon-help.png">
	        <?php _e( 'Successful Login Attempts', 'limit-login-attempts-reloaded' ) ?>
        </h3>
    </div>

<?php endif ?>

<div class="section-content">
    <div class="llar-table-scroll-wrap llar-app-login-infinity-scroll">
        <table class="llar-form-table llar-table-app-login">
            <thead>
                <tr>
                    <th scope="col"><?php _e( "Time", 'limit-login-attempts-reloaded' ); ?></th>
                    <th scope="col"><?php _e( "Login", 'limit-login-attempts-reloaded' ); ?></th>
                    <th scope="col"><?php _e( "IP", 'limit-login-attempts-reloaded' ); ?></th>
                    <th scope="col"><?php _e( "Role", 'limit-login-attempts-reloaded' ); ?></th>
                </tr>
            </thead>
            <tbody class="login-attempts"></tbody>
            <?php if ( empty( $is_tab_dashboard ) ) : ?>
                <tfoot class="table-inline-preloader">
                    <tr>
                        <td colspan="100%">
                            <div class="load-more-button"><a href="#">
                                    <?php _e( "Load older events", 'limit-login-attempts-reloaded' ); ?>
                                </a>
                            </div>
                            <div class="preloader-row">
                                <span class="preloader-icon"></span>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            <?php endif ?>
        </table>
    </div>
</div>

<?php if ( ! $is_active_app_custom ) : ?>

    <?php $app_custom = 'false'; ?>

    <div class="llar-blur-block">
        <div class="llar-blur-block-text">
            <img src="<?php echo LLA_PLUGIN_URL ?>assets/css/images/icon-block.png">
            <div class="title">
                <?php _e('View a complete history of successful logins for your WordPress account', 'limit-login-attempts-reloaded'); ?>
            </div>
            <div class="description">
	            <?php _e('All logs are stored in the cloud to ensure malicious users are unable to delete or manipulate site login data.', 'limit-login-attempts-reloaded'); ?>
            </div>
            <div class="footer">
	            <?php if ( ! empty ( $setup_code ) ) :
		            $text_no_custom = __( 'This feature is only available for<br><a class="link__style_unlink llar_turquoise" href="%s">Premium</a> users.', 'limit-login-attempts-reloaded' );
	            else:
		            $text_no_custom = __( 'This feature is only available for<br><a class="link__style_unlink llar_turquoise" href="%s">Premium</a> and <a class="link__style_unlink llar_turquoise button_micro_cloud">Micro Cloud (FREE!)</a> users.', 'limit-login-attempts-reloaded' );
	            endif ?>
	            <?php echo sprintf(
		            $text_no_custom,
		            '/wp-admin/admin.php?page=limit-login-attempts&tab=premium'
	            ); ?>
            </div>
        </div>
    </div>
<?php else : ?>

    <?php $app_custom = 'true'; ?>
<?php endif; ?>


<script type="text/javascript">
    ;(function($){

        $(document).ready(function () {

            let $log_table_body = $('.llar-table-app-login tbody'),
                $preloader = $log_table_body.next('.table-inline-preloader'),
                $load_more_btn = $preloader.find('.load-more-button a'),
                login_button_open = '.llar-add-login-open',
                loading_data = false,
                page_offset = '',
                page_limit = '<?php echo esc_js( $limit ) ?>',
                total_loaded = 0;

            load_login_data();

            $load_more_btn.on('click', function(e) {
                e.preventDefault();
                total_loaded = 0;
                load_login_data();
            });

            $log_table_body.on('click', login_button_open, function() {

                const dashicons = $( this ).find( '.dashicons' ),
                    dashicons_down = 'dashicons-arrow-down-alt2',
                    dashicons_up = 'dashicons-arrow-up-alt2',
                    parent_tr = $( this ).closest( 'tr' ),
                    hidden_row = parent_tr.next();

                if ( hidden_row.hasClass( 'table-row-open' ) ) {

                    dashicons.removeClass( dashicons_up );
                    dashicons.addClass( dashicons_down );
                    hidden_row.removeClass( 'table-row-open' );
                } else {

                    let iframe = hidden_row.find( '.open_street_map' );

                    if ( ! iframe.hasClass('activated') ) {

                        let latitude = iframe.data( 'latitude' ),
                            longitude = iframe.data( 'longitude' ),
                            height_hidden_row = hidden_row.height(),
                            scc_link = "https://www.openstreetmap.org/export/embed.html?bbox=" +
                                ( longitude * 0.8 ) + "%2C" + ( latitude * 0.8 ) + "%2C" +
                                ( longitude * 1.2 ) + "%2C" + ( latitude * 1.2 ) +
                                "&layer=mapnik&marker=" + latitude + "%2C" + longitude;

                        iframe.attr( 'height', height_hidden_row - 40);
                        iframe.attr( 'src', scc_link );
                        iframe.addClass('activated');
                    }

                    dashicons.removeClass( dashicons_down );
                    dashicons.addClass( dashicons_up );
                    hidden_row.addClass( 'table-row-open' );
                }
            })


            function load_login_data() {

                if ( page_offset === false ) {
                    return;
                }

                $preloader.addClass('loading');
                loading_data = true;

                $.post(ajaxurl, {
                    action:         'app_load_successful_login',
                    offset:         page_offset,
                    limit:          page_limit,
                    custom:         '<?php echo esc_js( $app_custom ); ?>',
                    url_premium:    '<?php echo esc_js( $upgrade_premium_url ); ?>',
                    sec:            '<?php echo wp_create_nonce( "llar-app-load-login" ); ?>'
                }, function(response){

                    $preloader.removeClass('loading');

                    if(response.success) {

                        if(response.data.html) {
                            $log_table_body.append(response.data.html);
                        }

                        total_loaded += response.data.total_items;

                        if(response.data.offset) {
                            page_offset = response.data.offset;

                            if(response.data.total_items < page_limit && total_loaded < page_limit) {

                                load_login_data();
                            }

                        } else {
                            $preloader.addClass('hidden');
                            page_offset = false;
                        }

                        loading_data = false;
                    }
                });
            }

        });

    })(jQuery);
</script>