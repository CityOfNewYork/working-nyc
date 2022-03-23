/**
 * Dependencies
 */

const svgsConfig = require('@nycopportunity/working-patterns/config/svgs');

/**
 * Restricted Feather Icons
 *
 * @type {String}
 */
const restrict = [
  'icon-', 'logo-', 'option-', 'select-', 'arrow-', 'chevron-', 'help-circle.svg',
  'calendar.svg', 'users.svg', 'award.svg', 'x.svg', 'copy.svg', 'check.svg',
  'facebook.svg', 'twitter.svg', 'menu.svg', 'translate.svg', 'search.svg',
  'info.svg', 'alert-', 'external-link.svg', 'share-2.svg', 'sun.svg', 'moon.svg',
  'map-pin.svg', 'dollar-sign.svg', 'clipboard.svg'
];

/**
 * Config
 *
 * @type {Array}
 */
module.exports = [
  {
    source: './node_modules/@nycopportunity/working-patterns/src/svg',
    dist: './assets/svg',
    prefix: '',
    file: 'icons-development.svg',
    svgo: svgsConfig[0].svgo // WNYC SVGO config
  },
  {
    source: './node_modules/feather-icons/dist/icons',
    dist: './assets/svg',
    prefix: 'feather-',
    file: 'feather-development.svg',
    svgo: svgsConfig[1].svgo, // Feather SVGO config
    restrict: restrict,
    write: {
      source: false
    }
  }
];
