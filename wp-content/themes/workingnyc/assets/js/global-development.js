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
          else
            // eslint-disable-next-line no-console
            console.dir(response);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.dir(error);
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

      let wt = this.webtrends(key, d);
      let ga = this.gtag(key, d);

      /* eslint-disable no-console */
      console.dir({'Track': [wt, ga]});
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
      let wt = this.webtrends(key, data);
      let ga = this.gtagView(app, key);

      /* eslint-disable no-console */
      console.dir({'Track': [wt, ga]});
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
          console.dir(err);
        });
    }
  }

  /** The html selector for the component */
  WebShare.selector = '[data-js*="web-share"]';

  /** Placeholder callback for a successful send */
  WebShare.callback = () => {
    console.dir('Success!');
  };

  /** Placeholder for the WebShare fallback */
  WebShare.fallback = () => {
    console.dir('Fallback!');
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
          {
            // eslint-disable-next-line no-console
            console.log('Rollbar is not defined.');
          }

          return false;
        }

        // eslint-disable-next-line no-undef
        let rollbarConfigure = Rollbar.configure(config);
        let msg = `Configured Rollbar with '${hash}'`;

        {
          // eslint-disable-next-line no-console
          console.log(`${msg}:`);

          // eslint-disable-next-line no-console
          console.dir(rollbarConfigure);

          Rollbar.debug(msg); // eslint-disable-line no-undef
        }
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
    version: '3.0.0'
  };

  let themeDark = {
    label: 'Light Theme',
    classname: 'dark',
    icon: 'lucide-sun',
    version: '3.0.0'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLWRldmVsb3BtZW50LmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL3RvZ2dsZS90b2dnbGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL2RpYWxvZy9kaWFsb2cuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL2NvcHkvY29weS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Abnljb3Bwb3J0dW5pdHkvcHR0cm4tc2NyaXB0cy9zcmMvaWNvbnMvaWNvbnMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL3NldC1oZWlnaHQtcHJvcGVydGllcy9zZXQtaGVpZ2h0LXByb3BlcnRpZXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL3RoZW1lcy90aGVtZXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL3RyYWNrL3RyYWNrLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy93ZWItc2hhcmUvd2ViLXNoYXJlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy93aW5kb3ctdmgvd2luZG93LXZoLmpzIiwiLi4vLi4vc3JjL2pzL21vZHVsZXMvcm9sbGJhci1jb25maWd1cmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3N0YW5kYXJkL3NyYy9jb21wb25lbnRzL2FjY29yZGlvbi9hY2NvcmRpb24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL29ic2VydmUvb2JzZXJ2ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Abnljb3Bwb3J0dW5pdHkvc3RhbmRhcmQvc3JjL2NvbXBvbmVudHMvYWN0aXZlLW5hdmlnYXRpb24vYWN0aXZlLW5hdmlnYXRpb24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3N0YW5kYXJkL3NyYy9vYmplY3RzL3NlYXJjaC9zZWFyY2guanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3BhdHRlcm4tbWVudS9zcmMvbWVudS5qcyIsIi4uLy4uL3NyYy9qcy9nbG9iYWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFRoZSBTaW1wbGUgVG9nZ2xlIGNsYXNzLiBUaGlzIHdpbGwgdG9nZ2xlIHRoZSBjbGFzcyAnYWN0aXZlJyBhbmQgJ2hpZGRlbidcbiAqIG9uIHRhcmdldCBlbGVtZW50cywgZGV0ZXJtaW5lZCBieSBhIGNsaWNrIGV2ZW50IG9uIGEgc2VsZWN0ZWQgbGluayBvclxuICogZWxlbWVudC4gVGhpcyB3aWxsIGFsc28gdG9nZ2xlIHRoZSBhcmlhLWhpZGRlbiBhdHRyaWJ1dGUgZm9yIHRhcmdldGVkXG4gKiBlbGVtZW50cyB0byBzdXBwb3J0IHNjcmVlbiByZWFkZXJzLiBUYXJnZXQgc2V0dGluZ3MgYW5kIG90aGVyIGZ1bmN0aW9uYWxpdHlcbiAqIGNhbiBiZSBjb250cm9sbGVkIHRocm91Z2ggZGF0YSBhdHRyaWJ1dGVzLlxuICpcbiAqIFRoaXMgdXNlcyB0aGUgLm1hdGNoZXMoKSBtZXRob2Qgd2hpY2ggd2lsbCByZXF1aXJlIGEgcG9seWZpbGwgZm9yIElFXG4gKiBodHRwczovL3BvbHlmaWxsLmlvL3YyL2RvY3MvZmVhdHVyZXMvI0VsZW1lbnRfcHJvdG90eXBlX21hdGNoZXNcbiAqXG4gKiBAY2xhc3NcbiAqL1xuY2xhc3MgVG9nZ2xlIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBzICBTZXR0aW5ncyBmb3IgdGhpcyBUb2dnbGUgaW5zdGFuY2VcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgVGhlIGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzKSB7XG4gICAgLy8gQ3JlYXRlIGFuIG9iamVjdCB0byBzdG9yZSBleGlzdGluZyB0b2dnbGUgbGlzdGVuZXJzIChpZiBpdCBkb2Vzbid0IGV4aXN0KVxuICAgIGlmICghd2luZG93Lmhhc093blByb3BlcnR5KFRvZ2dsZS5jYWxsYmFjaykpXG4gICAgICB3aW5kb3dbVG9nZ2xlLmNhbGxiYWNrXSA9IFtdO1xuXG4gICAgcyA9ICghcykgPyB7fSA6IHM7XG5cbiAgICB0aGlzLnNldHRpbmdzID0ge1xuICAgICAgc2VsZWN0b3I6IChzLnNlbGVjdG9yKSA/IHMuc2VsZWN0b3IgOiBUb2dnbGUuc2VsZWN0b3IsXG4gICAgICBuYW1lc3BhY2U6IChzLm5hbWVzcGFjZSkgPyBzLm5hbWVzcGFjZSA6IFRvZ2dsZS5uYW1lc3BhY2UsXG4gICAgICBpbmFjdGl2ZUNsYXNzOiAocy5pbmFjdGl2ZUNsYXNzKSA/IHMuaW5hY3RpdmVDbGFzcyA6IFRvZ2dsZS5pbmFjdGl2ZUNsYXNzLFxuICAgICAgYWN0aXZlQ2xhc3M6IChzLmFjdGl2ZUNsYXNzKSA/IHMuYWN0aXZlQ2xhc3MgOiBUb2dnbGUuYWN0aXZlQ2xhc3MsXG4gICAgICBiZWZvcmU6IChzLmJlZm9yZSkgPyBzLmJlZm9yZSA6IGZhbHNlLFxuICAgICAgYWZ0ZXI6IChzLmFmdGVyKSA/IHMuYWZ0ZXIgOiBmYWxzZSxcbiAgICAgIHZhbGlkOiAocy52YWxpZCkgPyBzLnZhbGlkIDogZmFsc2UsXG4gICAgICBmb2N1c2FibGU6IChzLmhhc093blByb3BlcnR5KCdmb2N1c2FibGUnKSkgPyBzLmZvY3VzYWJsZSA6IHRydWUsXG4gICAgICBqdW1wOiAocy5oYXNPd25Qcm9wZXJ0eSgnanVtcCcpKSA/IHMuanVtcCA6IHRydWVcbiAgICB9O1xuXG4gICAgLy8gU3RvcmUgdGhlIGVsZW1lbnQgZm9yIHBvdGVudGlhbCB1c2UgaW4gY2FsbGJhY2tzXG4gICAgdGhpcy5lbGVtZW50ID0gKHMuZWxlbWVudCkgPyBzLmVsZW1lbnQgOiBmYWxzZTtcblxuICAgIGlmICh0aGlzLmVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZShldmVudCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdGhlcmUgaXNuJ3QgYW4gZXhpc3RpbmcgaW5zdGFudGlhdGVkIHRvZ2dsZSwgYWRkIHRoZSBldmVudCBsaXN0ZW5lci5cbiAgICAgIGlmICghd2luZG93W1RvZ2dsZS5jYWxsYmFja10uaGFzT3duUHJvcGVydHkodGhpcy5zZXR0aW5ncy5zZWxlY3RvcikpIHtcbiAgICAgICAgbGV0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBUb2dnbGUuZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHRnZ2xlRXZlbnQgPSBUb2dnbGUuZXZlbnRzW2ldO1xuXG4gICAgICAgICAgYm9keS5hZGRFdmVudExpc3RlbmVyKHRnZ2xlRXZlbnQsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGlmICghZXZlbnQudGFyZ2V0Lm1hdGNoZXModGhpcy5zZXR0aW5ncy5zZWxlY3RvcikpXG4gICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5ldmVudCA9IGV2ZW50O1xuXG4gICAgICAgICAgICBsZXQgdHlwZSA9IGV2ZW50LnR5cGUudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICB0aGlzW2V2ZW50LnR5cGVdICYmXG4gICAgICAgICAgICAgIFRvZ2dsZS5lbGVtZW50c1t0eXBlXSAmJlxuICAgICAgICAgICAgICBUb2dnbGUuZWxlbWVudHNbdHlwZV0uaW5jbHVkZXMoZXZlbnQudGFyZ2V0LnRhZ05hbWUpXG4gICAgICAgICAgICApIHRoaXNbZXZlbnQudHlwZV0oZXZlbnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVjb3JkIHRoYXQgYSB0b2dnbGUgdXNpbmcgdGhpcyBzZWxlY3RvciBoYXMgYmVlbiBpbnN0YW50aWF0ZWQuXG4gICAgLy8gVGhpcyBwcmV2ZW50cyBkb3VibGUgdG9nZ2xpbmcuXG4gICAgd2luZG93W1RvZ2dsZS5jYWxsYmFja11bdGhpcy5zZXR0aW5ncy5zZWxlY3Rvcl0gPSB0cnVlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ2xpY2sgZXZlbnQgaGFuZGxlclxuICAgKlxuICAgKiBAcGFyYW0gIHtFdmVudH0gIGV2ZW50ICBUaGUgb3JpZ2luYWwgY2xpY2sgZXZlbnRcbiAgICovXG4gIGNsaWNrKGV2ZW50KSB7XG4gICAgdGhpcy50b2dnbGUoZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIElucHV0L3NlbGVjdC90ZXh0YXJlYSBjaGFuZ2UgZXZlbnQgaGFuZGxlci4gQ2hlY2tzIHRvIHNlZSBpZiB0aGVcbiAgICogZXZlbnQudGFyZ2V0IGlzIHZhbGlkIHRoZW4gdG9nZ2xlcyBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQHBhcmFtICB7RXZlbnR9ICBldmVudCAgVGhlIG9yaWdpbmFsIGlucHV0IGNoYW5nZSBldmVudFxuICAgKi9cbiAgY2hhbmdlKGV2ZW50KSB7XG4gICAgbGV0IHZhbGlkID0gZXZlbnQudGFyZ2V0LmNoZWNrVmFsaWRpdHkoKTtcblxuICAgIGlmICh2YWxpZCAmJiAhdGhpcy5pc0FjdGl2ZShldmVudC50YXJnZXQpKSB7XG4gICAgICB0aGlzLnRvZ2dsZShldmVudCk7IC8vIHNob3dcbiAgICB9IGVsc2UgaWYgKCF2YWxpZCAmJiB0aGlzLmlzQWN0aXZlKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgIHRoaXMudG9nZ2xlKGV2ZW50KTsgLy8gaGlkZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB0byBzZWUgaWYgdGhlIHRvZ2dsZSBpcyBhY3RpdmVcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgZWxlbWVudCAgVGhlIHRvZ2dsZSBlbGVtZW50ICh0cmlnZ2VyKVxuICAgKi9cbiAgaXNBY3RpdmUoZWxlbWVudCkge1xuICAgIGxldCBhY3RpdmUgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKSB7XG4gICAgICBhY3RpdmUgPSBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKVxuICAgIH1cblxuICAgIC8vIGlmICgpIHtcbiAgICAgIC8vIFRvZ2dsZS5lbGVtZW50QXJpYVJvbGVzXG4gICAgICAvLyBUT0RPOiBBZGQgY2F0Y2ggdG8gc2VlIGlmIGVsZW1lbnQgYXJpYSByb2xlcyBhcmUgdG9nZ2xlZFxuICAgIC8vIH1cblxuICAgIC8vIGlmICgpIHtcbiAgICAgIC8vIFRvZ2dsZS50YXJnZXRBcmlhUm9sZXNcbiAgICAgIC8vIFRPRE86IEFkZCBjYXRjaCB0byBzZWUgaWYgdGFyZ2V0IGFyaWEgcm9sZXMgYXJlIHRvZ2dsZWRcbiAgICAvLyB9XG5cbiAgICByZXR1cm4gYWN0aXZlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgdGFyZ2V0IG9mIHRoZSB0b2dnbGUgZWxlbWVudCAodHJpZ2dlcilcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgZWwgIFRoZSB0b2dnbGUgZWxlbWVudCAodHJpZ2dlcilcbiAgICovXG4gIGdldFRhcmdldChlbGVtZW50KSB7XG4gICAgbGV0IHRhcmdldCA9IGZhbHNlO1xuXG4gICAgLyoqIEFuY2hvciBMaW5rcyAqL1xuICAgIHRhcmdldCA9IChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnaHJlZicpKSA/XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpIDogdGFyZ2V0O1xuXG4gICAgLyoqIFRvZ2dsZSBDb250cm9scyAqL1xuICAgIHRhcmdldCA9IChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpKSA/XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpfWApIDogdGFyZ2V0O1xuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdG9nZ2xlIGV2ZW50IHByb3h5IGZvciBnZXR0aW5nIGFuZCBzZXR0aW5nIHRoZSBlbGVtZW50L3MgYW5kIHRhcmdldFxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBldmVudCAgVGhlIG1haW4gY2xpY2sgZXZlbnRcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgIFRoZSBUb2dnbGUgaW5zdGFuY2VcbiAgICovXG4gIHRvZ2dsZShldmVudCkge1xuICAgIGxldCBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuICAgIGxldCB0YXJnZXQgPSBmYWxzZTtcbiAgICBsZXQgZm9jdXNhYmxlID0gW107XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGFyZ2V0ID0gdGhpcy5nZXRUYXJnZXQoZWxlbWVudCk7XG5cbiAgICAvKiogRm9jdXNhYmxlIENoaWxkcmVuICovXG4gICAgZm9jdXNhYmxlID0gKHRhcmdldCkgP1xuICAgICAgdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoVG9nZ2xlLmVsRm9jdXNhYmxlLmpvaW4oJywgJykpIDogZm9jdXNhYmxlO1xuXG4gICAgLyoqIE1haW4gRnVuY3Rpb25hbGl0eSAqL1xuICAgIGlmICghdGFyZ2V0KSByZXR1cm4gdGhpcztcbiAgICB0aGlzLmVsZW1lbnRUb2dnbGUoZWxlbWVudCwgdGFyZ2V0LCBmb2N1c2FibGUpO1xuXG4gICAgLyoqIFVuZG8gKi9cbiAgICBpZiAoZWxlbWVudC5kYXRhc2V0W2Ake3RoaXMuc2V0dGluZ3MubmFtZXNwYWNlfVVuZG9gXSkge1xuICAgICAgY29uc3QgdW5kbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGVsZW1lbnQuZGF0YXNldFtgJHt0aGlzLnNldHRpbmdzLm5hbWVzcGFjZX1VbmRvYF1cbiAgICAgICk7XG5cbiAgICAgIHVuZG8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5lbGVtZW50VG9nZ2xlKGVsZW1lbnQsIHRhcmdldCk7XG4gICAgICAgIHVuZG8ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBvdGhlciB0b2dnbGVzIHRoYXQgbWlnaHQgY29udHJvbCB0aGUgc2FtZSBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSAgIHtPYmplY3R9ICAgIGVsZW1lbnQgIFRoZSB0b2dnbGluZyBlbGVtZW50XG4gICAqXG4gICAqIEByZXR1cm4gIHtOb2RlTGlzdH0gICAgICAgICAgIExpc3Qgb2Ygb3RoZXIgdG9nZ2xpbmcgZWxlbWVudHNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdCBjb250cm9sIHRoZSB0YXJnZXRcbiAgICovXG4gIGdldE90aGVycyhlbGVtZW50KSB7XG4gICAgbGV0IHNlbGVjdG9yID0gZmFsc2U7XG5cbiAgICBpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2hyZWYnKSkge1xuICAgICAgc2VsZWN0b3IgPSBgW2hyZWY9XCIke2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyl9XCJdYDtcbiAgICB9IGVsc2UgaWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJykpIHtcbiAgICAgIHNlbGVjdG9yID0gYFthcmlhLWNvbnRyb2xzPVwiJHtlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpfVwiXWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIChzZWxlY3RvcikgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSA6IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGUgdGhlIFRvZ2dsZSBUYXJnZXQncyBmb2N1c2FibGUgY2hpbGRyZW4gZnJvbSBmb2N1cy5cbiAgICogSWYgYW4gZWxlbWVudCBoYXMgdGhlIGRhdGEtYXR0cmlidXRlIGBkYXRhLXRvZ2dsZS10YWJpbmRleGBcbiAgICogaXQgd2lsbCB1c2UgdGhhdCBhcyB0aGUgZGVmYXVsdCB0YWIgaW5kZXggb2YgdGhlIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSAgIHtOb2RlTGlzdH0gIGVsZW1lbnRzICBMaXN0IG9mIGZvY3VzYWJsZSBlbGVtZW50c1xuICAgKlxuICAgKiBAcmV0dXJuICB7T2JqZWN0fSAgICAgICAgICAgICAgVGhlIFRvZ2dsZSBJbnN0YW5jZVxuICAgKi9cbiAgdG9nZ2xlRm9jdXNhYmxlKGVsZW1lbnRzKSB7XG4gICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgIGxldCB0YWJpbmRleCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpO1xuXG4gICAgICBpZiAodGFiaW5kZXggPT09ICctMScpIHtcbiAgICAgICAgbGV0IGRhdGFEZWZhdWx0ID0gZWxlbWVudFxuICAgICAgICAgIC5nZXRBdHRyaWJ1dGUoYGRhdGEtJHtUb2dnbGUubmFtZXNwYWNlfS10YWJpbmRleGApO1xuXG4gICAgICAgIGlmIChkYXRhRGVmYXVsdCkge1xuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIGRhdGFEZWZhdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBKdW1wcyB0byBFbGVtZW50IHZpc2libHkgYW5kIHNoaWZ0cyBmb2N1c1xuICAgKiB0byB0aGUgZWxlbWVudCBieSBzZXR0aW5nIHRoZSB0YWJpbmRleFxuICAgKlxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgZWxlbWVudCAgVGhlIFRvZ2dsaW5nIEVsZW1lbnRcbiAgICogQHBhcmFtICAge09iamVjdH0gIHRhcmdldCAgIFRoZSBUYXJnZXQgRWxlbWVudFxuICAgKlxuICAgKiBAcmV0dXJuICB7T2JqZWN0fSAgICAgICAgICAgVGhlIFRvZ2dsZSBpbnN0YW5jZVxuICAgKi9cbiAganVtcFRvKGVsZW1lbnQsIHRhcmdldCkge1xuICAgIC8vIFJlc2V0IHRoZSBoaXN0b3J5IHN0YXRlLiBUaGlzIHdpbGwgY2xlYXIgb3V0XG4gICAgLy8gdGhlIGhhc2ggd2hlbiB0aGUgdGFyZ2V0IGlzIHRvZ2dsZWQgY2xvc2VkXG4gICAgaGlzdG9yeS5wdXNoU3RhdGUoJycsICcnLFxuICAgICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG5cbiAgICAvLyBGb2N1cyBpZiBhY3RpdmVcbiAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKSkge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuXG4gICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG4gICAgICB0YXJnZXQuZm9jdXMoe3ByZXZlbnRTY3JvbGw6IHRydWV9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbWFpbiB0b2dnbGluZyBtZXRob2QgZm9yIGF0dHJpYnV0ZXNcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgICBlbGVtZW50ICAgIFRoZSBUb2dnbGUgZWxlbWVudFxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICAgIHRhcmdldCAgICAgVGhlIFRhcmdldCBlbGVtZW50IHRvIHRvZ2dsZSBhY3RpdmUvaGlkZGVuXG4gICAqIEBwYXJhbSAge05vZGVMaXN0fSAgZm9jdXNhYmxlICBBbnkgZm9jdXNhYmxlIGNoaWxkcmVuIGluIHRoZSB0YXJnZXRcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgIFRoZSBUb2dnbGUgaW5zdGFuY2VcbiAgICovXG4gIGVsZW1lbnRUb2dnbGUoZWxlbWVudCwgdGFyZ2V0LCBmb2N1c2FibGUgPSBbXSkge1xuICAgIGxldCBpID0gMDtcbiAgICBsZXQgYXR0ciA9ICcnO1xuICAgIGxldCB2YWx1ZSA9ICcnO1xuXG4gICAgLyoqXG4gICAgICogU3RvcmUgZWxlbWVudHMgZm9yIHBvdGVudGlhbCB1c2UgaW4gY2FsbGJhY2tzXG4gICAgICovXG5cbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMub3RoZXJzID0gdGhpcy5nZXRPdGhlcnMoZWxlbWVudCk7XG4gICAgdGhpcy5mb2N1c2FibGUgPSBmb2N1c2FibGU7XG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGl0eSBtZXRob2QgcHJvcGVydHkgdGhhdCB3aWxsIGNhbmNlbCB0aGUgdG9nZ2xlIGlmIGl0IHJldHVybnMgZmFsc2VcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLnZhbGlkICYmICF0aGlzLnNldHRpbmdzLnZhbGlkKHRoaXMpKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGluZyBiZWZvcmUgaG9va1xuICAgICAqL1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYmVmb3JlKVxuICAgICAgdGhpcy5zZXR0aW5ncy5iZWZvcmUodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGUgRWxlbWVudCBhbmQgVGFyZ2V0IGNsYXNzZXNcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKTtcbiAgICAgIHRoaXMudGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUodGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzcyk7XG5cbiAgICAgIC8vIElmIHRoZXJlIGFyZSBvdGhlciB0b2dnbGVzIHRoYXQgY29udHJvbCB0aGUgc2FtZSBlbGVtZW50XG4gICAgICB0aGlzLm90aGVycy5mb3JFYWNoKG90aGVyID0+IHtcbiAgICAgICAgaWYgKG90aGVyICE9PSB0aGlzLmVsZW1lbnQpXG4gICAgICAgICAgb3RoZXIuY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmluYWN0aXZlQ2xhc3MpXG4gICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLnNldHRpbmdzLmluYWN0aXZlQ2xhc3MpO1xuXG4gICAgLyoqXG4gICAgICogVGFyZ2V0IEVsZW1lbnQgQXJpYSBBdHRyaWJ1dGVzXG4gICAgICovXG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgVG9nZ2xlLnRhcmdldEFyaWFSb2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0ciA9IFRvZ2dsZS50YXJnZXRBcmlhUm9sZXNbaV07XG4gICAgICB2YWx1ZSA9IHRoaXMudGFyZ2V0LmdldEF0dHJpYnV0ZShhdHRyKTtcblxuICAgICAgaWYgKHZhbHVlICE9ICcnICYmIHZhbHVlKVxuICAgICAgICB0aGlzLnRhcmdldC5zZXRBdHRyaWJ1dGUoYXR0ciwgKHZhbHVlID09PSAndHJ1ZScpID8gJ2ZhbHNlJyA6ICd0cnVlJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIHRoZSB0YXJnZXQncyBmb2N1c2FibGUgY2hpbGRyZW4gdGFiaW5kZXhcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmZvY3VzYWJsZSlcbiAgICAgIHRoaXMudG9nZ2xlRm9jdXNhYmxlKHRoaXMuZm9jdXNhYmxlKTtcblxuICAgIC8qKlxuICAgICAqIEp1bXAgdG8gVGFyZ2V0IEVsZW1lbnQgaWYgVG9nZ2xlIEVsZW1lbnQgaXMgYW4gYW5jaG9yIGxpbmtcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmp1bXAgJiYgdGhpcy5lbGVtZW50Lmhhc0F0dHJpYnV0ZSgnaHJlZicpKVxuICAgICAgdGhpcy5qdW1wVG8odGhpcy5lbGVtZW50LCB0aGlzLnRhcmdldCk7XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGUgRWxlbWVudCAoaW5jbHVkaW5nIG11bHRpIHRvZ2dsZXMpIEFyaWEgQXR0cmlidXRlc1xuICAgICAqL1xuXG4gICAgZm9yIChpID0gMDsgaSA8IFRvZ2dsZS5lbEFyaWFSb2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0ciA9IFRvZ2dsZS5lbEFyaWFSb2xlc1tpXTtcbiAgICAgIHZhbHVlID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKTtcblxuICAgICAgaWYgKHZhbHVlICE9ICcnICYmIHZhbHVlKVxuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIsICh2YWx1ZSA9PT0gJ3RydWUnKSA/ICdmYWxzZScgOiAndHJ1ZScpO1xuXG4gICAgICAvLyBJZiB0aGVyZSBhcmUgb3RoZXIgdG9nZ2xlcyB0aGF0IGNvbnRyb2wgdGhlIHNhbWUgZWxlbWVudFxuICAgICAgdGhpcy5vdGhlcnMuZm9yRWFjaCgob3RoZXIpID0+IHtcbiAgICAgICAgaWYgKG90aGVyICE9PSB0aGlzLmVsZW1lbnQgJiYgb3RoZXIuZ2V0QXR0cmlidXRlKGF0dHIpKVxuICAgICAgICAgIG90aGVyLnNldEF0dHJpYnV0ZShhdHRyLCAodmFsdWUgPT09ICd0cnVlJykgPyAnZmFsc2UnIDogJ3RydWUnKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRvZ2dsaW5nIGNvbXBsZXRlIGhvb2tcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmFmdGVyKVxuICAgICAgdGhpcy5zZXR0aW5ncy5hZnRlcih0aGlzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbi8qKiBAdHlwZSAge1N0cmluZ30gIFRoZSBtYWluIHNlbGVjdG9yIHRvIGFkZCB0aGUgdG9nZ2xpbmcgZnVuY3Rpb24gdG8gKi9cblRvZ2dsZS5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XCJ0b2dnbGVcIl0nO1xuXG4vKiogQHR5cGUgIHtTdHJpbmd9ICBUaGUgbmFtZXNwYWNlIGZvciBvdXIgZGF0YSBhdHRyaWJ1dGUgc2V0dGluZ3MgKi9cblRvZ2dsZS5uYW1lc3BhY2UgPSAndG9nZ2xlJztcblxuLyoqIEB0eXBlICB7U3RyaW5nfSAgVGhlIGhpZGUgY2xhc3MgKi9cblRvZ2dsZS5pbmFjdGl2ZUNsYXNzID0gJ2hpZGRlbic7XG5cbi8qKiBAdHlwZSAge1N0cmluZ30gIFRoZSBhY3RpdmUgY2xhc3MgKi9cblRvZ2dsZS5hY3RpdmVDbGFzcyA9ICdhY3RpdmUnO1xuXG4vKiogQHR5cGUgIHtBcnJheX0gIEFyaWEgcm9sZXMgdG8gdG9nZ2xlIHRydWUvZmFsc2Ugb24gdGhlIHRvZ2dsaW5nIGVsZW1lbnQgKi9cblRvZ2dsZS5lbEFyaWFSb2xlcyA9IFsnYXJpYS1wcmVzc2VkJywgJ2FyaWEtZXhwYW5kZWQnXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBBcmlhIHJvbGVzIHRvIHRvZ2dsZSB0cnVlL2ZhbHNlIG9uIHRoZSB0YXJnZXQgZWxlbWVudCAqL1xuVG9nZ2xlLnRhcmdldEFyaWFSb2xlcyA9IFsnYXJpYS1oaWRkZW4nXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBGb2N1c2FibGUgZWxlbWVudHMgdG8gaGlkZSB3aXRoaW4gdGhlIGhpZGRlbiB0YXJnZXQgZWxlbWVudCAqL1xuVG9nZ2xlLmVsRm9jdXNhYmxlID0gW1xuICAnYScsICdidXR0b24nLCAnaW5wdXQnLCAnc2VsZWN0JywgJ3RleHRhcmVhJywgJ29iamVjdCcsICdlbWJlZCcsICdmb3JtJyxcbiAgJ2ZpZWxkc2V0JywgJ2xlZ2VuZCcsICdsYWJlbCcsICdhcmVhJywgJ2F1ZGlvJywgJ3ZpZGVvJywgJ2lmcmFtZScsICdzdmcnLFxuICAnZGV0YWlscycsICd0YWJsZScsICdbdGFiaW5kZXhdJywgJ1tjb250ZW50ZWRpdGFibGVdJywgJ1t1c2VtYXBdJ1xuXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBLZXkgYXR0cmlidXRlIGZvciBzdG9yaW5nIHRvZ2dsZXMgaW4gdGhlIHdpbmRvdyAqL1xuVG9nZ2xlLmNhbGxiYWNrID0gWydUb2dnbGVzQ2FsbGJhY2snXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBEZWZhdWx0IGV2ZW50cyB0byB0byB3YXRjaCBmb3IgdG9nZ2xpbmcuIEVhY2ggbXVzdCBoYXZlIGEgaGFuZGxlciBpbiB0aGUgY2xhc3MgYW5kIGVsZW1lbnRzIHRvIGxvb2sgZm9yIGluIFRvZ2dsZS5lbGVtZW50cyAqL1xuVG9nZ2xlLmV2ZW50cyA9IFsnY2xpY2snLCAnY2hhbmdlJ107XG5cbi8qKiBAdHlwZSAge0FycmF5fSAgRWxlbWVudHMgdG8gZGVsZWdhdGUgdG8gZWFjaCBldmVudCBoYW5kbGVyICovXG5Ub2dnbGUuZWxlbWVudHMgPSB7XG4gIENMSUNLOiBbJ0EnLCAnQlVUVE9OJ10sXG4gIENIQU5HRTogWydTRUxFQ1QnLCAnSU5QVVQnLCAnVEVYVEFSRUEnXVxufTtcblxuZXhwb3J0IGRlZmF1bHQgVG9nZ2xlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgVG9nZ2xlIGZyb20gJ0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy90b2dnbGUvdG9nZ2xlJztcblxuLyoqXG4gKiBAY2xhc3MgIERpYWxvZ1xuICpcbiAqIFVzYWdlXG4gKlxuICogRWxlbWVudCBBdHRyaWJ1dGVzLiBFaXRoZXIgPGE+IG9yIDxidXR0b24+XG4gKlxuICogQGF0dHIgIGRhdGEtanM9XCJkaWFsb2dcIiAgICAgICAgICAgICAgIEluc3RhbnRpYXRlcyB0aGUgdG9nZ2xpbmcgbWV0aG9kXG4gKiBAYXR0ciAgYXJpYS1jb250cm9scz1cIlwiICAgICAgICAgICAgICAgVGFyZ2V0cyB0aGUgaWQgb2YgdGhlIGRpYWxvZ1xuICogQGF0dHIgIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiICAgICAgICAgIERlY2xhcmVzIHRhcmdldCBjbG9zZWQvb3BlbiB3aGVuIHRvZ2dsZWRcbiAqIEBhdHRyICBkYXRhLWRpYWxvZz1cIm9wZW5cIiAgICAgICAgICAgICBEZXNpZ25hdGVzIHRoZSBwcmltYXJ5IG9wZW5pbmcgZWxlbWVudCBvZiB0aGUgZGlhbG9nXG4gKiBAYXR0ciAgZGF0YS1kaWFsb2c9XCJjbG9zZVwiICAgICAgICAgICAgRGVzaWduYXRlcyB0aGUgcHJpbWFyeSBjbG9zaW5nIGVsZW1lbnQgb2YgdGhlIGRpYWxvZ1xuICogQGF0dHIgIGRhdGEtZGlhbG9nLWZvY3VzLW9uLWNsb3NlPVwiXCIgIERlc2lnbmF0ZXMgYW4gYWx0ZXJuYXRlIGVsZW1lbnQgdG8gZm9jdXMgb24gd2hlbiB0aGUgZGlhbG9nIGNsb3Nlcy4gVmFsdWUgb2YgdGhlIGF0dHJpYnV0ZSBpcyB0aGUgaWQgb2YgdGhlIGRpYWxvZy5cbiAqIEBhdHRyICBkYXRhLWRpYWxvZy1sb2NrPVwidHJ1ZVwiICAgICAgICBXZXRoZXIgdG8gbG9jayBzY3JlZW4gc2Nyb2xsaW5nIHdoZW4gZGlhbG9nIGlzIG9wZW5cbiAqXG4gKiBUYXJnZXQgQXR0cmlidXRlcy4gQW55IDxlbGVtZW50PlxuICpcbiAqIEBhdHRyICBpZD1cIlwiICAgICAgICAgICAgICAgTWF0Y2hlcyBhcmlhLWNvbnRyb2xzIGF0dHIgb2YgRWxlbWVudFxuICogQGF0dHIgIGNsYXNzPVwiaGlkZGVuXCIgICAgICBIaWRkZW4gY2xhc3NcbiAqIEBhdHRyICBhcmlhLWhpZGRlbj1cInRydWVcIiAgRGVjbGFyZXMgdGFyZ2V0IG9wZW4vY2xvc2VkIHdoZW4gdG9nZ2xlZFxuICovXG5jbGFzcyBEaWFsb2cge1xuICAvKipcbiAgICogQGNvbnN0cnVjdG9yICBJbnN0YW50aWF0ZXMgZGlhbG9nIGFuZCB0b2dnbGUgbWV0aG9kXG4gICAqXG4gICAqIEByZXR1cm4gIHtPYmplY3R9ICBUaGUgaW5zdGFudGlhdGVkIGRpYWxvZyB3aXRoIHByb3BlcnRpZXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsZWN0b3IgPSBEaWFsb2cuc2VsZWN0b3I7XG5cbiAgICB0aGlzLnNlbGVjdG9ycyA9IERpYWxvZy5zZWxlY3RvcnM7XG5cbiAgICB0aGlzLmNsYXNzZXMgPSBEaWFsb2cuY2xhc3NlcztcblxuICAgIHRoaXMuZGF0YUF0dHJzID0gRGlhbG9nLmRhdGFBdHRycztcblxuICAgIHRoaXMudG9nZ2xlID0gbmV3IFRvZ2dsZSh7XG4gICAgICBzZWxlY3RvcjogdGhpcy5zZWxlY3RvcixcbiAgICAgIGFmdGVyOiAodG9nZ2xlKSA9PiB7XG4gICAgICAgIGxldCBhY3RpdmUgPSB0b2dnbGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhUb2dnbGUuYWN0aXZlQ2xhc3MpO1xuXG4gICAgICAgIC8vIExvY2sgdGhlIGJvZHkgZnJvbSBzY3JvbGxpbmcgaWYgbG9jayBhdHRyaWJ1dGUgaXMgcHJlc2VudFxuICAgICAgICBpZiAoYWN0aXZlICYmIHRvZ2dsZS5lbGVtZW50LmRhdGFzZXRbdGhpcy5kYXRhQXR0cnMuTE9DS10gPT09ICd0cnVlJykge1xuICAgICAgICAgIC8vIFNjcm9sbCB0byB0aGUgdG9wIG9mIHRoZSBwYWdlXG4gICAgICAgICAgd2luZG93LnNjcm9sbCgwLCAwKTtcblxuICAgICAgICAgIC8vIFByZXZlbnQgc2Nyb2xsaW5nIG9uIHRoZSBib2R5XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG5cbiAgICAgICAgICAvLyBXaGVuIHRoZSBsYXN0IGZvY3VzYWJsZSBpdGVtIGluIHRoZSBsaXN0IGxvb3NlcyBmb2N1cyBsb29wIHRvIHRoZSBmaXJzdFxuICAgICAgICAgIHRvZ2dsZS5mb2N1c2FibGUuaXRlbSh0b2dnbGUuZm9jdXNhYmxlLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsICgpID0+IHtcbiAgICAgICAgICAgICAgdG9nZ2xlLmZvY3VzYWJsZS5pdGVtKDApLmZvY3VzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZW1vdmUgaWYgYWxsIG90aGVyIGRpYWxvZyBib2R5IGxvY2tzIGFyZSBpbmFjdGl2ZVxuICAgICAgICAgIGxldCBsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoW1xuICAgICAgICAgICAgICB0aGlzLnNlbGVjdG9yLFxuICAgICAgICAgICAgICB0aGlzLnNlbGVjdG9ycy5sb2NrcyxcbiAgICAgICAgICAgICAgYC4ke1RvZ2dsZS5hY3RpdmVDbGFzc31gXG4gICAgICAgICAgICBdLmpvaW4oJycpKTtcblxuICAgICAgICAgIGlmIChsb2Nrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5zdHlsZS5vdmVyZmxvdyA9ICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZvY3VzIG9uIHRoZSBjbG9zZSwgb3Blbiwgb3Igb3RoZXIgZm9jdXMgZWxlbWVudCBpZiBwcmVzZW50XG4gICAgICAgIGxldCBpZCA9IHRvZ2dsZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgICBsZXQgY29udHJvbCA9IGBbYXJpYS1jb250cm9scz1cIiR7aWR9XCJdYDtcbiAgICAgICAgbGV0IGNsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNlbGVjdG9ycy5DTE9TRSArIGNvbnRyb2wpO1xuICAgICAgICBsZXQgb3BlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWxlY3RvcnMuT1BFTiArIGNvbnRyb2wpO1xuXG4gICAgICAgIGxldCBmb2N1c09uQ2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsZWN0b3JzLkZPQ1VTX09OX0NMT1NFLnJlcGxhY2UoJ3t7IElEIH19JywgaWQpKTtcblxuICAgICAgICBpZiAoYWN0aXZlICYmIGNsb3NlKSB7XG4gICAgICAgICAgY2xvc2UuZm9jdXMoKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcGVuKSB7XG4gICAgICAgICAgLy8gQWx0ZXJuYXRpdmVseSBmb2N1cyBvbiB0aGlzIGVsZW1lbnQgaWYgaXQgaXMgcHJlc2VudFxuICAgICAgICAgIGlmIChmb2N1c09uQ2xvc2UpIHtcbiAgICAgICAgICAgIGZvY3VzT25DbG9zZS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICAgICAgICBmb2N1c09uQ2xvc2UuZm9jdXMoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3Blbi5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuLyoqIEB0eXBlICB7U3RyaW5nfSAgTWFpbiBET00gc2VsZWN0b3IgKi9cbkRpYWxvZy5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XFxcImRpYWxvZ1xcXCJdJztcblxuLyoqIEB0eXBlICB7T2JqZWN0fSAgQWRkaXRpb25hbCBzZWxlY3RvcnMgdXNlZCBieSB0aGUgc2NyaXB0ICovXG5EaWFsb2cuc2VsZWN0b3JzID0ge1xuICBDTE9TRTogJ1tkYXRhLWRpYWxvZyo9XCJjbG9zZVwiXScsXG4gIE9QRU46ICdbZGF0YS1kaWFsb2cqPVwib3BlblwiXScsXG4gIExPQ0tTOiAnW2RhdGEtZGlhbG9nLWxvY2s9XCJ0cnVlXCJdJyxcbiAgRk9DVVNfT05fQ0xPU0U6ICdbZGF0YS1kaWFsb2ctZm9jdXMtb24tY2xvc2U9XCJ7eyBJRCB9fVwiXSdcbn07XG5cbi8qKiBAdHlwZSAge09iamVjdH0gIERhdGEgYXR0cmlidXRlIG5hbWVzcGFjZXMgKi9cbkRpYWxvZy5kYXRhQXR0cnMgPSB7XG4gIExPQ0s6ICdkaWFsb2dMb2NrJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRGlhbG9nOyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDb3B5IHRvIENsaXBib2FyZCBIZWxwZXJcbiAqL1xuY2xhc3MgQ29weSB7XG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtICAge09iamVjdH0gIHMgIFRoZSBzZXR0aW5ncyBvYmplY3QsIG1heSBpbmNsdWRlICdzZWxlY3RvcicsXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAnYXJpYScsICdub3RpZnlUaW1lb3V0JywgJ2JlZm9yZScsICdjb3BpZWQnLFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgb3IgJ2FmdGVyJyBhdHRyaWJ1dGVzLlxuICAgKlxuICAgKiBAcmV0dXJuICB7Q2xhc3N9ICAgICAgVGhlIGNvbnN0cnVjdGVkIGluc3RhbmNlIG9mIENvcHkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzKSB7XG4gICAgLy8gU2V0IGF0dHJpYnV0ZXNcbiAgICB0aGlzLnNlbGVjdG9yID0gKHMuaGFzT3duUHJvcGVydHkoJ3NlbGVjdG9yJykpID8gcy5zZWxlY3RvciA6IENvcHkuc2VsZWN0b3I7XG5cbiAgICB0aGlzLnNlbGVjdG9ycyA9IChzLmhhc093blByb3BlcnR5KCdzZWxlY3RvcnMnKSkgPyBzLnNlbGVjdG9ycyA6IENvcHkuc2VsZWN0b3JzO1xuXG4gICAgdGhpcy5hcmlhID0gKHMuaGFzT3duUHJvcGVydHkoJ2FyaWEnKSkgPyBzLmFyaWEgOiBDb3B5LmFyaWE7XG5cbiAgICB0aGlzLm5vdGlmeVRpbWVvdXQgPSAocy5oYXNPd25Qcm9wZXJ0eSgnbm90aWZ5VGltZW91dCcpKSA/IHMubm90aWZ5VGltZW91dCA6IENvcHkubm90aWZ5VGltZW91dDtcblxuICAgIHRoaXMuYmVmb3JlID0gKHMuaGFzT3duUHJvcGVydHkoJ2JlZm9yZScpKSA/IHMuYmVmb3JlIDogQ29weS5iZWZvcmU7XG5cbiAgICB0aGlzLmNvcGllZCA9IChzLmhhc093blByb3BlcnR5KCdjb3BpZWQnKSkgPyBzLmNvcGllZCA6IENvcHkuY29waWVkO1xuXG4gICAgdGhpcy5hZnRlciA9IChzLmhhc093blByb3BlcnR5KCdhZnRlcicpKSA/IHMuYWZ0ZXIgOiBDb3B5LmFmdGVyO1xuXG4gICAgLy8gU2VsZWN0IHRoZSBlbnRpcmUgdGV4dCB3aGVuIGl0J3MgZm9jdXNlZCBvblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZWxlY3RvcnMuVEFSR0VUUykuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCAoKSA9PiB0aGlzLnNlbGVjdChpdGVtKSk7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5zZWxlY3QoaXRlbSkpO1xuICAgIH0pO1xuXG4gICAgLy8gVGhlIG1haW4gY2xpY2sgZXZlbnQgZm9yIHRoZSBjbGFzc1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgIGlmICghZXZlbnQudGFyZ2V0Lm1hdGNoZXModGhpcy5zZWxlY3RvcikpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgdGhpcy5lbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuXG4gICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKHRoaXMuYXJpYSwgZmFsc2UpO1xuXG4gICAgICB0aGlzLnRhcmdldCA9IHRoaXMuZWxlbWVudC5kYXRhc2V0LmNvcHk7XG5cbiAgICAgIHRoaXMuYmVmb3JlKHRoaXMpO1xuXG4gICAgICBpZiAodGhpcy5jb3B5KHRoaXMudGFyZ2V0KSkge1xuICAgICAgICB0aGlzLmNvcGllZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKHRoaXMuYXJpYSwgdHJ1ZSk7XG5cbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZWxlbWVudFsndGltZW91dCddKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnRbJ3RpbWVvdXQnXSA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUodGhpcy5hcmlhLCBmYWxzZSk7XG5cbiAgICAgICAgICB0aGlzLmFmdGVyKHRoaXMpO1xuICAgICAgICB9LCB0aGlzLm5vdGlmeVRpbWVvdXQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNsaWNrIGV2ZW50IGhhbmRsZXJcbiAgICpcbiAgICogQHBhcmFtICAge1N0cmluZ30gIHRhcmdldCAgQ29udGVudCBvZiB0YXJnZXQgZGF0YSBhdHRyaWJ1dGVcbiAgICpcbiAgICogQHJldHVybiAge0Jvb2xlYW59ICAgICAgICAgV2V0aGVyIGNvcHkgd2FzIHN1Y2Nlc3NmdWwgb3Igbm90XG4gICAqL1xuICBjb3B5KHRhcmdldCkge1xuICAgIGxldCBzZWxlY3RvciA9IHRoaXMuc2VsZWN0b3JzLlRBUkdFVFMucmVwbGFjZSgnXScsIGA9XCIke3RhcmdldH1cIl1gKTtcblxuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gICAgdGhpcy5zZWxlY3QoaW5wdXQpO1xuXG4gICAgaWYgKG5hdmlnYXRvci5jbGlwYm9hcmQgJiYgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQpXG4gICAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChpbnB1dC52YWx1ZSk7XG4gICAgZWxzZSBpZiAoZG9jdW1lbnQuZXhlY0NvbW1hbmQpXG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXIgZm9yIHRoZSB0ZXh0IHNlbGVjdGlvbiBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtICAge09iamVjdH0gIGlucHV0ICBUaGUgaW5wdXQgd2l0aCBjb250ZW50IHRvIHNlbGVjdFxuICAgKi9cbiAgc2VsZWN0KGlucHV0KSB7XG4gICAgaW5wdXQuc2VsZWN0KCk7XG5cbiAgICBpbnB1dC5zZXRTZWxlY3Rpb25SYW5nZSgwLCA5OTk5OSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgbWFpbiBlbGVtZW50IHNlbGVjdG9yLlxuICpcbiAqIEB2YXIge1N0cmluZ31cbiAqL1xuQ29weS5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XCJjb3B5XCJdJztcblxuLyoqXG4gKiBUaGUgc2VsZWN0b3JzIGZvciB2YXJpb3VzIGVsZW1lbnRzIHF1ZXJpZWQgYnkgdGhlIHV0aWxpdHkuIFJlZmVyIHRvIHRoZVxuICogc291cmNlIGZvciBkZWZhdWx0cy5cbiAqXG4gKiBAdmFyIHtbdHlwZV19XG4gKi9cbkNvcHkuc2VsZWN0b3JzID0ge1xuICBUQVJHRVRTOiAnW2RhdGEtY29weS10YXJnZXRdJ1xufTtcblxuLyoqXG4gKiBCdXR0b24gYXJpYSByb2xlIHRvIHRvZ2dsZVxuICpcbiAqIEB2YXIge1N0cmluZ31cbiAqL1xuQ29weS5hcmlhID0gJ2FyaWEtcHJlc3NlZCc7XG5cbi8qKlxuICogVGltZW91dCBmb3IgdGhlIFwiQ29waWVkIVwiIG5vdGlmaWNhdGlvblxuICpcbiAqIEB2YXIge051bWJlcn1cbiAqL1xuQ29weS5ub3RpZnlUaW1lb3V0ID0gMTUwMDtcblxuLyoqXG4gKiBCZWZvcmUgaG9vay4gVHJpZ2dlcnMgYmVmb3JlIHRoZSBjbGljayBldmVudC5cbiAqXG4gKiBAdmFyIHtGdW5jdGlvbn1cbiAqL1xuQ29weS5iZWZvcmUgPSAoKSA9PiB7fTtcblxuLyoqXG4gKiBDb3BpZWQgaG9vay4gVHJpZ2dlcnMgYWZ0ZXIgYSBzdWNjZXNzZnVsIHRoZSBjb3B5IGV2ZW50LlxuICpcbiAqIEB2YXIge0Z1bmN0aW9ufVxuICovXG5Db3B5LmNvcGllZCA9ICgpID0+IHt9O1xuXG4vKipcbiAqIEFmdGVyIGhvb2suIFRyaWdnZXJzIGFmdGVyIHRoZSBjbGljayBldmVudC5cbiAqXG4gKiBAdmFyIHtGdW5jdGlvbn1cbiAqL1xuQ29weS5hZnRlciA9ICgpID0+IHt9O1xuXG5leHBvcnQgZGVmYXVsdCBDb3B5O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFRoZSBJY29uIG1vZHVsZVxuICogQGNsYXNzXG4gKi9cbmNsYXNzIEljb25zIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIGljb24gZmlsZVxuICAgKiBAcmV0dXJuIHtvYmplY3R9IFRoZSBjbGFzc1xuICAgKi9cbiAgY29uc3RydWN0b3IocGF0aCkge1xuICAgIHBhdGggPSAocGF0aCkgPyBwYXRoIDogSWNvbnMucGF0aDtcblxuICAgIGZldGNoKHBhdGgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLm9rKVxuICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKVxuICAgICAgICAgICAgY29uc29sZS5kaXIocmVzcG9uc2UpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpXG4gICAgICAgICAgY29uc29sZS5kaXIoZXJyb3IpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwcml0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBzcHJpdGUuaW5uZXJIVE1MID0gZGF0YTtcbiAgICAgICAgc3ByaXRlLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgc3ByaXRlLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogbm9uZTsnKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzcHJpdGUpO1xuICAgICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4vKiogQHR5cGUge1N0cmluZ30gVGhlIHBhdGggb2YgdGhlIGljb24gZmlsZSAqL1xuSWNvbnMucGF0aCA9ICdzdmcvaWNvbnMuc3ZnJztcblxuZXhwb3J0IGRlZmF1bHQgSWNvbnM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIFNldEhlaWdodFByb3BlcnRpZXMge1xuICBjb25zdHJ1Y3RvciAocykge1xuICAgIHRoaXMuZWxlbWVudHMgPSAocy5lbGVtZW50cykgPyBzLmVsZW1lbnRzIDogU2V0SGVpZ2h0UHJvcGVydGllcy5lbGVtZW50cztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5lbGVtZW50c1tpXVsnc2VsZWN0b3InXSkpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB0aGlzLnNldFByb3BlcnR5KHRoaXMuZWxlbWVudHNbaV0pKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHRoaXMuc2V0UHJvcGVydHkodGhpcy5lbGVtZW50c1tpXSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KHRoaXMuZWxlbWVudHNbaV1bJ3Byb3BlcnR5J10sICcwcHgnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRQcm9wZXJ0eShlKSB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVbJ3NlbGVjdG9yJ10pO1xuXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KGVbJ3Byb3BlcnR5J10sIGAke2VsZW1lbnQuY2xpZW50SGVpZ2h0fXB4YCk7XG4gIH1cbn1cblxuU2V0SGVpZ2h0UHJvcGVydGllcy5lbGVtZW50cyA9IFtdO1xuXG5leHBvcnQgZGVmYXVsdCBTZXRIZWlnaHRQcm9wZXJ0aWVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEN5Y2xlcyB0aHJvdWdoIGEgcHJlZGVmaW5lZCBvYmplY3Qgb2YgdGhlbWUgY2xhc3NuYW1lcyBhbmQgdG9nZ2xlcyB0aGVtIG9uXG4gKiB0aGUgZG9jdW1lbnQgZWxlbWVudCBiYXNlZCBvbiBhIGNsaWNrIGV2ZW50LiBVc2VzIGxvY2FsIHN0b3JhZ2UgdG8gc2F2ZSBhbmRcbiAqIHJlZmVyIHRvIGEgdXNlcidzIHByZWZlcmVuY2UgYmFzZWQgb24gdGhlIGxhc3QgdGhlbWUgc2VsZWN0ZWQuXG4gKi9cbmNsYXNzIFRoZW1lcyB7XG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtICAge09iamVjdH0gIHMgIFRoZSBzZXR0aW5ncyBvYmplY3QsIG1heSBpbmNsdWRlICdzdG9yYWdlJyxcbiAgICogICAgICAgICAgICAgICAgICAgICAgICdzZWxlY3RvcnMnLCBvciAndGhlbWUnIGF0dHJpYnV0ZXNcbiAgICpcbiAgICogQHJldHVybiAge0NsYXNzfSAgICAgIFRoZSBjb25zdHJ1Y3RlZCBpbnN0YW5jZSBvZiBUaGVtZXMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzID0ge30pIHtcbiAgICAvKipcbiAgICAgKiBTZXR0aW5nc1xuICAgICAqL1xuXG4gICAgdGhpcy5zdG9yYWdlID0gKHMuaGFzT3duUHJvcGVydHkoJ3N0b3JhZ2UnKSkgP1xuICAgICAgT2JqZWN0LmFzc2lnbihUaGVtZXMuc3RvcmFnZSwgcy5zdG9yYWdlKSA6IFRoZW1lcy5zdG9yYWdlO1xuXG4gICAgdGhpcy5zZWxlY3RvcnMgPSAocy5oYXNPd25Qcm9wZXJ0eSgnc2VsZWN0b3JzJykpID9cbiAgICAgIE9iamVjdC5hc3NpZ24oVGhlbWVzLnNlbGVjdG9ycywgcy5zZWxlY3RvcnMpIDogVGhlbWVzLnNlbGVjdG9ycztcblxuICAgIHRoaXMudGhlbWVzID0gKHMuaGFzT3duUHJvcGVydHkoJ3RoZW1lcycpKSA/IHMudGhlbWVzIDogVGhlbWVzLnRoZW1lcztcblxuICAgIHRoaXMuYWZ0ZXIgPSAocy5oYXNPd25Qcm9wZXJ0eSgnYWZ0ZXInKSkgPyBzLmFmdGVyIDogVGhlbWVzLmFmdGVyO1xuXG4gICAgdGhpcy5iZWZvcmUgPSAocy5oYXNPd25Qcm9wZXJ0eSgnYmVmb3JlJykpID8gcy5iZWZvcmUgOiBUaGVtZXMuYmVmb3JlO1xuXG4gICAgLyoqXG4gICAgICogR2V0IGluaXRpYWwgdXNlciBwcmVmZXJlbmNlXG4gICAgICovXG5cbiAgICB0aGlzLnByZWZlcmVuY2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnN0b3JhZ2UuVEhFTUUpO1xuXG4gICAgaWYgKHRoaXMucHJlZmVyZW5jZSlcbiAgICAgIHRoaXMuc2V0KEpTT04ucGFyc2UodGhpcy5wcmVmZXJlbmNlKSk7XG5cbiAgICAvKipcbiAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXJzXG4gICAgICovXG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICBpZiAoIWV2ZW50LnRhcmdldC5tYXRjaGVzKHRoaXMuc2VsZWN0b3JzLlRPR0dMRSkpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgdGhpcy50YXJnZXQgPSBldmVudC50YXJnZXQ7XG5cbiAgICAgIHRoaXMuYmVmb3JlKHRoaXMpO1xuXG4gICAgICB0aGlzLmNsaWNrKGV2ZW50KTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjbGljayBoYW5kbGVyIGZvciB0aGVtZSBjeWNsaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgZXZlbnQgIFRoZSBvcmlnaW5hbCBjbGljayBldmVudCB0aGF0IGludm9rZWQgdGhlIG1ldGhvZFxuICAgKlxuICAgKiBAcmV0dXJuICB7Q2xhc3N9ICAgICAgICAgIFRoZSBUaGVtZXMgaW5zdGFuY2VcbiAgICovXG4gIGNsaWNrKGV2ZW50KSB7XG4gICAgLy8gR2V0IGF2YWlsYWJsZSB0aGVtZSBjbGFzc25hbWVzXG4gICAgbGV0IGN5Y2xlID0gdGhpcy50aGVtZXMubWFwKHQgPT4gdC5jbGFzc25hbWUpO1xuXG4gICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBkb2N1bWVudCBoYXMgYW55IG9mIHRoZSB0aGVtZSBjbGFzcyBzZXR0aW5ncyBhbHJlYWR5XG4gICAgbGV0IGludGVyc2VjdGlvbiA9IGN5Y2xlLmZpbHRlcihpdGVtID0+IHtcbiAgICAgIHJldHVybiBbLi4uZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdF0uaW5jbHVkZXMoaXRlbSlcbiAgICB9KTtcblxuICAgIC8vIEZpbmQgdGhlIHN0YXJ0aW5nIGluZGV4XG4gICAgbGV0IHN0YXJ0ID0gKGludGVyc2VjdGlvbi5sZW5ndGggPT09IDApID8gMCA6IGN5Y2xlLmluZGV4T2YoaW50ZXJzZWN0aW9uWzBdKTtcbiAgICBsZXQgdGhlbWUgPSAodHlwZW9mIGN5Y2xlW3N0YXJ0ICsgMV0gPT09ICd1bmRlZmluZWQnKSA/IGN5Y2xlWzBdIDogY3ljbGVbc3RhcnQgKyAxXTtcblxuICAgIC8vIFRvZ2dsZSBlbGVtZW50c1xuICAgIHRoaXMucmVtb3ZlKHRoaXMudGhlbWVzLmZpbmQodCA9PiB0LmNsYXNzbmFtZSA9PT0gY3ljbGVbc3RhcnRdKSlcbiAgICAgIC5zZXQodGhpcy50aGVtZXMuZmluZCh0ID0+IHQuY2xhc3NuYW1lID09PSB0aGVtZSkpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHJlbW92ZSBtZXRob2QgZm9yIHRoZSB0aGVtZS4gUmVzZXRzIGFsbCBlbGVtZW50IGNsYXNzZXMgYW5kIGxvY2FsIHN0b3JhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSAgIHtPYmplY3R9ICB0aGVtZSAgVGhlIHRoZW1lIHRvIHJlbW92ZVxuICAgKlxuICAgKiBAcmV0dXJuICB7Q2xhc3N9ICAgICAgICAgIFRoZSBUaGVtZXMgaW5zdGFuY2VcbiAgICovXG4gIHJlbW92ZSh0aGVtZSkge1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHRoZW1lLmNsYXNzbmFtZSk7XG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2VsZWN0b3JzLlRPR0dMRSlcbiAgICAgIC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhlbWUuY2xhc3NuYW1lfSR7dGhpcy5zZWxlY3RvcnMuQUNUSVZFfWApO1xuICAgICAgfSk7XG5cbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLnN0b3JhZ2UuVEhFTUUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHNldHRlciBtZXRob2QgZm9yIHRoZW1lLiBBZGRzIGVsZW1lbnQgY2xhc3NlcyBhbmQgc2V0cyBsb2NhbCBzdG9yYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgdGhlbWUgIFRoZSB0aGVtZSBvYmplY3QgaW5jbHVkaW5nIGNsYXNzbmFtZSBhbmQgbGFiZWxcbiAgICpcbiAgICogQHJldHVybiAge0NsYXNzfSAgICAgICAgICBUaGUgVGhlbWVzIGluc3RhbmNlXG4gICAqL1xuICBzZXQodGhlbWUpIHtcbiAgICB0aGlzLnRoZW1lID0gdGhlbWU7XG5cbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLnRoZW1lLmNsYXNzbmFtZSk7XG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2VsZWN0b3JzLlRPR0dMRSlcbiAgICAgIC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoYCR7dGhpcy50aGVtZS5jbGFzc25hbWV9JHt0aGlzLnNlbGVjdG9ycy5BQ1RJVkV9YCk7XG4gICAgICB9KTtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZWxlY3RvcnMuTEFCRUwpXG4gICAgICAuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IHRoaXMudGhlbWUubGFiZWw7XG4gICAgICB9KTtcblxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuc3RvcmFnZS5USEVNRSwgSlNPTi5zdHJpbmdpZnkodGhlbWUpKTtcblxuICAgIHRoaXMuYWZ0ZXIodGhpcyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxuLyoqXG4gKiBUaGUgc3RvcmFnZSBrZXlzIHVzZWQgYnkgdGhlIHNjcmlwdCBmb3IgbG9jYWwgc3RvcmFnZS4gVGhlIGRlZmF1bHQgaXNcbiAqIGAtLW55Y28tdGhlbWVgIGZvciB0aGUgdGhlbWUgcHJlZmVyZW5jZS5cbiAqXG4gKiBAdmFyIHtPYmplY3R9XG4gKi9cblRoZW1lcy5zdG9yYWdlID0ge1xuICBUSEVNRTogJy0tbnljby10aGVtZSdcbn07XG5cbi8qKlxuICogVGhlIHNlbGVjdG9ycyBmb3IgdmFyaW91cyBlbGVtZW50cyBxdWVyaWVkIGJ5IHRoZSB1dGlsaXR5LiBSZWZlciB0byB0aGVcbiAqIHNvdXJjZSBmb3IgZGVmYXVsdHMuXG4gKlxuICogQHZhciB7T2JqZWN0fVxuICovXG5UaGVtZXMuc2VsZWN0b3JzID0ge1xuICBUT0dHTEU6ICdbZGF0YS1qcz1cInRoZW1lc1wiXScsXG4gIExBQkVMOiAnW2RhdGEtanMtdGhlbWVzPVwibGFiZWxcIl0nLFxuICBBQ1RJVkU6ICc6YWN0aXZlJ1xufTtcblxuLyoqXG4gKiBUaGUgcHJlZGVmaW5lZCB0aGVtZSBPYmplY3RzIHRvIGN5Y2xlIHRocm91Z2gsIGVhY2ggd2l0aCBhIGNvcnJlc3BvbmRpbmdcbiAqIGh1bWFuLXJlYWRhYmxlIHRleHQgbGFiZWwgYW5kIGNsYXNzbmFtZS4gVGhlIGRlZmF1bHQgaW5jbHVkZXMgdHdvIHRoZW1lcztcbiAqIGBkZWZhdWx0YCBsYWJlbGxlZCBcIkxpZ2h0XCIgdGhlbWUgYW5kIGBkYXJrYCBsYWJlbGxlZCBcIkRhcmtcIi5cbiAqXG4gKiBAdmFyIHtBcnJheX1cbiAqL1xuVGhlbWVzLnRoZW1lcyA9IFtcbiAge1xuICAgIGxhYmVsOiAnTGlnaHQnLFxuICAgIGNsYXNzbmFtZTogJ2RlZmF1bHQnXG4gIH0sXG4gIHtcbiAgICBsYWJlbDogJ0RhcmsnLFxuICAgIGNsYXNzbmFtZTogJ2RhcmsnXG4gIH1cbl07XG5cbi8qKlxuICogQmVmb3JlIGhvb2tcbiAqXG4gKiBAcmV0dXJuICB7RnVuY3Rpb259ICBUcmlnZ2VycyBiZWZvcmUgdGhlIGNsaWNrIGV2ZW50LlxuICovXG5UaGVtZXMuYmVmb3JlID0gKCkgPT4ge307XG5cbi8qKlxuICogQWZ0ZXIgaG9va1xuICpcbiAqIEByZXR1cm4gIHtGdW5jdGlvbn0gIFRyaWdnZXJzIGFmdGVyIHRoZSBjbGljayBldmVudC5cbiAqL1xuVGhlbWVzLmFmdGVyID0gKCkgPT4ge307XG5cbmV4cG9ydCBkZWZhdWx0IFRoZW1lcztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBUcmFja2luZyBidXMgZm9yIEdvb2dsZSBhbmFseXRpY3MgYW5kIFdlYnRyZW5kcy5cbiAqL1xuY2xhc3MgVHJhY2sge1xuICBjb25zdHJ1Y3RvcihzKSB7XG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcblxuICAgIHMgPSAoIXMpID8ge30gOiBzO1xuXG4gICAgdGhpcy5fc2V0dGluZ3MgPSB7XG4gICAgICBzZWxlY3RvcjogKHMuc2VsZWN0b3IpID8gcy5zZWxlY3RvciA6IFRyYWNrLnNlbGVjdG9yLFxuICAgIH07XG5cbiAgICB0aGlzLmRlc2luYXRpb25zID0gVHJhY2suZGVzdGluYXRpb25zO1xuXG4gICAgYm9keS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgaWYgKCFldmVudC50YXJnZXQubWF0Y2hlcyh0aGlzLl9zZXR0aW5ncy5zZWxlY3RvcikpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGtleSA9IGV2ZW50LnRhcmdldC5kYXRhc2V0LnRyYWNrS2V5O1xuICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LnRhcmdldC5kYXRhc2V0LnRyYWNrRGF0YSk7XG5cbiAgICAgIHRoaXMudHJhY2soa2V5LCBkYXRhKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNraW5nIGZ1bmN0aW9uIHdyYXBwZXJcbiAgICpcbiAgICogQHBhcmFtICB7U3RyaW5nfSAgICAgIGtleSAgIFRoZSBrZXkgb3IgZXZlbnQgb2YgdGhlIGRhdGFcbiAgICogQHBhcmFtICB7Q29sbGVjdGlvbn0gIGRhdGEgIFRoZSBkYXRhIHRvIHRyYWNrXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICBUaGUgZmluYWwgZGF0YSBvYmplY3RcbiAgICovXG4gIHRyYWNrKGtleSwgZGF0YSkge1xuICAgIC8vIFNldCB0aGUgcGF0aCBuYW1lIGJhc2VkIG9uIHRoZSBsb2NhdGlvblxuICAgIGNvbnN0IGQgPSBkYXRhLm1hcChlbCA9PiB7XG4gICAgICAgIGlmIChlbC5oYXNPd25Qcm9wZXJ0eShUcmFjay5rZXkpKVxuICAgICAgICAgIGVsW1RyYWNrLmtleV0gPSBgJHt3aW5kb3cubG9jYXRpb24ucGF0aG5hbWV9LyR7ZWxbVHJhY2sua2V5XX1gXG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH0pO1xuXG4gICAgbGV0IHd0ID0gdGhpcy53ZWJ0cmVuZHMoa2V5LCBkKTtcbiAgICBsZXQgZ2EgPSB0aGlzLmd0YWcoa2V5LCBkKTtcblxuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJylcbiAgICAgIGNvbnNvbGUuZGlyKHsnVHJhY2snOiBbd3QsIGdhXX0pO1xuICAgIC8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSAqL1xuXG4gICAgcmV0dXJuIGQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIERhdGEgYnVzIGZvciB0cmFja2luZyB2aWV3cyBpbiBXZWJ0cmVuZHMgYW5kIEdvb2dsZSBBbmFseXRpY3NcbiAgICpcbiAgICogQHBhcmFtICB7U3RyaW5nfSAgICAgIGFwcCAgIFRoZSBuYW1lIG9mIHRoZSBTaW5nbGUgUGFnZSBBcHBsaWNhdGlvbiB0byB0cmFja1xuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAga2V5ICAgVGhlIGtleSBvciBldmVudCBvZiB0aGUgZGF0YVxuICAgKiBAcGFyYW0gIHtDb2xsZWN0aW9ufSAgZGF0YSAgVGhlIGRhdGEgdG8gdHJhY2tcbiAgICovXG4gIHZpZXcoYXBwLCBrZXksIGRhdGEpIHtcbiAgICBsZXQgd3QgPSB0aGlzLndlYnRyZW5kcyhrZXksIGRhdGEpO1xuICAgIGxldCBnYSA9IHRoaXMuZ3RhZ1ZpZXcoYXBwLCBrZXkpO1xuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKVxuICAgICAgY29uc29sZS5kaXIoeydUcmFjayc6IFt3dCwgZ2FdfSk7XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1jb25zb2xlICovXG4gIH07XG5cbiAgLyoqXG4gICAqIFB1c2ggRXZlbnRzIHRvIFdlYnRyZW5kc1xuICAgKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAga2V5ICAgVGhlIGtleSBvciBldmVudCBvZiB0aGUgZGF0YVxuICAgKiBAcGFyYW0gIHtDb2xsZWN0aW9ufSAgZGF0YSAgVGhlIGRhdGEgdG8gdHJhY2tcbiAgICovXG4gIHdlYnRyZW5kcyhrZXksIGRhdGEpIHtcbiAgICBpZiAoXG4gICAgICB0eXBlb2YgV2VidHJlbmRzID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgdHlwZW9mIGRhdGEgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAhdGhpcy5kZXNpbmF0aW9ucy5pbmNsdWRlcygnd2VidHJlbmRzJylcbiAgICApXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBsZXQgZXZlbnQgPSBbe1xuICAgICAgJ1dULnRpJzoga2V5XG4gICAgfV07XG5cbiAgICBpZiAoZGF0YVswXSAmJiBkYXRhWzBdLmhhc093blByb3BlcnR5KFRyYWNrLmtleSkpXG4gICAgICBldmVudC5wdXNoKHtcbiAgICAgICAgJ0RDUy5kY3N1cmknOiBkYXRhWzBdW1RyYWNrLmtleV1cbiAgICAgIH0pO1xuICAgIGVsc2VcbiAgICAgIE9iamVjdC5hc3NpZ24oZXZlbnQsIGRhdGEpO1xuXG4gICAgLy8gRm9ybWF0IGRhdGEgZm9yIFdlYnRyZW5kc1xuICAgIGxldCB3dGQgPSB7YXJnc2E6IGV2ZW50LmZsYXRNYXAoZSA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoZSkuZmxhdE1hcChrID0+IFtrLCBlW2tdXSk7XG4gICAgfSl9O1xuXG4gICAgLy8gSWYgJ2FjdGlvbicgaXMgdXNlZCBhcyB0aGUga2V5IChmb3IgZ3RhZy5qcyksIHN3aXRjaCBpdCB0byBXZWJ0cmVuZHNcbiAgICBsZXQgYWN0aW9uID0gZGF0YS5hcmdzYS5pbmRleE9mKCdhY3Rpb24nKTtcblxuICAgIGlmIChhY3Rpb24pIGRhdGEuYXJnc2FbYWN0aW9uXSA9ICdEQ1MuZGNzdXJpJztcblxuICAgIC8vIFdlYnRyZW5kcyBkb2Vzbid0IHNlbmQgdGhlIHBhZ2UgdmlldyBmb3IgTXVsdGlUcmFjaywgYWRkIHBhdGggdG8gdXJsXG4gICAgbGV0IGRjc3VyaSA9IGRhdGEuYXJnc2EuaW5kZXhPZignRENTLmRjc3VyaScpO1xuXG4gICAgaWYgKGRjc3VyaSlcbiAgICAgIGRhdGEuYXJnc2FbZGNzdXJpICsgMV0gPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyBkYXRhLmFyZ3NhW2Rjc3VyaSArIDFdO1xuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbiAgICBpZiAodHlwZW9mIFdlYnRyZW5kcyAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICBXZWJ0cmVuZHMubXVsdGlUcmFjayh3dGQpO1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG5cbiAgICByZXR1cm4gWydXZWJ0cmVuZHMnLCB3dGRdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQdXNoIENsaWNrIEV2ZW50cyB0byBHb29nbGUgQW5hbHl0aWNzXG4gICAqXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICAgICBrZXkgICBUaGUga2V5IG9yIGV2ZW50IG9mIHRoZSBkYXRhXG4gICAqIEBwYXJhbSAge0NvbGxlY3Rpb259ICBkYXRhICBUaGUgZGF0YSB0byB0cmFja1xuICAgKi9cbiAgZ3RhZyhrZXksIGRhdGEpIHtcbiAgICBpZiAoXG4gICAgICB0eXBlb2YgZ3RhZyA9PT0gJ3VuZGVmaW5lZCcgfHxcbiAgICAgIHR5cGVvZiBkYXRhID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgIXRoaXMuZGVzaW5hdGlvbnMuaW5jbHVkZXMoJ2d0YWcnKVxuICAgIClcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGxldCB1cmkgPSBkYXRhLmZpbmQoKGVsZW1lbnQpID0+IGVsZW1lbnQuaGFzT3duUHJvcGVydHkoVHJhY2sua2V5KSk7XG5cbiAgICBsZXQgZXZlbnQgPSB7XG4gICAgICAnZXZlbnRfY2F0ZWdvcnknOiBrZXlcbiAgICB9O1xuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbiAgICBndGFnKFRyYWNrLmtleSwgdXJpW1RyYWNrLmtleV0sIGV2ZW50KTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVuZGVmICovXG5cbiAgICByZXR1cm4gWydndGFnJywgVHJhY2sua2V5LCB1cmlbVHJhY2sua2V5XSwgZXZlbnRdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQdXNoIFNjcmVlbiBWaWV3IEV2ZW50cyB0byBHb29nbGUgQW5hbHl0aWNzXG4gICAqXG4gICAqIEBwYXJhbSAge1N0cmluZ30gIGFwcCAgVGhlIG5hbWUgb2YgdGhlIGFwcGxpY2F0aW9uXG4gICAqIEBwYXJhbSAge1N0cmluZ30gIGtleSAgVGhlIGtleSBvciBldmVudCBvZiB0aGUgZGF0YVxuICAgKi9cbiAgZ3RhZ1ZpZXcoYXBwLCBrZXkpIHtcbiAgICBpZiAoXG4gICAgICB0eXBlb2YgZ3RhZyA9PT0gJ3VuZGVmaW5lZCcgfHxcbiAgICAgIHR5cGVvZiBkYXRhID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgIXRoaXMuZGVzaW5hdGlvbnMuaW5jbHVkZXMoJ2d0YWcnKVxuICAgIClcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGxldCB2aWV3ID0ge1xuICAgICAgYXBwX25hbWU6IGFwcCxcbiAgICAgIHNjcmVlbl9uYW1lOiBrZXlcbiAgICB9O1xuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbiAgICBndGFnKCdldmVudCcsICdzY3JlZW5fdmlldycsIHZpZXcpO1xuICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYgKi9cblxuICAgIHJldHVybiBbJ2d0YWcnLCBUcmFjay5rZXksICdzY3JlZW5fdmlldycsIHZpZXddO1xuICB9O1xufVxuXG4vKiogQHR5cGUge1N0cmluZ30gVGhlIG1haW4gc2VsZWN0b3IgdG8gYWRkIHRoZSB0cmFja2luZyBmdW5jdGlvbiB0byAqL1xuVHJhY2suc2VsZWN0b3IgPSAnW2RhdGEtanMqPVwidHJhY2tcIl0nO1xuXG4vKiogQHR5cGUge1N0cmluZ30gVGhlIG1haW4gZXZlbnQgdHJhY2tpbmcga2V5IHRvIG1hcCB0byBXZWJ0cmVuZHMgRENTLnVyaSAqL1xuVHJhY2sua2V5ID0gJ2V2ZW50JztcblxuLyoqIEB0eXBlIHtBcnJheX0gV2hhdCBkZXN0aW5hdGlvbnMgdG8gcHVzaCBkYXRhIHRvICovXG5UcmFjay5kZXN0aW5hdGlvbnMgPSBbXG4gICd3ZWJ0cmVuZHMnLFxuICAnZ3RhZydcbl07XG5cbmV4cG9ydCBkZWZhdWx0IFRyYWNrOyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIHdyYXBwZXIgYXJvdW5kIHRoZSBuYXZpZ2F0b3Iuc2hhcmUoKSBBUElcbiAqL1xuY2xhc3MgV2ViU2hhcmUge1xuICAvKipcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzID0ge30pIHtcbiAgICB0aGlzLnNlbGVjdG9yID0gKHMuc2VsZWN0b3IpID8gcy5zZWxlY3RvciA6IFdlYlNoYXJlLnNlbGVjdG9yO1xuXG4gICAgdGhpcy5jYWxsYmFjayA9IChzLmNhbGxiYWNrKSA/IHMuY2FsbGJhY2sgOiBXZWJTaGFyZS5jYWxsYmFjaztcblxuICAgIHRoaXMuZmFsbGJhY2sgPSAocy5mYWxsYmFjaykgPyBzLmZhbGxiYWNrIDogV2ViU2hhcmUuZmFsbGJhY2s7XG5cbiAgICB0aGlzLmZhbGxiYWNrQ29uZGl0aW9uID0gKHMuZmFsbGJhY2tDb25kaXRpb24pID8gcy5mYWxsYmFja0NvbmRpdGlvbiA6IFdlYlNoYXJlLmZhbGxiYWNrQ29uZGl0aW9uO1xuXG4gICAgaWYgKHRoaXMuZmFsbGJhY2tDb25kaXRpb24oKSkge1xuICAgICAgLy8gUmVtb3ZlIGZhbGxiYWNrIGFyaWEgdG9nZ2xpbmcgYXR0cmlidXRlc1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNlbGVjdG9yKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBpdGVtLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xuICAgICAgICBpdGVtLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgdGhlIHNoYXJlIGNsaWNrXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgIGlmICghZXZlbnQudGFyZ2V0Lm1hdGNoZXModGhpcy5zZWxlY3RvcikpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcblxuICAgICAgICB0aGlzLmRhdGEgPSBKU09OLnBhcnNlKHRoaXMuZWxlbWVudC5kYXRhc2V0LndlYlNoYXJlKTtcblxuICAgICAgICB0aGlzLnNoYXJlKHRoaXMuZGF0YSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2VcbiAgICAgIHRoaXMuZmFsbGJhY2soKTsgLy8gRXhlY3V0ZSB0aGUgZmFsbGJhY2tcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFdlYiBTaGFyZSBBUEkgaGFuZGxlclxuICAgKlxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgZGF0YSAgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGl0bGUsIHVybCwgYW5kIHRleHQuXG4gICAqXG4gICAqIEByZXR1cm4gIHtQcm9taXNlfSAgICAgICBUaGUgcmVzcG9uc2Ugb2YgdGhlIC5zaGFyZSgpIG1ldGhvZC5cbiAgICovXG4gIHNoYXJlKGRhdGEgPSB7fSkge1xuICAgIHJldHVybiBuYXZpZ2F0b3Iuc2hhcmUoZGF0YSlcbiAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgIHRoaXMuY2FsbGJhY2soZGF0YSk7XG4gICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJylcbiAgICAgICAgICBjb25zb2xlLmRpcihlcnIpO1xuICAgICAgfSk7XG4gIH1cbn1cblxuLyoqIFRoZSBodG1sIHNlbGVjdG9yIGZvciB0aGUgY29tcG9uZW50ICovXG5XZWJTaGFyZS5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XCJ3ZWItc2hhcmVcIl0nO1xuXG4vKiogUGxhY2Vob2xkZXIgY2FsbGJhY2sgZm9yIGEgc3VjY2Vzc2Z1bCBzZW5kICovXG5XZWJTaGFyZS5jYWxsYmFjayA9ICgpID0+IHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpXG4gICAgY29uc29sZS5kaXIoJ1N1Y2Nlc3MhJyk7XG59O1xuXG4vKiogUGxhY2Vob2xkZXIgZm9yIHRoZSBXZWJTaGFyZSBmYWxsYmFjayAqL1xuV2ViU2hhcmUuZmFsbGJhY2sgPSAoKSA9PiB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKVxuICAgIGNvbnNvbGUuZGlyKCdGYWxsYmFjayEnKTtcbn07XG5cbi8qKiBDb25kaXRpb25hbCBmdW5jdGlvbiBmb3IgdGhlIFdlYiBTaGFyZSBmYWxsYmFjayAqL1xuV2ViU2hhcmUuZmFsbGJhY2tDb25kaXRpb24gPSAoKSA9PiB7XG4gIHJldHVybiBuYXZpZ2F0b3Iuc2hhcmU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBXZWJTaGFyZTtcbiIsIi8qKlxuICogQGNsYXNzICBTZXQgdGhlIHRoZSBjc3MgdmFyaWFibGUgJy0tMTAwdmgnIHRvIHRoZSBzaXplIG9mIHRoZSBXaW5kb3cncyBpbm5lciBoZWlnaHQuXG4gKi9cbmNsYXNzIFdpbmRvd1ZoIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvciAgU2V0IGV2ZW50IGxpc3RlbmVyc1xuICAgKi9cbiAgY29uc3RydWN0b3IocyA9IHt9KSB7XG4gICAgdGhpcy5wcm9wZXJ0eSA9IChzLnByb3BlcnR5KSA/IHMucHJvcGVydHkgOiBXaW5kb3dWaC5wcm9wZXJ0eTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge3RoaXMuc2V0KCl9KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7dGhpcy5zZXQoKX0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY3NzIHZhcmlhYmxlIHByb3BlcnR5XG4gICAqL1xuICBzZXQoKSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlXG4gICAgICAuc2V0UHJvcGVydHkodGhpcy5wcm9wZXJ0eSwgYCR7d2luZG93LmlubmVySGVpZ2h0fXB4YCk7XG4gIH1cbn1cblxuLyoqIEBwYXJhbSAge1N0cmluZ30gIHByb3BlcnR5ICBUaGUgY3NzIHZhcmlhYmxlIHN0cmluZyB0byBzZXQgKi9cbldpbmRvd1ZoLnByb3BlcnR5ID0gJy0tMTAwdmgnO1xuXG5leHBvcnQgZGVmYXVsdCBXaW5kb3dWaDtcbiIsIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFNlbmRzIGEgY29uZmlndXJhdGlvbiBvYmplY3QgdG8gUm9sbGJhciwgdGhlIG1vc3QgaW1wb3J0YW50IGNvbmZpZyBpc1xuICogdGhlIGNvZGVfdmVyc2lvbiB3aGljaCBtYXBzIHRvIHRoZSBzb3VyY2UgbWFwcyB2ZXJzaW9uLlxuICpcbiAqIEBzb3VyY2UgaHR0cHM6Ly9kb2NzLnJvbGxiYXIuY29tL2RvY3Mvcm9sbGJhcmpzLWNvbmZpZ3VyYXRpb24tcmVmZXJlbmNlXG4gKi9cbmNsYXNzIFJvbGxiYXJDb25maWd1cmUge1xuICAvKipcbiAgICogQWRkcyBSb2xsYmFyIGNvbmZpZ3VyYXRpb24gdG8gdGhlIHBhZ2UgaWYgdGhlIHNuaXBwZXQgaGFzIGJlZW4gaW5jbHVkZWQuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gR2V0IHRoZSBzY3JpcHQgdmVyc2lvbiBiYXNlZCBvbiB0aGUgaGFzaCB2YWx1ZSBpbiB0aGUgZmlsZS5cbiAgICBsZXQgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKTtcbiAgICBsZXQgc291cmNlID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyYztcbiAgICBsZXQgcGF0aCA9IHNvdXJjZS5zcGxpdCgnLycpO1xuICAgIGxldCBiYXNlbmFtZSA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXTtcbiAgICBsZXQgaGFzaCA9IGJhc2VuYW1lLnNwbGl0KFJvbGxiYXJDb25maWd1cmUuaGFzaERlbGltZXRlcilbMV0ucmVwbGFjZSgnLmpzJywgJycpO1xuXG4gICAgLy8gQ29weSB0aGUgZGVmYXVsdCBjb25maWd1cmF0aW9uIGFuZCBhZGQgdGhlIGN1cnJlbnQgdmVyc2lvbiBudW1iZXIuXG4gICAgbGV0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIFJvbGxiYXJDb25maWd1cmUuY29uZmlnKTtcblxuICAgIGNvbmZpZy5wYXlsb2FkLmNsaWVudC5qYXZhc2NyaXB0LmNvZGVfdmVyc2lvbiA9IGhhc2g7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICAgICAgaWYgKHR5cGVvZiBSb2xsYmFyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgY29uc29sZS5sb2coJ1JvbGxiYXIgaXMgbm90IGRlZmluZWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICAgICAgbGV0IHJvbGxiYXJDb25maWd1cmUgPSBSb2xsYmFyLmNvbmZpZ3VyZShjb25maWcpO1xuICAgICAgbGV0IG1zZyA9IGBDb25maWd1cmVkIFJvbGxiYXIgd2l0aCAnJHtoYXNofSdgO1xuXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICBjb25zb2xlLmxvZyhgJHttc2d9OmApO1xuXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGNvbnNvbGUuZGlyKHJvbGxiYXJDb25maWd1cmUpO1xuXG4gICAgICAgIFJvbGxiYXIuZGVidWcobXNnKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogUm9sbGJhciBIYXNoIERlbGltaXRlclxuICovXG5Sb2xsYmFyQ29uZmlndXJlLmhhc2hEZWxpbWV0ZXIgPSAnLSc7XG5cbi8qKlxuICogQHR5cGUge09iamVjdH0gVGhlIGRlZmF1bHQgUm9sbGJhciBjb25maWd1cmF0aW9uXG4gKi9cblJvbGxiYXJDb25maWd1cmUuY29uZmlnID0ge1xuICBwYXlsb2FkOiB7XG4gICAgY2xpZW50OiB7XG4gICAgICBqYXZhc2NyaXB0OiB7XG4gICAgICAgIC8vIFRoaXMgaXMgd2lsbCBiZSB0cnVlIGJ5IGRlZmF1bHQgaWYgeW91IGhhdmUgZW5hYmxlZCB0aGlzIGluIHNldHRpbmdzLlxuICAgICAgICBzb3VyY2VfbWFwX2VuYWJsZWQ6IHRydWUsXG4gICAgICAgIC8vIE9wdGlvbmFsbHkgZ3Vlc3Mgd2hpY2ggZnJhbWVzIHRoZSBlcnJvciB3YXMgdGhyb3duIGZyb20gd2hlbiB0aGUgYnJvd3NlclxuICAgICAgICAvLyBkb2VzIG5vdCBwcm92aWRlIGxpbmUgYW5kIGNvbHVtbiBudW1iZXJzLlxuICAgICAgICBndWVzc191bmNhdWdodF9mcmFtZXM6IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJvbGxiYXJDb25maWd1cmU7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBUb2dnbGUgZnJvbSAnQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL3RvZ2dsZS90b2dnbGUnO1xuXG4vKipcbiAqIFRoZSBBY2NvcmRpb24gbW9kdWxlXG4gKiBAY2xhc3NcbiAqL1xuY2xhc3MgQWNjb3JkaW9uIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9IFRoZSBjbGFzc1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fdG9nZ2xlID0gbmV3IFRvZ2dsZSh7XG4gICAgICBzZWxlY3RvcjogQWNjb3JkaW9uLnNlbGVjdG9yXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBkb20gc2VsZWN0b3IgZm9yIHRoZSBtb2R1bGVcbiAqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICovXG5BY2NvcmRpb24uc2VsZWN0b3IgPSAnW2RhdGEtanMqPVwiYWNjb3JkaW9uXCJdJztcblxuZXhwb3J0IGRlZmF1bHQgQWNjb3JkaW9uO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgd3JhcHBlciBhcm91bmQgSW50ZXJzZWN0aW9uIE9ic2VydmVyIGNsYXNzXG4gKi9cbmNsYXNzIE9ic2VydmUge1xuICBjb25zdHJ1Y3RvcihzID0ge30pIHtcbiAgICBpZiAoIXMuZWxlbWVudCkgcmV0dXJuO1xuXG4gICAgdGhpcy5vcHRpb25zID0gKHMub3B0aW9ucykgPyBPYmplY3QuYXNzaWduKE9ic2VydmUub3B0aW9ucywgcy5vcHRpb25zKSA6IE9ic2VydmUub3B0aW9ucztcblxuICAgIHRoaXMudHJpZ2dlciA9IChzLnRyaWdnZXIpID8gcy50cmlnZ2VyIDogT2JzZXJ2ZS50cmlnZ2VyO1xuXG4gICAgdGhpcy5zZWxlY3RvcnMgPSAocy5zZWxlY3RvcnMpID8gcy5zZWxlY3RvcnMgOiBPYnNlcnZlLnNlbGVjdG9ycztcblxuICAgIC8vIEluc3RhbnRpYXRlIHRoZSBJbnRlcnNlY3Rpb24gT2JzZXJ2ZXJcbiAgICB0aGlzLm9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKChlbnRyaWVzLCBvYnNlcnZlcikgPT4ge1xuICAgICAgdGhpcy5jYWxsYmFjayhlbnRyaWVzLCBvYnNlcnZlcik7XG4gICAgfSwgdGhpcy5vcHRpb25zKTtcblxuICAgIC8vIFNlbGVjdCBhbGwgb2YgdGhlIGl0ZW1zIHRvIG9ic2VydmVcbiAgICBsZXQgc2VsZWN0b3JJdGVtID0gdGhpcy5zZWxlY3RvcnMuSVRFTS5yZXBsYWNlKCd7eyBpdGVtIH19JyxcbiAgICAgICAgcy5lbGVtZW50LmRhdGFzZXRbdGhpcy5zZWxlY3RvcnMuSVRFTVNfQVRUUl0pO1xuXG4gICAgdGhpcy5pdGVtcyA9IHMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9ySXRlbSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zW2ldO1xuXG4gICAgICB0aGlzLm9ic2VydmVyLm9ic2VydmUoaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgY2FsbGJhY2soZW50cmllcywgb2JzZXJ2ZXIpIHtcbiAgICBsZXQgcHJldkVudHJ5ID0gZW50cmllc1swXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZW50cnkgPSBlbnRyaWVzW2ldO1xuXG4gICAgICB0aGlzLnRyaWdnZXIoZW50cnksIHByZXZFbnRyeSwgb2JzZXJ2ZXIpO1xuXG4gICAgICBwcmV2RW50cnkgPSBlbnRyeTtcbiAgICB9XG4gIH1cbn1cblxuLyoqIE9wdGlvbnMgZm9yIHRoZSBJbnRlcnNlY3Rpb24gT2JzZXJ2ZXIgQVBJICovXG5PYnNlcnZlLm9wdGlvbnMgPSB7XG4gIHJvb3Q6IG51bGwsXG4gIHJvb3RNYXJnaW46ICcwcHgnLFxuICB0aHJlc2hvbGQ6IFswLjE1XVxufTtcblxuLyoqIFBsYWNlaG9sZGVyIGVudHJ5IGZ1bmN0aW9uIGZvciB3aGF0IGhhcHBlbnMgd2l0aCBpdGVtcyBhcmUgb2JzZXJ2ZWQgKi9cbk9ic2VydmUudHJpZ2dlciA9IGVudHJ5ID0+IHtcbiAgY29uc29sZS5kaXIoZW50cnkpO1xuICBjb25zb2xlLmRpcignT2JzZXJ2ZWQhIENyZWF0ZSBhIGVudHJ5IHRyaWdnZXIgZnVuY3Rpb24gYW5kIHBhc3MgaXQgdG8gdGhlIGluc3RhbnRpYXRlZCBPYnNlcnZlIHNldHRpbmdzIG9iamVjdC4nKTtcbn07XG5cbi8qKiBNYWluIHNlbGVjdG9yIGZvciB0aGUgdXRpbGl0eSAqL1xuT2JzZXJ2ZS5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XCJvYnNlcnZlXCJdJztcblxuLyoqIE1pc2MuIHNlbGVjdG9ycyBmb3IgdGhlIG9ic2VydmVyIHV0aWxpdHkgKi9cbk9ic2VydmUuc2VsZWN0b3JzID0ge1xuICBJVEVNOiAnW2RhdGEtanMtb2JzZXJ2ZS1pdGVtPVwie3sgaXRlbSB9fVwiXScsXG4gIElURU1TX0FUVFI6ICdqc09ic2VydmVJdGVtcydcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE9ic2VydmU7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBPYnNlcnZlIGZyb20gJ0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy9vYnNlcnZlL29ic2VydmUnO1xuXG5jbGFzcyBBY3RpdmVOYXZpZ2F0aW9uIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9ICBUaGUgaW5zdGFudGlhdGVkIHBhdHRlcm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHMgPSB7fSkge1xuICAgIHRoaXMuc2VsZWN0b3IgPSAocy5zZWxlY3RvcikgPyBzLnNlbGVjdG9yIDogQWN0aXZlTmF2aWdhdGlvbi5zZWxlY3RvcjtcblxuICAgIHRoaXMuc2VsZWN0b3JzID0gKHMuc2VsZWN0b3JzKSA/XG4gICAgICBPYmplY3QuYXNzaWduKEFjdGl2ZU5hdmlnYXRpb24uc2VsZWN0b3JzLCBzLnNlbGVjdG9ycykgOiBBY3RpdmVOYXZpZ2F0aW9uLnNlbGVjdG9ycztcblxuICAgIHRoaXMub2JzZXJ2ZU9wdGlvbnMgPSAocy5vYnNlcnZlT3B0aW9ucykgP1xuICAgICAgT2JqZWN0LmFzc2lnbihBY3RpdmVOYXZpZ2F0aW9uLm9ic2VydmVPcHRpb25zLCBzLm9ic2VydmVPcHRpb25zKSA6IEFjdGl2ZU5hdmlnYXRpb24ub2JzZXJ2ZU9wdGlvbnM7XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgZm9yIHRvZ2dsaW5nIHRoZSBqdW1wIG5hdmlnYXRpb24gaXRlbSwgdXNlZCBieSB0aGUgY2xpY2sgZXZlbnRcbiAgICAgKiBoYW5kbGVyIGFuZCB0aGUgaW50ZXJzZWN0aW9uIG9ic2VydmVyIGV2ZW50IGhhbmRsZXIuXG4gICAgICpcbiAgICAgKiBAdmFyIE5vZGVFbGVtZW50XG4gICAgICovXG4gICAgIGNvbnN0IGp1bXBDbGFzc1RvZ2dsZSA9IGl0ZW0gPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtLnBhcmVudE5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc2libGluZyA9IGl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbltpXTtcblxuICAgICAgICBpZiAodGhpcy5zZWxlY3RvcnMuRk9DVVNfQVRUUiBpbiBzaWJsaW5nLmRhdGFzZXQpIHtcbiAgICAgICAgICBsZXQgY2xhc3NBY3RpdmUgPSBzaWJsaW5nLmRhdGFzZXQuYWN0aXZlTmF2aWdhdGlvbkl0ZW0uc3BsaXQoJyAnKTtcbiAgICAgICAgICBsZXQgY2xhc3NJbmFjdGl2ZSA9IHNpYmxpbmcuZGF0YXNldC5pbmFjdGl2ZU5hdmlnYXRpb25JdGVtLnNwbGl0KCcgJyk7XG5cbiAgICAgICAgICBpZiAoc2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoLi4uY2xhc3NBY3RpdmUpKSB7XG4gICAgICAgICAgICBzaWJsaW5nLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2xhc3NBY3RpdmUpO1xuICAgICAgICAgICAgc2libGluZy5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzSW5hY3RpdmUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoLi4uaXRlbS5kYXRhc2V0LmluYWN0aXZlTmF2aWdhdGlvbkl0ZW0uc3BsaXQoJyAnKSk7XG4gICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoLi4uaXRlbS5kYXRhc2V0LmFjdGl2ZU5hdmlnYXRpb25JdGVtLnNwbGl0KCcgJykpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDbGljayBldmVudCBoYW5kbGVyIGZvciBqdW1wIG5hdmlnYXRpb24gaXRlbXNcbiAgICAgKlxuICAgICAqIEB2YXIgTm9kZUVsZW1lbnRcbiAgICAgKi9cbiAgICAoZWxlbWVudCA9PiB7XG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICBsZXQgYWN0aXZlTmF2aWdhdGlvbiA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYVtkYXRhLWFjdGl2ZS1uYXZpZ2F0aW9uLWl0ZW1dJyk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhY3RpdmVOYXZpZ2F0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgYSA9IGFjdGl2ZU5hdmlnYXRpb25baV07XG5cbiAgICAgICAgICBhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGp1bXBDbGFzc1RvZ2dsZShldmVudC50YXJnZXQpO1xuXG4gICAgICAgICAgICAgIGxldCBpdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuICAgICAgICAgICAgICBsZXQgZm9jdXNJdGVtID0gaXRlbS5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsZWN0b3JzLkZPQ1VTKTtcblxuICAgICAgICAgICAgICBpZiAoZm9jdXNJdGVtKSB7XG4gICAgICAgICAgICAgICAgZm9jdXNJdGVtLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgICAgICAgICBmb2N1c0l0ZW0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWxlY3RvcikpO1xuXG4gICAgLyoqXG4gICAgICogSW50ZXJzZWN0aW9uIE9ic2VydmVyIGV2ZW50IGhhbmRsZXIgZm9yIGp1bXAgbmF2aWdhdGlvbiBpdGVtc1xuICAgICAqXG4gICAgICogQHZhciBOb2RlRWxlbWVudExpc3RcbiAgICAgKi9cbiAgICAoZWxlbWVudHMgPT4ge1xuICAgICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgbmV3IE9ic2VydmUoe1xuICAgICAgICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgICAgICAgb3B0aW9uczogdGhpcy5vYnNlcnZlT3B0aW9ucyxcbiAgICAgICAgICBzZWxlY3RvcnM6IHtcbiAgICAgICAgICAgIElURU06IHRoaXMuc2VsZWN0b3JzLk9CU0VSVkVfSVRFTSxcbiAgICAgICAgICAgIElURU1TX0FUVFI6IHRoaXMuc2VsZWN0b3JzLk9CU0VSVkVfSVRFTVNfQVRUUlxuICAgICAgICAgIH0sXG4gICAgICAgICAgdHJpZ2dlcjogKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWVudHJ5LmlzSW50ZXJzZWN0aW5nKSByZXR1cm47XG5cbiAgICAgICAgICAgIGxldCBqdW1wSXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGFbaHJlZj1cIiMke2VudHJ5LnRhcmdldC5pZH1cIl1gKTtcblxuICAgICAgICAgICAgaWYgKCFqdW1wSXRlbSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBqdW1wSXRlbS5jbG9zZXN0KHRoaXMuc2VsZWN0b3JzLlNDUk9MTCkuc2Nyb2xsVG8oe1xuICAgICAgICAgICAgICBsZWZ0OiBqdW1wSXRlbS5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBmb2N1c0l0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNlbGVjdG9ycy5GT0NVUyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9jdXNJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBmb2N1c0l0ZW1zW2ldLnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAganVtcENsYXNzVG9nZ2xlKGp1bXBJdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNlbGVjdG9ycy5PQlNFUlZFKSk7XG4gIH1cbn1cblxuLyoqIEB0eXBlIHtTdHJpbmd9ICBNYWluIERPTSBzZWxlY3RvciAqL1xuQWN0aXZlTmF2aWdhdGlvbi5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XFxcImFjdGl2ZS1uYXZpZ2F0aW9uXFxcIl0nO1xuXG4vKiogQHR5cGUge09iamVjdH0gIFNlbGVjdG9ycyBmb3IgdGhlIGVsZW1lbnQgKi9cbkFjdGl2ZU5hdmlnYXRpb24uc2VsZWN0b3JzID0ge1xuICBPQlNFUlZFOiAnW2RhdGEtYWN0aXZlLW5hdmlnYXRpb249XCJvYnNlcnZlXCJdJyxcbiAgT0JTRVJWRV9JVEVNOiAnW2RhdGEtYWN0aXZlLW5hdmlnYXRpb24tb2JzZXJ2ZS1pdGVtPVwie3sgaXRlbSB9fVwiXScsXG4gIE9CU0VSVkVfSVRFTVNfQVRUUjogJ2FjdGl2ZU5hdmlnYXRpb25PYnNlcnZlSXRlbXMnLFxuICBTQ1JPTEw6ICdbZGF0YS1hY3RpdmUtbmF2aWdhdGlvbj1cInNjcm9sbFwiXScsXG4gIEZPQ1VTOiAnW2RhdGEtYWN0aXZlLW5hdmlnYXRpb24taXRlbT1cImZvY3VzXCJdJyxcbiAgRk9DVVNfQVRUUjogJ2FjdGl2ZU5hdmlnYXRpb25JdGVtJ1xufTtcblxuLyoqIEB0eXBlIHtPYmplY3R9ICBPYnNlcnZhdGlvbiB1dGlsaXR5IG9wdGlvbnMgKi9cbkFjdGl2ZU5hdmlnYXRpb24ub2JzZXJ2ZU9wdGlvbnMgPSB7XG4gIHJvb3Q6IG51bGwsXG4gIHJvb3RNYXJnaW46ICcwcHgnLFxuICB0aHJlc2hvbGQ6IFswLjE1XVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQWN0aXZlTmF2aWdhdGlvbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFRvZ2dsZSBmcm9tICdAbnljb3Bwb3J0dW5pdHkvcHR0cm4tc2NyaXB0cy9zcmMvdG9nZ2xlL3RvZ2dsZSc7XG5cbi8qKlxuICogVGhlIFNlYXJjaCBtb2R1bGVcbiAqXG4gKiBAY2xhc3NcbiAqL1xuY2xhc3MgU2VhcmNoIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9IFRoZSBjbGFzc1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fdG9nZ2xlID0gbmV3IFRvZ2dsZSh7XG4gICAgICBzZWxlY3RvcjogU2VhcmNoLnNlbGVjdG9yLFxuICAgICAgYWZ0ZXI6ICh0b2dnbGUpID0+IHtcbiAgICAgICAgbGV0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTZWFyY2guc2VsZWN0b3IpO1xuICAgICAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNlYXJjaC5zZWxlY3RvcnMuaW5wdXQpO1xuXG4gICAgICAgIGlmIChlbC5jbGFzc05hbWUuaW5jbHVkZXMoJ2FjdGl2ZScpICYmIGlucHV0KSB7XG4gICAgICAgICAgaW5wdXQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgZG9tIHNlbGVjdG9yIGZvciB0aGUgbW9kdWxlXG4gKiBAdHlwZSB7U3RyaW5nfVxuICovXG5TZWFyY2guc2VsZWN0b3IgPSAnW2RhdGEtanMqPVwic2VhcmNoXCJdJztcblxuU2VhcmNoLnNlbGVjdG9ycyA9IHtcbiAgaW5wdXQ6ICdbZGF0YS1zZWFyY2gqPVwiaW5wdXRcIl0nXG59O1xuXG5leHBvcnQgZGVmYXVsdCBTZWFyY2g7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBUb2dnbGUgZnJvbSAnQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL3RvZ2dsZS90b2dnbGUnO1xuXG4vKipcbiAqIFRoZSBNb2JpbGUgTmF2IG1vZHVsZVxuICpcbiAqIEBjbGFzc1xuICovXG5jbGFzcyBNZW51IHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcmV0dXJuICB7b2JqZWN0fSAgVGhlIGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbGVjdG9yID0gTWVudS5zZWxlY3RvcjtcblxuICAgIHRoaXMuc2VsZWN0b3JzID0gTWVudS5zZWxlY3RvcnM7XG5cbiAgICB0aGlzLnRvZ2dsZSA9IG5ldyBUb2dnbGUoe1xuICAgICAgc2VsZWN0b3I6IHRoaXMuc2VsZWN0b3IsXG4gICAgICBhZnRlcjogdG9nZ2xlID0+IHtcbiAgICAgICAgLy8gU2hpZnQgZm9jdXMgZnJvbSB0aGUgb3BlbiB0byB0aGUgY2xvc2UgYnV0dG9uIGluIHRoZSBNb2JpbGUgTWVudSB3aGVuIHRvZ2dsZWRcbiAgICAgICAgaWYgKHRvZ2dsZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFRvZ2dsZS5hY3RpdmVDbGFzcykpIHtcbiAgICAgICAgICB0b2dnbGUudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWxlY3RvcnMuQ0xPU0UpLmZvY3VzKCk7XG5cbiAgICAgICAgICAvLyBXaGVuIHRoZSBsYXN0IGZvY3VzYWJsZSBpdGVtIGluIHRoZSBsaXN0IGxvb3NlcyBmb2N1cyBsb29wIHRvIHRoZSBmaXJzdFxuICAgICAgICAgIHRvZ2dsZS5mb2N1c2FibGUuaXRlbSh0b2dnbGUuZm9jdXNhYmxlLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsICgpID0+IHtcbiAgICAgICAgICAgICAgdG9nZ2xlLmZvY3VzYWJsZS5pdGVtKDApLmZvY3VzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsZWN0b3JzLk9QRU4pLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbi8qKiBAdHlwZSAge1N0cmluZ30gIFRoZSBkb20gc2VsZWN0b3IgZm9yIHRoZSBtb2R1bGUgKi9cbk1lbnUuc2VsZWN0b3IgPSAnW2RhdGEtanMqPVwibWVudVwiXSc7XG5cbi8qKiBAdHlwZSAge09iamVjdH0gIEFkZGl0aW9uYWwgc2VsZWN0b3JzIHVzZWQgYnkgdGhlIHNjcmlwdCAqL1xuTWVudS5zZWxlY3RvcnMgPSB7XG4gIENMT1NFOiAnW2RhdGEtanMtbWVudSo9XCJjbG9zZVwiXScsXG4gIE9QRU46ICdbZGF0YS1qcy1tZW51Kj1cIm9wZW5cIl0nXG59O1xuXG5leHBvcnQgZGVmYXVsdCBNZW51O1xuIiwiLyoqXG4gKiBVdGlsaXRpZXNcbiAqL1xuXG5pbXBvcnQgRGlhbG9nIGZyb20gJ0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy9kaWFsb2cvZGlhbG9nJztcbmltcG9ydCBDb3B5IGZyb20gJ0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy9jb3B5L2NvcHknO1xuaW1wb3J0IEljb25zIGZyb20gJ0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy9pY29ucy9pY29ucyc7XG5pbXBvcnQgU2V0SGVpZ2h0UHJvcGVydGllcyBmcm9tICdAbnljb3Bwb3J0dW5pdHkvcHR0cm4tc2NyaXB0cy9zcmMvc2V0LWhlaWdodC1wcm9wZXJ0aWVzL3NldC1oZWlnaHQtcHJvcGVydGllcyc7XG5pbXBvcnQgVGhlbWVzIGZyb20gJ0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy90aGVtZXMvdGhlbWVzJztcbmltcG9ydCBUb2dnbGUgZnJvbSAnQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL3RvZ2dsZS90b2dnbGUnO1xuaW1wb3J0IFRyYWNrIGZyb20gJ0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy90cmFjay90cmFjayc7XG5pbXBvcnQgV2ViU2hhcmUgZnJvbSAnQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL3dlYi1zaGFyZS93ZWItc2hhcmUnO1xuaW1wb3J0IFdpbmRvd1ZoIGZyb20gJ0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy93aW5kb3ctdmgvd2luZG93LXZoJztcbmltcG9ydCBSb2xsYmFyQ29uZmlndXJlIGZyb20gJy4vbW9kdWxlcy9yb2xsYmFyLWNvbmZpZ3VyZSc7XG5cbi8qKlxuICogQ29tcG9uZW50c1xuICovXG5cbmltcG9ydCBBY2NvcmRpb24gZnJvbSAnQG55Y29wcG9ydHVuaXR5L3N0YW5kYXJkL3NyYy9jb21wb25lbnRzL2FjY29yZGlvbi9hY2NvcmRpb24nO1xuaW1wb3J0IEFjdGl2ZU5hdmlnYXRpb24gZnJvbSAnQG55Y29wcG9ydHVuaXR5L3N0YW5kYXJkL3NyYy9jb21wb25lbnRzL2FjdGl2ZS1uYXZpZ2F0aW9uL2FjdGl2ZS1uYXZpZ2F0aW9uJztcbmltcG9ydCBTZWFyY2ggZnJvbSAnQG55Y29wcG9ydHVuaXR5L3N0YW5kYXJkL3NyYy9vYmplY3RzL3NlYXJjaC9zZWFyY2gnO1xuXG4vKipcbiAqIE9iamVjdHNcbiAqL1xuXG5pbXBvcnQgTWVudSBmcm9tICdAbnljb3Bwb3J0dW5pdHkvcGF0dGVybi1tZW51L3NyYy9tZW51JztcblxuLyoqXG4gKiBJbml0XG4gKi9cblxubmV3IFJvbGxiYXJDb25maWd1cmUoKTtcblxuLyoqXG4gKiBQYXR0ZXJuc1xuICovXG5cbm5ldyBBY2NvcmRpb24oKTtcbm5ldyBBY3RpdmVOYXZpZ2F0aW9uKCk7XG5uZXcgRGlhbG9nKCk7XG5uZXcgTWVudSgpO1xubmV3IFNlYXJjaCgpO1xubmV3IFRvZ2dsZSgpO1xubmV3IFRyYWNrKCk7XG5uZXcgV2luZG93VmgoKTtcblxuLyoqXG4gKiBDb3B5LXRvLWNsaXBib2FyZCBVdGlsaXR5IENvbmZpZ3VyYXRpb25cbiAqL1xuXG5uZXcgQ29weSh7XG4gIGNvcGllZDogYyA9PiBjLmVsZW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtanMtY29weT1cImljb25cIl0nKVxuICAgIC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBgI2x1Y2lkZS1jaGVja2ApLFxuICBhZnRlcjogYyA9PiBjLmVsZW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtanMtY29weT1cImljb25cIl0nKVxuICAgIC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBgI2x1Y2lkZS1jb3B5YClcbn0pO1xuXG5cbi8qKlxuICogSWNvbiBTcHJpdGVzXG4gKi9cblxuY29uc3Qgc3ByaXRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWpzPVwic3ByaXRlc1wiXScpO1xuXG5uZXcgSWNvbnMoc3ByaXRlcy5kYXRhc2V0LnN2Z3MpO1xubmV3IEljb25zKHNwcml0ZXMuZGF0YXNldC5lbGVtZW50cyk7XG5uZXcgSWNvbnMoc3ByaXRlcy5kYXRhc2V0Lmx1Y2lkZSk7XG5uZXcgSWNvbnMoc3ByaXRlcy5kYXRhc2V0LndrbnljKTtcblxuc3ByaXRlcy5yZW1vdmUoKTtcblxuLyoqXG4gKiBUaGVtZXMgQ29uZmlndXJhdGlvblxuICovXG5cbmxldCB0aGVtZUxpZ2h0ID0ge1xuICBsYWJlbDogJ0RhcmsgVGhlbWUnLFxuICBjbGFzc25hbWU6ICdkZWZhdWx0JyxcbiAgaWNvbjogJ2x1Y2lkZS1tb29uJyxcbiAgdmVyc2lvbjogVkVSU0lPTlxufTtcblxubGV0IHRoZW1lRGFyayA9IHtcbiAgbGFiZWw6ICdMaWdodCBUaGVtZScsXG4gIGNsYXNzbmFtZTogJ2RhcmsnLFxuICBpY29uOiAnbHVjaWRlLXN1bicsXG4gIHZlcnNpb246IFZFUlNJT05cbn07XG5cbi8vIFRoaXMgYmxvY2sgZW5zdXJlcyBjb21wYXRpYmlsaXR5IHdpdGggdGhlIHByZXZpb3VzIHNpdGUgdGhlbWUgY29uZmlndXJhdGlvblxuXG5sZXQgdGhlbWVQcmVmZXJlbmNlU3RyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oVGhlbWVzLnN0b3JhZ2UuVEhFTUUpO1xuXG5pZiAodGhlbWVQcmVmZXJlbmNlU3RyKSB7XG4gIGxldCB0aGVtZVByZWZlcmVuY2UgPSBKU09OLnBhcnNlKHRoZW1lUHJlZmVyZW5jZVN0cik7XG5cbiAgaWYgKGZhbHNlID09PSB0aGVtZVByZWZlcmVuY2UuaGFzT3duUHJvcGVydHkoJ3ZlcnNpb24nKSkge1xuICAgIHN3aXRjaCh0aGVtZVByZWZlcmVuY2UuY2xhc3NuYW1lKSB7XG4gICAgICBjYXNlICdkZWZhdWx0JzpcbiAgICAgICAgY29uc29sZS5kaXIodGhlbWVEYXJrKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oVGhlbWVzLnN0b3JhZ2UuVEhFTUUsIEpTT04uc3RyaW5naWZ5KHRoZW1lRGFyaykpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbGlnaHQnOlxuICAgICAgICBjb25zb2xlLmRpcih0aGVtZUxpZ2h0KTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oVGhlbWVzLnN0b3JhZ2UuVEhFTUUsIEpTT04uc3RyaW5naWZ5KHRoZW1lTGlnaHQpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG5cbm5ldyBUaGVtZXMoe1xuICB0aGVtZXM6IFtcbiAgICB0aGVtZUxpZ2h0LFxuICAgIHRoZW1lRGFya1xuICBdLFxuICBhZnRlcjogdGhtcyA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRobXMuc2VsZWN0b3JzLlRPR0dMRSlcbiAgICAuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtanMtdGhlbWVzPVwiaWNvblwiXScpXG4gICAgICAgIC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBgIyR7dGhtcy50aGVtZS5pY29ufWApO1xuICAgIH0pXG59KTtcblxuLyoqXG4gKiBXZWIgU2hhcmUgQ29uZmlndXJhdGlvblxuICovXG5cbm5ldyBXZWJTaGFyZSh7XG4gIGZhbGxiYWNrOiAoKSA9PiB7XG4gICAgbmV3IFRvZ2dsZSh7XG4gICAgICBzZWxlY3RvcjogV2ViU2hhcmUuc2VsZWN0b3JcbiAgICB9KTtcbiAgfVxufSk7XG5cbi8qKlxuICogTGFuZ3VhZ2VzXG4gKi9cblxuLy8gTW9kaWZ5IFdQTUwgTGFuZ3VhZ2UgTGlua3NcbmNvbnN0IHdwbWxMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndwbWwtbHMtbGVnYWN5LWxpc3QtaG9yaXpvbnRhbCcpO1xuY29uc3Qgd3BtbExpc3RJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndwbWwtbHMtaXRlbScpO1xuY29uc3Qgd3BtbExpbmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndwbWwtbHMtbGluaycpO1xuXG53cG1sTGlua3MuZm9yRWFjaChsaW5rID0+IHtcbiAgbGluay5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gIGxpbmsuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xufSk7XG5cbndwbWxMaXN0SXRlbS5mb3JFYWNoKGxpbmsgPT4ge1xuICBsaW5rLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbn0pO1xuXG5pZiAod3BtbExpc3QpIHtcbiAgd3BtbExpc3QucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xufVxuXG4vLyBJbml0aWFsaXplIEdvb2dsZSBUcmFuc2xhdGUgV2lkZ2V0XG5pZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmxhbmcgIT0gJ2VuJykge1xuICBnb29nbGVUcmFuc2xhdGVFbGVtZW50SW5pdCgpO1xufVxuXG4vKipcbiAqIFNldCBDU1MgcHJvcGVydGllcyBvZiB2YXJpb3VzIGVsZW1lbnQgaGVpZ2h0cyBmb3JcbiAqIGNhbGN1bGF0aW5nIHRoZSB0cnVlIHdpbmRvdyBib3R0b20gdmFsdWUgaW4gQ1NTLlxuICovXG5cbigoZWxlbWVudHMpID0+IHtcbiAgbGV0IHNldE9iamVjdEhlaWdodHMgPSAoZSkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlWydzZWxlY3RvciddKTtcblxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShlWydwcm9wZXJ0eSddLCBgJHtlbGVtZW50LmNsaWVudEhlaWdodH1weGApO1xuICB9O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50c1tpXVsnc2VsZWN0b3InXSkpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4gc2V0T2JqZWN0SGVpZ2h0cyhlbGVtZW50c1tpXSkpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHNldE9iamVjdEhlaWdodHMoZWxlbWVudHNbaV0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KGVsZW1lbnRzW2ldWydwcm9wZXJ0eSddLCAnMHB4Jyk7XG4gICAgfVxuICB9XG59KShbXG4gIHtcbiAgICAnc2VsZWN0b3InOiAnW2RhdGEtanM9XCJuYXZpZ2F0aW9uXCJdJyxcbiAgICAncHJvcGVydHknOiAnLS13bnljLWRpbWVuc2lvbnMtbmF2aWdhdGlvbi1oZWlnaHQnXG4gIH0sXG4gIHtcbiAgICAnc2VsZWN0b3InOiAnW2RhdGEtanM9XCJmZWVkYmFja1wiXScsXG4gICAgJ3Byb3BlcnR5JzogJy0td255Yy1kaW1lbnNpb25zLWZlZWRiYWNrLWhlaWdodCdcbiAgfVxuXSk7XG5cbm5ldyBTZXRIZWlnaHRQcm9wZXJ0aWVzKHtcbiAgJ2VsZW1lbnRzJzogW1xuICAgIHtcbiAgICAgICdzZWxlY3Rvcic6ICdbZGF0YS1qcz1cIm5hdmlnYXRpb25cIl0nLFxuICAgICAgJ3Byb3BlcnR5JzogJy0tby1uYXZpZ2F0aW9uLWhlaWdodCdcbiAgICB9LFxuICAgIHtcbiAgICAgICdzZWxlY3Rvcic6ICdbZGF0YS1qcz1cImZlZWRiYWNrXCJdJyxcbiAgICAgICdwcm9wZXJ0eSc6ICctLW55Y28tZmVlZGJhY2staGVpZ2h0J1xuICAgIH1cbiAgXVxufSk7XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFD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LENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxLQUFLLE1BQU0sSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7RUFDOUUsS0FBSztBQUNMO0VBQ0E7RUFDQTtFQUNBO0FBQ0E7RUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTO0VBQy9CLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0M7RUFDQTtFQUNBO0VBQ0E7QUFDQTtFQUNBLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7RUFDL0QsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdDO0VBQ0E7RUFDQTtFQUNBO0FBQ0E7RUFDQSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7RUFDcEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNuQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QztFQUNBLE1BQU0sSUFBSSxLQUFLLElBQUksRUFBRSxJQUFJLEtBQUs7RUFDOUIsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEtBQUssTUFBTSxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQztBQUMvRTtFQUNBO0VBQ0EsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSztFQUNyQyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7RUFDOUQsVUFBVSxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssS0FBSyxNQUFNLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDO0VBQzFFLE9BQU8sQ0FBQyxDQUFDO0VBQ1QsS0FBSztBQUNMO0VBQ0E7RUFDQTtFQUNBO0FBQ0E7RUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLO0VBQzNCLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEM7RUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDO0VBQ2hCLEdBQUc7RUFDSCxDQUFDO0FBQ0Q7RUFDQTtFQUNBLE1BQU0sQ0FBQyxRQUFRLEdBQUcscUJBQXFCLENBQUM7QUFDeEM7RUFDQTtFQUNBLE1BQU0sQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQzVCO0VBQ0E7RUFDQSxNQUFNLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQztBQUNoQztFQUNBO0VBQ0EsTUFBTSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7QUFDOUI7RUFDQTtFQUNBLE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDdkQ7RUFDQTtFQUNBLE1BQU0sQ0FBQyxlQUFlLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN6QztFQUNBO0VBQ0EsTUFBTSxDQUFDLFdBQVcsR0FBRztFQUNyQixFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNO0VBQ3pFLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUs7RUFDMUUsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRSxVQUFVO0VBQ25FLENBQUMsQ0FBQztBQUNGO0VBQ0E7RUFDQSxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN0QztFQUNBO0VBQ0EsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNwQztFQUNBO0VBQ0EsTUFBTSxDQUFDLFFBQVEsR0FBRztFQUNsQixFQUFFLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUM7RUFDeEIsRUFBRSxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQztFQUN6QyxDQUFDOztFQ3paRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLE1BQU0sQ0FBQztFQUNiO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLFdBQVcsR0FBRztFQUNoQixJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNwQztFQUNBLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3RDO0VBQ0EsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDbEM7RUFDQSxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUN0QztFQUNBLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQztFQUM3QixNQUFNLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtFQUM3QixNQUFNLEtBQUssRUFBRSxDQUFDLE1BQU0sS0FBSztFQUN6QixRQUFRLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDMUU7RUFDQTtFQUNBLFFBQVEsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxNQUFNLEVBQUU7RUFDOUU7RUFDQSxVQUFVLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlCO0VBQ0E7RUFDQSxVQUFVLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDbkU7RUFDQTtFQUNBLFVBQVUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0VBQzVELGFBQWEsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU07RUFDNUMsY0FBYyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztFQUMvQyxhQUFhLENBQUMsQ0FBQztFQUNmLFNBQVMsTUFBTTtFQUNmO0VBQ0EsVUFBVSxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUM7RUFDaEQsY0FBYyxJQUFJLENBQUMsUUFBUTtFQUMzQixjQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSztFQUNsQyxjQUFjLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztFQUN0QyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEI7RUFDQSxVQUFVLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7RUFDbEMsWUFBWSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0VBQy9ELFdBQVc7RUFDWCxTQUFTO0FBQ1Q7RUFDQTtFQUNBLFFBQVEsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDbEQsUUFBUSxJQUFJLE9BQU8sR0FBRyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUNoRCxRQUFRLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLENBQUM7RUFDM0UsUUFBUSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQ3pFO0VBQ0EsUUFBUSxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6RztFQUNBLFFBQVEsSUFBSSxNQUFNLElBQUksS0FBSyxFQUFFO0VBQzdCLFVBQVUsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0VBQ3hCLFNBQVMsTUFBTSxJQUFJLElBQUksRUFBRTtFQUN6QjtFQUNBLFVBQVUsSUFBSSxZQUFZLEVBQUU7RUFDNUIsWUFBWSxZQUFZLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztFQUN4RCxZQUFZLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztFQUNqQyxXQUFXLE1BQU07RUFDakIsWUFBWSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7RUFDekIsV0FBVztFQUNYLFNBQVM7RUFDVCxPQUFPO0VBQ1AsS0FBSyxDQUFDLENBQUM7QUFDUDtFQUNBLElBQUksT0FBTyxJQUFJLENBQUM7RUFDaEIsR0FBRztFQUNILENBQUM7QUFDRDtFQUNBO0VBQ0EsTUFBTSxDQUFDLFFBQVEsR0FBRyx1QkFBdUIsQ0FBQztBQUMxQztFQUNBO0VBQ0EsTUFBTSxDQUFDLFNBQVMsR0FBRztFQUNuQixFQUFFLEtBQUssRUFBRSx3QkFBd0I7RUFDakMsRUFBRSxJQUFJLEVBQUUsdUJBQXVCO0VBQy9CLEVBQUUsS0FBSyxFQUFFLDJCQUEyQjtFQUNwQyxFQUFFLGNBQWMsRUFBRSx5Q0FBeUM7RUFDM0QsQ0FBQyxDQUFDO0FBQ0Y7RUFDQTtFQUNBLE1BQU0sQ0FBQyxTQUFTLEdBQUc7RUFDbkIsRUFBRSxJQUFJLEVBQUUsWUFBWTtFQUNwQixDQUFDOztFQzdHRDtFQUNBO0VBQ0E7RUFDQSxNQUFNLElBQUksQ0FBQztFQUNYO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsV0FBVyxDQUFDLENBQUMsRUFBRTtFQUNqQjtFQUNBLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ2hGO0VBQ0EsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDcEY7RUFDQSxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNoRTtFQUNBLElBQUksSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0FBQ3BHO0VBQ0EsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDeEU7RUFDQSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN4RTtFQUNBLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3BFO0VBQ0E7RUFDQSxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUk7RUFDdEUsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQzlELE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztFQUM5RCxLQUFLLENBQUMsQ0FBQztBQUNQO0VBQ0E7RUFDQSxJQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEtBQUssSUFBSTtFQUN0RSxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0VBQzlDLFFBQVEsT0FBTztBQUNmO0VBQ0EsTUFBTSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDbEM7RUFDQSxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEQ7RUFDQSxNQUFNLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQzlDO0VBQ0EsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hCO0VBQ0EsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQ2xDLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQjtFQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuRDtFQUNBLFFBQVEsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUM5QztFQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTTtFQUNuRCxVQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdEQ7RUFDQSxVQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDM0IsU0FBUyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztFQUMvQixPQUFPO0VBQ1AsS0FBSyxDQUFDLENBQUM7QUFDUDtFQUNBLElBQUksT0FBTyxJQUFJLENBQUM7RUFDaEIsR0FBRztBQUNIO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7RUFDZixJQUFJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEU7RUFDQSxJQUFJLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakQ7RUFDQSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkI7RUFDQSxJQUFJLElBQUksU0FBUyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVM7RUFDNUQsTUFBTSxTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDakQsU0FBUyxJQUFJLFFBQVEsQ0FBQyxXQUFXO0VBQ2pDLE1BQU0sUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUNuQztFQUNBLE1BQU0sT0FBTyxLQUFLLENBQUM7QUFDbkI7RUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDO0VBQ2hCLEdBQUc7QUFDSDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUU7RUFDaEIsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbkI7RUFDQSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7RUFDdEMsR0FBRztFQUNILENBQUM7QUFDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxJQUFJLENBQUMsUUFBUSxHQUFHLG1CQUFtQixDQUFDO0FBQ3BDO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsSUFBSSxDQUFDLFNBQVMsR0FBRztFQUNqQixFQUFFLE9BQU8sRUFBRSxvQkFBb0I7RUFDL0IsQ0FBQyxDQUFDO0FBQ0Y7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFjLENBQUM7QUFDM0I7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUI7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQztBQUN2QjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRSxDQUFDO0FBQ3ZCO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxFQUFFOztFQ3hKckI7RUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLEtBQUssQ0FBQztFQUNaO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLFdBQVcsQ0FBQyxJQUFJLEVBQUU7RUFDcEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDdEM7RUFDQSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUM7RUFDZixPQUFPLElBQUksQ0FBQyxDQUFDLFFBQVEsS0FBSztFQUMxQixRQUFRLElBQUksUUFBUSxDQUFDLEVBQUU7RUFDdkIsVUFBVSxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztFQUNqQztFQUNBO0VBQ0EsVUFDWSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQ2xDLE9BQU8sQ0FBQztFQUNSLE9BQU8sS0FBSyxDQUFDLENBQUMsS0FBSyxLQUFLO0VBQ3hCO0VBQ0EsUUFDVSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzdCLE9BQU8sQ0FBQztFQUNSLE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLO0VBQ3RCLFFBQVEsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNyRCxRQUFRLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0VBQ2hDLFFBQVEsTUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDakQsUUFBUSxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0VBQ3ZELFFBQVEsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDMUMsT0FBTyxDQUFDLENBQUM7QUFDVDtFQUNBLElBQUksT0FBTyxJQUFJLENBQUM7RUFDaEIsR0FBRztFQUNILENBQUM7QUFDRDtFQUNBO0VBQ0EsS0FBSyxDQUFDLElBQUksR0FBRyxlQUFlOztFQ3hDNUIsTUFBTSxtQkFBbUIsQ0FBQztFQUMxQixFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTtFQUNsQixJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxRQUFRLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDO0FBQzdFO0VBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7RUFDbkQsTUFBTSxJQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFO0VBQ2hFLFFBQVEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDbEYsUUFBUSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNwRixPQUFPLE1BQU07RUFDYixRQUFRLFFBQVEsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0VBQ3hGLE9BQU87RUFDUCxLQUFLO0VBQ0wsR0FBRztBQUNIO0VBQ0EsRUFBRSxXQUFXLENBQUMsQ0FBQyxFQUFFO0VBQ2pCLElBQUksSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUN4RDtFQUNBLElBQUksUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQzNGLEdBQUc7RUFDSCxDQUFDO0FBQ0Q7RUFDQSxtQkFBbUIsQ0FBQyxRQUFRLEdBQUcsRUFBRTs7RUNyQmpDO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLE1BQU0sQ0FBQztFQUNiO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLFdBQVcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO0VBQ3RCO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUM7RUFDL0MsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDaEU7RUFDQSxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQztFQUNuRCxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUN0RTtFQUNBLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQzFFO0VBQ0EsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDdEU7RUFDQSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUMxRTtFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvRDtFQUNBLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVTtFQUN2QixNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUM1QztFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsSUFBSSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFLLElBQUk7RUFDdEUsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7RUFDdEQsUUFBUSxPQUFPO0FBQ2Y7RUFDQSxNQUFNLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUNqQztFQUNBLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QjtFQUNBLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUN4QixLQUFLLENBQUMsQ0FBQztBQUNQO0VBQ0EsSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixHQUFHO0FBQ0g7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRTtFQUNmO0VBQ0EsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2xEO0VBQ0E7RUFDQSxJQUFJLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJO0VBQzVDLE1BQU0sT0FBTyxDQUFDLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0VBQ25FLEtBQUssQ0FBQyxDQUFDO0FBQ1A7RUFDQTtFQUNBLElBQUksSUFBSSxLQUFLLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNqRixJQUFJLElBQUksS0FBSyxHQUFHLENBQUMsT0FBTyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLFdBQVcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN4RjtFQUNBO0VBQ0EsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0VBQ3BFLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDekQ7RUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDO0VBQ2hCLEdBQUc7QUFDSDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFO0VBQ2hCLElBQUksUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvRDtFQUNBLElBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0VBQ3BELE9BQU8sT0FBTyxDQUFDLE9BQU8sSUFBSTtFQUMxQixRQUFRLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDL0UsT0FBTyxDQUFDLENBQUM7QUFDVDtFQUNBLElBQUksWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hEO0VBQ0EsSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixHQUFHO0FBQ0g7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRTtFQUNiLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDdkI7RUFDQSxJQUFJLFFBQVEsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pFO0VBQ0EsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7RUFDcEQsT0FBTyxPQUFPLENBQUMsT0FBTyxJQUFJO0VBQzFCLFFBQVEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakYsT0FBTyxDQUFDLENBQUM7QUFDVDtFQUNBLElBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO0VBQ25ELE9BQU8sT0FBTyxDQUFDLE9BQU8sSUFBSTtFQUMxQixRQUFRLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7RUFDL0MsT0FBTyxDQUFDLENBQUM7QUFDVDtFQUNBLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDcEU7RUFDQSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckI7RUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDO0VBQ2hCLEdBQUc7RUFDSCxDQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxDQUFDLE9BQU8sR0FBRztFQUNqQixFQUFFLEtBQUssRUFBRSxjQUFjO0VBQ3ZCLENBQUMsQ0FBQztBQUNGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxDQUFDLFNBQVMsR0FBRztFQUNuQixFQUFFLE1BQU0sRUFBRSxvQkFBb0I7RUFDOUIsRUFBRSxLQUFLLEVBQUUsMEJBQTBCO0VBQ25DLEVBQUUsTUFBTSxFQUFFLFNBQVM7RUFDbkIsQ0FBQyxDQUFDO0FBQ0Y7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLE1BQU0sQ0FBQyxNQUFNLEdBQUc7RUFDaEIsRUFBRTtFQUNGLElBQUksS0FBSyxFQUFFLE9BQU87RUFDbEIsSUFBSSxTQUFTLEVBQUUsU0FBUztFQUN4QixHQUFHO0VBQ0gsRUFBRTtFQUNGLElBQUksS0FBSyxFQUFFLE1BQU07RUFDakIsSUFBSSxTQUFTLEVBQUUsTUFBTTtFQUNyQixHQUFHO0VBQ0gsQ0FBQyxDQUFDO0FBQ0Y7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQztBQUN6QjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sRUFBRTs7RUMzTHZCO0VBQ0E7RUFDQTtFQUNBLE1BQU0sS0FBSyxDQUFDO0VBQ1osRUFBRSxXQUFXLENBQUMsQ0FBQyxFQUFFO0VBQ2pCLElBQUksTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRDtFQUNBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN0QjtFQUNBLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRztFQUNyQixNQUFNLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUTtFQUMxRCxLQUFLLENBQUM7QUFDTjtFQUNBLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO0FBQzFDO0VBQ0EsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxLQUFLO0VBQzlDLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO0VBQ3hELFFBQVEsT0FBTztBQUNmO0VBQ0EsTUFBTSxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7RUFDOUMsTUFBTSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzVEO0VBQ0EsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztFQUM1QixLQUFLLENBQUMsQ0FBQztBQUNQO0VBQ0EsSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixHQUFHO0FBQ0g7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRTtFQUNuQjtFQUNBLElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUk7RUFDN0IsUUFBUSxJQUFJLEVBQUUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztFQUN4QyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUM7RUFDeEUsUUFBUSxPQUFPLEVBQUUsQ0FBQztFQUNsQixPQUFPLENBQUMsQ0FBQztBQUNUO0VBQ0EsSUFBSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUNwQyxJQUFJLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9CO0VBQ0E7RUFDQSxJQUNNLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3ZDO0FBQ0E7RUFDQSxJQUFJLE9BQU8sQ0FBQyxDQUFDO0VBQ2IsR0FBRztBQUNIO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtFQUN2QixJQUFJLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0VBQ3ZDLElBQUksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDckM7RUFDQTtFQUNBLElBQ00sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDdkM7RUFDQSxHQUFHO0FBQ0g7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0VBQ3ZCLElBQUk7RUFDSixNQUFNLE9BQU8sU0FBUyxLQUFLLFdBQVc7RUFDdEMsTUFBTSxPQUFPLElBQUksS0FBSyxXQUFXO0VBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7RUFDN0M7RUFDQSxNQUFNLE9BQU8sS0FBSyxDQUFDO0FBQ25CO0VBQ0EsSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDO0VBQ2pCLE1BQU0sT0FBTyxFQUFFLEdBQUc7RUFDbEIsS0FBSyxDQUFDLENBQUM7QUFDUDtFQUNBLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0VBQ3BELE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQztFQUNqQixRQUFRLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztFQUN4QyxPQUFPLENBQUMsQ0FBQztFQUNUO0VBQ0EsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNqQztFQUNBO0VBQ0EsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSTtFQUN6QyxNQUFNLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDcEQsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNSO0VBQ0E7RUFDQSxJQUFJLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlDO0VBQ0EsSUFBSSxJQUFJLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFlBQVksQ0FBQztBQUNsRDtFQUNBO0VBQ0EsSUFBSSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNsRDtFQUNBLElBQUksSUFBSSxNQUFNO0VBQ2QsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqRjtFQUNBO0VBQ0EsSUFBSSxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVc7RUFDeEMsTUFBTSxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ2hDO0FBQ0E7RUFDQSxJQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFDOUIsR0FBRztBQUNIO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRTtFQUNsQixJQUFJO0VBQ0osTUFBTSxPQUFPLElBQUksS0FBSyxXQUFXO0VBQ2pDLE1BQU0sT0FBTyxJQUFJLEtBQUssV0FBVztFQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0VBQ3hDO0VBQ0EsTUFBTSxPQUFPLEtBQUssQ0FBQztBQUNuQjtFQUNBLElBQUksSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hFO0VBQ0EsSUFBSSxJQUFJLEtBQUssR0FBRztFQUNoQixNQUFNLGdCQUFnQixFQUFFLEdBQUc7RUFDM0IsS0FBSyxDQUFDO0FBQ047RUFDQTtFQUNBLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztFQUMzQztBQUNBO0VBQ0EsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztFQUN0RCxHQUFHO0FBQ0g7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0VBQ3JCLElBQUk7RUFDSixNQUFNLE9BQU8sSUFBSSxLQUFLLFdBQVc7RUFDakMsTUFBTSxPQUFPLElBQUksS0FBSyxXQUFXO0VBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7RUFDeEM7RUFDQSxNQUFNLE9BQU8sS0FBSyxDQUFDO0FBQ25CO0VBQ0EsSUFBSSxJQUFJLElBQUksR0FBRztFQUNmLE1BQU0sUUFBUSxFQUFFLEdBQUc7RUFDbkIsTUFBTSxXQUFXLEVBQUUsR0FBRztFQUN0QixLQUFLLENBQUM7QUFDTjtFQUNBO0VBQ0EsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztFQUN2QztBQUNBO0VBQ0EsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0VBQ3BELEdBQUc7RUFDSCxDQUFDO0FBQ0Q7RUFDQTtFQUNBLEtBQUssQ0FBQyxRQUFRLEdBQUcsb0JBQW9CLENBQUM7QUFDdEM7RUFDQTtFQUNBLEtBQUssQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO0FBQ3BCO0VBQ0E7RUFDQSxLQUFLLENBQUMsWUFBWSxHQUFHO0VBQ3JCLEVBQUUsV0FBVztFQUNiLEVBQUUsTUFBTTtFQUNSLENBQUM7O0VDekxEO0VBQ0E7RUFDQTtFQUNBLE1BQU0sUUFBUSxDQUFDO0VBQ2Y7RUFDQTtFQUNBO0VBQ0EsRUFBRSxXQUFXLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtFQUN0QixJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztBQUNsRTtFQUNBLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO0FBQ2xFO0VBQ0EsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7QUFDbEU7RUFDQSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLENBQUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLGlCQUFpQixDQUFDO0FBQ3RHO0VBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFO0VBQ2xDO0VBQ0EsTUFBTSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUk7RUFDL0QsUUFBUSxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0VBQzlDLFFBQVEsSUFBSSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQztFQUM5QyxPQUFPLENBQUMsQ0FBQztBQUNUO0VBQ0E7RUFDQSxNQUFNLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEtBQUssSUFBSTtFQUN4RSxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0VBQ2hELFVBQVUsT0FBTztBQUNqQjtFQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ3BDO0VBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUQ7RUFDQSxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzlCLE9BQU8sQ0FBQyxDQUFDO0VBQ1QsS0FBSztFQUNMLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3RCO0VBQ0EsSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixHQUFHO0FBQ0g7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxFQUFFLEVBQUU7RUFDbkIsSUFBSSxPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0VBQ2hDLE9BQU8sSUFBSSxDQUFDLEdBQUcsSUFBSTtFQUNuQixRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDNUIsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSTtFQUN0QixRQUNVLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDM0IsT0FBTyxDQUFDLENBQUM7RUFDVCxHQUFHO0VBQ0gsQ0FBQztBQUNEO0VBQ0E7RUFDQSxRQUFRLENBQUMsUUFBUSxHQUFHLHdCQUF3QixDQUFDO0FBQzdDO0VBQ0E7RUFDQSxRQUFRLENBQUMsUUFBUSxHQUFHLE1BQU07RUFDMUIsRUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0VBQzVCLENBQUMsQ0FBQztBQUNGO0VBQ0E7RUFDQSxRQUFRLENBQUMsUUFBUSxHQUFHLE1BQU07RUFDMUIsRUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0VBQzdCLENBQUMsQ0FBQztBQUNGO0VBQ0E7RUFDQSxRQUFRLENBQUMsaUJBQWlCLEdBQUcsTUFBTTtFQUNuQyxFQUFFLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQztFQUN6QixDQUFDOztFQzlFRDtFQUNBO0VBQ0E7RUFDQSxNQUFNLFFBQVEsQ0FBQztFQUNmO0VBQ0E7RUFDQTtFQUNBLEVBQUUsV0FBVyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7RUFDdEIsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7QUFDbEU7RUFDQSxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEQ7RUFDQSxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUQ7RUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDO0VBQ2hCLEdBQUc7QUFDSDtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsR0FBRyxHQUFHO0VBQ1IsSUFBSSxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUs7RUFDbEMsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQzdELEdBQUc7RUFDSCxDQUFDO0FBQ0Q7RUFDQTtFQUNBLFFBQVEsQ0FBQyxRQUFRLEdBQUcsU0FBUzs7RUMzQjdCO0FBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLGdCQUFnQixDQUFDO0VBQ3ZCO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLFdBQVcsR0FBRztFQUNoQjtFQUNBLElBQUksSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQzFELElBQUksSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0VBQ2pELElBQUksSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNqQyxJQUFJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQ3pDLElBQUksSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3BGO0VBQ0E7RUFDQSxJQUFJLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVEO0VBQ0EsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztBQUN6RDtFQUNBLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNO0VBQzFDO0VBQ0EsTUFBTSxJQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsRUFBRTtFQUMxQyxRQUFtRDtFQUNuRDtFQUNBLFVBQVUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0VBQ2pELFNBQVM7QUFDVDtFQUNBLFFBQVEsT0FBTyxLQUFLLENBQUM7RUFDckIsT0FBTztBQUNQO0VBQ0E7RUFDQSxNQUFNLElBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUN2RCxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BEO0VBQ0EsTUFBaUQ7RUFDakQ7RUFDQSxRQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CO0VBQ0E7RUFDQSxRQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN0QztFQUNBLFFBQVEsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUMzQixPQUFPO0VBQ1AsS0FBSyxDQUFDLENBQUM7RUFDUCxHQUFHO0VBQ0gsQ0FBQztBQUNEO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsZ0JBQWdCLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQztBQUNyQztFQUNBO0VBQ0E7RUFDQTtFQUNBLGdCQUFnQixDQUFDLE1BQU0sR0FBRztFQUMxQixFQUFFLE9BQU8sRUFBRTtFQUNYLElBQUksTUFBTSxFQUFFO0VBQ1osTUFBTSxVQUFVLEVBQUU7RUFDbEI7RUFDQSxRQUFRLGtCQUFrQixFQUFFLElBQUk7RUFDaEM7RUFDQTtFQUNBLFFBQVEscUJBQXFCLEVBQUUsSUFBSTtFQUNuQyxPQUFPO0VBQ1AsS0FBSztFQUNMLEdBQUc7RUFDSCxDQUFDOztFQ3hFRDtFQUNBO0VBQ0E7RUFDQTtFQUNBLE1BQU0sU0FBUyxDQUFDO0VBQ2hCO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLFdBQVcsR0FBRztFQUNoQixJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUM7RUFDOUIsTUFBTSxRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVE7RUFDbEMsS0FBSyxDQUFDLENBQUM7QUFDUDtFQUNBLElBQUksT0FBTyxJQUFJLENBQUM7RUFDaEIsR0FBRztFQUNILENBQUM7QUFDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxTQUFTLENBQUMsUUFBUSxHQUFHLHdCQUF3Qjs7RUMxQjdDO0VBQ0E7RUFDQTtFQUNBLE1BQU0sT0FBTyxDQUFDO0VBQ2QsRUFBRSxXQUFXLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtFQUN0QixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLE9BQU87QUFDM0I7RUFDQSxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztBQUM3RjtFQUNBLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQzdEO0VBQ0EsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDckU7RUFDQTtFQUNBLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLG9CQUFvQixDQUFDLENBQUMsT0FBTyxFQUFFLFFBQVEsS0FBSztFQUNwRSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0VBQ3ZDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckI7RUFDQTtFQUNBLElBQUksSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVk7RUFDL0QsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDdEQ7RUFDQSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMxRDtFQUNBLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0VBQ2hELE1BQU0sTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQztFQUNBLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDbEMsS0FBSztFQUNMLEdBQUc7QUFDSDtFQUNBLEVBQUUsUUFBUSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUU7RUFDOUIsSUFBSSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0I7RUFDQSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0VBQzdDLE1BQU0sTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CO0VBQ0EsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDL0M7RUFDQSxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUM7RUFDeEIsS0FBSztFQUNMLEdBQUc7RUFDSCxDQUFDO0FBQ0Q7RUFDQTtFQUNBLE9BQU8sQ0FBQyxPQUFPLEdBQUc7RUFDbEIsRUFBRSxJQUFJLEVBQUUsSUFBSTtFQUNaLEVBQUUsVUFBVSxFQUFFLEtBQUs7RUFDbkIsRUFBRSxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUM7RUFDbkIsQ0FBQyxDQUFDO0FBQ0Y7RUFDQTtFQUNBLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxJQUFJO0VBQzNCLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNyQixFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0dBQW9HLENBQUMsQ0FBQztFQUNwSCxDQUFDLENBQUM7QUFDRjtFQUNBO0VBQ0EsT0FBTyxDQUFDLFFBQVEsR0FBRyxzQkFBc0IsQ0FBQztBQUMxQztFQUNBO0VBQ0EsT0FBTyxDQUFDLFNBQVMsR0FBRztFQUNwQixFQUFFLElBQUksRUFBRSxxQ0FBcUM7RUFDN0MsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCO0VBQzlCLENBQUM7O0VDOURELE1BQU0sZ0JBQWdCLENBQUM7RUFDdkI7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsV0FBVyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7RUFDdEIsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxHQUFHLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztBQUMxRTtFQUNBLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTO0VBQ2pDLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFNBQVMsQ0FBQztBQUMxRjtFQUNBLElBQUksSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQyxjQUFjO0VBQzNDLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLGNBQWMsQ0FBQztBQUN6RztFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEtBQUssTUFBTSxlQUFlLEdBQUcsSUFBSSxJQUFJO0VBQ3JDLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtFQUNoRSxRQUFRLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BEO0VBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7RUFDMUQsVUFBVSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUM1RSxVQUFVLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hGO0VBQ0EsVUFBVSxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxDQUFDLEVBQUU7RUFDMUQsWUFBWSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDO0VBQ3JELFlBQVksT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQztFQUNwRCxXQUFXO0VBQ1gsU0FBUztFQUNULE9BQU87QUFDUDtFQUNBLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQy9FLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQzFFLEtBQUssQ0FBQztBQUNOO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLElBQUksQ0FBQyxPQUFPLElBQUk7RUFDaEIsTUFBTSxJQUFJLE9BQU8sRUFBRTtFQUNuQixRQUFRLElBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDMUY7RUFDQSxRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7RUFDMUQsVUFBVSxNQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QztFQUNBLFVBQVUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFLLElBQUk7RUFDL0MsWUFBWSxVQUFVLENBQUMsTUFBTTtFQUM3QixjQUFjLGVBQWUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUM7RUFDQSxjQUFjLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztFQUNuRixjQUFjLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2RTtFQUNBLGNBQWMsSUFBSSxTQUFTLEVBQUU7RUFDN0IsZ0JBQWdCLFNBQVMsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0VBQ3pELGdCQUFnQixTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7RUFDbEMsZUFBZTtFQUNmLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztFQUNwQixXQUFXLENBQUMsQ0FBQztFQUNiLFNBQVM7RUFDVCxPQUFPO0VBQ1AsS0FBSyxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDOUM7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsSUFBSSxDQUFDLFFBQVEsSUFBSTtFQUNqQixNQUFNLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJO0VBQ2xDLFFBQVEsSUFBSSxPQUFPLENBQUM7RUFDcEIsVUFBVSxPQUFPLEVBQUUsT0FBTztFQUMxQixVQUFVLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYztFQUN0QyxVQUFVLFNBQVMsRUFBRTtFQUNyQixZQUFZLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVk7RUFDN0MsWUFBWSxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0I7RUFDekQsV0FBVztFQUNYLFVBQVUsT0FBTyxFQUFFLENBQUMsS0FBSyxLQUFLO0VBQzlCLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsT0FBTztBQUM5QztFQUNBLFlBQVksSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25GO0VBQ0EsWUFBWSxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU87QUFDbEM7RUFDQSxZQUFZLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUM7RUFDN0QsY0FBYyxJQUFJLEVBQUUsUUFBUSxDQUFDLFVBQVU7RUFDdkMsY0FBYyxHQUFHLEVBQUUsQ0FBQztFQUNwQixjQUFjLFFBQVEsRUFBRSxRQUFRO0VBQ2hDLGFBQWEsQ0FBQyxDQUFDO0FBQ2Y7RUFDQSxZQUFZLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdFO0VBQ0EsWUFBWSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtFQUN4RCxjQUFjLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7RUFDeEQsYUFBYTtBQUNiO0VBQ0EsWUFBWSxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDdEMsV0FBVztFQUNYLFNBQVMsQ0FBQyxDQUFDO0VBQ1gsT0FBTyxDQUFDLENBQUM7RUFDVCxLQUFLLEVBQUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztFQUMxRCxHQUFHO0VBQ0gsQ0FBQztBQUNEO0VBQ0E7RUFDQSxnQkFBZ0IsQ0FBQyxRQUFRLEdBQUcsa0NBQWtDLENBQUM7QUFDL0Q7RUFDQTtFQUNBLGdCQUFnQixDQUFDLFNBQVMsR0FBRztFQUM3QixFQUFFLE9BQU8sRUFBRSxvQ0FBb0M7RUFDL0MsRUFBRSxZQUFZLEVBQUUsb0RBQW9EO0VBQ3BFLEVBQUUsa0JBQWtCLEVBQUUsOEJBQThCO0VBQ3BELEVBQUUsTUFBTSxFQUFFLG1DQUFtQztFQUM3QyxFQUFFLEtBQUssRUFBRSx1Q0FBdUM7RUFDaEQsRUFBRSxVQUFVLEVBQUUsc0JBQXNCO0VBQ3BDLENBQUMsQ0FBQztBQUNGO0VBQ0E7RUFDQSxnQkFBZ0IsQ0FBQyxjQUFjLEdBQUc7RUFDbEMsRUFBRSxJQUFJLEVBQUUsSUFBSTtFQUNaLEVBQUUsVUFBVSxFQUFFLEtBQUs7RUFDbkIsRUFBRSxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUM7RUFDbkIsQ0FBQzs7RUNoSUQ7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLE1BQU0sTUFBTSxDQUFDO0VBQ2I7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsV0FBVyxHQUFHO0VBQ2hCLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQztFQUM5QixNQUFNLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUTtFQUMvQixNQUFNLEtBQUssRUFBRSxDQUFDLE1BQU0sS0FBSztFQUN6QixRQUFRLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQ3pELFFBQVEsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25FO0VBQ0EsUUFBUSxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssRUFBRTtFQUN0RCxVQUFVLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztFQUN4QixTQUFTO0VBQ1QsT0FBTztFQUNQLEtBQUssQ0FBQyxDQUFDO0FBQ1A7RUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDO0VBQ2hCLEdBQUc7RUFDSCxDQUFDO0FBQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLE1BQU0sQ0FBQyxRQUFRLEdBQUcscUJBQXFCLENBQUM7QUFDeEM7RUFDQSxNQUFNLENBQUMsU0FBUyxHQUFHO0VBQ25CLEVBQUUsS0FBSyxFQUFFLHdCQUF3QjtFQUNqQyxDQUFDOztFQ3BDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxJQUFJLENBQUM7RUFDWDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsRUFBRSxXQUFXLEdBQUc7RUFDaEIsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDbEM7RUFDQSxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNwQztFQUNBLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQztFQUM3QixNQUFNLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtFQUM3QixNQUFNLEtBQUssRUFBRSxNQUFNLElBQUk7RUFDdkI7RUFDQSxRQUFRLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRTtFQUNsRSxVQUFVLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDcEU7RUFDQTtFQUNBLFVBQVUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0VBQzVELGFBQWEsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU07RUFDNUMsY0FBYyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztFQUMvQyxhQUFhLENBQUMsQ0FBQztFQUNmLFNBQVMsTUFBTTtFQUNmLFVBQVUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0VBQzlELFNBQVM7RUFDVCxPQUFPO0VBQ1AsS0FBSyxDQUFDLENBQUM7QUFDUDtFQUNBLElBQUksT0FBTyxJQUFJLENBQUM7RUFDaEIsR0FBRztFQUNILENBQUM7QUFDRDtFQUNBO0VBQ0EsSUFBSSxDQUFDLFFBQVEsR0FBRyxtQkFBbUIsQ0FBQztBQUNwQztFQUNBO0VBQ0EsSUFBSSxDQUFDLFNBQVMsR0FBRztFQUNqQixFQUFFLEtBQUssRUFBRSx5QkFBeUI7RUFDbEMsRUFBRSxJQUFJLEVBQUUsd0JBQXdCO0VBQ2hDLENBQUM7O0VDakREO0VBQ0E7RUFDQTtBQTBCQTtFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0FBQ3ZCO0VBQ0E7RUFDQTtFQUNBO0FBQ0E7RUFDQSxJQUFJLFNBQVMsRUFBRSxDQUFDO0VBQ2hCLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztFQUN2QixJQUFJLE1BQU0sRUFBRSxDQUFDO0VBQ2IsSUFBSSxJQUFJLEVBQUUsQ0FBQztFQUNYLElBQUksTUFBTSxFQUFFLENBQUM7RUFDYixJQUFJLE1BQU0sRUFBRSxDQUFDO0VBQ2IsSUFBSSxLQUFLLEVBQUUsQ0FBQztFQUNaLElBQUksUUFBUSxFQUFFLENBQUM7QUFDZjtFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsSUFBSSxJQUFJLENBQUM7RUFDVCxFQUFFLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUM7RUFDL0QsS0FBSyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7RUFDMUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDO0VBQzlELEtBQUssWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO0VBQ3pDLENBQUMsQ0FBQyxDQUFDO0FBQ0g7QUFDQTtFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQzlEO0VBQ0EsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNoQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQ3BDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDbEMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqQztFQUNBLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNqQjtFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsSUFBSSxVQUFVLEdBQUc7RUFDakIsRUFBRSxLQUFLLEVBQUUsWUFBWTtFQUNyQixFQUFFLFNBQVMsRUFBRSxTQUFTO0VBQ3RCLEVBQUUsSUFBSSxFQUFFLGFBQWE7RUFDckIsRUFBRSxPQUFPLEVBQUUsT0FBTztFQUNsQixDQUFDLENBQUM7QUFDRjtFQUNBLElBQUksU0FBUyxHQUFHO0VBQ2hCLEVBQUUsS0FBSyxFQUFFLGFBQWE7RUFDdEIsRUFBRSxTQUFTLEVBQUUsTUFBTTtFQUNuQixFQUFFLElBQUksRUFBRSxZQUFZO0VBQ3BCLEVBQUUsT0FBTyxFQUFFLE9BQU87RUFDbEIsQ0FBQyxDQUFDO0FBQ0Y7RUFDQTtBQUNBO0VBQ0EsSUFBSSxrQkFBa0IsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEU7RUFDQSxJQUFJLGtCQUFrQixFQUFFO0VBQ3hCLEVBQUUsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3ZEO0VBQ0EsRUFBRSxJQUFJLEtBQUssS0FBSyxlQUFlLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0VBQzNELElBQUksT0FBTyxlQUFlLENBQUMsU0FBUztFQUNwQyxNQUFNLEtBQUssU0FBUztFQUNwQixRQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDL0IsUUFBUSxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztFQUM5RSxRQUFRLE1BQU07QUFDZDtFQUNBLE1BQU0sS0FBSyxPQUFPO0VBQ2xCLFFBQVEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztFQUNoQyxRQUFRLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0VBQy9FLFFBQVEsTUFBTTtFQUNkLEtBQUs7RUFDTCxHQUFHO0VBQ0gsQ0FBQztBQUNEO0VBQ0EsSUFBSSxNQUFNLENBQUM7RUFDWCxFQUFFLE1BQU0sRUFBRTtFQUNWLElBQUksVUFBVTtFQUNkLElBQUksU0FBUztFQUNiLEdBQUc7RUFDSCxFQUFFLEtBQUssRUFBRSxJQUFJLElBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0VBQ2pFLEtBQUssT0FBTyxDQUFDLE9BQU8sSUFBSTtFQUN4QixNQUFNLE9BQU8sQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUM7RUFDdEQsU0FBUyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3JELEtBQUssQ0FBQztFQUNOLENBQUMsQ0FBQyxDQUFDO0FBQ0g7RUFDQTtFQUNBO0VBQ0E7QUFDQTtFQUNBLElBQUksUUFBUSxDQUFDO0VBQ2IsRUFBRSxRQUFRLEVBQUUsTUFBTTtFQUNsQixJQUFJLElBQUksTUFBTSxDQUFDO0VBQ2YsTUFBTSxRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVE7RUFDakMsS0FBSyxDQUFDLENBQUM7RUFDUCxHQUFHO0VBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDSDtFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0E7RUFDQSxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7RUFDM0UsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0VBQ2hFLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUM3RDtFQUNBLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJO0VBQzFCLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUNoQyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0VBQ3RDLENBQUMsQ0FBQyxDQUFDO0FBQ0g7RUFDQSxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSTtFQUM3QixFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDaEMsQ0FBQyxDQUFDLENBQUM7QUFDSDtFQUNBLElBQUksUUFBUSxFQUFFO0VBQ2QsRUFBRSxRQUFRLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQ3BDLENBQUM7QUFDRDtFQUNBO0VBQ0EsSUFBSSxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUU7RUFDM0MsRUFBRSwwQkFBMEIsRUFBRSxDQUFDO0VBQy9CLENBQUM7QUFDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0FBQ0E7RUFDQSxDQUFDLENBQUMsUUFBUSxLQUFLO0VBQ2YsRUFBRSxJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxLQUFLO0VBQ2hDLElBQUksSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUN4RDtFQUNBLElBQUksUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQzNGLEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtFQUM1QyxJQUFJLElBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTtFQUN6RCxNQUFNLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzNFLE1BQU0sTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDN0UsS0FBSyxNQUFNO0VBQ1gsTUFBTSxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0VBQ2pGLEtBQUs7RUFDTCxHQUFHO0VBQ0gsQ0FBQyxFQUFFO0VBQ0gsRUFBRTtFQUNGLElBQUksVUFBVSxFQUFFLHdCQUF3QjtFQUN4QyxJQUFJLFVBQVUsRUFBRSxxQ0FBcUM7RUFDckQsR0FBRztFQUNILEVBQUU7RUFDRixJQUFJLFVBQVUsRUFBRSxzQkFBc0I7RUFDdEMsSUFBSSxVQUFVLEVBQUUsbUNBQW1DO0VBQ25ELEdBQUc7RUFDSCxDQUFDLENBQUMsQ0FBQztBQUNIO0VBQ0EsSUFBSSxtQkFBbUIsQ0FBQztFQUN4QixFQUFFLFVBQVUsRUFBRTtFQUNkLElBQUk7RUFDSixNQUFNLFVBQVUsRUFBRSx3QkFBd0I7RUFDMUMsTUFBTSxVQUFVLEVBQUUsdUJBQXVCO0VBQ3pDLEtBQUs7RUFDTCxJQUFJO0VBQ0osTUFBTSxVQUFVLEVBQUUsc0JBQXNCO0VBQ3hDLE1BQU0sVUFBVSxFQUFFLHdCQUF3QjtFQUMxQyxLQUFLO0VBQ0wsR0FBRztFQUNILENBQUMsQ0FBQzs7Ozs7OyJ9
