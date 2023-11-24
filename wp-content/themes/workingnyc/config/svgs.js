/**
 * Dependencies
 */

const svgsConfig = require('@nycopportunity/standard/config/svgs');

/**
 * Config
 *
 * @type {Array}
 */
module.exports = [
  {
    source: './node_modules/@nycopportunity/standard/src/svg',
    dist: './assets/svg',
    prefix: '',
    file: 'svgs-development.svg',
    svgo: svgsConfig[0].svgo, // Opportunity Standard SVGO config
    restrict: [
      'nyco-accessibility.svg',
      'nyco-languages.svg',
      'logo-nyc.svg',
      'program-card-',
      'favicon.svg'
    ],
    write: {
      source: true
    }
  },
  {
    source: './node_modules/@nycopportunity/pattern-elements/src/svg',
    dist: './assets/svg',
    prefix: '',
    file: 'pattern-elements-development.svg',
    svgo: svgsConfig[1].svgo, // Pattern Elements SVGO config
    write: {
      source: false
    }
  },
  {
    source: './node_modules/lucide-static/icons',
    dist: './assets/svg',
    prefix: 'lucide-',
    file: 'lucide-development.svg',
    svgo: svgsConfig[2].svgo, // Lucide SVGO config
    restrict: [
      'icon-', 'logo-', 'option-', 'select-', 'arrow-', 'chevron-', 'alert-',
      'help-circle.svg', 'calendar.svg', 'users.svg', 'award.svg', 'x.svg',
      'copy.svg', 'check.svg', 'facebook.svg', 'twitter.svg', 'menu.svg',
      'translate.svg', 'search.svg', 'info.svg', 'external-link.svg',
      'share-2.svg', 'sun.svg', 'moon.svg', 'map-pin.svg', 'dollar-sign.svg',
      'clipboard.svg', 'heart-handshake.svg', 'clock.svg',
    ],
    write: {
      source: false
    }
  },
  {
    source: './src/svgs',
    dist: './assets/svg',
    prefix: '',
    file: 'wknyc-development.svg',
    svgo: svgsConfig[0].svgo, // Pattern Elements SVGO config
    write: {
      source: true
    }
  },
  // {
  //   source: './node_modules/feather-icons/dist/icons',
  //   dist: './assets/svg',
  //   prefix: 'feather-',
  //   file: 'feather-development.svg',
  //   svgo: svgsConfig[1].svgo, // Feather SVGO config
  //   restrict: restrict,
  //   write: {
  //     source: false
  //   }
  // }
];
