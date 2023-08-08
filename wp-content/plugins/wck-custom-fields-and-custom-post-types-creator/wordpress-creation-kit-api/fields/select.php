<?php
 /* @param string $meta Meta name.	 
 * @param array $details Contains the details for the field.	 
 * @param string $value Contains input value;
 * @param string $context Context where the function is used. Depending on it some actions are preformed.;
 * @return string $element input element html string. */

$extra_attr = apply_filters( 'wck_extra_field_attributes', '', $details, $meta );

$element .= '<select name="'. $single_prefix . esc_attr( Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details ) ) .'"  id="';
if( !empty( $frontend_prefix ) )
	$element .= $frontend_prefix;
$element .= esc_attr( Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details ) ) .'" class="mb-select mb-field" '.$extra_attr.'>';
			
if( !empty( $details['default-option'] ) && $details['default-option'] )
	$element .= '<option value="">'. __('...Choose', 'wck') .'</option>';

$field_name = Wordpress_Creation_Kit::wck_generate_slug( $details['title'], $details );

$options = '';
if( !empty( $details['options'] ) ){
		$i = 0;		
		foreach( $details['options'] as $option ){
			
			if( strpos( $option, '%' ) === false ){
				$label = $option;
				if( !empty( $details['values'] ) )
					$value_attr = $details['values'][$i];
				else 
					$value_attr = $option;
			}
			else{
				$option_parts = explode( '%', $option );
				if( !empty( $option_parts ) ){
					if( empty( $option_parts[0] ) && count( $option_parts ) == 3 ){
						$label = $option_parts[1];
						if( !empty( $details['values'] ) )
							$value_attr = $details['values'][$i];
						else
							$value_attr = $option_parts[2];
					}
				}
			}

            $optionOutput = '<option value="'. esc_attr( $value_attr ) .'"  '. selected( $value_attr, $value, false ) .' >'. esc_html( $label ) .'</option>';
            $options .= apply_filters( "wck_select_{$meta}_{$field_name}_option_{$i}", $optionOutput, $i);
			$i++;
		}
}				

$element .= apply_filters( "wck_select_{$meta}_{$field_name}_options", $options );	
$element .= '</select>';
?>