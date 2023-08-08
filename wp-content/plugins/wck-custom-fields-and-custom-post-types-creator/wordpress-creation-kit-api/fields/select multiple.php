<?php
 /* @param string $meta Meta name.	 
 * @param array $details Contains the details for the field.	 
 * @param string $value Contains input value;
 * @param string $context Context where the function is used. Depending on it some actions are preformed.;
 * @return string $element input element html string. */
$element .= '<select multiple name="'. $single_prefix . esc_attr( Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details ) );
if( $this->args['single'] && $this->args['context'] != 'option' ) {
	$element .= '[]';
}
$element .= '"  id="';
if( !empty( $frontend_prefix ) )
	$element .= $frontend_prefix;
$element .= esc_attr( Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details ) ) .'" class="mb-select-multiple mb-field" >';
			
if( !empty( $details['default-option'] ) && $details['default-option'] )
	$element .= '<option value="">'. __('...Choose', 'wck') .'</option>';

$field_name = Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details );

$options = '';
if( !empty( $details['options'] ) ){
	$i = 0;
	foreach( $details['options'] as $option ){
		$found = false;

		if( !is_array( $value ) )
			$values = explode( ', ', $value );
		else
			$values = $value;

		if( strpos( $option, '%' ) === false  ){
			$label = $option;
			$value_attr = $option;
			if ( in_array( $option, $values ) )
				$found = true;
		}
		else{
			$option_parts = explode( '%', $option );
			if( !empty( $option_parts ) ){
				if( empty( $option_parts[0] ) && count( $option_parts ) == 3 ){
					$label = $option_parts[1];
					$value_attr = $option_parts[2];
					if ( in_array( $option_parts[2], $values ) )
						$found = true;
				}
			}
		}

		$optionOutput = '<option value="'. esc_attr( $value_attr ) .'"  '. selected( $found, true, false ) .' >'. esc_html( $label ) .'</option>';
		$options .= apply_filters( "wck_select_{$meta}_{$field_name}_option_{$i}", $optionOutput, $i);
		$i++;
	}
}

$element .= apply_filters( "wck_select_{$meta}_{$field_name}_options", $options );	
$element .= '</select>';
?>