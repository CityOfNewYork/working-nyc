<?php

/*
 * Array with the currency ISO code and associated currency name
 *
 * @return array
 *
 */
function wck_get_currencies() {

    $currencies = array(
        'ALL' => __( 'Albania Lek', 'wck' ),
        'AFN' => __( 'Afghanistan Afghani', 'wck' ),
        'ARS' => __( 'Argentina Peso', 'wck' ),
        'AWG' => __( 'Aruba Guilder', 'wkc' ),
        'AUD' => __( 'Australia Dollar', 'wck' ),
        'AZN' => __( 'Azerbaijan New Manat', 'wck' ),
        'BSD' => __( 'Bahamas Dollar', 'wck' ),
        'BBD' => __( 'Barbados Dollar','wck' ),
        'BDT' => __( 'Bangladeshi taka','wck' ),
        'BYR' => __( 'Belarus Ruble','wck' ),
        'BZD' => __( 'Belize Dollar','wck' ),
        'BMD' => __( 'Bermuda Dollar','wck' ),
        'BOB' => __( 'Bolivia Boliviano','wck' ),
        'BAM' => __( 'Bosnia and Herzegovina Convertible Marka','wck' ),
        'BWP' => __( 'Botswana Pula','wck' ),
        'BGN' => __( 'Bulgaria Lev','wck' ),
        'BRL' => __( 'Brazil Real','wck' ),
        'BND' => __( 'Brunei Darussalam Dollar','wck' ),
        'KHR' => __( 'Cambodia Riel','wck' ),
        'CAD' => __( 'Canada Dollar','wck' ),
        'KYD' => __( 'Cayman Islands Dollar','wck' ),
        'CLP' => __( 'Chile Peso','wck' ),
        'CNY' => __( 'China Yuan Renminbi','wck' ),
        'COP' => __( 'Colombia Peso','wck' ),
        'CRC' => __( 'Costa Rica Colon','wck' ),
        'HRK' => __( 'Croatia Kuna','wck' ),
        'CUP' => __( 'Cuba Peso','wck' ),
        'CZK' => __( 'Czech Republic Koruna','wck' ),
        'DKK' => __( 'Denmark Krone','wck' ),
        'DOP' => __( 'Dominican Republic Peso','wck' ),
        'XCD' => __( 'East Caribbean Dollar','wck' ),
        'EGP' => __( 'Egypt Pound','wck' ),
        'SVC' => __( 'El Salvador Colon','wck' ),
        'EEK' => __( 'Estonia Kroon','wck' ),
        'EUR' => __( 'Euro','wck' ),
        'FKP' => __( 'Falkland Islands (Malvinas) Pound','wck' ),
        'FJD' => __( 'Fiji Dollar','wck' ),
        'GHC' => __( 'Ghana Cedis','wck' ),
        'GIP' => __( 'Gibraltar Pound','wck' ),
        'GTQ' => __( 'Guatemala Quetzal','wck' ),
        'GGP' => __( 'Guernsey Pound','wck' ),
        'GYD' => __( 'Guyana Dollar','wck' ),
        'HNL' => __( 'Honduras Lempira','wck' ),
        'HKD' => __( 'Hong Kong Dollar','wck' ),
        'HUF' => __( 'Hungary Forint','wck' ),
        'ISK' => __( 'Iceland Krona','wck' ),
        'INR' => __( 'India Rupee','wck' ),
        'IDR' => __( 'Indonesia Rupiah','wck' ),
        'IRR' => __( 'Iran Rial','wck' ),
        'IMP' => __( 'Isle of Man Pound','wck' ),
        'ILS' => __( 'Israel Shekel','wck' ),
        'JMD' => __( 'Jamaica Dollar','wck' ),
        'JPY' => __( 'Japan Yen','wck' ),
        'JEP' => __( 'Jersey Pound','wck' ),
        'JOD' => __( 'Jordanian Dinar','wck' ),
        'KZT' => __( 'Kazakhstan Tenge','wck' ),
        'KPW' => __( 'Korea (North) Won','wck' ),
        'KRW' => __( 'Korea (South) Won','wck' ),
        'KGS' => __( 'Kyrgyzstan Som','wck' ),
        'LAK' => __( 'Laos Kip','wck' ),
        'LVL' => __( 'Latvia Lat','wck' ),
        'LBP' => __( 'Lebanon Pound','wck' ),
        'LRD' => __( 'Liberia Dollar','wck' ),
        'LTL' => __( 'Lithuania Litas','wck' ),
        'MOP' => __( 'Macau Pataca','wck' ),
        'MKD' => __( 'Macedonia Denar','wck' ),
        'MYR' => __( 'Malaysia Ringgit','wck' ),
        'MUR' => __( 'Mauritius Rupee','wck' ),
        'MXN' => __( 'Mexico Peso','wck' ),
        'MNT' => __( 'Mongolia Tughrik','wck' ),
        'MZN' => __( 'Mozambique Metical','wck' ),
        'NAD' => __( 'Namibia Dollar','wck' ),
        'NPR' => __( 'Nepal Rupee','wck' ),
        'ANG' => __( 'Netherlands Antilles Guilder','wck' ),
        'NZD' => __( 'New Zealand Dollar','wck' ),
        'NIO' => __( 'Nicaragua Cordoba','wck' ),
        'NGN' => __( 'Nigeria Naira','wck' ),
        'NOK' => __( 'Norway Krone','wck' ),
        'OMR' => __( 'Oman Rial', 'wck' ),
        'PKR' => __( 'Pakistan Rupee', 'wck' ),
        'PAB' => __( 'Panama Balboa', 'wck' ),
        'PYG' => __( 'Paraguay Guarani', 'wck' ),
        'PEN' => __( 'Peru Nuevo Sol', 'wck' ),
        'PHP' => __( 'Philippines Peso', 'wck' ),
        'PLN' => __( 'Poland Zloty', 'wck' ),
        'QAR' => __( 'Qatar Riyal', 'wck' ),
        'RON' => __( 'Romania New Leu', 'wck' ),
        'RUB' => __( 'Russia Ruble', 'wck' ),
        'SHP' => __( 'Saint Helena Pound', 'wck' ),
        'SAR' => __( 'Saudi Arabia Riyal', 'wck' ),
        'RSD' => __( 'Serbia Dinar', 'wck' ),
        'SCR' => __( 'Seychelles Rupee', 'wck' ),
        'SGD' => __( 'Singapore Dollar', 'wck' ),
        'SBD' => __( 'Solomon Islands Dollar', 'wck' ),
        'SOS' => __( 'Somalia Shilling', 'wck' ),
        'ZAR' => __( 'South Africa Rand', 'wck' ),
        'LKR' => __( 'Sri Lanka Rupee', 'wck' ),
        'SEK' => __( 'Sweden Krona', 'wck' ),
        'CHF' => __( 'Switzerland Franc', 'wck' ),
        'SRD' => __( 'Suriname Dollar', 'wck' ),
        'SYP' => __( 'Syria Pound', 'wck' ),
        'TWD' => __( 'Taiwan New Dollar', 'wck' ),
        'THB' => __( 'Thailand Baht', 'wck' ),
        'TTD' => __( 'Trinidad and Tobago Dollar', 'wck' ),
        'TRY' => __( 'Turkey Lira', 'wck' ),
        'TRL' => __( 'Turkey Lira', 'wck' ),
        'TVD' => __( 'Tuvalu Dollar', 'wck' ),
        'UAH' => __( 'Ukraine Hryvna', 'wck' ),
        'GBP' => __( 'United Kingdom Pound', 'wck' ),
        'UGX' => __( 'Uganda Shilling', 'wck' ),
        'USD' => __( 'US Dollar', 'wck' ),
        'UYU' => __( 'Uruguay Peso', 'wck' ),
        'UZS' => __( 'Uzbekistan Som', 'wck' ),
        'VEF' => __( 'Venezuela Bolivar', 'wck' ),
        'VND' => __( 'Viet Nam Dong', 'wck' ),
        'YER' => __( 'Yemen Rial', 'wck' ),
        'ZWD' => __( 'Zimbabwe Dollar', 'wck' )
    );

    return apply_filters( 'wck_get_currencies', $currencies );

}


/*
 * Returns the currency symbol for a given currency code
 *
 * @param string $currency_code
 *
 * @return string
 *
 */
function wck_get_currency_symbol( $currency_code ) {

    $currency_symbols = array(
        'AED' => '&#1583;.&#1573;', // ?
        'AFN' => '&#65;&#102;',
        'ALL' => '&#76;&#101;&#107;',
        'AMD' => '',
        'ANG' => '&#402;',
        'AOA' => '&#75;&#122;', // ?
        'ARS' => '&#36;',
        'AUD' => '&#36;',
        'AWG' => '&#402;',
        'AZN' => '&#1084;&#1072;&#1085;',
        'BAM' => '&#75;&#77;',
        'BBD' => '&#36;',
        'BDT' => '&#2547;', // ?
        'BGN' => '&#1083;&#1074;',
        'BHD' => '.&#1583;.&#1576;', // ?
        'BIF' => '&#70;&#66;&#117;', // ?
        'BMD' => '&#36;',
        'BND' => '&#36;',
        'BOB' => '&#36;&#98;',
        'BRL' => '&#82;&#36;',
        'BSD' => '&#36;',
        'BTN' => '&#78;&#117;&#46;', // ?
        'BWP' => '&#80;',
        'BYR' => '&#112;&#46;',
        'BZD' => '&#66;&#90;&#36;',
        'CAD' => '&#36;',
        'CDF' => '&#70;&#67;',
        'CHF' => '&#67;&#72;&#70;',
        'CLF' => '', // ?
        'CLP' => '&#36;',
        'CNY' => '&#165;',
        'COP' => '&#36;',
        'CRC' => '&#8353;',
        'CUP' => '&#8396;',
        'CVE' => '&#36;', // ?
        'CZK' => '&#75;&#269;',
        'DJF' => '&#70;&#100;&#106;', // ?
        'DKK' => '&#107;&#114;',
        'DOP' => '&#82;&#68;&#36;',
        'DZD' => '&#1583;&#1580;', // ?
        'EGP' => '&#163;',
        'ETB' => '&#66;&#114;',
        'EUR' => '&#8364;',
        'FJD' => '&#36;',
        'FKP' => '&#163;',
        'GBP' => '&#163;',
        'GEL' => '&#4314;', // ?
        'GHS' => '&#162;',
        'GIP' => '&#163;',
        'GMD' => '&#68;', // ?
        'GNF' => '&#70;&#71;', // ?
        'GTQ' => '&#81;',
        'GYD' => '&#36;',
        'HKD' => '&#36;',
        'HNL' => '&#76;',
        'HRK' => '&#107;&#110;',
        'HTG' => '&#71;', // ?
        'HUF' => '&#70;&#116;',
        'IDR' => '&#82;&#112;',
        'ILS' => '&#8362;',
        'INR' => '&#8377;',
        'IQD' => '&#1593;.&#1583;', // ?
        'IRR' => '&#65020;',
        'ISK' => '&#107;&#114;',
        'JEP' => '&#163;',
        'JMD' => '&#74;&#36;',
        'JOD' => '&#74;&#68;', // ?
        'JPY' => '&#165;',
        'KES' => '&#75;&#83;&#104;', // ?
        'KGS' => '&#1083;&#1074;',
        'KHR' => '&#6107;',
        'KMF' => '&#67;&#70;', // ?
        'KPW' => '&#8361;',
        'KRW' => '&#8361;',
        'KWD' => '&#1583;.&#1603;', // ?
        'KYD' => '&#36;',
        'KZT' => '&#1083;&#1074;',
        'LAK' => '&#8365;',
        'LBP' => '&#163;',
        'LKR' => '&#8360;',
        'LRD' => '&#36;',
        'LSL' => '&#76;', // ?
        'LTL' => '&#76;&#116;',
        'LVL' => '&#76;&#115;',
        'LYD' => '&#1604;.&#1583;', // ?
        'MAD' => '&#1583;.&#1605;.', //?
        'MDL' => '&#76;',
        'MGA' => '&#65;&#114;', // ?
        'MKD' => '&#1076;&#1077;&#1085;',
        'MMK' => '&#75;',
        'MNT' => '&#8366;',
        'MOP' => '&#77;&#79;&#80;&#36;', // ?
        'MRO' => '&#85;&#77;', // ?
        'MUR' => '&#8360;', // ?
        'MVR' => '.&#1923;', // ?
        'MWK' => '&#77;&#75;',
        'MXN' => '&#36;',
        'MYR' => '&#82;&#77;',
        'MZN' => '&#77;&#84;',
        'NAD' => '&#36;',
        'NGN' => '&#8358;',
        'NIO' => '&#67;&#36;',
        'NOK' => '&#107;&#114;',
        'NPR' => '&#8360;',
        'NZD' => '&#36;',
        'OMR' => '&#65020;',
        'PAB' => '&#66;&#47;&#46;',
        'PEN' => '&#83;&#47;&#46;',
        'PGK' => '&#75;', // ?
        'PHP' => '&#8369;',
        'PKR' => '&#8360;',
        'PLN' => '&#122;&#322;',
        'PYG' => '&#71;&#115;',
        'QAR' => '&#65020;',
        'RON' => '&#108;&#101;&#105;',
        'RSD' => '&#1044;&#1080;&#1085;&#46;',
        'RUB' => '&#1088;&#1091;&#1073;',
        'RWF' => '&#1585;.&#1587;',
        'SAR' => '&#65020;',
        'SBD' => '&#36;',
        'SCR' => '&#8360;',
        'SDG' => '&#163;', // ?
        'SEK' => '&#107;&#114;',
        'SGD' => '&#36;',
        'SHP' => '&#163;',
        'SLL' => '&#76;&#101;', // ?
        'SOS' => '&#83;',
        'SRD' => '&#36;',
        'STD' => '&#68;&#98;', // ?
        'SVC' => '&#36;',
        'SYP' => '&#163;',
        'SZL' => '&#76;', // ?
        'THB' => '&#3647;',
        'TJS' => '&#84;&#74;&#83;', // ? TJS (guess)
        'TMT' => '&#109;',
        'TND' => '&#1583;.&#1578;',
        'TOP' => '&#84;&#36;',
        'TRY' => '&#8356;', // New Turkey Lira (old symbol used)
        'TTD' => '&#36;',
        'TWD' => '&#78;&#84;&#36;',
        'TZS' => '',
        'UAH' => '&#8372;',
        'UGX' => '&#85;&#83;&#104;',
        'USD' => '&#36;',
        'UYU' => '&#36;&#85;',
        'UZS' => '&#1083;&#1074;',
        'VEF' => '&#66;&#115;',
        'VND' => '&#8363;',
        'VUV' => '&#86;&#84;',
        'WST' => '&#87;&#83;&#36;',
        'XAF' => '&#70;&#67;&#70;&#65;',
        'XCD' => '&#36;',
        'XDR' => '',
        'XOF' => '',
        'XPF' => '&#70;',
        'YER' => '&#65020;',
        'ZAR' => '&#82;',
        'ZMK' => '&#90;&#75;', // ?
        'ZWL' => '&#90;&#36;',
    );

    if( !empty( $currency_symbols[$currency_code] ) )
        return $currency_symbols[$currency_code];
    else
        return '';

}