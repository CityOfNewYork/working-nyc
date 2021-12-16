/**
 * Utilities
 */

import Dialog from '@nycopportunity/pttrn-scripts/src/dialog/dialog';
import Copy from '@nycopportunity/pttrn-scripts/src/copy/copy';
import Icons from '@nycopportunity/pttrn-scripts/src/icons/icons';
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

/**
 * Init
 */

new Accordion();
new ActiveNavigation();
new Dialog();
new Copy();
new Menu();
new Toggle();
new Track();
new WindowVh();

/**
 * Icon Sprites
 */

const sprites = document.querySelector('[data-js="sprites"]');

new Icons(sprites.dataset.wnyc);
new Icons(sprites.dataset.feather);

sprites.remove();

/**
 * Color Themes
 */

new Themes({
  themes: [
    {
      label: 'Light Theme',
      classname: 'default',
      icon: 'feather-sun'
    },
    {
      label: 'Dark Theme',
      classname: 'light',
      icon: 'feather-moon'
    }
  ],
  after: thms => document.querySelectorAll(thms.selectors.TOGGLE)
    .forEach(element => {
      element.querySelector('[data-js-themes="icon"]')
        .setAttribute('href', `#${thms.theme.icon}`);
    })
});

/**
 * Webshare Configuration
 */

new WebShare({
  fallback: () => {
    new Toggle({
      selector: WebShare.selector
    });
  }
});

/**
 * Text Controller
 */

// Removing the WPML classes
const wpmlClasses='.wpml-ls-statics-shortcode_actions.wpml-ls.wpml-ls-legacy-list-horizontal';
document.querySelector(wpmlClasses).removeAttribute('class');

// Add tabindex=-1 to wpml language links
const wpmlLinks = document.querySelectorAll('.wpml-ls-link');

wpmlLinks.forEach(function (link) {
  link.setAttribute('tabindex', '-1');
});

// Initialize Google Translate Widget
if (document.documentElement.lang != 'en') {
  googleTranslateElementInit();
}

/**
 * Set CSS properties of various element heights for calculating the true
 * window bottom value in CSS.
 */

((elements) => {
  let setObjectHeights = (e) => {
    let element = document.querySelector(e['selector']);

    document.documentElement.style.setProperty(e['property'], `${element.clientHeight}px`);
  };

  for (let i = 0; i < elements.length; i++) {
    if (document.querySelector(elements[i]['selector'])) {
      window.addEventListener('load', () => setObjectHeights(elements[i]));
      window.addEventListener('resize', () => setObjectHeights(elements[i]));
    } else {
      document.documentElement.style.setProperty(elements[i]['property'], '0px');
    }
  }
})([
  {
    'selector': '[data-js="navigation"]',
    'property': '--wnyc-dimensions-navigation-height'
  },
  {
    'selector': '[data-js="feedback"]',
    'property': '--wnyc-dimensions-feedback-height'
  }
]);
