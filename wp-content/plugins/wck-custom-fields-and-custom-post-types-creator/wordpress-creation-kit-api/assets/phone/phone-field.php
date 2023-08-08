<?php

/* handle phone number format */
function wck_make_phone_number_format( $details ) {
	if( ! empty( $details['phone-format'] ) ) {
		$available_characters = array( '#', '(', ')', '-', '+', '.', ' ' );
		$phone_nb_chars = array();
		$length = strlen( $details['phone-format'] );

		for( $i=0; $i < $length; $i++ ) {
			$phone_nb_chars[$i] = $details['phone-format'][$i];

			if( ! in_array( $details['phone-format'][$i], $available_characters ) ) {
				$phone_nb_chars = 0;
				break;
			}
		}
	} else {
		$phone_nb_chars = 0;
	}

	return $phone_nb_chars;
}

?>