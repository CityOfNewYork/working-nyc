/**
 * Utilities
 */

import Dialog from '@nycopportunity/pttrn-scripts/src/dialog/dialog';
import Copy from '@nycopportunity/pttrn-scripts/src/copy/copy';
import Icons from '@nycopportunity/pttrn-scripts/src/icons/icons';
import SetHeightProperties from '@nycopportunity/pttrn-scripts/src/set-height-properties/set-height-properties';
import Themes from '@nycopportunity/pttrn-scripts/src/themes/themes';
import Toggle from '@nycopportunity/pttrn-scripts/src/toggle/toggle';
import Track from '@nycopportunity/pttrn-scripts/src/track/track';
import WebShare from '@nycopportunity/pttrn-scripts/src/web-share/web-share';
import WindowVh from '@nycopportunity/pttrn-scripts/src/window-vh/window-vh';
import RollbarConfigure from './modules/rollbar-configure';

/**
 * Components
 */

import Accordion from '@nycopportunity/standard/src/components/accordion/accordion';
import ActiveNavigation from '@nycopportunity/standard/src/components/active-navigation/active-navigation';
import Search from '@nycopportunity/standard/src/objects/search/search';

/**
 * Objects
 */

import Menu from '@nycopportunity/pattern-menu/src/menu';

/**
 * Init
 */

new RollbarConfigure();

/**
 * Patterns
 */

new Accordion();
new ActiveNavigation();
new Dialog();
new Menu();
new Search();
new Toggle();
new Track();
new WindowVh();

/**
 * Copy-to-clipboard Utility Configuration
 */

new Copy({
  copied: c => c.element.querySelector('[data-js-copy="icon"]')
    .setAttribute('href', `#lucide-check`),
  after: c => c.element.querySelector('[data-js-copy="icon"]')
    .setAttribute('href', `#lucide-copy`)
});


/**
 * Icon Sprites
 */

const sprites = document.querySelector('[data-js="sprites"]');

new Icons(sprites.dataset.svgs);
new Icons(sprites.dataset.elements);
new Icons(sprites.dataset.lucide);
new Icons(sprites.dataset.wknyc);

sprites.remove();

/**
 * Themes Configuration
 */

let themeLight = {
  label: 'Dark Theme',
  classname: 'default',
  icon: 'lucide-moon',
  version: VERSION
};

let themeDark = {
  label: 'Light Theme',
  classname: 'dark',
  icon: 'lucide-sun',
  version: VERSION
};

// This block ensures compatibility with the previous site theme configuration

let themePreferenceStr = localStorage.getItem(Themes.storage.THEME);

if (themePreferenceStr) {
  let themePreference = JSON.parse(themePreferenceStr);

  if (false === themePreference.hasOwnProperty('version')) {
    switch(themePreference.classname) {
      case 'default':
        console.dir(themeDark);
        localStorage.setItem(Themes.storage.THEME, JSON.stringify(themeDark));
        break;

      case 'light':
        console.dir(themeLight);
        localStorage.setItem(Themes.storage.THEME, JSON.stringify(themeLight));
        break;
    }
  }
}

new Themes({
  themes: [
    themeLight,
    themeDark
  ],
  after: thms => document.querySelectorAll(thms.selectors.TOGGLE)
    .forEach(element => {
      element.querySelector('[data-js-themes="icon"]')
        .setAttribute('href', `#${thms.theme.icon}`);
    })
});

/**
 * Web Share Configuration
 */

new WebShare({
  fallback: () => {
    new Toggle({
      selector: WebShare.selector
    });
  }
});

/**
 * Languages
 */

// Modify WPML Language Links
const wpmlList = document.querySelector('.wpml-ls-legacy-list-horizontal');
const wpmlListItem = document.querySelectorAll('.wpml-ls-item');
const wpmlLinks = document.querySelectorAll('.wpml-ls-link');

wpmlLinks.forEach(link => {
  link.removeAttribute('class');
  link.setAttribute('tabindex', '-1');
});

wpmlListItem.forEach(link => {
  link.removeAttribute('class');
});

if (wpmlList) {
  wpmlList.removeAttribute('class');
}

// Initialize Google Translate Widget
if (document.documentElement.lang != 'en') {
  googleTranslateElementInit();
}

/**
 * Set CSS properties of various element heights for
 * calculating the true window bottom value in CSS.
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

new SetHeightProperties({
  'elements': [
    {
      'selector': '[data-js="navigation"]',
      'property': '--o-navigation-height'
    },
    {
      'selector': '[data-js="feedback"]',
      'property': '--nyco-feedback-height'
    }
  ]
});
