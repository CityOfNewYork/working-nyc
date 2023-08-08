<?php 
/* Start and settings page */

/* Add Scripts */
add_action('admin_enqueue_scripts', 'wck_sas_print_scripts' );
function wck_sas_print_scripts($hook){
	if( 'wck_page_sas-page' == $hook ){		
		wp_register_style('wck-sas-css', plugins_url('/css/wck-sas.css', __FILE__));
		wp_enqueue_style('wck-sas-css');
	}
}

/* Create the WCK "Start & Settings" Page only for admins ( 'capability' => 'edit_theme_options' ) */
$args = array(					
			'page_title' => __( 'Start Here & General Settings', 'wck' ),
			'menu_title' => __( 'Start and Settings', 'wck' ),
			'capability' => 'edit_theme_options',
			'menu_slug' => 'sas-page',									
			'page_type' => 'submenu_page',
			'parent_slug' => 'wck-page',
			'priority' => 7,
			'page_icon' => plugins_url('/images/wck-32x32.png', __FILE__)
		);
$sas_page = new WCK_Page_Creator( $args );

/* create the meta box only for admins ( 'capability' => 'edit_theme_options' ) */
add_action( 'init', 'wck_sas_create_box', 11 );
function wck_sas_create_box(){

	if( is_admin() && current_user_can( 'edit_theme_options' ) ){
		
		/* set up the fields array */
		$sas_serial_fields = array(
			array( 'type' => 'text', 'title' => __( 'Serial Number', 'wck' ), 'slug' => 'serial-number', 'description' => __( 'Please enter your serial number. (e.g. WCKPRO-11-SN-251r55baa4fbe7bf595b2aabb8d72985)', 'wck' ), 'required' => true )
		);
		
		/* set up the box arguments */
		$args = array(
			'metabox_id' => 'option_page',
			'metabox_title' => __( 'Register Your Version', 'wck' ),
			'post_type' => 'sas-page',
			'meta_name' => 'wck_serial',
			'meta_array' => $sas_serial_fields,	
			'context' 	=> 'option',
			'single' => true,
			'sortable' => false
		);

		/* create the box */
		$wck_premium_update = WCK_PLUGIN_DIR.'/update/';
		if (file_exists ($wck_premium_update . 'update-checker.php'))
			new Wordpress_Creation_Kit( $args );
				
		/* set up the tools array */			
		$sas_tools_activate = array(
			array( 'type' => 'radio', 'title' => __( 'Custom Fields Creator', 'wck' ), 'slug' => 'custom-fields-creator', 'options' => array( 'enabled', 'disabled' ), 'default' => 'enabled' ),
			array( 'type' => 'radio', 'title' => __( 'Custom Post Type Creator', 'wck' ), 'slug' => 'custom-post-type-creator', 'options' => array( 'enabled', 'disabled' ), 'default' => 'enabled' ),
			array( 'type' => 'radio', 'title' => __( 'Custom Taxonomy Creator', 'wck' ), 'slug' => 'custom-taxonomy-creator', 'options' => array( 'enabled', 'disabled' ), 'default' => 'enabled' ),
		);
		if( file_exists( dirname(__FILE__).'/wck-fep.php' ) )
			$sas_tools_activate[] = array( 'type' => 'radio', 'title' => __( 'Frontend Posting', 'wck' ), 'slug' => 'frontend-posting', 'options' => array( 'enabled', 'disabled' ), 'default' => 'enabled' );
		if( file_exists( dirname(__FILE__).'/wck-opc.php' ) )
			$sas_tools_activate[] = array( 'type' => 'radio', 'title' => __( 'Option Pages Creator', 'wck' ), 'slug' => 'option-pages-creator', 'options' => array( 'enabled', 'disabled' ), 'default' => 'enabled' );
		if( file_exists( dirname(__FILE__).'/wck-stp.php' ) )
			$sas_tools_activate[] = array( 'type' => 'radio', 'title' => __( 'Swift Templates', 'wck' ), 'slug' => 'swift-templates', 'options' => array( 'enabled', 'disabled' ), 'default' => 'enabled' );
		if( !file_exists( dirname(__FILE__).'/wck-stp.php' ) && !file_exists( dirname(__FILE__).'/wck-fep.php' )  )
			$sas_tools_activate[] = array( 'type' => 'radio', 'title' => __( 'Swift Templates and Front End Posting', 'wck' ), 'slug' => 'swift-templates-and-front-end-posting', 'options' => array( 'enabled', 'disabled' ), 'default' => 'enabled' );
			
		/* set up the box arguments */
		$args = array(
			'metabox_id' => 'wck_tools_activate',
			'metabox_title' => __( 'WordPress Creation Kit Tools: enable or disable the tools you want', 'wck' ),
			'post_type' => 'sas-page',
			'meta_name' => 'wck_tools',
			'meta_array' => $sas_tools_activate,	
			'context' 	=> 'option',
			'single' => true
		);

		/* create the box */
		new Wordpress_Creation_Kit( $args );


        /* set up the extra settings array */
        $sas_extra_options = array();

        if( file_exists( dirname( __FILE__ ) . '/wordpress-creation-kit-api/fields/map.php' ) )
            $sas_extra_options[] = array( 'type' => 'text', 'title' => __( 'Google Maps API', 'wck' ), 'description' => __( 'Enter your Google Maps API key ( <a href="https://console.developers.google.com/flows/enableapi?apiid=maps_backend" target="_blank">Get your API key</a> )', 'wck' ), 'required' => false );

        /* if there are extra options add the box */
        if( !empty( $sas_extra_options ) ) {

            /* set up the box arguments */
            $args = array(
                'metabox_id' => 'wck_extra_options',
                'metabox_title' => __( 'Extra Settings', 'wck' ),
                'post_type' => 'sas-page',
                'meta_name' => 'wck_extra_options',
                'meta_array' => $sas_extra_options,
                'context' 	=> 'option',
                'single' => true,
                'sortable' => false
            );

            /* create the box */
            if (file_exists ($wck_premium_update . 'update-checker.php'))
                new Wordpress_Creation_Kit( $args );

        }

	}
}

/* Add the welcoming text on WCK Start and Settings Page */
add_action( 'wck_before_meta_boxes', 'wck_sas_welcome');
function wck_sas_welcome($hook){
	if('wck_page_sas-page' == $hook ){
		$plugin_path = dirname( __FILE__ ) . '/wck.php';
		$default_plugin_headers = get_plugin_data($plugin_path);
		$plugin_name = $default_plugin_headers['Name'];
		$plugin_version = $default_plugin_headers['Version'];
		$plugin_name_class = ( strpos( strtolower($plugin_name), 'pro' ) !== false ? 'Pro' : ( strpos( strtolower($plugin_name), 'hobbyist' ) !== false ? 'Hobbyist' : 'Free' ) );

        if( version_compare(PHP_VERSION, '5.3.0') < 0 ) { ?>
            <div class="notice-error notice">
                <p>
                    <?php esc_html_e('<strong>You are using a very old version of PHP</strong> (5.2.x or older) which has serious security and performance issues. Please ask your hoster to provide you with an upgrade path to 5.6 or 7.0','wck'); ?>
                </p>
            </div>
        <?php }
?>
		<div class="wrap about-wrap">
			<div class="wck-badge <?php echo esc_attr($plugin_name_class); ?>"><span><?php echo esc_html( sprintf( __( 'Version %s', "wck" ), esc_html( $plugin_version ) ) ); ?></span></div>
			<h1><?php echo esc_html( sprintf( __( 'Welcome to %s', 'wck' ), $plugin_name ) ); ?></h1>
			<div class="about-text"><?php echo wp_kses_post( 'WCK helps you create <strong>repeater custom fields, custom post types</strong> and <strong>taxonomies</strong> in just a couple of clicks, directly from the WordPress admin interface. WCK content types will improve the usability of the sites you build, making them easy to manage by your clients. ', 'wck' ); ?></div>
		</div>

<?php
	}
}

/* Add the Quick Start-Up Guide text on WCK Start and Settings Page */
add_action( 'wck_after_meta_boxes', 'wck_sas_quickintro', 12);
function wck_sas_quickintro($hook){
	if('wck_page_sas-page' == $hook ){
?>



        <div class="wrap about-wrap" style="clear:both;">

            <div>
                <div style="float:right">
                    <a href="https://wordpress.org/plugins/translatepress-multilingual/" target="_blank"><img src="<?php echo esc_url( plugins_url( './images/pb-trp-cross-promotion.png', __FILE__ ) ); ?>" alt="TranslatePress Logo"/></a>
                </div>
                <div>
                    <h3>Easily translate your entire WordPress website</h3>
                    <p>Translate your Custom Post Types and Custom Fields with a WordPress translation plugin that anyone can use.</p>
                    <p>It offers a simpler way to translate WordPress sites, with full support for WooCommerce and site builders.</p>
                    <p><a href="https://wordpress.org/plugins/translatepress-multilingual/" class="button" target="_blank">Find out how</a></p>

                </div>
            </div>


			<div class="changelog">
				<h2><?php esc_html_e( 'Quick Start-Up Guide', 'wck' ); ?></h2>

				<div class="feature-section">

					<h4><?php esc_html_e( 'Custom Fields Creator', 'wck' ); ?></h4>
					<p><?php esc_html_e( 'WordPress Creation Kit Pro has support for a wide list of custom fields: WYSIWYG Editor, Upload Field, Date, User, Country, Text Input, Textarea, Drop-Down, Select, Checkboxes, Radio Buttons', 'wck' ); ?></p>
					<p><?php echo wp_kses_post( 'Access documentation <a href="http://www.cozmoslabs.com/docs/wordpress-creation-kit-documentation/#Custom_Fields_Creator" target="_blank">here</a> about how to display them in your templates.', 'wck' ); ?></p>

					<h4><?php esc_html_e( 'Post Type Creator', 'wck' ); ?></h4>
					<p><?php esc_html_e( 'Create & manage all your custom content types', 'wck' ); ?></p>
					<p><?php echo wp_kses_post( 'Access documentation <a href="http://www.cozmoslabs.com/docs/wordpress-creation-kit-documentation/#Custom_Post_Type_Creator" target="_blank">here</a> about how to display them in your templates.', 'wck' ); ?></p>
					
					<h4><?php esc_html_e( 'Taxonomy Creator', 'wck' ); ?></h4>
					<p><?php esc_html_e( 'Create new taxonomies for filtering your content', 'wck' ); ?></p>
					<p><?php echo wp_kses_post( 'Access documentation <a href="http://www.cozmoslabs.com/docs/wordpress-creation-kit-documentation/#Custom_Taxonomy_Creator" target="_blank">here</a> about how to display them in your templates.', 'wck' ); ?></p>
					
					<h4><?php echo wp_kses_post( 'Swift Templates (available in the <a href="http://www.cozmoslabs.com/wck-custom-fields-custom-post-types-plugin/?utm_source=wpbackend&utm_medium=clientsite&utm_campaign=WCKFree-SAS" target="_blank">PRO</a> version)', 'wck' ); ?></h4>
					<p><?php esc_html_e( 'Build your front-end templates directly from the WordPress admin UI, without writing any PHP code.', 'wck' ); ?></p>
					<p><?php echo wp_kses_post( 'Access documentation <a href="http://www.cozmoslabs.com/docs/wordpress-creation-kit-documentation/#Swift_Templates" target="_blank">here</a> on how to easily display registered custom post types, custom fields and taxonomies in your theme.', 'wck' ); ?></p>
					
					<h4><?php echo wp_kses_post( 'Front-End Posting (available in the <a href="http://www.cozmoslabs.com/wck-custom-fields-custom-post-types-plugin/?utm_source=wpbackend&utm_medium=clientsite&utm_campaign=WCKFree-SAS" target="_blank">PRO</a> version)', 'wck' ); ?></h4>
					<p><?php esc_html_e( 'Create and edit posts/pages or custom posts directly from the front-end.', 'wck' ); ?></p>
					<p><?php esc_html_e( 'Available shortcodes:', 'wck' ); ?></p>
					<ul>
						<li><?php esc_html_e( '[fep form_name="front-end-post-name"] - displays your form in the front-end', 'wck' ); ?></li>
						<li><?php esc_html_e( '[fep-dashboard] - the quick-dashboard allows: simple profile updates, editing/deletion of posts, pages and custom post types.', 'wck' ); ?></li>
						<li><?php esc_html_e( '[fep-lilo] - login/logout/register widget with the simple usage of a shortcode. Can be added in a page or text widget.', 'wck' ); ?></li>
					</ul>
					<p><?php echo wp_kses_post( 'Access documentation <a href="http://www.cozmoslabs.com/docs/wordpress-creation-kit-documentation/frontend-posting/" target="_blank">here</a> about how to display them in your templates.', 'wck' ); ?></p>
					
					<h4><?php echo wp_kses_post( 'Option Pages (available in the <a href="http://www.cozmoslabs.com/wck-custom-fields-custom-post-types-plugin/?utm_source=wpbackend&utm_medium=clientsite&utm_campaign=WCKFree-SAS" target="_blank">PRO</a> version)', 'wck' ); ?></h4>
					<p><?php esc_html_e( 'The Options Page Creator Allows you to create a new menu item called "Options"(for example) which can hold advanced custom field groups. Perfect for theme options or a simple UI for your custom plugin (like a simple testimonials section in the front-end).', 'wck' ); ?></p>

				</div>
			</div>
		</div>

<?php
	}
}

/* Notify user of when he enters his serial number. 
 * Also Check if serial is valid on meta_name creation and update 
 */
add_action( "wck_after_add_form_wck_serial_element_0", 'wck_sas_serial_notification' );
function wck_sas_serial_notification(){

	wck_sas_check_serial_number();
	$status = get_option('wck_serial_status');
	
	if ( $status == 'noserial') $notif = '<p class="serial-notification red">' . __( 'Please enter your serial number to receive access to automatic updates and support. Need a license key? <a href="http://www.cozmoslabs.com/wck-custom-fields-custom-post-types-plugin/?utm_source=WCK-sas&utm_medium=dashboard&utm_campaign=WCK-SN-Purchase" target="_blank">Get One Here</a>.', 'wck' ) . ' </p>';

	if ( $status == 'serverDown') $notif = '<p class="serial-notification yellow">' . __( 'Oops! Our serial verification server is down. Please try again later.', 'wck' ) . ' </p>';
	
	if ( $status == 'notFound') $notif = '<p class="serial-notification red">' . __( 'Oops! It seems the serial number you entered was not found in our database. To find out what\'s your serial number log-in to <a href="http://www.cozmoslabs.com/account/?utm_source=WCK-sas&utm_medium=dashboard&utm_campaign=WCK-Renewal" target="_blank">your account page</a> over at Cozmoslabs.com', 'wck' ) . ' </p>';
	
	if ( $status == 'found') $notif = '<p class="serial-notification green">' . __( 'Wohoo! Your serial number is valid and you have access to automatic updates.', 'wck' ) . ' </p>'; 
	
	if ( $status == 'expired') $notif = '<p class="serial-notification red">' . __( 'It seems your serial number has <strong>expired</strong>. To continue receiving access to product downloads, automatic updates and support please update your serial number for another year from <a href="http://www.cozmoslabs.com/account/?utm_source=WCK-sas&utm_medium=dashboard&utm_campaign=WCK-Renewal" target="_blank"><strong>your account page</strong></a>.', 'wck' ) . ' </p>';

    if ( strpos( $status, 'about' ) === 0 ) $notif = '<p class="serial-notification yellow">' . __( 'Your WordPress Creation Kit serial number is about to expire. To continue receiving access to product downloads, automatic updates and support please update your serial number for another year from <a href="http://www.cozmoslabs.com/account/?utm_source=WCK-sas&utm_medium=dashboard&utm_campaign=WCK-Renewal" target="_blank"><strong>your account page</strong></a>.', 'wck' ) . ' </p>';

    if( !empty( $notif ) )
	    echo wp_kses_post( $notif );
}

/* Check if serial is valid on Start and Settings page load. 
 * We're tying to the admin_enque_scripts because it returns the current page $hook
 */
add_action( 'admin_enqueue_scripts', 'wck_retest_serial_on_load');
function wck_retest_serial_on_load($hook){
	if('wck_page_sas-page' == $hook )
		wck_sas_check_serial_number();
}

/* Checks local serial number against our serial-number database. */
function wck_sas_check_serial_number(){
	// take into account the Free version doesn't need an update check and serial. 
	$wck_premium_update = WCK_PLUGIN_DIR.'/update/';
	if (!file_exists($wck_premium_update . 'update-checker.php'))
		return;
		
	$serial = get_option('wck_serial');
	if( !empty( $serial[0] ) )
		$serial = urlencode( $serial[0]['serial-number'] );
	if(empty($serial) || $serial == '') {
		update_option( 'wck_serial_status', 'noserial' ); //server down
	} else {
		$response = wp_remote_get( 'http://updatemetadata.cozmoslabs.com/checkserial/?serialNumberSent='.$serial );

		if (is_wp_error($response)){
			update_option( 'wck_serial_status', 'serverDown' ); //server down

		}elseif( (trim($response['body']) != 'notFound') && (trim($response['body']) != 'found') && (trim($response['body']) != 'expired') && strpos( trim($response['body']), 'aboutToExpire') === false ){
			update_option( 'wck_serial_status', 'serverDown' );  //unknown response parameter
		}else{
			update_option( 'wck_serial_status', trim($response['body']) ); //either found, notFound or expired
		}
	}
}

/**
 * Class that adds a notice when either the serial number wasn't found, or it has expired
 *
 * @since v.2.1.1
 *
 * @return void
 */
class wck_add_serial_notices{
    public $pluginPrefix = '';
    public $notificaitonMessage = '';
    public $pluginSerialStatus = '';

    function __construct( $pluginPrefix, $notificaitonMessage, $pluginSerialStatus ){
        $this->pluginPrefix = $pluginPrefix;
        $this->notificaitonMessage = $notificaitonMessage;
        $this->pluginSerialStatus = $pluginSerialStatus;

        add_action( 'admin_notices', array( $this, 'add_admin_notice' ) );
        add_action( 'admin_init', array( $this, 'dismiss_notification' ) );
    }


    // Display a notice that can be dismissed in case the serial number is inactive
    function add_admin_notice() {
        global $current_user ;
        global $pagenow;

        $user_id = $current_user->ID;

        do_action( $this->pluginPrefix.'_before_notification_displayed', $current_user, $pagenow );

        if ( current_user_can( 'manage_options' ) ){

            $plugin_serial_status = get_option( $this->pluginSerialStatus );
            if ( $plugin_serial_status != 'found' ){

                //we want to show the expiration notice on our plugin pages even if the user dismissed it on the rest of the site
                $force_show = false;
                if ( $plugin_serial_status == 'expired' ) {
                    $notification_instance = WCK_Plugin_Notifications::get_instance();
                    if ($notification_instance->is_plugin_page()) {
                        $force_show = true;
                    }
                }

                // Check that the user hasn't already clicked to ignore the message
                if ( ! get_user_meta($user_id, $this->pluginPrefix.'_dismiss_notification' ) || $force_show ) {
                    echo wp_kses_post( apply_filters($this->pluginPrefix.'_notification_message','<div class="error wck-serial-notification" >'.$this->notificaitonMessage.'</div>', $this->notificaitonMessage) );
                }
            }

            do_action( $this->pluginPrefix.'_notification_displayed', $current_user, $pagenow, $plugin_serial_status );

        }

        do_action( $this->pluginPrefix.'_after_notification_displayed', $current_user, $pagenow );

    }

    function dismiss_notification() {
        global $current_user;

        $user_id = $current_user->ID;

        do_action( $this->pluginPrefix.'_before_notification_dismissed', $current_user );

        // If user clicks to ignore the notice, add that to their user meta
        if ( isset( $_GET[$this->pluginPrefix.'_dismiss_notification']) && '0' === $_GET[$this->pluginPrefix.'_dismiss_notification'] )
            add_user_meta( $user_id, $this->pluginPrefix.'_dismiss_notification', 'true', true );

        do_action( $this->pluginPrefix.'_after_notification_dismissed', $current_user );
    }
}

// Verify if it's a premium version and display serial notifications
$wck_premium_update = WCK_PLUGIN_DIR.'/update/';
if (file_exists ($wck_premium_update . 'update-checker.php')) {
    $wck_serial_status = get_option('wck_serial_status');

     if (file_exists ( WCK_PLUGIN_DIR . '/wordpress-creation-kit-api/wck-fep/wck-fep.php' ))
         $wck_version = 'pro';
	 else
         $wck_version = 'hobbyist';

    if ($wck_serial_status == 'notFound' || $wck_serial_status == 'noserial' || $wck_serial_status == '') {
        new wck_add_serial_notices('wck', sprintf(__('<p>Your <strong>WordPress Creation Kit</strong> serial number is invalid or missing. <br/>Please %1$sregister your copy%2$s of WCK to receive access to automatic updates and support. Need a license key? %3$sPurchase one now%4$s</p>', 'wck'), "<a href='admin.php?page=sas-page'>", "</a>", "<a href='https://www.cozmoslabs.com/wck-custom-fields-custom-post-types-plugin/?utm_source=WCK&utm_medium=dashboard&utm_campaign=WCK-SN-Purchase' target='_blank' class='button-primary'>", "</a>"), 'wck_serial_status'); //phpcs:ignore WordPress.WP.I18n.NoHtmlWrappedStrings
    } elseif ($wck_serial_status == 'expired') {
        /* on our plugin pages do not add the dismiss button for the expired notification*/
        $wck_notifications = WCK_Plugin_Notifications::get_instance();
        if( $wck_notifications->is_plugin_page() )
            $message = __('<p style="position:relative;">Your <strong>WordPress Creation Kit</strong> licence has expired. <br/>Please %1$sRenew Your Licence%2$s to continue receiving access to product downloads, automatic updates and support. %3$sRenew now %4$s</p>', 'wck'); //phpcs:ignore WordPress.WP.I18n.NoHtmlWrappedStrings
        else
            $message = __('<p style="position:relative;">Your <strong>WordPress Creation Kit</strong> licence has expired. <br/>Please %1$sRenew Your Licence%2$s to continue receiving access to product downloads, automatic updates and support. %3$sRenew now %4$s %5$sDismiss%6$s</p>', 'wck'); //phpcs:ignore WordPress.WP.I18n.NoHtmlWrappedStrings
        new wck_add_serial_notices('wck_expired', sprintf( $message, "<a href='https://www.cozmoslabs.com/account/?utm_source=WCK&utm_medium=dashboard&utm_campaign=WCK-Renewal' target='_blank'>", "</a>", "<a href='". esc_url( "https://www.cozmoslabs.com/account/?utm_source=WCK&utm_medium=dashboard&utm_campaign=WCK-Renewal") ."' target='_blank' class='button-primary'>", "</a>", "<a href='" . esc_url( add_query_arg('wck_expired_dismiss_notification', '0') ) . "' class='wck-dismiss-notification' style='position:absolute; right:0px; top:50%; margin-top:-7px;'>", "</a>"), 'wck_serial_status');
    } elseif (strpos($wck_serial_status, 'aboutToExpire') === 0) {
        $serial_status_parts = explode( '#', $wck_serial_status );
        $date = $serial_status_parts[1];
        new wck_add_serial_notices('wck_about_to_expire', sprintf(__('<p style="position:relative;">Your <strong>WordPress Creation Kit</strong> serial number is about to expire on %5$s. <br/>Please %1$sRenew Your Licence%2$s to continue receiving access to product downloads, automatic updates and support. %3$sRenew now %4$s %6$sDismiss%7$s</p>', 'wck'), "<a href='https://www.cozmoslabs.com/account/?utm_source=WCK&utm_medium=dashboard&utm_campaign=WCK-Renewal'>", "</a>", "<a href='". esc_url( "https://www.cozmoslabs.com/account/?utm_source=WCK&utm_medium=dashboard&utm_campaign=WCK-Renewal" ) ."' target='_blank' class='button-primary'>", "</a>", $date, "<a href='" . esc_url( add_query_arg('wck_about_to_expire_dismiss_notification', '0') ) . "' class='wck-dismiss-notification' style='position:absolute; right:0px; top:50%; margin-top:-7px;'>", "</a>"), 'wck_serial_status'); //phpcs:ignore WordPress.WP.I18n.NoHtmlWrappedStrings
    }

	/* change serial field type to password */
	add_filter( 'wck_text_input_type_attribute_wck_serial_serial-number', 'wck_sas_change_serial_field_type' );
	function wck_sas_change_serial_field_type( $type ){
		return 'password';
	}

}
