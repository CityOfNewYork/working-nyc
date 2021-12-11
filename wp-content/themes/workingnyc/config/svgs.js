/**
 * Dependencies
 */

const alerts = require('@nycopportunity/pttrn/config/alerts');
const cnsl = require('@nycopportunity/pttrn/bin/util/console');
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
  'info.svg', 'alert-', 'external-link.svg', 'share-2.svg'
];

cnsl.describe(`${alerts.package} Mirroring SVGO configuration ${alerts.str.path('@nycopportunity/working-patterns/config/svgs')} with restricted Feather sprite.`);

/**
 * Config
 *
 * @type {Object}
 */
module.exports = [
  {
    source: './node_modules/@nycopportunity/working-patterns/src/svg',
    dist: './assets/svg',
    prefix: '',
    file: 'svgs.svg',
    svgo: svgsConfig.svgo
  },
  {
    source: './node_modules/feather-icons/dist/icons',
    dist: './assets/svg',
    prefix: 'feather-',
    file: 'feather.svg',
    svgo: svgsConfig.svgo,
    restrict: restrict,
    write: {
      source: false
    }
  }
];
