<?php
/* Add Scripts */
add_action('admin_enqueue_scripts', 'wck_free_to_pro_print_scripts' );
function wck_free_to_pro_print_scripts($hook){
	if( 'wck_page_free-to-pro-stp' == $hook || 'wck_page_free-to-pro-fep' == $hook ){		
		wp_register_style('wck-sas-css', plugins_url('/css/wck-free-to-pro.css', __FILE__));
		wp_enqueue_style('wck-sas-css');
	}
}

/* Create the WCK "Front End Posting" Page only for admins ( 'capability' => 'edit_theme_options' ) */
$args = array(					
			'page_title' => __( 'Front End Posting', 'wck' ),
			'menu_title' => __( 'Front End Posting', 'wck' ),
			'capability' => 'edit_theme_options',
			'menu_slug' => 'free-to-pro-fep',									
			'page_type' => 'submenu_page',
			'parent_slug' => 'wck-page',
			'priority' => 15,
			'page_icon' => plugins_url('/images/wck-32x32.png', __FILE__)
		);
$sas_page = new WCK_Page_Creator( $args );

/* Create the WCK "Swift Templates" Page only for admins ( 'capability' => 'edit_theme_options' ) */
$args = array(					
			'page_title' => __( 'Swift Templates', 'wck' ),
			'menu_title' => __( 'Swift Templates', 'wck' ),
			'capability' => 'edit_theme_options',
			'menu_slug' => 'free-to-pro-stp',									
			'page_type' => 'submenu_page',
			'parent_slug' => 'wck-page',
			'priority' => 17,
			'page_icon' => plugins_url('/images/wck-32x32.png', __FILE__)
		);
$sas_page = new WCK_Page_Creator( $args );

/**
 * Function that adds content to the "Swift Templates" page for the free version
 *
 * @since v.2.0.8
 *
 * @return string
 */
add_action( 'wck_before_meta_boxes', 'wck_free_to_pro_stp' );
function wck_free_to_pro_stp( $hook ) {
	if( 'wck_page_free-to-pro-stp' != $hook ){
		return ;
	}
	
?>
	<div class="wck-wrap wck-info-wrap">
		<img class="stp-logo" src="<?php echo esc_url( plugins_url( 'images/swift-template-logo.png' , __FILE__ ) ); ?>" alt="Swift Templates" />
		<h1><?php esc_html_e( 'Swift Templates', 'wck' ); ?></h1>
		<p class="wck-info-text"><?php esc_html_e( 'A straight forward alternative to WordPress templates', 'wck' ); ?></p>
		<hr />
		<h2>You're not a programmer. You keep delaying work with any of the templates in fear of making a bigger mess than where you started.</h2>
		<p><strong>When you're starting out it's just painful. You would do anything BUT custom code your WordPress templates:</strong></p>
		<ul>
			<li>research 10+ plugins wishing they can solve your problem</li>
			<li>start using a lot of shortcodes inside the content area that will break the moment the client wants to edit the content</li>
			<li>consider spending at least a week on that 5 parts HUGE article explaining how to custom code your own WordPress templates</li>
		</ul>
		
		<h3>Wouldn't it be nice to be able to simply:</h3>
		<ul>
			<li>create listings of all your custom post types</li>
			<li>create single page templates that take into account your custom fields previously defined with WCK</li>
			<li>all of this without writing PHP and messing with any of the template files</li>
		</ul>
		
		<h2>Swift Templates helps you build front-end templates directly from the WordPress admin UI, without writing a single line of PHP code.</h2>
		<p>It turns a time consuming and error prone process that was previously only accessible to developers into a straight forward UI that with a little bit of HTML and CSS allows you to:</p>
		<ul>
			<li>create archive listings for your custom post types, pages or posts</li>
			<li>modify the single CPT page template to include ALL your custom fields and metaboxes</li>
			<li>display your custom fields in any page, post or custom post type</li>
			<li>query, filter and load any content type</li>
		<ul>
		<br/>
		
		<h3 class="wck-free-to-pro-call-to-action">Swift Templates is available in <br/><a class="button button-primary button-free-to-pro" href="http://www.cozmoslabs.com/wck-custom-fields-custom-post-types-plugin/?utm_source=wpbackend&utm_medium=clientsite&utm_campaign=WCK-FreetoPRO">WordPress Creation Kit PRO</a></h3>
		<p class="wck-free-to-pro-call-to-action">* Simply deactivate the free version before installing WCK PRO and all your existing settings/setup will be ported over.</p>	
		
		<h2>Screenshots</h2>
		<p><strong>1. Creating a Custom Post Type Archive page</strong></p>
		<img class="screenshot" src="<?php echo esc_url( plugins_url( 'images/swift-templates.png' , __FILE__ ) ); ?>" alt="Custom Post Type Archive page" />
		
		<p><strong>2. Build your Archive and Single Templates for any Custom Post Type by simply selecting from the list of available variables. </strong></p>
		<img class="screenshot" src="<?php echo esc_url( plugins_url( 'images/swift-templates-code.png' , __FILE__ ) ); ?>" alt="Swift Templates - Archive and Single Templates" />
		
		<p><strong>3. Create individual templates for pages, posts or custom post types that include all your custom fields.</strong></p>
		<img class="screenshot" src="<?php echo esc_url( plugins_url( 'images/swift_single_team_page.png' , __FILE__ ) ); ?>" alt="individual page template" />
		
		<p><strong>3. Here's how the Team page will look in the front-end.</strong> It now includes the post content as well as the all custom fields data.</p>
		<img class="screenshot" src="<?php echo esc_url( plugins_url( 'images/team-page-final.jpg' , __FILE__ ) ); ?>" alt="team page" />
		
		<h3 class="wck-free-to-pro-call-to-action">Swift Templates is available in <br/><a class="button button-primary button-free-to-pro" href="http://www.cozmoslabs.com/wck-custom-fields-custom-post-types-plugin/?utm_source=wpbackend&utm_medium=clientsite&utm_campaign=WCK-FreetoPRO">WordPress Creation Kit PRO</a></h3>
		<p class="wck-free-to-pro-call-to-action">* Simply deactivate the free version before installing WCK PRO and all your existing settings/setup will be ported over.</p>	
	</div>
<?php
}

/**
 * Function that adds content to the "Front End Posting" page for the free version
 *
 * @since v.2.0.8
 *
 * @return string
 */
add_action( 'wck_before_meta_boxes', 'wck_free_to_pro_fep' );
function wck_free_to_pro_fep( $hook ) {
	if( 'wck_page_free-to-pro-fep' != $hook ){ 
		return;
	}
		
?>
	<div class="wck-wrap wck-info-wrap">
		<img class="stp-logo" src="<?php echo esc_url( plugins_url( 'images/fep_logo.png' , __FILE__ ) ); ?>" alt="Front End Posting" />
		<h1><?php esc_html_e( 'Front End Posting', 'wck' ); ?></h1>
		<p class="wck-info-text"><?php esc_html_e( 'An easy way to add and edit content from the front-end', 'wck' ); ?></p>
		<hr />
		<h2>Wouldn't it be nice to allow your users to post content directly from the front-end without ever seeing the backend?</h2>
		<p><strong>If you've been looking for an easy way to:</strong></p>
		<ul>
			<li>allow visitors to submit posts or images</li>
			<li>transform part of your website's visitors into contributors</li>
			<li>keep WordPress users out of the dashboard and put everything they need on the front-end</li>
		</ul>
		<p> Now you can.</p>
		
		<h2>With WCK Front-end Posting you can create and edit posts, pages or custom post types, directly from the front-end. No coding required.</h2>
		<p></p>
		
		<h3>You can build a flexible <strong>Front-end Posting form</strong> in minutes, that can contain:</h3>
		<ul>
		<li>Any of the available fields in the WordPress backend: <strong>Title, Content, Excerpt, Categories, Tags, Custom Taxonomies, Featured Image</strong> etc.</li>
		<li>Any <strong>Custom Fields</strong> that are attached to the post type</li>
		<li>Any <strong>Taxonomy</strong> that is attached to the post type</li>
		</ul>
		<br/>
		
		<h3><strong>Frontend Posting Features:</strong></h3>
		<ul>
			<li>Post articles in ANY Custom Post Type</li>
			<li>Taxonomies and Custom Fields available for the front-end form</li>
			<li>Edit all your content directly from the front-end (you'll get access to a <strong>Front-end Dashboard</strong>)</li>
			<li><strong>WYSIWYG Editor</strong> for adding and editing content</li>
			<li><strong>Anonymous Posting</strong> and <strong>Admin Approval</strong></li>
			<li>Easy to integrate by using shortcodes</li>
			
		</ul>
		<h3 class="wck-free-to-pro-call-to-action">Frontend Posting is available in <br/><a class="button button-primary button-free-to-pro" href="http://www.cozmoslabs.com/wck-custom-fields-custom-post-types-plugin/?utm_source=wpbackend&utm_medium=clientsite&utm_campaign=WCK-FreetoPRO">WordPress Creation Kit PRO</a></h3>
		<p class="wck-free-to-pro-call-to-action">* Simply deactivate the free version before installing WCK PRO and all your existing settings/setup will be ported over.</p>	
			
		<h2>Screenshots</h2>
		<img class="screenshot" src="<?php echo esc_url( plugins_url( 'images/FEP_form_setup.png' , __FILE__ ) ); ?>" alt="form setup screenshot" />
		<img class="screenshot" src="<?php echo esc_url( plugins_url( 'images/FEP_form_fields.png' , __FILE__ ) ); ?>" alt="form fields screenshot" />
		<img class="screenshot" src="<?php echo esc_url( plugins_url( 'images/FEP_form_example.png' , __FILE__ ) ); ?>" alt="fep screenshot" /><br/>
		<img class="screenshot" src="<?php echo esc_url( plugins_url( 'images/FEP_dashboard.png' , __FILE__ ) ); ?>" alt="fep dashboard" /><br/>
		<img class="screenshot" src="<?php echo esc_url( plugins_url( 'images/FEP_dashboard_edit.png' , __FILE__ ) ); ?>" alt="fep dashboard" /><br/>
		
		<h3 class="wck-free-to-pro-call-to-action">Frontend Posting is available in <br/><a class="button button-primary button-free-to-pro" href="http://www.cozmoslabs.com/wck-custom-fields-custom-post-types-plugin/?utm_source=wpbackend&utm_medium=clientsite&utm_campaign=WCK-FreetoPRO">WordPress Creation Kit PRO</a></h3>
		<p class="wck-free-to-pro-call-to-action">* Simply deactivate the free version before installing WCK PRO and all your existing settings/setup will be ported over.</p>	

	</div>
<?php
}