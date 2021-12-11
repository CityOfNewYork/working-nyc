/**
 * Patterns
 */

// import 'regenerator-runtime/runtime'; ???

/**
 * Utilities
 */

 import Dialog from '@nycopportunity/pttrn-scripts/src/dialog/dialog';
 import Direction from '@nycopportunity/pttrn-scripts/src/direction/direction';
 import Copy from '@nycopportunity/pttrn-scripts/src/copy/copy';
 import Forms from '@nycopportunity/pttrn-scripts/src/forms/forms';
 import Icons from '@nycopportunity/pttrn-scripts/src/icons/icons';
 import Newsletter from '@nycopportunity/pttrn-scripts/src/newsletter/newsletter';
 import Themes from '@nycopportunity/pttrn-scripts/src/themes/themes';
 import Toggle from '@nycopportunity/pttrn-scripts/src/toggle/toggle';
 import Track from '@nycopportunity/pttrn-scripts/src/track/track';
 import WebShare from '@nycopportunity/pttrn-scripts/src/web-share/web-share';
 import WindowVh from '@nycopportunity/pttrn-scripts/src/window-vh/window-vh';

/**
 * Components
 */

import Accordion from '@nycopportunity/working-patterns/src/components/accordion/accordion';
import ActiveNavigation from '@nycopportunity/working-patterns/src/components/active-navigation/active-navigation';

/**
 * Objects
 */

import Menu from '@nycopportunity/pattern-menu/src/menu';
// import Search from '../objects/search/search';

(function (window) {
  'use strict';

  const icons = document.querySelector('#icons').textContent

  new Icons(icons != undefined ? icons : '');

  // new Icons('/wp-content/themes/workingnyc/assets/svg/icons.svg');
  new Toggle();
  new Accordion();
  new Copy();
  new Menu();
  new Track();
  new WindowVh();

  // headerIds();

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
  const wpmlLinks = document.querySelectorAll('.wpml-ls-link');

  wpmlLinks.forEach(function (link) {
    link.setAttribute('tabindex', '-1');
  })

  // if (document.querySelector('[id*=vue]')) {
  //   new Programs();
  // }

  // if (document.querySelector('[id*=answer-a-few-questions]')) {
  //   new Questionnaire();
  // }

  // new Dropdown();

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
    submit.addEventListener('click', function() {
      if (response == null) {
        error.setAttribute('aria-hidden', 'false');

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

  /**
   * Set CSS properties of various element heights for calculating the true
   * window bottom value in CSS.
   */
  let setObjectHeights = () => {
    let navigation = document.querySelector('[data-js="navigation"]');
    let feedback = document.querySelector('[data-js="feedback"]');

    document.documentElement.style
      .setProperty('--o-navigation-height', `${navigation.clientHeight}px`);

    document.documentElement.style
      .setProperty('--o-feedback-height', `${feedback.clientHeight}px`);
  };

  window.addEventListener('load', () => setObjectHeights());
  window.addEventListener('resize', () => setObjectHeights());
})(window);
