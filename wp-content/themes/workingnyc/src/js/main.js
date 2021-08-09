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

import '@nycopportunity/access-patterns/src/utilities/element/closest';
import '@nycopportunity/access-patterns/src/utilities/element/matches';
import '@nycopportunity/access-patterns/src/utilities/element/remove';
import '@nycopportunity/access-patterns/src/utilities/nodelist/foreach';

/**
 * Components
 */

import Accordion from '@nycopportunity/working-patterns/src/components/accordion/accordion';
import Dropdown from '@nycopportunity/working-patterns/src/components/dropdown/dropdown';

/**
 * Objects
 */

import Menu from '@nycopportunity/pattern-menu/src/menu';

/**
 * Utilities
 */

import Toggle from '@nycopportunity/pttrn-scripts/src/toggle/toggle';
import Icons from '@nycopportunity/pttrn-scripts/src/icons/icons';
import Copy from '@nycopportunity/pttrn-scripts/src/copy/copy';
import Newsletter from '@nycopportunity/pttrn-scripts/src/newsletter/newsletter';
import Track from '@nycopportunity/pttrn-scripts/src/track/track';
import WebShare from '@nycopportunity/pttrn-scripts/src/web-share/web-share';
import WindowVh from '@nycopportunity/pttrn-scripts/src/window-vh/window-vh';
import Observe from '@nycopportunity/pttrn-scripts/src/observe/observe';

// Post Types
import Programs from './programs';
import Questionnaire from './questionnaire';

// Additional modules
// import headerIds from 'modules/header-ids'

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

  if (document.querySelector('[id*=vue]')) {
    new Programs();
  }

  if (document.querySelector('[id*=answer-a-few-questions]')) {
    new Questionnaire();
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
   * Scrolling Jump Navigation
   */

  const jumpClassToggle = item => {
    for (let i = 0; i < item.parentNode.children.length; i++) {
      const sibling = item.parentNode.children[i];

      if (sibling.classList.contains('no-underline'))
        sibling.classList.remove('no-underline', 'text-alt');
    }

    item.classList.add('no-underline', 'text-alt');
  };

  (element => {
    if (element) {
      let activeNavigation = element.querySelectorAll('a[href]');

      for (let i = 0; i < activeNavigation.length; i++) {
        const a = activeNavigation[i];

        a.addEventListener('click', event => {
          setTimeout(() => {
            jumpClassToggle(event.target);
          }, 200);
        });
      }
    }
  })(document.querySelector('[data-js*="active-navigation"]'));

  (elements => {
    elements.forEach(element => {
      new Observe({
        element: element,
        trigger: (entry) => {
          if (!entry.isIntersecting) return;

          let jumpItem = document.querySelector(`a[href="#${entry.target.id}"]`);

          jumpItem.parentNode.scrollTo({
            left: jumpItem.offsetLeft,
            top: 0,
            behavior: 'smooth'
          });

          jumpClassToggle(jumpItem);
        }
      });
    });
  })(document.querySelectorAll(Observe.selector));
})(window)
