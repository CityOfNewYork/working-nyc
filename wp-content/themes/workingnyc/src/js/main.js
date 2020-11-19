/**
 * Patterns
 */

/**
 * Polyfills
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'core-js/features/promise';
import 'core-js/features/array/for-each';
import 'core-js/features/object/assign';
import 'core-js/features/dom-collections/for-each';
import 'core-js/features/url-search-params';

import 'whatwg-fetch';

import 'matches';
import 'closest';
import 'remove';
import 'foreach';

/**
 * Components
 */
import Accordion from 'components/accordion/accordion';
import Dropdown from 'components/dropdown/dropdown';

/**
 * Objects
 */
import Search from 'objects/search/search';
import MobileNav from 'objects/mobile-menu/mobile-menu';

/**
* Utilities
*/
import Toggle from 'utilities/toggle/toggle';
import Icons from 'utilities/icons/icons';
import Copy from 'utilities/copy/copy';
import Newsletter from 'utilities/newsletter/newsletter';
import Track from 'utilities/track/track';
import WebShare from 'utilities/web-share/web-share';
import WindowVh from 'utilities/window-vh/window-vh';

// Post Types
import Programs from 'programs';
import Questionnaire from 'questionnaire';

(function (window) {
  'use strict';

  new Icons('/wp-content/themes/workingnyc/assets/svg/icons.svg');
  new Toggle();
  new Accordion();
  new Copy();
  new MobileNav();
  new Search();
  new Track();
  new WindowVh();

  new WebShare({
    fallback: () => {
      new Toggle({
        selector: WebShare.selector
      });
    }
  });

  // Removing the WPML classes
  const wpmlClasses='.wpml-ls-statics-shortcode_actions.wpml-ls.wpml-ls-legacy-list-horizontal';
  document.querySelector(wpmlClasses).removeAttribute('class');

  // Add tabindex=-1 to wpml language links
  const wpmlLinks=document.querySelectorAll('.wpml-ls-link');
  wpmlLinks.forEach(function (link) {
    link.setAttribute("tabindex", "-1");
  })

  if (document.querySelector('[id*=vue]')){
    new Programs()
  }
  if (document.querySelector('[id*=answer-a-few-questions]')){
    new Questionnaire()
  }

  new Dropdown();

  /**
   * Newsletter Archive Landing
  */
  let element = document.querySelector('[data-js="newsletter-form"]')
  let params = new URLSearchParams(window.location.search);
  let response = params.get('response');
  let newsletter = null;
  
  if (element) {
    let submit = element.querySelector('[type=submit]');
    let error = element.querySelector('[data-js="alert-error"]')
    
    newsletter = new Newsletter(element);
    newsletter.form.selectors.ERROR_MESSAGE_PARENT = '.c-question__container';

    // display error on invalid form
    submit.addEventListener('click', function(){
      if (response == null) {
        error.setAttribute("aria-hidden", "false");
        error.classList.remove('hidden')
      }
    })
  }

  if (response && newsletter) {
    let email = params.get('email');
    let input = element.querySelector('input[name="EMAIL"]');

    input.value = email;

    newsletter._data = {
      'result': params.get('result'),
      'msg': params.get('msg'),
      'EMAIL': email
    };

    newsletter._callback(newsletter._data);
  }

  /**
   * Initialize Google Translate Widget
   */
  if (document.documentElement.lang != 'en') {
    googleTranslateElementInit();
  }
})(window)
