(function () {
  'use strict';

  /**
   * The Simple Toggle class. This will toggle the class 'active' and 'hidden'
   * on target elements, determined by a click event on a selected link or
   * element. This will also toggle the aria-hidden attribute for targeted
   * elements to support screen readers. Target settings and other functionality
   * can be controlled through data attributes.
   *
   * This uses the .matches() method which will require a polyfill for IE
   * https://polyfill.io/v2/docs/features/#Element_prototype_matches
   *
   * @class
   */
  class Toggle {
    /**
     * @constructor
     *
     * @param  {Object}  s  Settings for this Toggle instance
     *
     * @return {Object}     The class
     */
    constructor(s) {
      // Create an object to store existing toggle listeners (if it doesn't exist)
      if (!window.hasOwnProperty(Toggle.callback))
        window[Toggle.callback] = [];

      s = (!s) ? {} : s;

      this.settings = {
        selector: (s.selector) ? s.selector : Toggle.selector,
        namespace: (s.namespace) ? s.namespace : Toggle.namespace,
        inactiveClass: (s.inactiveClass) ? s.inactiveClass : Toggle.inactiveClass,
        activeClass: (s.activeClass) ? s.activeClass : Toggle.activeClass,
        before: (s.before) ? s.before : false,
        after: (s.after) ? s.after : false,
        valid: (s.valid) ? s.valid : false,
        focusable: (s.hasOwnProperty('focusable')) ? s.focusable : true,
        jump: (s.hasOwnProperty('jump')) ? s.jump : true
      };

      // Store the element for potential use in callbacks
      this.element = (s.element) ? s.element : false;

      if (this.element) {
        this.element.addEventListener('click', (event) => {
          this.toggle(event);
        });
      } else {
        // If there isn't an existing instantiated toggle, add the event listener.
        if (!window[Toggle.callback].hasOwnProperty(this.settings.selector)) {
          let body = document.querySelector('body');

          for (let i = 0; i < Toggle.events.length; i++) {
            let tggleEvent = Toggle.events[i];

            body.addEventListener(tggleEvent, event => {
              if (!event.target.matches(this.settings.selector))
                return;

              this.event = event;

              let type = event.type.toUpperCase();

              if (
                this[event.type] &&
                Toggle.elements[type] &&
                Toggle.elements[type].includes(event.target.tagName)
              ) this[event.type](event);
            });
          }
        }
      }

      // Record that a toggle using this selector has been instantiated.
      // This prevents double toggling.
      window[Toggle.callback][this.settings.selector] = true;

      return this;
    }

    /**
     * Click event handler
     *
     * @param  {Event}  event  The original click event
     */
    click(event) {
      this.toggle(event);
    }

    /**
     * Input/select/textarea change event handler. Checks to see if the
     * event.target is valid then toggles accordingly.
     *
     * @param  {Event}  event  The original input change event
     */
    change(event) {
      let valid = event.target.checkValidity();

      if (valid && !this.isActive(event.target)) {
        this.toggle(event); // show
      } else if (!valid && this.isActive(event.target)) {
        this.toggle(event); // hide
      }
    }

    /**
     * Check to see if the toggle is active
     *
     * @param  {Object}  element  The toggle element (trigger)
     */
    isActive(element) {
      let active = false;

      if (this.settings.activeClass) {
        active = element.classList.contains(this.settings.activeClass);
      }

      // if () {
        // Toggle.elementAriaRoles
        // TODO: Add catch to see if element aria roles are toggled
      // }

      // if () {
        // Toggle.targetAriaRoles
        // TODO: Add catch to see if target aria roles are toggled
      // }

      return active;
    }

    /**
     * Get the target of the toggle element (trigger)
     *
     * @param  {Object}  el  The toggle element (trigger)
     */
    getTarget(element) {
      let target = false;

      /** Anchor Links */
      target = (element.hasAttribute('href')) ?
        document.querySelector(element.getAttribute('href')) : target;

      /** Toggle Controls */
      target = (element.hasAttribute('aria-controls')) ?
        document.querySelector(`#${element.getAttribute('aria-controls')}`) : target;

      return target;
    }

    /**
     * The toggle event proxy for getting and setting the element/s and target
     *
     * @param  {Object}  event  The main click event
     *
     * @return {Object}         The Toggle instance
     */
    toggle(event) {
      let element = event.target;
      let target = false;
      let focusable = [];

      event.preventDefault();

      target = this.getTarget(element);

      /** Focusable Children */
      focusable = (target) ?
        target.querySelectorAll(Toggle.elFocusable.join(', ')) : focusable;

      /** Main Functionality */
      if (!target) return this;
      this.elementToggle(element, target, focusable);

      /** Undo */
      if (element.dataset[`${this.settings.namespace}Undo`]) {
        const undo = document.querySelector(
          element.dataset[`${this.settings.namespace}Undo`]
        );

        undo.addEventListener('click', (event) => {
          event.preventDefault();
          this.elementToggle(element, target);
          undo.removeEventListener('click');
        });
      }

      return this;
    }

    /**
     * Get other toggles that might control the same element
     *
     * @param   {Object}    element  The toggling element
     *
     * @return  {NodeList}           List of other toggling elements
     *                               that control the target
     */
    getOthers(element) {
      let selector = false;

      if (element.hasAttribute('href')) {
        selector = `[href="${element.getAttribute('href')}"]`;
      } else if (element.hasAttribute('aria-controls')) {
        selector = `[aria-controls="${element.getAttribute('aria-controls')}"]`;
      }

      return (selector) ? document.querySelectorAll(selector) : [];
    }

    /**
     * Hide the Toggle Target's focusable children from focus.
     * If an element has the data-attribute `data-toggle-tabindex`
     * it will use that as the default tab index of the element.
     *
     * @param   {NodeList}  elements  List of focusable elements
     *
     * @return  {Object}              The Toggle Instance
     */
    toggleFocusable(elements) {
      elements.forEach(element => {
        let tabindex = element.getAttribute('tabindex');

        if (tabindex === '-1') {
          let dataDefault = element
            .getAttribute(`data-${Toggle.namespace}-tabindex`);

          if (dataDefault) {
            element.setAttribute('tabindex', dataDefault);
          } else {
            element.removeAttribute('tabindex');
          }
        } else {
          element.setAttribute('tabindex', '-1');
        }
      });

      return this;
    }

    /**
     * Jumps to Element visibly and shifts focus
     * to the element by setting the tabindex
     *
     * @param   {Object}  element  The Toggling Element
     * @param   {Object}  target   The Target Element
     *
     * @return  {Object}           The Toggle instance
     */
    jumpTo(element, target) {
      // Reset the history state. This will clear out
      // the hash when the target is toggled closed
      history.pushState('', '',
        window.location.pathname + window.location.search);

      // Focus if active
      if (target.classList.contains(this.settings.activeClass)) {
        window.location.hash = element.getAttribute('href');

        target.setAttribute('tabindex', '0');
        target.focus({preventScroll: true});
      } else {
        target.removeAttribute('tabindex');
      }

      return this;
    }

    /**
     * The main toggling method for attributes
     *
     * @param  {Object}    element    The Toggle element
     * @param  {Object}    target     The Target element to toggle active/hidden
     * @param  {NodeList}  focusable  Any focusable children in the target
     *
     * @return {Object}               The Toggle instance
     */
    elementToggle(element, target, focusable = []) {
      let i = 0;
      let attr = '';
      let value = '';

      /**
       * Store elements for potential use in callbacks
       */

      this.element = element;
      this.target = target;
      this.others = this.getOthers(element);
      this.focusable = focusable;

      /**
       * Validity method property that will cancel the toggle if it returns false
       */

      if (this.settings.valid && !this.settings.valid(this))
        return this;

      /**
       * Toggling before hook
       */

      if (this.settings.before)
        this.settings.before(this);

      /**
       * Toggle Element and Target classes
       */

      if (this.settings.activeClass) {
        this.element.classList.toggle(this.settings.activeClass);
        this.target.classList.toggle(this.settings.activeClass);

        // If there are other toggles that control the same element
        this.others.forEach(other => {
          if (other !== this.element)
            other.classList.toggle(this.settings.activeClass);
        });
      }

      if (this.settings.inactiveClass)
        target.classList.toggle(this.settings.inactiveClass);

      /**
       * Target Element Aria Attributes
       */

      for (i = 0; i < Toggle.targetAriaRoles.length; i++) {
        attr = Toggle.targetAriaRoles[i];
        value = this.target.getAttribute(attr);

        if (value != '' && value)
          this.target.setAttribute(attr, (value === 'true') ? 'false' : 'true');
      }

      /**
       * Toggle the target's focusable children tabindex
       */

      if (this.settings.focusable)
        this.toggleFocusable(this.focusable);

      /**
       * Jump to Target Element if Toggle Element is an anchor link
       */

      if (this.settings.jump && this.element.hasAttribute('href'))
        this.jumpTo(this.element, this.target);

      /**
       * Toggle Element (including multi toggles) Aria Attributes
       */

      for (i = 0; i < Toggle.elAriaRoles.length; i++) {
        attr = Toggle.elAriaRoles[i];
        value = this.element.getAttribute(attr);

        if (value != '' && value)
          this.element.setAttribute(attr, (value === 'true') ? 'false' : 'true');

        // If there are other toggles that control the same element
        this.others.forEach((other) => {
          if (other !== this.element && other.getAttribute(attr))
            other.setAttribute(attr, (value === 'true') ? 'false' : 'true');
        });
      }

      /**
       * Toggling complete hook
       */

      if (this.settings.after)
        this.settings.after(this);

      return this;
    }
  }

  /** @type  {String}  The main selector to add the toggling function to */
  Toggle.selector = '[data-js*="toggle"]';

  /** @type  {String}  The namespace for our data attribute settings */
  Toggle.namespace = 'toggle';

  /** @type  {String}  The hide class */
  Toggle.inactiveClass = 'hidden';

  /** @type  {String}  The active class */
  Toggle.activeClass = 'active';

  /** @type  {Array}  Aria roles to toggle true/false on the toggling element */
  Toggle.elAriaRoles = ['aria-pressed', 'aria-expanded'];

  /** @type  {Array}  Aria roles to toggle true/false on the target element */
  Toggle.targetAriaRoles = ['aria-hidden'];

  /** @type  {Array}  Focusable elements to hide within the hidden target element */
  Toggle.elFocusable = [
    'a', 'button', 'input', 'select', 'textarea', 'object', 'embed', 'form',
    'fieldset', 'legend', 'label', 'area', 'audio', 'video', 'iframe', 'svg',
    'details', 'table', '[tabindex]', '[contenteditable]', '[usemap]'
  ];

  /** @type  {Array}  Key attribute for storing toggles in the window */
  Toggle.callback = ['TogglesCallback'];

  /** @type  {Array}  Default events to to watch for toggling. Each must have a handler in the class and elements to look for in Toggle.elements */
  Toggle.events = ['click', 'change'];

  /** @type  {Array}  Elements to delegate to each event handler */
  Toggle.elements = {
    CLICK: ['A', 'BUTTON'],
    CHANGE: ['SELECT', 'INPUT', 'TEXTAREA']
  };

  /**
   * @class  Dialog
   *
   * Usage
   *
   * Element Attributes. Either <a> or <button>
   *
   * @attr  data-js="dialog"               Instantiates the toggling method
   * @attr  aria-controls=""               Targets the id of the dialog
   * @attr  aria-expanded="false"          Declares target closed/open when toggled
   * @attr  data-dialog="open"             Designates the primary opening element of the dialog
   * @attr  data-dialog="close"            Designates the primary closing element of the dialog
   * @attr  data-dialog-focus-on-close=""  Designates an alternate element to focus on when the dialog closes. Value of the attribute is the id of the dialog.
   * @attr  data-dialog-lock="true"        Wether to lock screen scrolling when dialog is open
   *
   * Target Attributes. Any <element>
   *
   * @attr  id=""               Matches aria-controls attr of Element
   * @attr  class="hidden"      Hidden class
   * @attr  aria-hidden="true"  Declares target open/closed when toggled
   */
  class Dialog {
    /**
     * @constructor  Instantiates dialog and toggle method
     *
     * @return  {Object}  The instantiated dialog with properties
     */
    constructor() {
      this.selector = Dialog.selector;

      this.selectors = Dialog.selectors;

      this.classes = Dialog.classes;

      this.dataAttrs = Dialog.dataAttrs;

      this.toggle = new Toggle({
        selector: this.selector,
        after: (toggle) => {
          let active = toggle.target.classList.contains(Toggle.activeClass);

          // Lock the body from scrolling if lock attribute is present
          if (active && toggle.element.dataset[this.dataAttrs.LOCK] === 'true') {
            // Scroll to the top of the page
            window.scroll(0, 0);

            // Prevent scrolling on the body
            document.querySelector('body').style.overflow = 'hidden';

            // When the last focusable item in the list looses focus loop to the first
            toggle.focusable.item(toggle.focusable.length - 1)
              .addEventListener('blur', () => {
                toggle.focusable.item(0).focus();
              });
          } else {
            // Remove if all other dialog body locks are inactive
            let locks = document.querySelectorAll([
                this.selector,
                this.selectors.locks,
                `.${Toggle.activeClass}`
              ].join(''));

            if (locks.length === 0) {
              document.querySelector('body').style.overflow = '';
            }
          }

          // Focus on the close, open, or other focus element if present
          let id = toggle.target.getAttribute('id');
          let control = `[aria-controls="${id}"]`;
          let close = document.querySelector(this.selectors.CLOSE + control);
          let open = document.querySelector(this.selectors.OPEN + control);

          let focusOnClose = document.querySelector(this.selectors.FOCUS_ON_CLOSE.replace('{{ ID }}', id));

          if (active && close) {
            close.focus();
          } else if (open) {
            // Alternatively focus on this element if it is present
            if (focusOnClose) {
              focusOnClose.setAttribute('tabindex', '-1');
              focusOnClose.focus();
            } else {
              open.focus();
            }
          }
        }
      });

      return this;
    }
  }

  /** @type  {String}  Main DOM selector */
  Dialog.selector = '[data-js*=\"dialog\"]';

  /** @type  {Object}  Additional selectors used by the script */
  Dialog.selectors = {
    CLOSE: '[data-dialog*="close"]',
    OPEN: '[data-dialog*="open"]',
    LOCKS: '[data-dialog-lock="true"]',
    FOCUS_ON_CLOSE: '[data-dialog-focus-on-close="{{ ID }}"]'
  };

  /** @type  {Object}  Data attribute namespaces */
  Dialog.dataAttrs = {
    LOCK: 'dialogLock'
  };

  /**
   * Copy to Clipboard Helper
   */
  class Copy {
    /**
     * @constructor
     *
     * @param   {Object}  s  The settings object, may include 'selector',
     *                       'aria', 'notifyTimeout', 'before', 'copied',
     *                       or 'after' attributes.
     *
     * @return  {Class}      The constructed instance of Copy.
     */
    constructor(s) {
      // Set attributes
      this.selector = (s.hasOwnProperty('selector')) ? s.selector : Copy.selector;

      this.selectors = (s.hasOwnProperty('selectors')) ? s.selectors : Copy.selectors;

      this.aria = (s.hasOwnProperty('aria')) ? s.aria : Copy.aria;

      this.notifyTimeout = (s.hasOwnProperty('notifyTimeout')) ? s.notifyTimeout : Copy.notifyTimeout;

      this.before = (s.hasOwnProperty('before')) ? s.before : Copy.before;

      this.copied = (s.hasOwnProperty('copied')) ? s.copied : Copy.copied;

      this.after = (s.hasOwnProperty('after')) ? s.after : Copy.after;

      // Select the entire text when it's focused on
      document.querySelectorAll(this.selectors.TARGETS).forEach(item => {
        item.addEventListener('focus', () => this.select(item));
        item.addEventListener('click', () => this.select(item));
      });

      // The main click event for the class
      document.querySelector('body').addEventListener('click', event => {
        if (!event.target.matches(this.selector))
          return;

        this.element = event.target;

        this.element.setAttribute(this.aria, false);

        this.target = this.element.dataset.copy;

        this.before(this);

        if (this.copy(this.target)) {
          this.copied(this);

          this.element.setAttribute(this.aria, true);

          clearTimeout(this.element['timeout']);

          this.element['timeout'] = setTimeout(() => {
            this.element.setAttribute(this.aria, false);

            this.after(this);
          }, this.notifyTimeout);
        }
      });

      return this;
    }

    /**
     * The click event handler
     *
     * @param   {String}  target  Content of target data attribute
     *
     * @return  {Boolean}         Wether copy was successful or not
     */
    copy(target) {
      let selector = this.selectors.TARGETS.replace(']', `="${target}"]`);

      let input = document.querySelector(selector);

      this.select(input);

      if (navigator.clipboard && navigator.clipboard.writeText)
        navigator.clipboard.writeText(input.value);
      else if (document.execCommand)
        document.execCommand('copy');
      else
        return false;

      return true;
    }

    /**
     * Handler for the text selection method
     *
     * @param   {Object}  input  The input with content to select
     */
    select(input) {
      input.select();

      input.setSelectionRange(0, 99999);
    }
  }

  /**
   * The main element selector.
   *
   * @var {String}
   */
  Copy.selector = '[data-js*="copy"]';

  /**
   * The selectors for various elements queried by the utility. Refer to the
   * source for defaults.
   *
   * @var {[type]}
   */
  Copy.selectors = {
    TARGETS: '[data-copy-target]'
  };

  /**
   * Button aria role to toggle
   *
   * @var {String}
   */
  Copy.aria = 'aria-pressed';

  /**
   * Timeout for the "Copied!" notification
   *
   * @var {Number}
   */
  Copy.notifyTimeout = 1500;

  /**
   * Before hook. Triggers before the click event.
   *
   * @var {Function}
   */
  Copy.before = () => {};

  /**
   * Copied hook. Triggers after a successful the copy event.
   *
   * @var {Function}
   */
  Copy.copied = () => {};

  /**
   * After hook. Triggers after the click event.
   *
   * @var {Function}
   */
  Copy.after = () => {};

  /**
   * The Icon module
   * @class
   */
  class Icons {
    /**
     * @constructor
     * @param  {String} path The path of the icon file
     * @return {object} The class
     */
    constructor(path) {
      path = (path) ? path : Icons.path;

      fetch(path)
        .then((response) => {
          if (response.ok)
            return response.text();
        })
        .catch((error) => {
        })
        .then((data) => {
          const sprite = document.createElement('div');
          sprite.innerHTML = data;
          sprite.setAttribute('aria-hidden', true);
          sprite.setAttribute('style', 'display: none;');
          document.body.appendChild(sprite);
        });

      return this;
    }
  }

  /** @type {String} The path of the icon file */
  Icons.path = 'svg/icons.svg';

  class SetHeightProperties {
    constructor (s) {
      this.elements = (s.elements) ? s.elements : SetHeightProperties.elements;

      for (let i = 0; i < this.elements.length; i++) {
        if (document.querySelector(this.elements[i]['selector'])) {
          window.addEventListener('load', () => this.setProperty(this.elements[i]));
          window.addEventListener('resize', () => this.setProperty(this.elements[i]));
        } else {
          document.documentElement.style.setProperty(this.elements[i]['property'], '0px');
        }
      }
    }

    setProperty(e) {
      let element = document.querySelector(e['selector']);

      document.documentElement.style.setProperty(e['property'], `${element.clientHeight}px`);
    }
  }

  SetHeightProperties.elements = [];

  /**
   * Cycles through a predefined object of theme classnames and toggles them on
   * the document element based on a click event. Uses local storage to save and
   * refer to a user's preference based on the last theme selected.
   */
  class Themes {
    /**
     * @constructor
     *
     * @param   {Object}  s  The settings object, may include 'storage',
     *                       'selectors', or 'theme' attributes
     *
     * @return  {Class}      The constructed instance of Themes.
     */
    constructor(s = {}) {
      /**
       * Settings
       */

      this.storage = (s.hasOwnProperty('storage')) ?
        Object.assign(Themes.storage, s.storage) : Themes.storage;

      this.selectors = (s.hasOwnProperty('selectors')) ?
        Object.assign(Themes.selectors, s.selectors) : Themes.selectors;

      this.themes = (s.hasOwnProperty('themes')) ? s.themes : Themes.themes;

      this.after = (s.hasOwnProperty('after')) ? s.after : Themes.after;

      this.before = (s.hasOwnProperty('before')) ? s.before : Themes.before;

      /**
       * Get initial user preference
       */

      this.preference = localStorage.getItem(this.storage.THEME);

      if (this.preference)
        this.set(JSON.parse(this.preference));

      /**
       * Add event listeners
       */

      document.querySelector('body').addEventListener('click', event => {
        if (!event.target.matches(this.selectors.TOGGLE))
          return;

        this.target = event.target;

        this.before(this);

        this.click(event);
      });

      return this;
    }

    /**
     * The click handler for theme cycling.
     *
     * @param   {Object}  event  The original click event that invoked the method
     *
     * @return  {Class}          The Themes instance
     */
    click(event) {
      // Get available theme classnames
      let cycle = this.themes.map(t => t.classname);

      // Check to see if the document has any of the theme class settings already
      let intersection = cycle.filter(item => {
        return [...document.documentElement.classList].includes(item)
      });

      // Find the starting index
      let start = (intersection.length === 0) ? 0 : cycle.indexOf(intersection[0]);
      let theme = (typeof cycle[start + 1] === 'undefined') ? cycle[0] : cycle[start + 1];

      // Toggle elements
      this.remove(this.themes.find(t => t.classname === cycle[start]))
        .set(this.themes.find(t => t.classname === theme));

      return this;
    }

    /**
     * The remove method for the theme. Resets all element classes and local storage.
     *
     * @param   {Object}  theme  The theme to remove
     *
     * @return  {Class}          The Themes instance
     */
    remove(theme) {
      document.documentElement.classList.remove(theme.classname);

      document.querySelectorAll(this.selectors.TOGGLE)
        .forEach(element => {
          element.classList.remove(`${theme.classname}${this.selectors.ACTIVE}`);
        });

      localStorage.removeItem(this.storage.THEME);

      return this;
    }

    /**
     * The setter method for theme. Adds element classes and sets local storage.
     *
     * @param   {Object}  theme  The theme object including classname and label
     *
     * @return  {Class}          The Themes instance
     */
    set(theme) {
      this.theme = theme;

      document.documentElement.classList.add(this.theme.classname);

      document.querySelectorAll(this.selectors.TOGGLE)
        .forEach(element => {
          element.classList.add(`${this.theme.classname}${this.selectors.ACTIVE}`);
        });

      document.querySelectorAll(this.selectors.LABEL)
        .forEach(element => {
          element.textContent = this.theme.label;
        });

      localStorage.setItem(this.storage.THEME, JSON.stringify(theme));

      this.after(this);

      return this;
    }
  }
  /**
   * The storage keys used by the script for local storage. The default is
   * `--nyco-theme` for the theme preference.
   *
   * @var {Object}
   */
  Themes.storage = {
    THEME: '--nyco-theme'
  };

  /**
   * The selectors for various elements queried by the utility. Refer to the
   * source for defaults.
   *
   * @var {Object}
   */
  Themes.selectors = {
    TOGGLE: '[data-js="themes"]',
    LABEL: '[data-js-themes="label"]',
    ACTIVE: ':active'
  };

  /**
   * The predefined theme Objects to cycle through, each with a corresponding
   * human-readable text label and classname. The default includes two themes;
   * `default` labelled "Light" theme and `dark` labelled "Dark".
   *
   * @var {Array}
   */
  Themes.themes = [
    {
      label: 'Light',
      classname: 'default'
    },
    {
      label: 'Dark',
      classname: 'dark'
    }
  ];

  /**
   * Before hook
   *
   * @return  {Function}  Triggers before the click event.
   */
  Themes.before = () => {};

  /**
   * After hook
   *
   * @return  {Function}  Triggers after the click event.
   */
  Themes.after = () => {};

  /**
   * Tracking bus for Google analytics and Webtrends.
   */
  class Track {
    constructor(s) {
      const body = document.querySelector('body');

      s = (!s) ? {} : s;

      this._settings = {
        selector: (s.selector) ? s.selector : Track.selector,
      };

      this.desinations = Track.destinations;

      body.addEventListener('click', (event) => {
        if (!event.target.matches(this._settings.selector))
          return;

        let key = event.target.dataset.trackKey;
        let data = JSON.parse(event.target.dataset.trackData);

        this.track(key, data);
      });

      return this;
    }

    /**
     * Tracking function wrapper
     *
     * @param  {String}      key   The key or event of the data
     * @param  {Collection}  data  The data to track
     *
     * @return {Object}            The final data object
     */
    track(key, data) {
      // Set the path name based on the location
      const d = data.map(el => {
          if (el.hasOwnProperty(Track.key))
            el[Track.key] = `${window.location.pathname}/${el[Track.key]}`;
          return el;
        });

      this.webtrends(key, d);
      this.gtag(key, d);
      /* eslint-enable no-console */

      return d;
    };

    /**
     * Data bus for tracking views in Webtrends and Google Analytics
     *
     * @param  {String}      app   The name of the Single Page Application to track
     * @param  {String}      key   The key or event of the data
     * @param  {Collection}  data  The data to track
     */
    view(app, key, data) {
      this.webtrends(key, data);
      this.gtagView(app, key);
      /* eslint-enable no-console */
    };

    /**
     * Push Events to Webtrends
     *
     * @param  {String}      key   The key or event of the data
     * @param  {Collection}  data  The data to track
     */
    webtrends(key, data) {
      if (
        typeof Webtrends === 'undefined' ||
        typeof data === 'undefined' ||
        !this.desinations.includes('webtrends')
      )
        return false;

      let event = [{
        'WT.ti': key
      }];

      if (data[0] && data[0].hasOwnProperty(Track.key))
        event.push({
          'DCS.dcsuri': data[0][Track.key]
        });
      else
        Object.assign(event, data);

      // Format data for Webtrends
      let wtd = {argsa: event.flatMap(e => {
        return Object.keys(e).flatMap(k => [k, e[k]]);
      })};

      // If 'action' is used as the key (for gtag.js), switch it to Webtrends
      let action = data.argsa.indexOf('action');

      if (action) data.argsa[action] = 'DCS.dcsuri';

      // Webtrends doesn't send the page view for MultiTrack, add path to url
      let dcsuri = data.argsa.indexOf('DCS.dcsuri');

      if (dcsuri)
        data.argsa[dcsuri + 1] = window.location.pathname + data.argsa[dcsuri + 1];

      /* eslint-disable no-undef */
      if (typeof Webtrends !== 'undefined')
        Webtrends.multiTrack(wtd);
      /* eslint-disable no-undef */

      return ['Webtrends', wtd];
    };

    /**
     * Push Click Events to Google Analytics
     *
     * @param  {String}      key   The key or event of the data
     * @param  {Collection}  data  The data to track
     */
    gtag(key, data) {
      if (
        typeof gtag === 'undefined' ||
        typeof data === 'undefined' ||
        !this.desinations.includes('gtag')
      )
        return false;

      let uri = data.find((element) => element.hasOwnProperty(Track.key));

      let event = {
        'event_category': key
      };

      /* eslint-disable no-undef */
      gtag(Track.key, uri[Track.key], event);
      /* eslint-enable no-undef */

      return ['gtag', Track.key, uri[Track.key], event];
    };

    /**
     * Push Screen View Events to Google Analytics
     *
     * @param  {String}  app  The name of the application
     * @param  {String}  key  The key or event of the data
     */
    gtagView(app, key) {
      if (
        typeof gtag === 'undefined' ||
        typeof data === 'undefined' ||
        !this.desinations.includes('gtag')
      )
        return false;

      let view = {
        app_name: app,
        screen_name: key
      };

      /* eslint-disable no-undef */
      gtag('event', 'screen_view', view);
      /* eslint-enable no-undef */

      return ['gtag', Track.key, 'screen_view', view];
    };
  }

  /** @type {String} The main selector to add the tracking function to */
  Track.selector = '[data-js*="track"]';

  /** @type {String} The main event tracking key to map to Webtrends DCS.uri */
  Track.key = 'event';

  /** @type {Array} What destinations to push data to */
  Track.destinations = [
    'webtrends',
    'gtag'
  ];

  /**
   * A wrapper around the navigator.share() API
   */
  class WebShare {
    /**
     * @constructor
     */
    constructor(s = {}) {
      this.selector = (s.selector) ? s.selector : WebShare.selector;

      this.callback = (s.callback) ? s.callback : WebShare.callback;

      this.fallback = (s.fallback) ? s.fallback : WebShare.fallback;

      this.fallbackCondition = (s.fallbackCondition) ? s.fallbackCondition : WebShare.fallbackCondition;

      if (this.fallbackCondition()) {
        // Remove fallback aria toggling attributes
        document.querySelectorAll(this.selector).forEach(item => {
          item.removeAttribute('aria-controls');
          item.removeAttribute('aria-expanded');
        });

        // Add event listener for the share click
        document.querySelector('body').addEventListener('click', event => {
          if (!event.target.matches(this.selector))
            return;

          this.element = event.target;

          this.data = JSON.parse(this.element.dataset.webShare);

          this.share(this.data);
        });
      } else
        this.fallback(); // Execute the fallback

      return this;
    }

    /**
     * Web Share API handler
     *
     * @param   {Object}  data  An object containing title, url, and text.
     *
     * @return  {Promise}       The response of the .share() method.
     */
    share(data = {}) {
      return navigator.share(data)
        .then(res => {
          this.callback(data);
        }).catch(err => {
        });
    }
  }

  /** The html selector for the component */
  WebShare.selector = '[data-js*="web-share"]';

  /** Placeholder callback for a successful send */
  WebShare.callback = () => {
  };

  /** Placeholder for the WebShare fallback */
  WebShare.fallback = () => {
  };

  /** Conditional function for the Web Share fallback */
  WebShare.fallbackCondition = () => {
    return navigator.share;
  };

  /**
   * @class  Set the the css variable '--100vh' to the size of the Window's inner height.
   */
  class WindowVh {
    /**
     * @constructor  Set event listeners
     */
    constructor(s = {}) {
      this.property = (s.property) ? s.property : WindowVh.property;

      window.addEventListener('load', () => {this.set();});

      window.addEventListener('resize', () => {this.set();});

      return this;
    }

    /**
     * Sets the css variable property
     */
    set() {
      document.documentElement.style
        .setProperty(this.property, `${window.innerHeight}px`);
    }
  }

  /** @param  {String}  property  The css variable string to set */
  WindowVh.property = '--100vh';

  /* eslint-env browser */

  /**
   * Sends a configuration object to Rollbar, the most important config is
   * the code_version which maps to the source maps version.
   *
   * @source https://docs.rollbar.com/docs/rollbarjs-configuration-reference
   */
  class RollbarConfigure {
    /**
     * Adds Rollbar configuration to the page if the snippet has been included.
     *
     * @constructor
     */
    constructor() {
      // Get the script version based on the hash value in the file.
      let scripts = document.getElementsByTagName('script');
      let source = scripts[scripts.length - 1].src;
      let path = source.split('/');
      let basename = path[path.length - 1];
      let hash = basename.split(RollbarConfigure.hashDelimeter)[1].replace('.js', '');

      // Copy the default configuration and add the current version number.
      let config = Object.assign({}, RollbarConfigure.config);

      config.payload.client.javascript.code_version = hash;

      window.addEventListener('load', () => {
        // eslint-disable-next-line no-undef
        if (typeof Rollbar === 'undefined') {

          return false;
        }

        // eslint-disable-next-line no-undef
        Rollbar.configure(config);
      });
    }
  }

  /**
   * Rollbar Hash Delimiter
   */
  RollbarConfigure.hashDelimeter = '-';

  /**
   * @type {Object} The default Rollbar configuration
   */
  RollbarConfigure.config = {
    payload: {
      client: {
        javascript: {
          // This is will be true by default if you have enabled this in settings.
          source_map_enabled: true,
          // Optionally guess which frames the error was thrown from when the browser
          // does not provide line and column numbers.
          guess_uncaught_frames: true
        }
      }
    }
  };

  /**
   * The Accordion module
   * @class
   */
  class Accordion {
    /**
     * @constructor
     *
     * @return {object} The class
     */
    constructor() {
      this._toggle = new Toggle({
        selector: Accordion.selector
      });

      return this;
    }
  }

  /**
   * The dom selector for the module
   *
   * @type {String}
   */
  Accordion.selector = '[data-js*="accordion"]';

  /**
   * A wrapper around Intersection Observer class
   */
  class Observe {
    constructor(s = {}) {
      if (!s.element) return;

      this.options = (s.options) ? Object.assign(Observe.options, s.options) : Observe.options;

      this.trigger = (s.trigger) ? s.trigger : Observe.trigger;

      this.selectors = (s.selectors) ? s.selectors : Observe.selectors;

      // Instantiate the Intersection Observer
      this.observer = new IntersectionObserver((entries, observer) => {
        this.callback(entries, observer);
      }, this.options);

      // Select all of the items to observe
      let selectorItem = this.selectors.ITEM.replace('{{ item }}',
          s.element.dataset[this.selectors.ITEMS_ATTR]);

      this.items = s.element.querySelectorAll(selectorItem);

      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];

        this.observer.observe(item);
      }
    }

    callback(entries, observer) {
      let prevEntry = entries[0];

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        this.trigger(entry, prevEntry, observer);

        prevEntry = entry;
      }
    }
  }

  /** Options for the Intersection Observer API */
  Observe.options = {
    root: null,
    rootMargin: '0px',
    threshold: [0.15]
  };

  /** Placeholder entry function for what happens with items are observed */
  Observe.trigger = entry => {
    console.dir(entry);
    console.dir('Observed! Create a entry trigger function and pass it to the instantiated Observe settings object.');
  };

  /** Main selector for the utility */
  Observe.selector = '[data-js*="observe"]';

  /** Misc. selectors for the observer utility */
  Observe.selectors = {
    ITEM: '[data-js-observe-item="{{ item }}"]',
    ITEMS_ATTR: 'jsObserveItems'
  };

  class ActiveNavigation {
    /**
     * @constructor
     *
     * @return {Object}  The instantiated pattern
     */
    constructor(s = {}) {
      this.selector = (s.selector) ? s.selector : ActiveNavigation.selector;

      this.selectors = (s.selectors) ?
        Object.assign(ActiveNavigation.selectors, s.selectors) : ActiveNavigation.selectors;

      this.observeOptions = (s.observeOptions) ?
        Object.assign(ActiveNavigation.observeOptions, s.observeOptions) : ActiveNavigation.observeOptions;

      /**
       * Method for toggling the jump navigation item, used by the click event
       * handler and the intersection observer event handler.
       *
       * @var NodeElement
       */
       const jumpClassToggle = item => {
        for (let i = 0; i < item.parentNode.children.length; i++) {
          const sibling = item.parentNode.children[i];

          if (this.selectors.FOCUS_ATTR in sibling.dataset) {
            let classActive = sibling.dataset.activeNavigationItem.split(' ');
            let classInactive = sibling.dataset.inactiveNavigationItem.split(' ');

            if (sibling.classList.contains(...classActive)) {
              sibling.classList.remove(...classActive);
              sibling.classList.add(...classInactive);
            }
          }
        }

        item.classList.remove(...item.dataset.inactiveNavigationItem.split(' '));
        item.classList.add(...item.dataset.activeNavigationItem.split(' '));
      };

      /**
       * Click event handler for jump navigation items
       *
       * @var NodeElement
       */
      (element => {
        if (element) {
          let activeNavigation = element.querySelectorAll('a[data-active-navigation-item]');

          for (let i = 0; i < activeNavigation.length; i++) {
            const a = activeNavigation[i];

            a.addEventListener('click', event => {
              setTimeout(() => {
                jumpClassToggle(event.target);

                let item = document.querySelector(event.target.getAttribute('href'));
                let focusItem = item.querySelector(this.selectors.FOCUS);

                if (focusItem) {
                  focusItem.setAttribute('tabindex', '-1');
                  focusItem.focus();
                }
              }, 200);
            });
          }
        }
      })(document.querySelector(this.selector));

      /**
       * Intersection Observer event handler for jump navigation items
       *
       * @var NodeElementList
       */
      (elements => {
        elements.forEach(element => {
          new Observe({
            element: element,
            options: this.observeOptions,
            selectors: {
              ITEM: this.selectors.OBSERVE_ITEM,
              ITEMS_ATTR: this.selectors.OBSERVE_ITEMS_ATTR
            },
            trigger: (entry) => {
              if (!entry.isIntersecting) return;

              let jumpItem = document.querySelector(`a[href="#${entry.target.id}"]`);

              if (!jumpItem) return;

              jumpItem.closest(this.selectors.SCROLL).scrollTo({
                left: jumpItem.offsetLeft,
                top: 0,
                behavior: 'smooth'
              });

              let focusItems = document.querySelectorAll(this.selectors.FOCUS);

              for (let i = 0; i < focusItems.length; i++) {
                focusItems[i].removeAttribute('tabindex');
              }

              jumpClassToggle(jumpItem);
            }
          });
        });
      })(document.querySelectorAll(this.selectors.OBSERVE));
    }
  }

  /** @type {String}  Main DOM selector */
  ActiveNavigation.selector = '[data-js*=\"active-navigation\"]';

  /** @type {Object}  Selectors for the element */
  ActiveNavigation.selectors = {
    OBSERVE: '[data-active-navigation="observe"]',
    OBSERVE_ITEM: '[data-active-navigation-observe-item="{{ item }}"]',
    OBSERVE_ITEMS_ATTR: 'activeNavigationObserveItems',
    SCROLL: '[data-active-navigation="scroll"]',
    FOCUS: '[data-active-navigation-item="focus"]',
    FOCUS_ATTR: 'activeNavigationItem'
  };

  /** @type {Object}  Observation utility options */
  ActiveNavigation.observeOptions = {
    root: null,
    rootMargin: '0px',
    threshold: [0.15]
  };

  /**
   * The Search module
   *
   * @class
   */
  class Search {
    /**
     * @constructor
     *
     * @return {object} The class
     */
    constructor() {
      this._toggle = new Toggle({
        selector: Search.selector,
        after: (toggle) => {
          let el = document.querySelector(Search.selector);
          let input = document.querySelector(Search.selectors.input);

          if (el.className.includes('active') && input) {
            input.focus();
          }
        }
      });

      return this;
    }
  }

  /**
   * The dom selector for the module
   * @type {String}
   */
  Search.selector = '[data-js*="search"]';

  Search.selectors = {
    input: '[data-search*="input"]'
  };

  /**
   * The Mobile Nav module
   *
   * @class
   */
  class Menu {
    /**
     * @constructor
     *
     * @return  {object}  The class
     */
    constructor() {
      this.selector = Menu.selector;

      this.selectors = Menu.selectors;

      this.toggle = new Toggle({
        selector: this.selector,
        after: toggle => {
          // Shift focus from the open to the close button in the Mobile Menu when toggled
          if (toggle.target.classList.contains(Toggle.activeClass)) {
            toggle.target.querySelector(this.selectors.CLOSE).focus();

            // When the last focusable item in the list looses focus loop to the first
            toggle.focusable.item(toggle.focusable.length - 1)
              .addEventListener('blur', () => {
                toggle.focusable.item(0).focus();
              });
          } else {
            document.querySelector(this.selectors.OPEN).focus();
          }
        }
      });

      return this;
    }
  }

  /** @type  {String}  The dom selector for the module */
  Menu.selector = '[data-js*="menu"]';

  /** @type  {Object}  Additional selectors used by the script */
  Menu.selectors = {
    CLOSE: '[data-js-menu*="close"]',
    OPEN: '[data-js-menu*="open"]'
  };

  /**
   * Utilities
   */

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
    version: '2.0.2'
  };

  let themeDark = {
    label: 'Light Theme',
    classname: 'dark',
    icon: 'lucide-sun',
    version: '2.0.2'
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

})();
