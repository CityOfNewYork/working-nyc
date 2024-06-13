/**
 * Utilities
 */

import Dialog from '@nycopportunity/pttrn-scripts/src/dialog/dialog';
import Copy from '@nycopportunity/pttrn-scripts/src/copy/copy';
import Icons from '@nycopportunity/pttrn-scripts/src/icons/icons';
import SetHeightProperties from '@nycopportunity/pttrn-scripts/src/set-height-properties/set-height-properties';
import Toggle from '@nycopportunity/pttrn-scripts/src/toggle/toggle';
import Track from '@nycopportunity/pttrn-scripts/src/track/track';
import WebShare from '@nycopportunity/pttrn-scripts/src/web-share/web-share';
import WindowVh from '@nycopportunity/pttrn-scripts/src/window-vh/window-vh';
import RollbarConfigure from './modules/rollbar-configure';

/**
 * Components
 */

import Accordion from '@nycopportunity/standard/src/components/accordion/accordion';
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

/** Toggle the language dropdown carrot */

let toggleElement = document.querySelector('[data-js-dialog="language"]');

toggleElement.addEventListener('click', (event) => {
  if(toggleElement.hasAttribute('aria-controls')){
    let toToggle = toggleElement.querySelector('[data-js="language-up-arrow"]');
    let hideToggle = toggleElement.querySelector('[data-js="language-down-arrow"]');
    if(toToggle && hideToggle){ 
      toToggle.classList.toggle("hidden");
      hideToggle.classList.toggle("hidden");
    }
  }
});

// Initialize Google Translate Widget

/**
if (document.documentElement.lang != 'en') {
  googleTranslateElementInit();
}
 */

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
