/**
 * Archive
 *
 * @author NYC Opportunity
 */

/**
 * Dependencies
 */

import Programs from './modules/programs';

/**
 * Init
 */

(function (window) {
  'use strict';

  if (document.querySelector('[id*=vue]')) {
    new Programs();
  }
})(window);