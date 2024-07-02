<?php
/**
 * Chart failed attempts
 *
 * @var string $active_app
 * @var string $is_active_app_custom
 * @var bool|mixed $api_stats
 * @var bool $is_agency
 * @var array $requests
 * @var bool|string $is_exhausted
 *
 */

use LLAR\Core\Config;
use LLAR\Core\Helpers;

$chart2_label = '';
$chart2_labels = array();
$chart2_datasets = array();
$chart2_requests_scale_max = 0;
$chart2_attempts_scale_max = 0;

$chart2__color_attempts = '#58C3FF';
$chart2__color_gradient_attempts = '#58C3FF4D';
$chart2__color_requests = '#AEAEAEB2';
$chart2__color_gradient_requests = '#AEAEAE33';

if ( $is_active_app_custom ) {

	$stats_dates = array();
	$stats_values = array();
	$date_format = trim( get_option( 'date_format' ), ' yY,._:;-/\\' );
	$date_format = str_replace( 'F', 'M', $date_format );

	$attempts_dataset = array(
		'label'             => __( 'Failed Login Attempts', 'limit-login-attempts-reloaded' ),
		'data'              => array(),
		'backgroundColor'   => $chart2__color_gradient_attempts,
		'borderColor'       => $chart2__color_attempts,
		'fill'              => true,
	);

	$requests_dataset = array(
		'label'             => __( 'Requests', 'limit-login-attempts-reloaded' ),
		'data'              => array(),
		'backgroundColor'   => $chart2__color_gradient_requests,
		'borderColor'       => $chart2__color_requests,
		'fill'              => true,
		'yAxisID'           => 'requests',
	);

	if ( $api_stats ) {

		if ( !empty( $api_stats['attempts'] ) ) {

			foreach ( $api_stats['attempts']['at'] as $timestamp ) {

				$stats_dates[] = date( $date_format, $timestamp );
			}

			$chart2_labels = $stats_dates;
			$attempts_dataset['data'] = $api_stats['attempts']['count'];
		}

		if ( !empty( $api_stats['requests'] ) ) {

			$requests_dataset['data'] = $api_stats['requests']['count'];
		}

		if ( !empty( $api_stats['attempts_y'] ) )
			$chart2_attempts_scale_max = (int) $api_stats['attempts_y'];

		if ( !empty( $api_stats['requests_y'] ) )
			$chart2_requests_scale_max = (int) $api_stats['requests_y'];
	}

	$chart2_datasets[] = $attempts_dataset;
	$chart2_datasets[] = $requests_dataset;

} else {

	$date_format = trim( get_option( 'date_format' ), ' yY,._:;-/\\' );
	$date_format = str_replace( 'F', 'M', $date_format );

	$retries_stats = Config::get( 'retries_stats' );

	if ( is_array( $retries_stats ) && $retries_stats ) {
		$key = key( $retries_stats );
		$start = is_numeric( $key ) ? date_i18n( 'Y-m-d', $key ) : $key;

		$daterange = new DatePeriod(
			new DateTime( $start ),
			new DateInterval('P1D'),
			new DateTime('-1 day')
		);

		$retries_per_day = array();
		foreach ( $retries_stats as $key => $count ) {

			$date = is_numeric( $key ) ? date_i18n( 'Y-m-d', $key ) : $key;

			if( empty( $retries_per_day[$date] ) ) {
				$retries_per_day[$date] = 0;
			}

			$retries_per_day[$date] += $count;
		}

		$chart2_data = array();
		foreach ( $daterange as $date ) {
			$chart2_labels[] = $date->format( $date_format );
			$chart2_data[] = ( !empty($retries_per_day[ $date->format("Y-m-d")] ) ) ? $retries_per_day[ $date->format("Y-m-d") ] : 0;
		}
	} else {

		$chart2_labels[] = ( new DateTime())->format( $date_format );
		$chart2_data[] = 0;
	}

	$chart2_datasets[] = array(
		'label' => __( 'Failed Login Attempts', 'limit-login-attempts-reloaded' ),
		'data' => $chart2_data,
	);
}
?>

<div class="section-title__new">
    <div class="llar-label-group">
        <span class="llar-label">
            <span class="llar-label__circle-blue">&bull;</span>
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
		<?php if( $is_active_app_custom ) : ?>
            <span class="llar-label">
                <span class="llar-label__circle-grey">&bull;</span>
                    <?php _e( 'Requests', 'limit-login-attempts-reloaded' ); ?>
                <span class="hint_tooltip-parent">
                    <span class="dashicons dashicons-editor-help"></span>
                    <div class="hint_tooltip">
                        <div class="hint_tooltip-content">
                            <?php esc_attr_e( 'A request is utilized when the cloud validates whether an IP address is allowed to attempt a login, which also includes denied logins.', 'limit-login-attempts-reloaded' ); ?>
                        </div>
                    </div>
                </span>
            </span>
		<?php endif; ?>
    </div>
    <?php if ( ( isset( $is_tab_dashboard ) && $is_tab_dashboard ) && $is_active_app_custom && ! $is_agency ) : ?>
     <span class="llar-label request <?php echo  $is_exhausted  ? 'exhausted' : '' ?>">
         <?php echo ( isset( $requests['usage'], $requests['quota'] ) )
                 ? ( __( 'Monthly Usage: ', 'limit-login-attempts-reloaded' ) . $requests['usage'] . '/' . $requests['quota'] )
                 : '' ?>
     </span>
    <?php endif; ?>
</div>
<div class="section-content">
    <div class="llar-chart-wrap">
        <canvas id="llar-api-requests-chart" style=""></canvas>
    </div>
</div>

<script type="text/javascript">
    (function(){

        var ctx = document.getElementById('llar-api-requests-chart').getContext('2d');

        var llar_stat_chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: <?php echo json_encode( $chart2_labels ); ?>,
                datasets: <?php echo json_encode($chart2_datasets); ?>,
            },
            options: {
                elements: {
                    point: {
                        pointStyle: 'circle',
                        radius: 3.5,
                        pointBackgroundColor: 'white',
                        pointBorderWidth: 1.5,
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                return context.raw.toLocaleString('<?php echo esc_js( Helpers::wp_locale() ); ?>');
                            }
                        }
                    },
                    legend: {
                        display: false
                    },
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    x: {
                        display: true,
                        scaleLabel: {
                            display: false
                        }
                    },
                    y: {
                        display: true,
                        scaleLabel: {
                            display: false
                        },
                        title: {
                            display: <?php echo esc_js( $is_active_app_custom ? 'true' : 'false' ); ?>,
                            text: '<?php echo esc_js( __( 'Attempts', 'limit-login-attempts-reloaded' ) ); ?>',
                        },
                        beginAtZero: true,
                        position: 'left',
                        suggestedMax: <?php echo esc_js( $chart2_attempts_scale_max ); ?>,
                        ticks: {
                            callback: function(label) {
                                if (Math.floor(label) === label) {
                                    return label.toLocaleString('<?php echo esc_js( Helpers::wp_locale() ); ?>');
                                }
                            },
                        }
                    },
                    requests: {
                        display: <?php echo esc_js( $is_active_app_custom ? 'true' : 'false' ); ?>,
                        title: {
                            display: true,
                            text: '<?php echo esc_js( __( 'Requests', 'limit-login-attempts-reloaded' ) ); ?>',
                        },
                        position: 'right',
                        beginAtZero: true,
                        suggestedMax: <?php echo esc_js( $chart2_requests_scale_max ); ?>,
                        scaleLabel: {
                            display: false
                        },
                        ticks: {
                            callback: function(label) {
                                if (Math.floor(label) === label) {
                                    return label.toLocaleString('<?php echo esc_js( Helpers::wp_locale() ); ?>');
                                }
                            },
                        }
                    },
                }
            }
        });

    })();
</script>
