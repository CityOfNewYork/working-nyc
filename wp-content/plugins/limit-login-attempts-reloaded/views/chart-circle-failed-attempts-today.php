<?php
/**
 * Chart circle failed attempts today
 *
 * @var string $active_app
 * @var string $setup_code
 * @var string $is_active_app_custom
 * @var bool|mixed $api_stats
 * @var bool|string $is_exhausted
 * @var string $block_sub_group
 * @var string $upgrade_premium_url
 *
 */

use LLAR\Core\Config;
use LLAR\Core\Helpers;

$retries_chart_title = '';
$retries_chart_desc  = '';
$retries_chart_color = '';
$retries_count       = 0;

if ( ! $is_active_app_custom ) {

	$retries_stats = Config::get( 'retries_stats' );

	if ( $retries_stats ) {
		foreach ( $retries_stats as $key => $count ) {
			if ( is_numeric( $key ) && $key > strtotime( '-24 hours' ) ) {
				$retries_count += $count;
			}
            elseif( !is_numeric( $key ) && date_i18n( 'Y-m-d' ) === $key ) {
				$retries_count += $count;
			}
		}
	}

	if ( $retries_count === 0 ) {

		$retries_chart_title = __( 'Hooray! Zero failed login attempts (past 24 hrs)', 'limit-login-attempts-reloaded' );
		$retries_chart_color = '#97F6C8';
	}
	else if ( $retries_count < 100 ) {

		$retries_chart_title = sprintf( _n( '%d failed login attempt ', '%d failed login attempts ', $retries_count, 'limit-login-attempts-reloaded' ), $retries_count );
		$retries_chart_title .= __( '(past 24 hrs)', 'limit-login-attempts-reloaded' );
		$retries_chart_desc = __( 'Your site is currently at a low risk for brute force activity', 'limit-login-attempts-reloaded' );
		$retries_chart_color = '#FFCC66';
	} else {

		$retries_chart_title = __( 'Warning: Your site has experienced over 100 failed login attempts in the past 24 hours', 'limit-login-attempts-reloaded' );

		if ( ! empty( $setup_code ) ) {
			$retries_chart_desc = sprintf(
				__( 'Based on your level of brute force activity, we recommend <a href="%s" class="llar_orange" target="_blank">upgrading to premium</a> to access features to reduce failed logins and improve site performance.', 'limit-login-attempts-reloaded' ),
				$upgrade_premium_url );
		} else {
			$retries_chart_desc = sprintf(
				__( 'Based on your level of brute force activity, we recommend <a class="llar_orange %s">free Micro Cloud upgrade</a> to access features to reduce failed logins and improve site performance.', 'limit-login-attempts-reloaded' ),
				'button_micro_cloud' );
        }

		$retries_chart_color = '#FF6633';
	}

} else {

	if ( $api_stats && ! empty( $api_stats['attempts']['count'] ) ) {
		$retries_count = (int) end( $api_stats['attempts']['count'] );
	}

	if ( $is_exhausted && $block_sub_group === 'Micro Cloud' ) {

		if ( $retries_count === 0 ) {
			$retries_chart_title = __( 'Hooray! Zero failed login attempts (past 24 hrs)', 'limit-login-attempts-reloaded' );
			$retries_chart_color = '#97F6C8';

        } elseif ( $retries_count < 100 ) {
			$retries_chart_title = sprintf( _n( '%d failed login attempt ', '%d failed login attempts ', $retries_count, 'limit-login-attempts-reloaded' ), $retries_count );
			$retries_chart_title .= __( '(past 24 hrs)', 'limit-login-attempts-reloaded' );
			$retries_chart_desc = __( 'Your site is currently at a low risk for brute force activity', 'limit-login-attempts-reloaded' );
			$retries_chart_color = '#FFCC66';

        } else {
			$upgrade_premium_url = ! empty ( $upgrade_premium_url ) ? $upgrade_premium_url : '';
			$retries_chart_desc = sprintf(
				__( 'Based on your level of brute force activity, we recommend <a href="%s" class="llar_orange" target="_blank">upgrading to premium</a> to access features to reduce failed logins and improve site performance.', 'limit-login-attempts-reloaded' ),
				$upgrade_premium_url );
			$retries_chart_color = '#FF6633';
        }

    } else {
		$retries_chart_title = __( 'Failed Login Attempts Today', 'limit-login-attempts-reloaded' );
		$retries_chart_color = '#97F6C8';
    }
}
?>

<div class="section-title__new">
	<?php if ( isset( $is_tab_dashboard ) && $is_tab_dashboard ) : ?>
        <span class="llar-label">
            <?php _e( 'Failed Login Attempts', 'limit-login-attempts-reloaded' ); ?>
            <span class="hint_tooltip-parent">
                <span class="dashicons dashicons-editor-help"></span>
                <div class="hint_tooltip">
                    <div class="hint_tooltip-content">
                        <?php $is_active_app_custom
	                        ? esc_attr_e( 'An IP that hasn\'t been previously denied by the cloud app, but has made an unsuccessful login attempt on your website.', 'limit-login-attempts-reloaded' )
	                       : esc_attr_e( 'An IP that has made an unsuccessful login attempt on your website.', 'limit-login-attempts-reloaded' );
                        ?>
                    </div>
                </div>
            </span>
        </span>
	<?php else : ?>
        <span class="llar-label__url">
        </span>
	<?php endif; ?>
	<?php echo ( $is_active_app_custom && ! $is_exhausted )
		? '<span class="llar-premium-label"><span class="dashicons dashicons-saved"></span>' . __( 'Cloud protection enabled', 'limit-login-attempts-reloaded' ) . '</span>'
		: ''; ?>
</div>
<div class="section-content">
    <div class="chart">
        <div class="doughnut-chart-wrap">
            <canvas id="llar-attack-velocity-chart"></canvas>
        </div>
        <span class="llar-retries-count"><?php echo esc_html( Helpers::short_number( $retries_count ) ); ?></span>
    </div>
</div>

<script type="text/javascript">
    ( function() {

        var ctx = document.getElementById( 'llar-attack-velocity-chart' ).getContext( '2d' );

        // Add a shadow on the graph
        let shadow_fill = ctx.fill;
        ctx.fill = function () {
            ctx.save();
            ctx.shadowColor = '<?php echo esc_js( $retries_chart_color ) ?>';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 3;
            shadow_fill.apply( this, arguments )
            ctx.restore();
        };

        let llar_retries_chart = new Chart( ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [1],
                    value: <?php echo esc_js( $retries_count ); ?>,
                    backgroundColor: ['<?php echo esc_js( $retries_chart_color ); ?>'],
                    borderWidth: 0,
                }]
            },
            options: {
                layout: {
                    padding: {
                        bottom: 10,
                    },
                },
                responsive: true,
                cutout: 65,
                title: {
                    display: false,
                },
                plugins: {
                    tooltip: {
                        enabled: false,
                    }
                },
            }
        } );

    } )();
</script>
<div class="title<?php echo $active_app !== 'local' ? ' title-big' : ''?>"><?php echo esc_html( $retries_chart_title ); ?></div>
<div class="desc"><?php echo $retries_chart_desc; ?></div>

