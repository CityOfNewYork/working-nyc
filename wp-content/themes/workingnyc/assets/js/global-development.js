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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLWRldmVsb3BtZW50LmpzIiwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL3RvZ2dsZS90b2dnbGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL2RpYWxvZy9kaWFsb2cuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL2NvcHkvY29weS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Abnljb3Bwb3J0dW5pdHkvcHR0cm4tc2NyaXB0cy9zcmMvaWNvbnMvaWNvbnMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL3NldC1oZWlnaHQtcHJvcGVydGllcy9zZXQtaGVpZ2h0LXByb3BlcnRpZXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL3RyYWNrL3RyYWNrLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy93ZWItc2hhcmUvd2ViLXNoYXJlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy93aW5kb3ctdmgvd2luZG93LXZoLmpzIiwiLi4vLi4vc3JjL2pzL21vZHVsZXMvcm9sbGJhci1jb25maWd1cmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3N0YW5kYXJkL3NyYy9jb21wb25lbnRzL2FjY29yZGlvbi9hY2NvcmRpb24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL29ic2VydmUvb2JzZXJ2ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Abnljb3Bwb3J0dW5pdHkvc3RhbmRhcmQvc3JjL2NvbXBvbmVudHMvYWN0aXZlLW5hdmlnYXRpb24vYWN0aXZlLW5hdmlnYXRpb24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3N0YW5kYXJkL3NyYy9vYmplY3RzL3NlYXJjaC9zZWFyY2guanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG55Y29wcG9ydHVuaXR5L3BhdHRlcm4tbWVudS9zcmMvbWVudS5qcyIsIi4uLy4uL3NyYy9qcy9nbG9iYWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFRoZSBTaW1wbGUgVG9nZ2xlIGNsYXNzLiBUaGlzIHdpbGwgdG9nZ2xlIHRoZSBjbGFzcyAnYWN0aXZlJyBhbmQgJ2hpZGRlbidcbiAqIG9uIHRhcmdldCBlbGVtZW50cywgZGV0ZXJtaW5lZCBieSBhIGNsaWNrIGV2ZW50IG9uIGEgc2VsZWN0ZWQgbGluayBvclxuICogZWxlbWVudC4gVGhpcyB3aWxsIGFsc28gdG9nZ2xlIHRoZSBhcmlhLWhpZGRlbiBhdHRyaWJ1dGUgZm9yIHRhcmdldGVkXG4gKiBlbGVtZW50cyB0byBzdXBwb3J0IHNjcmVlbiByZWFkZXJzLiBUYXJnZXQgc2V0dGluZ3MgYW5kIG90aGVyIGZ1bmN0aW9uYWxpdHlcbiAqIGNhbiBiZSBjb250cm9sbGVkIHRocm91Z2ggZGF0YSBhdHRyaWJ1dGVzLlxuICpcbiAqIFRoaXMgdXNlcyB0aGUgLm1hdGNoZXMoKSBtZXRob2Qgd2hpY2ggd2lsbCByZXF1aXJlIGEgcG9seWZpbGwgZm9yIElFXG4gKiBodHRwczovL3BvbHlmaWxsLmlvL3YyL2RvY3MvZmVhdHVyZXMvI0VsZW1lbnRfcHJvdG90eXBlX21hdGNoZXNcbiAqXG4gKiBAY2xhc3NcbiAqL1xuY2xhc3MgVG9nZ2xlIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBzICBTZXR0aW5ncyBmb3IgdGhpcyBUb2dnbGUgaW5zdGFuY2VcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgVGhlIGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzKSB7XG4gICAgLy8gQ3JlYXRlIGFuIG9iamVjdCB0byBzdG9yZSBleGlzdGluZyB0b2dnbGUgbGlzdGVuZXJzIChpZiBpdCBkb2Vzbid0IGV4aXN0KVxuICAgIGlmICghd2luZG93Lmhhc093blByb3BlcnR5KFRvZ2dsZS5jYWxsYmFjaykpXG4gICAgICB3aW5kb3dbVG9nZ2xlLmNhbGxiYWNrXSA9IFtdO1xuXG4gICAgcyA9ICghcykgPyB7fSA6IHM7XG5cbiAgICB0aGlzLnNldHRpbmdzID0ge1xuICAgICAgc2VsZWN0b3I6IChzLnNlbGVjdG9yKSA/IHMuc2VsZWN0b3IgOiBUb2dnbGUuc2VsZWN0b3IsXG4gICAgICBuYW1lc3BhY2U6IChzLm5hbWVzcGFjZSkgPyBzLm5hbWVzcGFjZSA6IFRvZ2dsZS5uYW1lc3BhY2UsXG4gICAgICBpbmFjdGl2ZUNsYXNzOiAocy5pbmFjdGl2ZUNsYXNzKSA/IHMuaW5hY3RpdmVDbGFzcyA6IFRvZ2dsZS5pbmFjdGl2ZUNsYXNzLFxuICAgICAgYWN0aXZlQ2xhc3M6IChzLmFjdGl2ZUNsYXNzKSA/IHMuYWN0aXZlQ2xhc3MgOiBUb2dnbGUuYWN0aXZlQ2xhc3MsXG4gICAgICBiZWZvcmU6IChzLmJlZm9yZSkgPyBzLmJlZm9yZSA6IGZhbHNlLFxuICAgICAgYWZ0ZXI6IChzLmFmdGVyKSA/IHMuYWZ0ZXIgOiBmYWxzZSxcbiAgICAgIHZhbGlkOiAocy52YWxpZCkgPyBzLnZhbGlkIDogZmFsc2UsXG4gICAgICBmb2N1c2FibGU6IChzLmhhc093blByb3BlcnR5KCdmb2N1c2FibGUnKSkgPyBzLmZvY3VzYWJsZSA6IHRydWUsXG4gICAgICBqdW1wOiAocy5oYXNPd25Qcm9wZXJ0eSgnanVtcCcpKSA/IHMuanVtcCA6IHRydWVcbiAgICB9O1xuXG4gICAgLy8gU3RvcmUgdGhlIGVsZW1lbnQgZm9yIHBvdGVudGlhbCB1c2UgaW4gY2FsbGJhY2tzXG4gICAgdGhpcy5lbGVtZW50ID0gKHMuZWxlbWVudCkgPyBzLmVsZW1lbnQgOiBmYWxzZTtcblxuICAgIGlmICh0aGlzLmVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZShldmVudCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdGhlcmUgaXNuJ3QgYW4gZXhpc3RpbmcgaW5zdGFudGlhdGVkIHRvZ2dsZSwgYWRkIHRoZSBldmVudCBsaXN0ZW5lci5cbiAgICAgIGlmICghd2luZG93W1RvZ2dsZS5jYWxsYmFja10uaGFzT3duUHJvcGVydHkodGhpcy5zZXR0aW5ncy5zZWxlY3RvcikpIHtcbiAgICAgICAgbGV0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBUb2dnbGUuZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHRnZ2xlRXZlbnQgPSBUb2dnbGUuZXZlbnRzW2ldO1xuXG4gICAgICAgICAgYm9keS5hZGRFdmVudExpc3RlbmVyKHRnZ2xlRXZlbnQsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGlmICghZXZlbnQudGFyZ2V0Lm1hdGNoZXModGhpcy5zZXR0aW5ncy5zZWxlY3RvcikpXG4gICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5ldmVudCA9IGV2ZW50O1xuXG4gICAgICAgICAgICBsZXQgdHlwZSA9IGV2ZW50LnR5cGUudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICB0aGlzW2V2ZW50LnR5cGVdICYmXG4gICAgICAgICAgICAgIFRvZ2dsZS5lbGVtZW50c1t0eXBlXSAmJlxuICAgICAgICAgICAgICBUb2dnbGUuZWxlbWVudHNbdHlwZV0uaW5jbHVkZXMoZXZlbnQudGFyZ2V0LnRhZ05hbWUpXG4gICAgICAgICAgICApIHRoaXNbZXZlbnQudHlwZV0oZXZlbnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVjb3JkIHRoYXQgYSB0b2dnbGUgdXNpbmcgdGhpcyBzZWxlY3RvciBoYXMgYmVlbiBpbnN0YW50aWF0ZWQuXG4gICAgLy8gVGhpcyBwcmV2ZW50cyBkb3VibGUgdG9nZ2xpbmcuXG4gICAgd2luZG93W1RvZ2dsZS5jYWxsYmFja11bdGhpcy5zZXR0aW5ncy5zZWxlY3Rvcl0gPSB0cnVlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ2xpY2sgZXZlbnQgaGFuZGxlclxuICAgKlxuICAgKiBAcGFyYW0gIHtFdmVudH0gIGV2ZW50ICBUaGUgb3JpZ2luYWwgY2xpY2sgZXZlbnRcbiAgICovXG4gIGNsaWNrKGV2ZW50KSB7XG4gICAgdGhpcy50b2dnbGUoZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIElucHV0L3NlbGVjdC90ZXh0YXJlYSBjaGFuZ2UgZXZlbnQgaGFuZGxlci4gQ2hlY2tzIHRvIHNlZSBpZiB0aGVcbiAgICogZXZlbnQudGFyZ2V0IGlzIHZhbGlkIHRoZW4gdG9nZ2xlcyBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQHBhcmFtICB7RXZlbnR9ICBldmVudCAgVGhlIG9yaWdpbmFsIGlucHV0IGNoYW5nZSBldmVudFxuICAgKi9cbiAgY2hhbmdlKGV2ZW50KSB7XG4gICAgbGV0IHZhbGlkID0gZXZlbnQudGFyZ2V0LmNoZWNrVmFsaWRpdHkoKTtcblxuICAgIGlmICh2YWxpZCAmJiAhdGhpcy5pc0FjdGl2ZShldmVudC50YXJnZXQpKSB7XG4gICAgICB0aGlzLnRvZ2dsZShldmVudCk7IC8vIHNob3dcbiAgICB9IGVsc2UgaWYgKCF2YWxpZCAmJiB0aGlzLmlzQWN0aXZlKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgIHRoaXMudG9nZ2xlKGV2ZW50KTsgLy8gaGlkZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB0byBzZWUgaWYgdGhlIHRvZ2dsZSBpcyBhY3RpdmVcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgZWxlbWVudCAgVGhlIHRvZ2dsZSBlbGVtZW50ICh0cmlnZ2VyKVxuICAgKi9cbiAgaXNBY3RpdmUoZWxlbWVudCkge1xuICAgIGxldCBhY3RpdmUgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKSB7XG4gICAgICBhY3RpdmUgPSBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKVxuICAgIH1cblxuICAgIC8vIGlmICgpIHtcbiAgICAgIC8vIFRvZ2dsZS5lbGVtZW50QXJpYVJvbGVzXG4gICAgICAvLyBUT0RPOiBBZGQgY2F0Y2ggdG8gc2VlIGlmIGVsZW1lbnQgYXJpYSByb2xlcyBhcmUgdG9nZ2xlZFxuICAgIC8vIH1cblxuICAgIC8vIGlmICgpIHtcbiAgICAgIC8vIFRvZ2dsZS50YXJnZXRBcmlhUm9sZXNcbiAgICAgIC8vIFRPRE86IEFkZCBjYXRjaCB0byBzZWUgaWYgdGFyZ2V0IGFyaWEgcm9sZXMgYXJlIHRvZ2dsZWRcbiAgICAvLyB9XG5cbiAgICByZXR1cm4gYWN0aXZlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgdGFyZ2V0IG9mIHRoZSB0b2dnbGUgZWxlbWVudCAodHJpZ2dlcilcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgZWwgIFRoZSB0b2dnbGUgZWxlbWVudCAodHJpZ2dlcilcbiAgICovXG4gIGdldFRhcmdldChlbGVtZW50KSB7XG4gICAgbGV0IHRhcmdldCA9IGZhbHNlO1xuXG4gICAgLyoqIEFuY2hvciBMaW5rcyAqL1xuICAgIHRhcmdldCA9IChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnaHJlZicpKSA/XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpIDogdGFyZ2V0O1xuXG4gICAgLyoqIFRvZ2dsZSBDb250cm9scyAqL1xuICAgIHRhcmdldCA9IChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpKSA/XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpfWApIDogdGFyZ2V0O1xuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdG9nZ2xlIGV2ZW50IHByb3h5IGZvciBnZXR0aW5nIGFuZCBzZXR0aW5nIHRoZSBlbGVtZW50L3MgYW5kIHRhcmdldFxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBldmVudCAgVGhlIG1haW4gY2xpY2sgZXZlbnRcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgIFRoZSBUb2dnbGUgaW5zdGFuY2VcbiAgICovXG4gIHRvZ2dsZShldmVudCkge1xuICAgIGxldCBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuICAgIGxldCB0YXJnZXQgPSBmYWxzZTtcbiAgICBsZXQgZm9jdXNhYmxlID0gW107XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGFyZ2V0ID0gdGhpcy5nZXRUYXJnZXQoZWxlbWVudCk7XG5cbiAgICAvKiogRm9jdXNhYmxlIENoaWxkcmVuICovXG4gICAgZm9jdXNhYmxlID0gKHRhcmdldCkgP1xuICAgICAgdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoVG9nZ2xlLmVsRm9jdXNhYmxlLmpvaW4oJywgJykpIDogZm9jdXNhYmxlO1xuXG4gICAgLyoqIE1haW4gRnVuY3Rpb25hbGl0eSAqL1xuICAgIGlmICghdGFyZ2V0KSByZXR1cm4gdGhpcztcbiAgICB0aGlzLmVsZW1lbnRUb2dnbGUoZWxlbWVudCwgdGFyZ2V0LCBmb2N1c2FibGUpO1xuXG4gICAgLyoqIFVuZG8gKi9cbiAgICBpZiAoZWxlbWVudC5kYXRhc2V0W2Ake3RoaXMuc2V0dGluZ3MubmFtZXNwYWNlfVVuZG9gXSkge1xuICAgICAgY29uc3QgdW5kbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGVsZW1lbnQuZGF0YXNldFtgJHt0aGlzLnNldHRpbmdzLm5hbWVzcGFjZX1VbmRvYF1cbiAgICAgICk7XG5cbiAgICAgIHVuZG8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5lbGVtZW50VG9nZ2xlKGVsZW1lbnQsIHRhcmdldCk7XG4gICAgICAgIHVuZG8ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBvdGhlciB0b2dnbGVzIHRoYXQgbWlnaHQgY29udHJvbCB0aGUgc2FtZSBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSAgIHtPYmplY3R9ICAgIGVsZW1lbnQgIFRoZSB0b2dnbGluZyBlbGVtZW50XG4gICAqXG4gICAqIEByZXR1cm4gIHtOb2RlTGlzdH0gICAgICAgICAgIExpc3Qgb2Ygb3RoZXIgdG9nZ2xpbmcgZWxlbWVudHNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdCBjb250cm9sIHRoZSB0YXJnZXRcbiAgICovXG4gIGdldE90aGVycyhlbGVtZW50KSB7XG4gICAgbGV0IHNlbGVjdG9yID0gZmFsc2U7XG5cbiAgICBpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2hyZWYnKSkge1xuICAgICAgc2VsZWN0b3IgPSBgW2hyZWY9XCIke2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyl9XCJdYDtcbiAgICB9IGVsc2UgaWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJykpIHtcbiAgICAgIHNlbGVjdG9yID0gYFthcmlhLWNvbnRyb2xzPVwiJHtlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpfVwiXWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIChzZWxlY3RvcikgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSA6IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGUgdGhlIFRvZ2dsZSBUYXJnZXQncyBmb2N1c2FibGUgY2hpbGRyZW4gZnJvbSBmb2N1cy5cbiAgICogSWYgYW4gZWxlbWVudCBoYXMgdGhlIGRhdGEtYXR0cmlidXRlIGBkYXRhLXRvZ2dsZS10YWJpbmRleGBcbiAgICogaXQgd2lsbCB1c2UgdGhhdCBhcyB0aGUgZGVmYXVsdCB0YWIgaW5kZXggb2YgdGhlIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSAgIHtOb2RlTGlzdH0gIGVsZW1lbnRzICBMaXN0IG9mIGZvY3VzYWJsZSBlbGVtZW50c1xuICAgKlxuICAgKiBAcmV0dXJuICB7T2JqZWN0fSAgICAgICAgICAgICAgVGhlIFRvZ2dsZSBJbnN0YW5jZVxuICAgKi9cbiAgdG9nZ2xlRm9jdXNhYmxlKGVsZW1lbnRzKSB7XG4gICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgIGxldCB0YWJpbmRleCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpO1xuXG4gICAgICBpZiAodGFiaW5kZXggPT09ICctMScpIHtcbiAgICAgICAgbGV0IGRhdGFEZWZhdWx0ID0gZWxlbWVudFxuICAgICAgICAgIC5nZXRBdHRyaWJ1dGUoYGRhdGEtJHtUb2dnbGUubmFtZXNwYWNlfS10YWJpbmRleGApO1xuXG4gICAgICAgIGlmIChkYXRhRGVmYXVsdCkge1xuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIGRhdGFEZWZhdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBKdW1wcyB0byBFbGVtZW50IHZpc2libHkgYW5kIHNoaWZ0cyBmb2N1c1xuICAgKiB0byB0aGUgZWxlbWVudCBieSBzZXR0aW5nIHRoZSB0YWJpbmRleFxuICAgKlxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgZWxlbWVudCAgVGhlIFRvZ2dsaW5nIEVsZW1lbnRcbiAgICogQHBhcmFtICAge09iamVjdH0gIHRhcmdldCAgIFRoZSBUYXJnZXQgRWxlbWVudFxuICAgKlxuICAgKiBAcmV0dXJuICB7T2JqZWN0fSAgICAgICAgICAgVGhlIFRvZ2dsZSBpbnN0YW5jZVxuICAgKi9cbiAganVtcFRvKGVsZW1lbnQsIHRhcmdldCkge1xuICAgIC8vIFJlc2V0IHRoZSBoaXN0b3J5IHN0YXRlLiBUaGlzIHdpbGwgY2xlYXIgb3V0XG4gICAgLy8gdGhlIGhhc2ggd2hlbiB0aGUgdGFyZ2V0IGlzIHRvZ2dsZWQgY2xvc2VkXG4gICAgaGlzdG9yeS5wdXNoU3RhdGUoJycsICcnLFxuICAgICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG5cbiAgICAvLyBGb2N1cyBpZiBhY3RpdmVcbiAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKSkge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuXG4gICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG4gICAgICB0YXJnZXQuZm9jdXMoe3ByZXZlbnRTY3JvbGw6IHRydWV9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbWFpbiB0b2dnbGluZyBtZXRob2QgZm9yIGF0dHJpYnV0ZXNcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgICBlbGVtZW50ICAgIFRoZSBUb2dnbGUgZWxlbWVudFxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICAgIHRhcmdldCAgICAgVGhlIFRhcmdldCBlbGVtZW50IHRvIHRvZ2dsZSBhY3RpdmUvaGlkZGVuXG4gICAqIEBwYXJhbSAge05vZGVMaXN0fSAgZm9jdXNhYmxlICBBbnkgZm9jdXNhYmxlIGNoaWxkcmVuIGluIHRoZSB0YXJnZXRcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgIFRoZSBUb2dnbGUgaW5zdGFuY2VcbiAgICovXG4gIGVsZW1lbnRUb2dnbGUoZWxlbWVudCwgdGFyZ2V0LCBmb2N1c2FibGUgPSBbXSkge1xuICAgIGxldCBpID0gMDtcbiAgICBsZXQgYXR0ciA9ICcnO1xuICAgIGxldCB2YWx1ZSA9ICcnO1xuXG4gICAgLyoqXG4gICAgICogU3RvcmUgZWxlbWVudHMgZm9yIHBvdGVudGlhbCB1c2UgaW4gY2FsbGJhY2tzXG4gICAgICovXG5cbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMub3RoZXJzID0gdGhpcy5nZXRPdGhlcnMoZWxlbWVudCk7XG4gICAgdGhpcy5mb2N1c2FibGUgPSBmb2N1c2FibGU7XG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGl0eSBtZXRob2QgcHJvcGVydHkgdGhhdCB3aWxsIGNhbmNlbCB0aGUgdG9nZ2xlIGlmIGl0IHJldHVybnMgZmFsc2VcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLnZhbGlkICYmICF0aGlzLnNldHRpbmdzLnZhbGlkKHRoaXMpKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGluZyBiZWZvcmUgaG9va1xuICAgICAqL1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYmVmb3JlKVxuICAgICAgdGhpcy5zZXR0aW5ncy5iZWZvcmUodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGUgRWxlbWVudCBhbmQgVGFyZ2V0IGNsYXNzZXNcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKTtcbiAgICAgIHRoaXMudGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUodGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzcyk7XG5cbiAgICAgIC8vIElmIHRoZXJlIGFyZSBvdGhlciB0b2dnbGVzIHRoYXQgY29udHJvbCB0aGUgc2FtZSBlbGVtZW50XG4gICAgICB0aGlzLm90aGVycy5mb3JFYWNoKG90aGVyID0+IHtcbiAgICAgICAgaWYgKG90aGVyICE9PSB0aGlzLmVsZW1lbnQpXG4gICAgICAgICAgb3RoZXIuY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmluYWN0aXZlQ2xhc3MpXG4gICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLnNldHRpbmdzLmluYWN0aXZlQ2xhc3MpO1xuXG4gICAgLyoqXG4gICAgICogVGFyZ2V0IEVsZW1lbnQgQXJpYSBBdHRyaWJ1dGVzXG4gICAgICovXG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgVG9nZ2xlLnRhcmdldEFyaWFSb2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0ciA9IFRvZ2dsZS50YXJnZXRBcmlhUm9sZXNbaV07XG4gICAgICB2YWx1ZSA9IHRoaXMudGFyZ2V0LmdldEF0dHJpYnV0ZShhdHRyKTtcblxuICAgICAgaWYgKHZhbHVlICE9ICcnICYmIHZhbHVlKVxuICAgICAgICB0aGlzLnRhcmdldC5zZXRBdHRyaWJ1dGUoYXR0ciwgKHZhbHVlID09PSAndHJ1ZScpID8gJ2ZhbHNlJyA6ICd0cnVlJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIHRoZSB0YXJnZXQncyBmb2N1c2FibGUgY2hpbGRyZW4gdGFiaW5kZXhcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmZvY3VzYWJsZSlcbiAgICAgIHRoaXMudG9nZ2xlRm9jdXNhYmxlKHRoaXMuZm9jdXNhYmxlKTtcblxuICAgIC8qKlxuICAgICAqIEp1bXAgdG8gVGFyZ2V0IEVsZW1lbnQgaWYgVG9nZ2xlIEVsZW1lbnQgaXMgYW4gYW5jaG9yIGxpbmtcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmp1bXAgJiYgdGhpcy5lbGVtZW50Lmhhc0F0dHJpYnV0ZSgnaHJlZicpKVxuICAgICAgdGhpcy5qdW1wVG8odGhpcy5lbGVtZW50LCB0aGlzLnRhcmdldCk7XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGUgRWxlbWVudCAoaW5jbHVkaW5nIG11bHRpIHRvZ2dsZXMpIEFyaWEgQXR0cmlidXRlc1xuICAgICAqL1xuXG4gICAgZm9yIChpID0gMDsgaSA8IFRvZ2dsZS5lbEFyaWFSb2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0ciA9IFRvZ2dsZS5lbEFyaWFSb2xlc1tpXTtcbiAgICAgIHZhbHVlID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKTtcblxuICAgICAgaWYgKHZhbHVlICE9ICcnICYmIHZhbHVlKVxuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIsICh2YWx1ZSA9PT0gJ3RydWUnKSA/ICdmYWxzZScgOiAndHJ1ZScpO1xuXG4gICAgICAvLyBJZiB0aGVyZSBhcmUgb3RoZXIgdG9nZ2xlcyB0aGF0IGNvbnRyb2wgdGhlIHNhbWUgZWxlbWVudFxuICAgICAgdGhpcy5vdGhlcnMuZm9yRWFjaCgob3RoZXIpID0+IHtcbiAgICAgICAgaWYgKG90aGVyICE9PSB0aGlzLmVsZW1lbnQgJiYgb3RoZXIuZ2V0QXR0cmlidXRlKGF0dHIpKVxuICAgICAgICAgIG90aGVyLnNldEF0dHJpYnV0ZShhdHRyLCAodmFsdWUgPT09ICd0cnVlJykgPyAnZmFsc2UnIDogJ3RydWUnKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRvZ2dsaW5nIGNvbXBsZXRlIGhvb2tcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmFmdGVyKVxuICAgICAgdGhpcy5zZXR0aW5ncy5hZnRlcih0aGlzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbi8qKiBAdHlwZSAge1N0cmluZ30gIFRoZSBtYWluIHNlbGVjdG9yIHRvIGFkZCB0aGUgdG9nZ2xpbmcgZnVuY3Rpb24gdG8gKi9cblRvZ2dsZS5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XCJ0b2dnbGVcIl0nO1xuXG4vKiogQHR5cGUgIHtTdHJpbmd9ICBUaGUgbmFtZXNwYWNlIGZvciBvdXIgZGF0YSBhdHRyaWJ1dGUgc2V0dGluZ3MgKi9cblRvZ2dsZS5uYW1lc3BhY2UgPSAndG9nZ2xlJztcblxuLyoqIEB0eXBlICB7U3RyaW5nfSAgVGhlIGhpZGUgY2xhc3MgKi9cblRvZ2dsZS5pbmFjdGl2ZUNsYXNzID0gJ2hpZGRlbic7XG5cbi8qKiBAdHlwZSAge1N0cmluZ30gIFRoZSBhY3RpdmUgY2xhc3MgKi9cblRvZ2dsZS5hY3RpdmVDbGFzcyA9ICdhY3RpdmUnO1xuXG4vKiogQHR5cGUgIHtBcnJheX0gIEFyaWEgcm9sZXMgdG8gdG9nZ2xlIHRydWUvZmFsc2Ugb24gdGhlIHRvZ2dsaW5nIGVsZW1lbnQgKi9cblRvZ2dsZS5lbEFyaWFSb2xlcyA9IFsnYXJpYS1wcmVzc2VkJywgJ2FyaWEtZXhwYW5kZWQnXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBBcmlhIHJvbGVzIHRvIHRvZ2dsZSB0cnVlL2ZhbHNlIG9uIHRoZSB0YXJnZXQgZWxlbWVudCAqL1xuVG9nZ2xlLnRhcmdldEFyaWFSb2xlcyA9IFsnYXJpYS1oaWRkZW4nXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBGb2N1c2FibGUgZWxlbWVudHMgdG8gaGlkZSB3aXRoaW4gdGhlIGhpZGRlbiB0YXJnZXQgZWxlbWVudCAqL1xuVG9nZ2xlLmVsRm9jdXNhYmxlID0gW1xuICAnYScsICdidXR0b24nLCAnaW5wdXQnLCAnc2VsZWN0JywgJ3RleHRhcmVhJywgJ29iamVjdCcsICdlbWJlZCcsICdmb3JtJyxcbiAgJ2ZpZWxkc2V0JywgJ2xlZ2VuZCcsICdsYWJlbCcsICdhcmVhJywgJ2F1ZGlvJywgJ3ZpZGVvJywgJ2lmcmFtZScsICdzdmcnLFxuICAnZGV0YWlscycsICd0YWJsZScsICdbdGFiaW5kZXhdJywgJ1tjb250ZW50ZWRpdGFibGVdJywgJ1t1c2VtYXBdJ1xuXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBLZXkgYXR0cmlidXRlIGZvciBzdG9yaW5nIHRvZ2dsZXMgaW4gdGhlIHdpbmRvdyAqL1xuVG9nZ2xlLmNhbGxiYWNrID0gWydUb2dnbGVzQ2FsbGJhY2snXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBEZWZhdWx0IGV2ZW50cyB0byB0byB3YXRjaCBmb3IgdG9nZ2xpbmcuIEVhY2ggbXVzdCBoYXZlIGEgaGFuZGxlciBpbiB0aGUgY2xhc3MgYW5kIGVsZW1lbnRzIHRvIGxvb2sgZm9yIGluIFRvZ2dsZS5lbGVtZW50cyAqL1xuVG9nZ2xlLmV2ZW50cyA9IFsnY2xpY2snLCAnY2hhbmdlJ107XG5cbi8qKiBAdHlwZSAge0FycmF5fSAgRWxlbWVudHMgdG8gZGVsZWdhdGUgdG8gZWFjaCBldmVudCBoYW5kbGVyICovXG5Ub2dnbGUuZWxlbWVudHMgPSB7XG4gIENMSUNLOiBbJ0EnLCAnQlVUVE9OJ10sXG4gIENIQU5HRTogWydTRUxFQ1QnLCAnSU5QVVQnLCAnVEVYVEFSRUEnXVxufTtcblxuZXhwb3J0IGRlZmF1bHQgVG9nZ2xlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgVG9nZ2xlIGZyb20gJ0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy90b2dnbGUvdG9nZ2xlJztcblxuLyoqXG4gKiBAY2xhc3MgIERpYWxvZ1xuICpcbiAqIFVzYWdlXG4gKlxuICogRWxlbWVudCBBdHRyaWJ1dGVzLiBFaXRoZXIgPGE+IG9yIDxidXR0b24+XG4gKlxuICogQGF0dHIgIGRhdGEtanM9XCJkaWFsb2dcIiAgICAgICAgICAgICAgIEluc3RhbnRpYXRlcyB0aGUgdG9nZ2xpbmcgbWV0aG9kXG4gKiBAYXR0ciAgYXJpYS1jb250cm9scz1cIlwiICAgICAgICAgICAgICAgVGFyZ2V0cyB0aGUgaWQgb2YgdGhlIGRpYWxvZ1xuICogQGF0dHIgIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiICAgICAgICAgIERlY2xhcmVzIHRhcmdldCBjbG9zZWQvb3BlbiB3aGVuIHRvZ2dsZWRcbiAqIEBhdHRyICBkYXRhLWRpYWxvZz1cIm9wZW5cIiAgICAgICAgICAgICBEZXNpZ25hdGVzIHRoZSBwcmltYXJ5IG9wZW5pbmcgZWxlbWVudCBvZiB0aGUgZGlhbG9nXG4gKiBAYXR0ciAgZGF0YS1kaWFsb2c9XCJjbG9zZVwiICAgICAgICAgICAgRGVzaWduYXRlcyB0aGUgcHJpbWFyeSBjbG9zaW5nIGVsZW1lbnQgb2YgdGhlIGRpYWxvZ1xuICogQGF0dHIgIGRhdGEtZGlhbG9nLWZvY3VzLW9uLWNsb3NlPVwiXCIgIERlc2lnbmF0ZXMgYW4gYWx0ZXJuYXRlIGVsZW1lbnQgdG8gZm9jdXMgb24gd2hlbiB0aGUgZGlhbG9nIGNsb3Nlcy4gVmFsdWUgb2YgdGhlIGF0dHJpYnV0ZSBpcyB0aGUgaWQgb2YgdGhlIGRpYWxvZy5cbiAqIEBhdHRyICBkYXRhLWRpYWxvZy1sb2NrPVwidHJ1ZVwiICAgICAgICBXZXRoZXIgdG8gbG9jayBzY3JlZW4gc2Nyb2xsaW5nIHdoZW4gZGlhbG9nIGlzIG9wZW5cbiAqXG4gKiBUYXJnZXQgQXR0cmlidXRlcy4gQW55IDxlbGVtZW50PlxuICpcbiAqIEBhdHRyICBpZD1cIlwiICAgICAgICAgICAgICAgTWF0Y2hlcyBhcmlhLWNvbnRyb2xzIGF0dHIgb2YgRWxlbWVudFxuICogQGF0dHIgIGNsYXNzPVwiaGlkZGVuXCIgICAgICBIaWRkZW4gY2xhc3NcbiAqIEBhdHRyICBhcmlhLWhpZGRlbj1cInRydWVcIiAgRGVjbGFyZXMgdGFyZ2V0IG9wZW4vY2xvc2VkIHdoZW4gdG9nZ2xlZFxuICovXG5jbGFzcyBEaWFsb2cge1xuICAvKipcbiAgICogQGNvbnN0cnVjdG9yICBJbnN0YW50aWF0ZXMgZGlhbG9nIGFuZCB0b2dnbGUgbWV0aG9kXG4gICAqXG4gICAqIEByZXR1cm4gIHtPYmplY3R9ICBUaGUgaW5zdGFudGlhdGVkIGRpYWxvZyB3aXRoIHByb3BlcnRpZXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsZWN0b3IgPSBEaWFsb2cuc2VsZWN0b3I7XG5cbiAgICB0aGlzLnNlbGVjdG9ycyA9IERpYWxvZy5zZWxlY3RvcnM7XG5cbiAgICB0aGlzLmNsYXNzZXMgPSBEaWFsb2cuY2xhc3NlcztcblxuICAgIHRoaXMuZGF0YUF0dHJzID0gRGlhbG9nLmRhdGFBdHRycztcblxuICAgIHRoaXMudG9nZ2xlID0gbmV3IFRvZ2dsZSh7XG4gICAgICBzZWxlY3RvcjogdGhpcy5zZWxlY3RvcixcbiAgICAgIGFmdGVyOiAodG9nZ2xlKSA9PiB7XG4gICAgICAgIGxldCBhY3RpdmUgPSB0b2dnbGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhUb2dnbGUuYWN0aXZlQ2xhc3MpO1xuXG4gICAgICAgIC8vIExvY2sgdGhlIGJvZHkgZnJvbSBzY3JvbGxpbmcgaWYgbG9jayBhdHRyaWJ1dGUgaXMgcHJlc2VudFxuICAgICAgICBpZiAoYWN0aXZlICYmIHRvZ2dsZS5lbGVtZW50LmRhdGFzZXRbdGhpcy5kYXRhQXR0cnMuTE9DS10gPT09ICd0cnVlJykge1xuICAgICAgICAgIC8vIFNjcm9sbCB0byB0aGUgdG9wIG9mIHRoZSBwYWdlXG4gICAgICAgICAgd2luZG93LnNjcm9sbCgwLCAwKTtcblxuICAgICAgICAgIC8vIFByZXZlbnQgc2Nyb2xsaW5nIG9uIHRoZSBib2R5XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG5cbiAgICAgICAgICAvLyBXaGVuIHRoZSBsYXN0IGZvY3VzYWJsZSBpdGVtIGluIHRoZSBsaXN0IGxvb3NlcyBmb2N1cyBsb29wIHRvIHRoZSBmaXJzdFxuICAgICAgICAgIHRvZ2dsZS5mb2N1c2FibGUuaXRlbSh0b2dnbGUuZm9jdXNhYmxlLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsICgpID0+IHtcbiAgICAgICAgICAgICAgdG9nZ2xlLmZvY3VzYWJsZS5pdGVtKDApLmZvY3VzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZW1vdmUgaWYgYWxsIG90aGVyIGRpYWxvZyBib2R5IGxvY2tzIGFyZSBpbmFjdGl2ZVxuICAgICAgICAgIGxldCBsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoW1xuICAgICAgICAgICAgICB0aGlzLnNlbGVjdG9yLFxuICAgICAgICAgICAgICB0aGlzLnNlbGVjdG9ycy5sb2NrcyxcbiAgICAgICAgICAgICAgYC4ke1RvZ2dsZS5hY3RpdmVDbGFzc31gXG4gICAgICAgICAgICBdLmpvaW4oJycpKTtcblxuICAgICAgICAgIGlmIChsb2Nrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5zdHlsZS5vdmVyZmxvdyA9ICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZvY3VzIG9uIHRoZSBjbG9zZSwgb3Blbiwgb3Igb3RoZXIgZm9jdXMgZWxlbWVudCBpZiBwcmVzZW50XG4gICAgICAgIGxldCBpZCA9IHRvZ2dsZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgICBsZXQgY29udHJvbCA9IGBbYXJpYS1jb250cm9scz1cIiR7aWR9XCJdYDtcbiAgICAgICAgbGV0IGNsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNlbGVjdG9ycy5DTE9TRSArIGNvbnRyb2wpO1xuICAgICAgICBsZXQgb3BlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWxlY3RvcnMuT1BFTiArIGNvbnRyb2wpO1xuXG4gICAgICAgIGxldCBmb2N1c09uQ2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsZWN0b3JzLkZPQ1VTX09OX0NMT1NFLnJlcGxhY2UoJ3t7IElEIH19JywgaWQpKTtcblxuICAgICAgICBpZiAoYWN0aXZlICYmIGNsb3NlKSB7XG4gICAgICAgICAgY2xvc2UuZm9jdXMoKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcGVuKSB7XG4gICAgICAgICAgLy8gQWx0ZXJuYXRpdmVseSBmb2N1cyBvbiB0aGlzIGVsZW1lbnQgaWYgaXQgaXMgcHJlc2VudFxuICAgICAgICAgIGlmIChmb2N1c09uQ2xvc2UpIHtcbiAgICAgICAgICAgIGZvY3VzT25DbG9zZS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICAgICAgICBmb2N1c09uQ2xvc2UuZm9jdXMoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3Blbi5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuLyoqIEB0eXBlICB7U3RyaW5nfSAgTWFpbiBET00gc2VsZWN0b3IgKi9cbkRpYWxvZy5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XFxcImRpYWxvZ1xcXCJdJztcblxuLyoqIEB0eXBlICB7T2JqZWN0fSAgQWRkaXRpb25hbCBzZWxlY3RvcnMgdXNlZCBieSB0aGUgc2NyaXB0ICovXG5EaWFsb2cuc2VsZWN0b3JzID0ge1xuICBDTE9TRTogJ1tkYXRhLWRpYWxvZyo9XCJjbG9zZVwiXScsXG4gIE9QRU46ICdbZGF0YS1kaWFsb2cqPVwib3BlblwiXScsXG4gIExPQ0tTOiAnW2RhdGEtZGlhbG9nLWxvY2s9XCJ0cnVlXCJdJyxcbiAgRk9DVVNfT05fQ0xPU0U6ICdbZGF0YS1kaWFsb2ctZm9jdXMtb24tY2xvc2U9XCJ7eyBJRCB9fVwiXSdcbn07XG5cbi8qKiBAdHlwZSAge09iamVjdH0gIERhdGEgYXR0cmlidXRlIG5hbWVzcGFjZXMgKi9cbkRpYWxvZy5kYXRhQXR0cnMgPSB7XG4gIExPQ0s6ICdkaWFsb2dMb2NrJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRGlhbG9nOyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDb3B5IHRvIENsaXBib2FyZCBIZWxwZXJcbiAqL1xuY2xhc3MgQ29weSB7XG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtICAge09iamVjdH0gIHMgIFRoZSBzZXR0aW5ncyBvYmplY3QsIG1heSBpbmNsdWRlICdzZWxlY3RvcicsXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAnYXJpYScsICdub3RpZnlUaW1lb3V0JywgJ2JlZm9yZScsICdjb3BpZWQnLFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgb3IgJ2FmdGVyJyBhdHRyaWJ1dGVzLlxuICAgKlxuICAgKiBAcmV0dXJuICB7Q2xhc3N9ICAgICAgVGhlIGNvbnN0cnVjdGVkIGluc3RhbmNlIG9mIENvcHkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzKSB7XG4gICAgLy8gU2V0IGF0dHJpYnV0ZXNcbiAgICB0aGlzLnNlbGVjdG9yID0gKHMuaGFzT3duUHJvcGVydHkoJ3NlbGVjdG9yJykpID8gcy5zZWxlY3RvciA6IENvcHkuc2VsZWN0b3I7XG5cbiAgICB0aGlzLnNlbGVjdG9ycyA9IChzLmhhc093blByb3BlcnR5KCdzZWxlY3RvcnMnKSkgPyBzLnNlbGVjdG9ycyA6IENvcHkuc2VsZWN0b3JzO1xuXG4gICAgdGhpcy5hcmlhID0gKHMuaGFzT3duUHJvcGVydHkoJ2FyaWEnKSkgPyBzLmFyaWEgOiBDb3B5LmFyaWE7XG5cbiAgICB0aGlzLm5vdGlmeVRpbWVvdXQgPSAocy5oYXNPd25Qcm9wZXJ0eSgnbm90aWZ5VGltZW91dCcpKSA/IHMubm90aWZ5VGltZW91dCA6IENvcHkubm90aWZ5VGltZW91dDtcblxuICAgIHRoaXMuYmVmb3JlID0gKHMuaGFzT3duUHJvcGVydHkoJ2JlZm9yZScpKSA/IHMuYmVmb3JlIDogQ29weS5iZWZvcmU7XG5cbiAgICB0aGlzLmNvcGllZCA9IChzLmhhc093blByb3BlcnR5KCdjb3BpZWQnKSkgPyBzLmNvcGllZCA6IENvcHkuY29waWVkO1xuXG4gICAgdGhpcy5hZnRlciA9IChzLmhhc093blByb3BlcnR5KCdhZnRlcicpKSA/IHMuYWZ0ZXIgOiBDb3B5LmFmdGVyO1xuXG4gICAgLy8gU2VsZWN0IHRoZSBlbnRpcmUgdGV4dCB3aGVuIGl0J3MgZm9jdXNlZCBvblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZWxlY3RvcnMuVEFSR0VUUykuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCAoKSA9PiB0aGlzLnNlbGVjdChpdGVtKSk7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5zZWxlY3QoaXRlbSkpO1xuICAgIH0pO1xuXG4gICAgLy8gVGhlIG1haW4gY2xpY2sgZXZlbnQgZm9yIHRoZSBjbGFzc1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgIGlmICghZXZlbnQudGFyZ2V0Lm1hdGNoZXModGhpcy5zZWxlY3RvcikpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgdGhpcy5lbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuXG4gICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKHRoaXMuYXJpYSwgZmFsc2UpO1xuXG4gICAgICB0aGlzLnRhcmdldCA9IHRoaXMuZWxlbWVudC5kYXRhc2V0LmNvcHk7XG5cbiAgICAgIHRoaXMuYmVmb3JlKHRoaXMpO1xuXG4gICAgICBpZiAodGhpcy5jb3B5KHRoaXMudGFyZ2V0KSkge1xuICAgICAgICB0aGlzLmNvcGllZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKHRoaXMuYXJpYSwgdHJ1ZSk7XG5cbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZWxlbWVudFsndGltZW91dCddKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnRbJ3RpbWVvdXQnXSA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUodGhpcy5hcmlhLCBmYWxzZSk7XG5cbiAgICAgICAgICB0aGlzLmFmdGVyKHRoaXMpO1xuICAgICAgICB9LCB0aGlzLm5vdGlmeVRpbWVvdXQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNsaWNrIGV2ZW50IGhhbmRsZXJcbiAgICpcbiAgICogQHBhcmFtICAge1N0cmluZ30gIHRhcmdldCAgQ29udGVudCBvZiB0YXJnZXQgZGF0YSBhdHRyaWJ1dGVcbiAgICpcbiAgICogQHJldHVybiAge0Jvb2xlYW59ICAgICAgICAgV2V0aGVyIGNvcHkgd2FzIHN1Y2Nlc3NmdWwgb3Igbm90XG4gICAqL1xuICBjb3B5KHRhcmdldCkge1xuICAgIGxldCBzZWxlY3RvciA9IHRoaXMuc2VsZWN0b3JzLlRBUkdFVFMucmVwbGFjZSgnXScsIGA9XCIke3RhcmdldH1cIl1gKTtcblxuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gICAgdGhpcy5zZWxlY3QoaW5wdXQpO1xuXG4gICAgaWYgKG5hdmlnYXRvci5jbGlwYm9hcmQgJiYgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQpXG4gICAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChpbnB1dC52YWx1ZSk7XG4gICAgZWxzZSBpZiAoZG9jdW1lbnQuZXhlY0NvbW1hbmQpXG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXIgZm9yIHRoZSB0ZXh0IHNlbGVjdGlvbiBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtICAge09iamVjdH0gIGlucHV0ICBUaGUgaW5wdXQgd2l0aCBjb250ZW50IHRvIHNlbGVjdFxuICAgKi9cbiAgc2VsZWN0KGlucHV0KSB7XG4gICAgaW5wdXQuc2VsZWN0KCk7XG5cbiAgICBpbnB1dC5zZXRTZWxlY3Rpb25SYW5nZSgwLCA5OTk5OSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgbWFpbiBlbGVtZW50IHNlbGVjdG9yLlxuICpcbiAqIEB2YXIge1N0cmluZ31cbiAqL1xuQ29weS5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XCJjb3B5XCJdJztcblxuLyoqXG4gKiBUaGUgc2VsZWN0b3JzIGZvciB2YXJpb3VzIGVsZW1lbnRzIHF1ZXJpZWQgYnkgdGhlIHV0aWxpdHkuIFJlZmVyIHRvIHRoZVxuICogc291cmNlIGZvciBkZWZhdWx0cy5cbiAqXG4gKiBAdmFyIHtbdHlwZV19XG4gKi9cbkNvcHkuc2VsZWN0b3JzID0ge1xuICBUQVJHRVRTOiAnW2RhdGEtY29weS10YXJnZXRdJ1xufTtcblxuLyoqXG4gKiBCdXR0b24gYXJpYSByb2xlIHRvIHRvZ2dsZVxuICpcbiAqIEB2YXIge1N0cmluZ31cbiAqL1xuQ29weS5hcmlhID0gJ2FyaWEtcHJlc3NlZCc7XG5cbi8qKlxuICogVGltZW91dCBmb3IgdGhlIFwiQ29waWVkIVwiIG5vdGlmaWNhdGlvblxuICpcbiAqIEB2YXIge051bWJlcn1cbiAqL1xuQ29weS5ub3RpZnlUaW1lb3V0ID0gMTUwMDtcblxuLyoqXG4gKiBCZWZvcmUgaG9vay4gVHJpZ2dlcnMgYmVmb3JlIHRoZSBjbGljayBldmVudC5cbiAqXG4gKiBAdmFyIHtGdW5jdGlvbn1cbiAqL1xuQ29weS5iZWZvcmUgPSAoKSA9PiB7fTtcblxuLyoqXG4gKiBDb3BpZWQgaG9vay4gVHJpZ2dlcnMgYWZ0ZXIgYSBzdWNjZXNzZnVsIHRoZSBjb3B5IGV2ZW50LlxuICpcbiAqIEB2YXIge0Z1bmN0aW9ufVxuICovXG5Db3B5LmNvcGllZCA9ICgpID0+IHt9O1xuXG4vKipcbiAqIEFmdGVyIGhvb2suIFRyaWdnZXJzIGFmdGVyIHRoZSBjbGljayBldmVudC5cbiAqXG4gKiBAdmFyIHtGdW5jdGlvbn1cbiAqL1xuQ29weS5hZnRlciA9ICgpID0+IHt9O1xuXG5leHBvcnQgZGVmYXVsdCBDb3B5O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFRoZSBJY29uIG1vZHVsZVxuICogQGNsYXNzXG4gKi9cbmNsYXNzIEljb25zIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIGljb24gZmlsZVxuICAgKiBAcmV0dXJuIHtvYmplY3R9IFRoZSBjbGFzc1xuICAgKi9cbiAgY29uc3RydWN0b3IocGF0aCkge1xuICAgIHBhdGggPSAocGF0aCkgPyBwYXRoIDogSWNvbnMucGF0aDtcblxuICAgIGZldGNoKHBhdGgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLm9rKVxuICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKVxuICAgICAgICAgICAgY29uc29sZS5kaXIocmVzcG9uc2UpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpXG4gICAgICAgICAgY29uc29sZS5kaXIoZXJyb3IpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwcml0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBzcHJpdGUuaW5uZXJIVE1MID0gZGF0YTtcbiAgICAgICAgc3ByaXRlLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgc3ByaXRlLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogbm9uZTsnKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzcHJpdGUpO1xuICAgICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4vKiogQHR5cGUge1N0cmluZ30gVGhlIHBhdGggb2YgdGhlIGljb24gZmlsZSAqL1xuSWNvbnMucGF0aCA9ICdzdmcvaWNvbnMuc3ZnJztcblxuZXhwb3J0IGRlZmF1bHQgSWNvbnM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIFNldEhlaWdodFByb3BlcnRpZXMge1xuICBjb25zdHJ1Y3RvciAocykge1xuICAgIHRoaXMuZWxlbWVudHMgPSAocy5lbGVtZW50cykgPyBzLmVsZW1lbnRzIDogU2V0SGVpZ2h0UHJvcGVydGllcy5lbGVtZW50cztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5lbGVtZW50c1tpXVsnc2VsZWN0b3InXSkpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB0aGlzLnNldFByb3BlcnR5KHRoaXMuZWxlbWVudHNbaV0pKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHRoaXMuc2V0UHJvcGVydHkodGhpcy5lbGVtZW50c1tpXSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KHRoaXMuZWxlbWVudHNbaV1bJ3Byb3BlcnR5J10sICcwcHgnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRQcm9wZXJ0eShlKSB7XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVbJ3NlbGVjdG9yJ10pO1xuXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KGVbJ3Byb3BlcnR5J10sIGAke2VsZW1lbnQuY2xpZW50SGVpZ2h0fXB4YCk7XG4gIH1cbn1cblxuU2V0SGVpZ2h0UHJvcGVydGllcy5lbGVtZW50cyA9IFtdO1xuXG5leHBvcnQgZGVmYXVsdCBTZXRIZWlnaHRQcm9wZXJ0aWVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFRyYWNraW5nIGJ1cyBmb3IgR29vZ2xlIGFuYWx5dGljcyBhbmQgV2VidHJlbmRzLlxuICovXG5jbGFzcyBUcmFjayB7XG4gIGNvbnN0cnVjdG9yKHMpIHtcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuXG4gICAgcyA9ICghcykgPyB7fSA6IHM7XG5cbiAgICB0aGlzLl9zZXR0aW5ncyA9IHtcbiAgICAgIHNlbGVjdG9yOiAocy5zZWxlY3RvcikgPyBzLnNlbGVjdG9yIDogVHJhY2suc2VsZWN0b3IsXG4gICAgfTtcblxuICAgIHRoaXMuZGVzaW5hdGlvbnMgPSBUcmFjay5kZXN0aW5hdGlvbnM7XG5cbiAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIWV2ZW50LnRhcmdldC5tYXRjaGVzKHRoaXMuX3NldHRpbmdzLnNlbGVjdG9yKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQga2V5ID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQudHJhY2tLZXk7XG4gICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQudGFyZ2V0LmRhdGFzZXQudHJhY2tEYXRhKTtcblxuICAgICAgdGhpcy50cmFjayhrZXksIGRhdGEpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVHJhY2tpbmcgZnVuY3Rpb24gd3JhcHBlclxuICAgKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAga2V5ICAgVGhlIGtleSBvciBldmVudCBvZiB0aGUgZGF0YVxuICAgKiBAcGFyYW0gIHtDb2xsZWN0aW9ufSAgZGF0YSAgVGhlIGRhdGEgdG8gdHJhY2tcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgIFRoZSBmaW5hbCBkYXRhIG9iamVjdFxuICAgKi9cbiAgdHJhY2soa2V5LCBkYXRhKSB7XG4gICAgLy8gU2V0IHRoZSBwYXRoIG5hbWUgYmFzZWQgb24gdGhlIGxvY2F0aW9uXG4gICAgY29uc3QgZCA9IGRhdGEubWFwKGVsID0+IHtcbiAgICAgICAgaWYgKGVsLmhhc093blByb3BlcnR5KFRyYWNrLmtleSkpXG4gICAgICAgICAgZWxbVHJhY2sua2V5XSA9IGAke3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZX0vJHtlbFtUcmFjay5rZXldfWBcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfSk7XG5cbiAgICBsZXQgd3QgPSB0aGlzLndlYnRyZW5kcyhrZXksIGQpO1xuICAgIGxldCBnYSA9IHRoaXMuZ3RhZyhrZXksIGQpO1xuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKVxuICAgICAgY29uc29sZS5kaXIoeydUcmFjayc6IFt3dCwgZ2FdfSk7XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1jb25zb2xlICovXG5cbiAgICByZXR1cm4gZDtcbiAgfTtcblxuICAvKipcbiAgICogRGF0YSBidXMgZm9yIHRyYWNraW5nIHZpZXdzIGluIFdlYnRyZW5kcyBhbmQgR29vZ2xlIEFuYWx5dGljc1xuICAgKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgYXBwICAgVGhlIG5hbWUgb2YgdGhlIFNpbmdsZSBQYWdlIEFwcGxpY2F0aW9uIHRvIHRyYWNrXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICAgICBrZXkgICBUaGUga2V5IG9yIGV2ZW50IG9mIHRoZSBkYXRhXG4gICAqIEBwYXJhbSAge0NvbGxlY3Rpb259ICBkYXRhICBUaGUgZGF0YSB0byB0cmFja1xuICAgKi9cbiAgdmlldyhhcHAsIGtleSwgZGF0YSkge1xuICAgIGxldCB3dCA9IHRoaXMud2VidHJlbmRzKGtleSwgZGF0YSk7XG4gICAgbGV0IGdhID0gdGhpcy5ndGFnVmlldyhhcHAsIGtleSk7XG5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpXG4gICAgICBjb25zb2xlLmRpcih7J1RyYWNrJzogW3d0LCBnYV19KTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWNvbnNvbGUgKi9cbiAgfTtcblxuICAvKipcbiAgICogUHVzaCBFdmVudHMgdG8gV2VidHJlbmRzXG4gICAqXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICAgICBrZXkgICBUaGUga2V5IG9yIGV2ZW50IG9mIHRoZSBkYXRhXG4gICAqIEBwYXJhbSAge0NvbGxlY3Rpb259ICBkYXRhICBUaGUgZGF0YSB0byB0cmFja1xuICAgKi9cbiAgd2VidHJlbmRzKGtleSwgZGF0YSkge1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiBXZWJ0cmVuZHMgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICB0eXBlb2YgZGF0YSA9PT0gJ3VuZGVmaW5lZCcgfHxcbiAgICAgICF0aGlzLmRlc2luYXRpb25zLmluY2x1ZGVzKCd3ZWJ0cmVuZHMnKVxuICAgIClcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGxldCBldmVudCA9IFt7XG4gICAgICAnV1QudGknOiBrZXlcbiAgICB9XTtcblxuICAgIGlmIChkYXRhWzBdICYmIGRhdGFbMF0uaGFzT3duUHJvcGVydHkoVHJhY2sua2V5KSlcbiAgICAgIGV2ZW50LnB1c2goe1xuICAgICAgICAnRENTLmRjc3VyaSc6IGRhdGFbMF1bVHJhY2sua2V5XVxuICAgICAgfSk7XG4gICAgZWxzZVxuICAgICAgT2JqZWN0LmFzc2lnbihldmVudCwgZGF0YSk7XG5cbiAgICAvLyBGb3JtYXQgZGF0YSBmb3IgV2VidHJlbmRzXG4gICAgbGV0IHd0ZCA9IHthcmdzYTogZXZlbnQuZmxhdE1hcChlID0+IHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhlKS5mbGF0TWFwKGsgPT4gW2ssIGVba11dKTtcbiAgICB9KX07XG5cbiAgICAvLyBJZiAnYWN0aW9uJyBpcyB1c2VkIGFzIHRoZSBrZXkgKGZvciBndGFnLmpzKSwgc3dpdGNoIGl0IHRvIFdlYnRyZW5kc1xuICAgIGxldCBhY3Rpb24gPSBkYXRhLmFyZ3NhLmluZGV4T2YoJ2FjdGlvbicpO1xuXG4gICAgaWYgKGFjdGlvbikgZGF0YS5hcmdzYVthY3Rpb25dID0gJ0RDUy5kY3N1cmknO1xuXG4gICAgLy8gV2VidHJlbmRzIGRvZXNuJ3Qgc2VuZCB0aGUgcGFnZSB2aWV3IGZvciBNdWx0aVRyYWNrLCBhZGQgcGF0aCB0byB1cmxcbiAgICBsZXQgZGNzdXJpID0gZGF0YS5hcmdzYS5pbmRleE9mKCdEQ1MuZGNzdXJpJyk7XG5cbiAgICBpZiAoZGNzdXJpKVxuICAgICAgZGF0YS5hcmdzYVtkY3N1cmkgKyAxXSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIGRhdGEuYXJnc2FbZGNzdXJpICsgMV07XG5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgIGlmICh0eXBlb2YgV2VidHJlbmRzICE9PSAndW5kZWZpbmVkJylcbiAgICAgIFdlYnRyZW5kcy5tdWx0aVRyYWNrKHd0ZCk7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cblxuICAgIHJldHVybiBbJ1dlYnRyZW5kcycsIHd0ZF07XG4gIH07XG5cbiAgLyoqXG4gICAqIFB1c2ggQ2xpY2sgRXZlbnRzIHRvIEdvb2dsZSBBbmFseXRpY3NcbiAgICpcbiAgICogQHBhcmFtICB7U3RyaW5nfSAgICAgIGtleSAgIFRoZSBrZXkgb3IgZXZlbnQgb2YgdGhlIGRhdGFcbiAgICogQHBhcmFtICB7Q29sbGVjdGlvbn0gIGRhdGEgIFRoZSBkYXRhIHRvIHRyYWNrXG4gICAqL1xuICBndGFnKGtleSwgZGF0YSkge1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiBndGFnID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgdHlwZW9mIGRhdGEgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAhdGhpcy5kZXNpbmF0aW9ucy5pbmNsdWRlcygnZ3RhZycpXG4gICAgKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgbGV0IHVyaSA9IGRhdGEuZmluZCgoZWxlbWVudCkgPT4gZWxlbWVudC5oYXNPd25Qcm9wZXJ0eShUcmFjay5rZXkpKTtcblxuICAgIGxldCBldmVudCA9IHtcbiAgICAgICdldmVudF9jYXRlZ29yeSc6IGtleVxuICAgIH07XG5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgIGd0YWcoVHJhY2sua2V5LCB1cmlbVHJhY2sua2V5XSwgZXZlbnQpO1xuICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYgKi9cblxuICAgIHJldHVybiBbJ2d0YWcnLCBUcmFjay5rZXksIHVyaVtUcmFjay5rZXldLCBldmVudF07XG4gIH07XG5cbiAgLyoqXG4gICAqIFB1c2ggU2NyZWVuIFZpZXcgRXZlbnRzIHRvIEdvb2dsZSBBbmFseXRpY3NcbiAgICpcbiAgICogQHBhcmFtICB7U3RyaW5nfSAgYXBwICBUaGUgbmFtZSBvZiB0aGUgYXBwbGljYXRpb25cbiAgICogQHBhcmFtICB7U3RyaW5nfSAga2V5ICBUaGUga2V5IG9yIGV2ZW50IG9mIHRoZSBkYXRhXG4gICAqL1xuICBndGFnVmlldyhhcHAsIGtleSkge1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiBndGFnID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgdHlwZW9mIGRhdGEgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAhdGhpcy5kZXNpbmF0aW9ucy5pbmNsdWRlcygnZ3RhZycpXG4gICAgKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgbGV0IHZpZXcgPSB7XG4gICAgICBhcHBfbmFtZTogYXBwLFxuICAgICAgc2NyZWVuX25hbWU6IGtleVxuICAgIH07XG5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgIGd0YWcoJ2V2ZW50JywgJ3NjcmVlbl92aWV3Jywgdmlldyk7XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby11bmRlZiAqL1xuXG4gICAgcmV0dXJuIFsnZ3RhZycsIFRyYWNrLmtleSwgJ3NjcmVlbl92aWV3Jywgdmlld107XG4gIH07XG59XG5cbi8qKiBAdHlwZSB7U3RyaW5nfSBUaGUgbWFpbiBzZWxlY3RvciB0byBhZGQgdGhlIHRyYWNraW5nIGZ1bmN0aW9uIHRvICovXG5UcmFjay5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XCJ0cmFja1wiXSc7XG5cbi8qKiBAdHlwZSB7U3RyaW5nfSBUaGUgbWFpbiBldmVudCB0cmFja2luZyBrZXkgdG8gbWFwIHRvIFdlYnRyZW5kcyBEQ1MudXJpICovXG5UcmFjay5rZXkgPSAnZXZlbnQnO1xuXG4vKiogQHR5cGUge0FycmF5fSBXaGF0IGRlc3RpbmF0aW9ucyB0byBwdXNoIGRhdGEgdG8gKi9cblRyYWNrLmRlc3RpbmF0aW9ucyA9IFtcbiAgJ3dlYnRyZW5kcycsXG4gICdndGFnJ1xuXTtcblxuZXhwb3J0IGRlZmF1bHQgVHJhY2s7IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgd3JhcHBlciBhcm91bmQgdGhlIG5hdmlnYXRvci5zaGFyZSgpIEFQSVxuICovXG5jbGFzcyBXZWJTaGFyZSB7XG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHMgPSB7fSkge1xuICAgIHRoaXMuc2VsZWN0b3IgPSAocy5zZWxlY3RvcikgPyBzLnNlbGVjdG9yIDogV2ViU2hhcmUuc2VsZWN0b3I7XG5cbiAgICB0aGlzLmNhbGxiYWNrID0gKHMuY2FsbGJhY2spID8gcy5jYWxsYmFjayA6IFdlYlNoYXJlLmNhbGxiYWNrO1xuXG4gICAgdGhpcy5mYWxsYmFjayA9IChzLmZhbGxiYWNrKSA/IHMuZmFsbGJhY2sgOiBXZWJTaGFyZS5mYWxsYmFjaztcblxuICAgIHRoaXMuZmFsbGJhY2tDb25kaXRpb24gPSAocy5mYWxsYmFja0NvbmRpdGlvbikgPyBzLmZhbGxiYWNrQ29uZGl0aW9uIDogV2ViU2hhcmUuZmFsbGJhY2tDb25kaXRpb247XG5cbiAgICBpZiAodGhpcy5mYWxsYmFja0NvbmRpdGlvbigpKSB7XG4gICAgICAvLyBSZW1vdmUgZmFsbGJhY2sgYXJpYSB0b2dnbGluZyBhdHRyaWJ1dGVzXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2VsZWN0b3IpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGl0ZW0ucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XG4gICAgICAgIGl0ZW0ucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJyk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVyIGZvciB0aGUgc2hhcmUgY2xpY2tcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKCFldmVudC50YXJnZXQubWF0Y2hlcyh0aGlzLnNlbGVjdG9yKSlcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuXG4gICAgICAgIHRoaXMuZGF0YSA9IEpTT04ucGFyc2UodGhpcy5lbGVtZW50LmRhdGFzZXQud2ViU2hhcmUpO1xuXG4gICAgICAgIHRoaXMuc2hhcmUodGhpcy5kYXRhKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZVxuICAgICAgdGhpcy5mYWxsYmFjaygpOyAvLyBFeGVjdXRlIHRoZSBmYWxsYmFja1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogV2ViIFNoYXJlIEFQSSBoYW5kbGVyXG4gICAqXG4gICAqIEBwYXJhbSAgIHtPYmplY3R9ICBkYXRhICBBbiBvYmplY3QgY29udGFpbmluZyB0aXRsZSwgdXJsLCBhbmQgdGV4dC5cbiAgICpcbiAgICogQHJldHVybiAge1Byb21pc2V9ICAgICAgIFRoZSByZXNwb25zZSBvZiB0aGUgLnNoYXJlKCkgbWV0aG9kLlxuICAgKi9cbiAgc2hhcmUoZGF0YSA9IHt9KSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci5zaGFyZShkYXRhKVxuICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgdGhpcy5jYWxsYmFjayhkYXRhKTtcbiAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKVxuICAgICAgICAgIGNvbnNvbGUuZGlyKGVycik7XG4gICAgICB9KTtcbiAgfVxufVxuXG4vKiogVGhlIGh0bWwgc2VsZWN0b3IgZm9yIHRoZSBjb21wb25lbnQgKi9cbldlYlNoYXJlLnNlbGVjdG9yID0gJ1tkYXRhLWpzKj1cIndlYi1zaGFyZVwiXSc7XG5cbi8qKiBQbGFjZWhvbGRlciBjYWxsYmFjayBmb3IgYSBzdWNjZXNzZnVsIHNlbmQgKi9cbldlYlNoYXJlLmNhbGxiYWNrID0gKCkgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJylcbiAgICBjb25zb2xlLmRpcignU3VjY2VzcyEnKTtcbn07XG5cbi8qKiBQbGFjZWhvbGRlciBmb3IgdGhlIFdlYlNoYXJlIGZhbGxiYWNrICovXG5XZWJTaGFyZS5mYWxsYmFjayA9ICgpID0+IHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpXG4gICAgY29uc29sZS5kaXIoJ0ZhbGxiYWNrIScpO1xufTtcblxuLyoqIENvbmRpdGlvbmFsIGZ1bmN0aW9uIGZvciB0aGUgV2ViIFNoYXJlIGZhbGxiYWNrICovXG5XZWJTaGFyZS5mYWxsYmFja0NvbmRpdGlvbiA9ICgpID0+IHtcbiAgcmV0dXJuIG5hdmlnYXRvci5zaGFyZTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFdlYlNoYXJlO1xuIiwiLyoqXG4gKiBAY2xhc3MgIFNldCB0aGUgdGhlIGNzcyB2YXJpYWJsZSAnLS0xMDB2aCcgdG8gdGhlIHNpemUgb2YgdGhlIFdpbmRvdydzIGlubmVyIGhlaWdodC5cbiAqL1xuY2xhc3MgV2luZG93Vmgge1xuICAvKipcbiAgICogQGNvbnN0cnVjdG9yICBTZXQgZXZlbnQgbGlzdGVuZXJzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzID0ge30pIHtcbiAgICB0aGlzLnByb3BlcnR5ID0gKHMucHJvcGVydHkpID8gcy5wcm9wZXJ0eSA6IFdpbmRvd1ZoLnByb3BlcnR5O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7dGhpcy5zZXQoKX0pO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHt0aGlzLnNldCgpfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjc3MgdmFyaWFibGUgcHJvcGVydHlcbiAgICovXG4gIHNldCgpIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGVcbiAgICAgIC5zZXRQcm9wZXJ0eSh0aGlzLnByb3BlcnR5LCBgJHt3aW5kb3cuaW5uZXJIZWlnaHR9cHhgKTtcbiAgfVxufVxuXG4vKiogQHBhcmFtICB7U3RyaW5nfSAgcHJvcGVydHkgIFRoZSBjc3MgdmFyaWFibGUgc3RyaW5nIHRvIHNldCAqL1xuV2luZG93VmgucHJvcGVydHkgPSAnLS0xMDB2aCc7XG5cbmV4cG9ydCBkZWZhdWx0IFdpbmRvd1ZoO1xuIiwiLyogZXNsaW50LWVudiBicm93c2VyICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU2VuZHMgYSBjb25maWd1cmF0aW9uIG9iamVjdCB0byBSb2xsYmFyLCB0aGUgbW9zdCBpbXBvcnRhbnQgY29uZmlnIGlzXG4gKiB0aGUgY29kZV92ZXJzaW9uIHdoaWNoIG1hcHMgdG8gdGhlIHNvdXJjZSBtYXBzIHZlcnNpb24uXG4gKlxuICogQHNvdXJjZSBodHRwczovL2RvY3Mucm9sbGJhci5jb20vZG9jcy9yb2xsYmFyanMtY29uZmlndXJhdGlvbi1yZWZlcmVuY2VcbiAqL1xuY2xhc3MgUm9sbGJhckNvbmZpZ3VyZSB7XG4gIC8qKlxuICAgKiBBZGRzIFJvbGxiYXIgY29uZmlndXJhdGlvbiB0byB0aGUgcGFnZSBpZiB0aGUgc25pcHBldCBoYXMgYmVlbiBpbmNsdWRlZC5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyBHZXQgdGhlIHNjcmlwdCB2ZXJzaW9uIGJhc2VkIG9uIHRoZSBoYXNoIHZhbHVlIGluIHRoZSBmaWxlLlxuICAgIGxldCBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpO1xuICAgIGxldCBzb3VyY2UgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjO1xuICAgIGxldCBwYXRoID0gc291cmNlLnNwbGl0KCcvJyk7XG4gICAgbGV0IGJhc2VuYW1lID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdO1xuICAgIGxldCBoYXNoID0gYmFzZW5hbWUuc3BsaXQoUm9sbGJhckNvbmZpZ3VyZS5oYXNoRGVsaW1ldGVyKVsxXS5yZXBsYWNlKCcuanMnLCAnJyk7XG5cbiAgICAvLyBDb3B5IHRoZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gYW5kIGFkZCB0aGUgY3VycmVudCB2ZXJzaW9uIG51bWJlci5cbiAgICBsZXQgY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgUm9sbGJhckNvbmZpZ3VyZS5jb25maWcpO1xuXG4gICAgY29uZmlnLnBheWxvYWQuY2xpZW50LmphdmFzY3JpcHQuY29kZV92ZXJzaW9uID0gaGFzaDtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gICAgICBpZiAodHlwZW9mIFJvbGxiYXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBjb25zb2xlLmxvZygnUm9sbGJhciBpcyBub3QgZGVmaW5lZC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gICAgICBsZXQgcm9sbGJhckNvbmZpZ3VyZSA9IFJvbGxiYXIuY29uZmlndXJlKGNvbmZpZyk7XG4gICAgICBsZXQgbXNnID0gYENvbmZpZ3VyZWQgUm9sbGJhciB3aXRoICcke2hhc2h9J2A7XG5cbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGNvbnNvbGUubG9nKGAke21zZ306YCk7XG5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgY29uc29sZS5kaXIocm9sbGJhckNvbmZpZ3VyZSk7XG5cbiAgICAgICAgUm9sbGJhci5kZWJ1Zyhtc2cpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSb2xsYmFyIEhhc2ggRGVsaW1pdGVyXG4gKi9cblJvbGxiYXJDb25maWd1cmUuaGFzaERlbGltZXRlciA9ICctJztcblxuLyoqXG4gKiBAdHlwZSB7T2JqZWN0fSBUaGUgZGVmYXVsdCBSb2xsYmFyIGNvbmZpZ3VyYXRpb25cbiAqL1xuUm9sbGJhckNvbmZpZ3VyZS5jb25maWcgPSB7XG4gIHBheWxvYWQ6IHtcbiAgICBjbGllbnQ6IHtcbiAgICAgIGphdmFzY3JpcHQ6IHtcbiAgICAgICAgLy8gVGhpcyBpcyB3aWxsIGJlIHRydWUgYnkgZGVmYXVsdCBpZiB5b3UgaGF2ZSBlbmFibGVkIHRoaXMgaW4gc2V0dGluZ3MuXG4gICAgICAgIHNvdXJjZV9tYXBfZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgLy8gT3B0aW9uYWxseSBndWVzcyB3aGljaCBmcmFtZXMgdGhlIGVycm9yIHdhcyB0aHJvd24gZnJvbSB3aGVuIHRoZSBicm93c2VyXG4gICAgICAgIC8vIGRvZXMgbm90IHByb3ZpZGUgbGluZSBhbmQgY29sdW1uIG51bWJlcnMuXG4gICAgICAgIGd1ZXNzX3VuY2F1Z2h0X2ZyYW1lczogdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgUm9sbGJhckNvbmZpZ3VyZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFRvZ2dsZSBmcm9tICdAbnljb3Bwb3J0dW5pdHkvcHR0cm4tc2NyaXB0cy9zcmMvdG9nZ2xlL3RvZ2dsZSc7XG5cbi8qKlxuICogVGhlIEFjY29yZGlvbiBtb2R1bGVcbiAqIEBjbGFzc1xuICovXG5jbGFzcyBBY2NvcmRpb24ge1xuICAvKipcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqXG4gICAqIEByZXR1cm4ge29iamVjdH0gVGhlIGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl90b2dnbGUgPSBuZXcgVG9nZ2xlKHtcbiAgICAgIHNlbGVjdG9yOiBBY2NvcmRpb24uc2VsZWN0b3JcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGRvbSBzZWxlY3RvciBmb3IgdGhlIG1vZHVsZVxuICpcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbkFjY29yZGlvbi5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XCJhY2NvcmRpb25cIl0nO1xuXG5leHBvcnQgZGVmYXVsdCBBY2NvcmRpb247XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQSB3cmFwcGVyIGFyb3VuZCBJbnRlcnNlY3Rpb24gT2JzZXJ2ZXIgY2xhc3NcbiAqL1xuY2xhc3MgT2JzZXJ2ZSB7XG4gIGNvbnN0cnVjdG9yKHMgPSB7fSkge1xuICAgIGlmICghcy5lbGVtZW50KSByZXR1cm47XG5cbiAgICB0aGlzLm9wdGlvbnMgPSAocy5vcHRpb25zKSA/IE9iamVjdC5hc3NpZ24oT2JzZXJ2ZS5vcHRpb25zLCBzLm9wdGlvbnMpIDogT2JzZXJ2ZS5vcHRpb25zO1xuXG4gICAgdGhpcy50cmlnZ2VyID0gKHMudHJpZ2dlcikgPyBzLnRyaWdnZXIgOiBPYnNlcnZlLnRyaWdnZXI7XG5cbiAgICB0aGlzLnNlbGVjdG9ycyA9IChzLnNlbGVjdG9ycykgPyBzLnNlbGVjdG9ycyA6IE9ic2VydmUuc2VsZWN0b3JzO1xuXG4gICAgLy8gSW5zdGFudGlhdGUgdGhlIEludGVyc2VjdGlvbiBPYnNlcnZlclxuICAgIHRoaXMub2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKGVudHJpZXMsIG9ic2VydmVyKSA9PiB7XG4gICAgICB0aGlzLmNhbGxiYWNrKGVudHJpZXMsIG9ic2VydmVyKTtcbiAgICB9LCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgLy8gU2VsZWN0IGFsbCBvZiB0aGUgaXRlbXMgdG8gb2JzZXJ2ZVxuICAgIGxldCBzZWxlY3Rvckl0ZW0gPSB0aGlzLnNlbGVjdG9ycy5JVEVNLnJlcGxhY2UoJ3t7IGl0ZW0gfX0nLFxuICAgICAgICBzLmVsZW1lbnQuZGF0YXNldFt0aGlzLnNlbGVjdG9ycy5JVEVNU19BVFRSXSk7XG5cbiAgICB0aGlzLml0ZW1zID0gcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JJdGVtKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbXNbaV07XG5cbiAgICAgIHRoaXMub2JzZXJ2ZXIub2JzZXJ2ZShpdGVtKTtcbiAgICB9XG4gIH1cblxuICBjYWxsYmFjayhlbnRyaWVzLCBvYnNlcnZlcikge1xuICAgIGxldCBwcmV2RW50cnkgPSBlbnRyaWVzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBlbnRyeSA9IGVudHJpZXNbaV07XG5cbiAgICAgIHRoaXMudHJpZ2dlcihlbnRyeSwgcHJldkVudHJ5LCBvYnNlcnZlcik7XG5cbiAgICAgIHByZXZFbnRyeSA9IGVudHJ5O1xuICAgIH1cbiAgfVxufVxuXG4vKiogT3B0aW9ucyBmb3IgdGhlIEludGVyc2VjdGlvbiBPYnNlcnZlciBBUEkgKi9cbk9ic2VydmUub3B0aW9ucyA9IHtcbiAgcm9vdDogbnVsbCxcbiAgcm9vdE1hcmdpbjogJzBweCcsXG4gIHRocmVzaG9sZDogWzAuMTVdXG59O1xuXG4vKiogUGxhY2Vob2xkZXIgZW50cnkgZnVuY3Rpb24gZm9yIHdoYXQgaGFwcGVucyB3aXRoIGl0ZW1zIGFyZSBvYnNlcnZlZCAqL1xuT2JzZXJ2ZS50cmlnZ2VyID0gZW50cnkgPT4ge1xuICBjb25zb2xlLmRpcihlbnRyeSk7XG4gIGNvbnNvbGUuZGlyKCdPYnNlcnZlZCEgQ3JlYXRlIGEgZW50cnkgdHJpZ2dlciBmdW5jdGlvbiBhbmQgcGFzcyBpdCB0byB0aGUgaW5zdGFudGlhdGVkIE9ic2VydmUgc2V0dGluZ3Mgb2JqZWN0LicpO1xufTtcblxuLyoqIE1haW4gc2VsZWN0b3IgZm9yIHRoZSB1dGlsaXR5ICovXG5PYnNlcnZlLnNlbGVjdG9yID0gJ1tkYXRhLWpzKj1cIm9ic2VydmVcIl0nO1xuXG4vKiogTWlzYy4gc2VsZWN0b3JzIGZvciB0aGUgb2JzZXJ2ZXIgdXRpbGl0eSAqL1xuT2JzZXJ2ZS5zZWxlY3RvcnMgPSB7XG4gIElURU06ICdbZGF0YS1qcy1vYnNlcnZlLWl0ZW09XCJ7eyBpdGVtIH19XCJdJyxcbiAgSVRFTVNfQVRUUjogJ2pzT2JzZXJ2ZUl0ZW1zJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgT2JzZXJ2ZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IE9ic2VydmUgZnJvbSAnQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL29ic2VydmUvb2JzZXJ2ZSc7XG5cbmNsYXNzIEFjdGl2ZU5hdmlnYXRpb24ge1xuICAvKipcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gIFRoZSBpbnN0YW50aWF0ZWQgcGF0dGVyblxuICAgKi9cbiAgY29uc3RydWN0b3IocyA9IHt9KSB7XG4gICAgdGhpcy5zZWxlY3RvciA9IChzLnNlbGVjdG9yKSA/IHMuc2VsZWN0b3IgOiBBY3RpdmVOYXZpZ2F0aW9uLnNlbGVjdG9yO1xuXG4gICAgdGhpcy5zZWxlY3RvcnMgPSAocy5zZWxlY3RvcnMpID9cbiAgICAgIE9iamVjdC5hc3NpZ24oQWN0aXZlTmF2aWdhdGlvbi5zZWxlY3RvcnMsIHMuc2VsZWN0b3JzKSA6IEFjdGl2ZU5hdmlnYXRpb24uc2VsZWN0b3JzO1xuXG4gICAgdGhpcy5vYnNlcnZlT3B0aW9ucyA9IChzLm9ic2VydmVPcHRpb25zKSA/XG4gICAgICBPYmplY3QuYXNzaWduKEFjdGl2ZU5hdmlnYXRpb24ub2JzZXJ2ZU9wdGlvbnMsIHMub2JzZXJ2ZU9wdGlvbnMpIDogQWN0aXZlTmF2aWdhdGlvbi5vYnNlcnZlT3B0aW9ucztcblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCBmb3IgdG9nZ2xpbmcgdGhlIGp1bXAgbmF2aWdhdGlvbiBpdGVtLCB1c2VkIGJ5IHRoZSBjbGljayBldmVudFxuICAgICAqIGhhbmRsZXIgYW5kIHRoZSBpbnRlcnNlY3Rpb24gb2JzZXJ2ZXIgZXZlbnQgaGFuZGxlci5cbiAgICAgKlxuICAgICAqIEB2YXIgTm9kZUVsZW1lbnRcbiAgICAgKi9cbiAgICAgY29uc3QganVtcENsYXNzVG9nZ2xlID0gaXRlbSA9PiB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBzaWJsaW5nID0gaXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdG9ycy5GT0NVU19BVFRSIGluIHNpYmxpbmcuZGF0YXNldCkge1xuICAgICAgICAgIGxldCBjbGFzc0FjdGl2ZSA9IHNpYmxpbmcuZGF0YXNldC5hY3RpdmVOYXZpZ2F0aW9uSXRlbS5zcGxpdCgnICcpO1xuICAgICAgICAgIGxldCBjbGFzc0luYWN0aXZlID0gc2libGluZy5kYXRhc2V0LmluYWN0aXZlTmF2aWdhdGlvbkl0ZW0uc3BsaXQoJyAnKTtcblxuICAgICAgICAgIGlmIChzaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucyguLi5jbGFzc0FjdGl2ZSkpIHtcbiAgICAgICAgICAgIHNpYmxpbmcuY2xhc3NMaXN0LnJlbW92ZSguLi5jbGFzc0FjdGl2ZSk7XG4gICAgICAgICAgICBzaWJsaW5nLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3NJbmFjdGl2ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSguLi5pdGVtLmRhdGFzZXQuaW5hY3RpdmVOYXZpZ2F0aW9uSXRlbS5zcGxpdCgnICcpKTtcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCguLi5pdGVtLmRhdGFzZXQuYWN0aXZlTmF2aWdhdGlvbkl0ZW0uc3BsaXQoJyAnKSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENsaWNrIGV2ZW50IGhhbmRsZXIgZm9yIGp1bXAgbmF2aWdhdGlvbiBpdGVtc1xuICAgICAqXG4gICAgICogQHZhciBOb2RlRWxlbWVudFxuICAgICAqL1xuICAgIChlbGVtZW50ID0+IHtcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGxldCBhY3RpdmVOYXZpZ2F0aW9uID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhW2RhdGEtYWN0aXZlLW5hdmlnYXRpb24taXRlbV0nKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFjdGl2ZU5hdmlnYXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBhID0gYWN0aXZlTmF2aWdhdGlvbltpXTtcblxuICAgICAgICAgIGEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAganVtcENsYXNzVG9nZ2xlKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XG4gICAgICAgICAgICAgIGxldCBmb2N1c0l0ZW0gPSBpdGVtLnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWxlY3RvcnMuRk9DVVMpO1xuXG4gICAgICAgICAgICAgIGlmIChmb2N1c0l0ZW0pIHtcbiAgICAgICAgICAgICAgICBmb2N1c0l0ZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICAgICAgICAgIGZvY3VzSXRlbS5mb2N1cygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNlbGVjdG9yKSk7XG5cbiAgICAvKipcbiAgICAgKiBJbnRlcnNlY3Rpb24gT2JzZXJ2ZXIgZXZlbnQgaGFuZGxlciBmb3IganVtcCBuYXZpZ2F0aW9uIGl0ZW1zXG4gICAgICpcbiAgICAgKiBAdmFyIE5vZGVFbGVtZW50TGlzdFxuICAgICAqL1xuICAgIChlbGVtZW50cyA9PiB7XG4gICAgICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICBuZXcgT2JzZXJ2ZSh7XG4gICAgICAgICAgZWxlbWVudDogZWxlbWVudCxcbiAgICAgICAgICBvcHRpb25zOiB0aGlzLm9ic2VydmVPcHRpb25zLFxuICAgICAgICAgIHNlbGVjdG9yczoge1xuICAgICAgICAgICAgSVRFTTogdGhpcy5zZWxlY3RvcnMuT0JTRVJWRV9JVEVNLFxuICAgICAgICAgICAgSVRFTVNfQVRUUjogdGhpcy5zZWxlY3RvcnMuT0JTRVJWRV9JVEVNU19BVFRSXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0cmlnZ2VyOiAoZW50cnkpID0+IHtcbiAgICAgICAgICAgIGlmICghZW50cnkuaXNJbnRlcnNlY3RpbmcpIHJldHVybjtcblxuICAgICAgICAgICAgbGV0IGp1bXBJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgYVtocmVmPVwiIyR7ZW50cnkudGFyZ2V0LmlkfVwiXWApO1xuXG4gICAgICAgICAgICBpZiAoIWp1bXBJdGVtKSByZXR1cm47XG5cbiAgICAgICAgICAgIGp1bXBJdGVtLmNsb3Nlc3QodGhpcy5zZWxlY3RvcnMuU0NST0xMKS5zY3JvbGxUbyh7XG4gICAgICAgICAgICAgIGxlZnQ6IGp1bXBJdGVtLm9mZnNldExlZnQsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IGZvY3VzSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2VsZWN0b3JzLkZPQ1VTKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb2N1c0l0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGZvY3VzSXRlbXNbaV0ucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBqdW1wQ2xhc3NUb2dnbGUoanVtcEl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2VsZWN0b3JzLk9CU0VSVkUpKTtcbiAgfVxufVxuXG4vKiogQHR5cGUge1N0cmluZ30gIE1haW4gRE9NIHNlbGVjdG9yICovXG5BY3RpdmVOYXZpZ2F0aW9uLnNlbGVjdG9yID0gJ1tkYXRhLWpzKj1cXFwiYWN0aXZlLW5hdmlnYXRpb25cXFwiXSc7XG5cbi8qKiBAdHlwZSB7T2JqZWN0fSAgU2VsZWN0b3JzIGZvciB0aGUgZWxlbWVudCAqL1xuQWN0aXZlTmF2aWdhdGlvbi5zZWxlY3RvcnMgPSB7XG4gIE9CU0VSVkU6ICdbZGF0YS1hY3RpdmUtbmF2aWdhdGlvbj1cIm9ic2VydmVcIl0nLFxuICBPQlNFUlZFX0lURU06ICdbZGF0YS1hY3RpdmUtbmF2aWdhdGlvbi1vYnNlcnZlLWl0ZW09XCJ7eyBpdGVtIH19XCJdJyxcbiAgT0JTRVJWRV9JVEVNU19BVFRSOiAnYWN0aXZlTmF2aWdhdGlvbk9ic2VydmVJdGVtcycsXG4gIFNDUk9MTDogJ1tkYXRhLWFjdGl2ZS1uYXZpZ2F0aW9uPVwic2Nyb2xsXCJdJyxcbiAgRk9DVVM6ICdbZGF0YS1hY3RpdmUtbmF2aWdhdGlvbi1pdGVtPVwiZm9jdXNcIl0nLFxuICBGT0NVU19BVFRSOiAnYWN0aXZlTmF2aWdhdGlvbkl0ZW0nXG59O1xuXG4vKiogQHR5cGUge09iamVjdH0gIE9ic2VydmF0aW9uIHV0aWxpdHkgb3B0aW9ucyAqL1xuQWN0aXZlTmF2aWdhdGlvbi5vYnNlcnZlT3B0aW9ucyA9IHtcbiAgcm9vdDogbnVsbCxcbiAgcm9vdE1hcmdpbjogJzBweCcsXG4gIHRocmVzaG9sZDogWzAuMTVdXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBY3RpdmVOYXZpZ2F0aW9uO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgVG9nZ2xlIGZyb20gJ0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy90b2dnbGUvdG9nZ2xlJztcblxuLyoqXG4gKiBUaGUgU2VhcmNoIG1vZHVsZVxuICpcbiAqIEBjbGFzc1xuICovXG5jbGFzcyBTZWFyY2gge1xuICAvKipcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqXG4gICAqIEByZXR1cm4ge29iamVjdH0gVGhlIGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl90b2dnbGUgPSBuZXcgVG9nZ2xlKHtcbiAgICAgIHNlbGVjdG9yOiBTZWFyY2guc2VsZWN0b3IsXG4gICAgICBhZnRlcjogKHRvZ2dsZSkgPT4ge1xuICAgICAgICBsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNlYXJjaC5zZWxlY3Rvcik7XG4gICAgICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU2VhcmNoLnNlbGVjdG9ycy5pbnB1dCk7XG5cbiAgICAgICAgaWYgKGVsLmNsYXNzTmFtZS5pbmNsdWRlcygnYWN0aXZlJykgJiYgaW5wdXQpIHtcbiAgICAgICAgICBpbnB1dC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBkb20gc2VsZWN0b3IgZm9yIHRoZSBtb2R1bGVcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cblNlYXJjaC5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XCJzZWFyY2hcIl0nO1xuXG5TZWFyY2guc2VsZWN0b3JzID0ge1xuICBpbnB1dDogJ1tkYXRhLXNlYXJjaCo9XCJpbnB1dFwiXSdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNlYXJjaDtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFRvZ2dsZSBmcm9tICdAbnljb3Bwb3J0dW5pdHkvcHR0cm4tc2NyaXB0cy9zcmMvdG9nZ2xlL3RvZ2dsZSc7XG5cbi8qKlxuICogVGhlIE1vYmlsZSBOYXYgbW9kdWxlXG4gKlxuICogQGNsYXNzXG4gKi9cbmNsYXNzIE1lbnUge1xuICAvKipcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqXG4gICAqIEByZXR1cm4gIHtvYmplY3R9ICBUaGUgY2xhc3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsZWN0b3IgPSBNZW51LnNlbGVjdG9yO1xuXG4gICAgdGhpcy5zZWxlY3RvcnMgPSBNZW51LnNlbGVjdG9ycztcblxuICAgIHRoaXMudG9nZ2xlID0gbmV3IFRvZ2dsZSh7XG4gICAgICBzZWxlY3RvcjogdGhpcy5zZWxlY3RvcixcbiAgICAgIGFmdGVyOiB0b2dnbGUgPT4ge1xuICAgICAgICAvLyBTaGlmdCBmb2N1cyBmcm9tIHRoZSBvcGVuIHRvIHRoZSBjbG9zZSBidXR0b24gaW4gdGhlIE1vYmlsZSBNZW51IHdoZW4gdG9nZ2xlZFxuICAgICAgICBpZiAodG9nZ2xlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoVG9nZ2xlLmFjdGl2ZUNsYXNzKSkge1xuICAgICAgICAgIHRvZ2dsZS50YXJnZXQucXVlcnlTZWxlY3Rvcih0aGlzLnNlbGVjdG9ycy5DTE9TRSkuZm9jdXMoKTtcblxuICAgICAgICAgIC8vIFdoZW4gdGhlIGxhc3QgZm9jdXNhYmxlIGl0ZW0gaW4gdGhlIGxpc3QgbG9vc2VzIGZvY3VzIGxvb3AgdG8gdGhlIGZpcnN0XG4gICAgICAgICAgdG9nZ2xlLmZvY3VzYWJsZS5pdGVtKHRvZ2dsZS5mb2N1c2FibGUubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKCkgPT4ge1xuICAgICAgICAgICAgICB0b2dnbGUuZm9jdXNhYmxlLml0ZW0oMCkuZm9jdXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWxlY3RvcnMuT1BFTikuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuLyoqIEB0eXBlICB7U3RyaW5nfSAgVGhlIGRvbSBzZWxlY3RvciBmb3IgdGhlIG1vZHVsZSAqL1xuTWVudS5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XCJtZW51XCJdJztcblxuLyoqIEB0eXBlICB7T2JqZWN0fSAgQWRkaXRpb25hbCBzZWxlY3RvcnMgdXNlZCBieSB0aGUgc2NyaXB0ICovXG5NZW51LnNlbGVjdG9ycyA9IHtcbiAgQ0xPU0U6ICdbZGF0YS1qcy1tZW51Kj1cImNsb3NlXCJdJyxcbiAgT1BFTjogJ1tkYXRhLWpzLW1lbnUqPVwib3BlblwiXSdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE1lbnU7XG4iLCIvKipcbiAqIFV0aWxpdGllc1xuICovXG5cbmltcG9ydCBEaWFsb2cgZnJvbSAnQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL2RpYWxvZy9kaWFsb2cnO1xuaW1wb3J0IENvcHkgZnJvbSAnQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL2NvcHkvY29weSc7XG5pbXBvcnQgSWNvbnMgZnJvbSAnQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL2ljb25zL2ljb25zJztcbmltcG9ydCBTZXRIZWlnaHRQcm9wZXJ0aWVzIGZyb20gJ0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy9zZXQtaGVpZ2h0LXByb3BlcnRpZXMvc2V0LWhlaWdodC1wcm9wZXJ0aWVzJztcbmltcG9ydCBUb2dnbGUgZnJvbSAnQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL3RvZ2dsZS90b2dnbGUnO1xuaW1wb3J0IFRyYWNrIGZyb20gJ0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy90cmFjay90cmFjayc7XG5pbXBvcnQgV2ViU2hhcmUgZnJvbSAnQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL3dlYi1zaGFyZS93ZWItc2hhcmUnO1xuaW1wb3J0IFdpbmRvd1ZoIGZyb20gJ0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy93aW5kb3ctdmgvd2luZG93LXZoJztcbmltcG9ydCBSb2xsYmFyQ29uZmlndXJlIGZyb20gJy4vbW9kdWxlcy9yb2xsYmFyLWNvbmZpZ3VyZSc7XG5cbi8qKlxuICogQ29tcG9uZW50c1xuICovXG5cbmltcG9ydCBBY2NvcmRpb24gZnJvbSAnQG55Y29wcG9ydHVuaXR5L3N0YW5kYXJkL3NyYy9jb21wb25lbnRzL2FjY29yZGlvbi9hY2NvcmRpb24nO1xuaW1wb3J0IEFjdGl2ZU5hdmlnYXRpb24gZnJvbSAnQG55Y29wcG9ydHVuaXR5L3N0YW5kYXJkL3NyYy9jb21wb25lbnRzL2FjdGl2ZS1uYXZpZ2F0aW9uL2FjdGl2ZS1uYXZpZ2F0aW9uJztcbmltcG9ydCBTZWFyY2ggZnJvbSAnQG55Y29wcG9ydHVuaXR5L3N0YW5kYXJkL3NyYy9vYmplY3RzL3NlYXJjaC9zZWFyY2gnO1xuXG4vKipcbiAqIE9iamVjdHNcbiAqL1xuXG5pbXBvcnQgTWVudSBmcm9tICdAbnljb3Bwb3J0dW5pdHkvcGF0dGVybi1tZW51L3NyYy9tZW51JztcblxuLyoqXG4gKiBJbml0XG4gKi9cblxubmV3IFJvbGxiYXJDb25maWd1cmUoKTtcblxuLyoqXG4gKiBQYXR0ZXJuc1xuICovXG5cbm5ldyBBY2NvcmRpb24oKTtcbm5ldyBBY3RpdmVOYXZpZ2F0aW9uKCk7XG5uZXcgRGlhbG9nKCk7XG5uZXcgTWVudSgpO1xubmV3IFNlYXJjaCgpO1xubmV3IFRvZ2dsZSgpO1xubmV3IFRyYWNrKCk7XG5uZXcgV2luZG93VmgoKTtcblxuLyoqXG4gKiBDb3B5LXRvLWNsaXBib2FyZCBVdGlsaXR5IENvbmZpZ3VyYXRpb25cbiAqL1xuXG5uZXcgQ29weSh7XG4gIGNvcGllZDogYyA9PiBjLmVsZW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtanMtY29weT1cImljb25cIl0nKVxuICAgIC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBgI2x1Y2lkZS1jaGVja2ApLFxuICBhZnRlcjogYyA9PiBjLmVsZW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtanMtY29weT1cImljb25cIl0nKVxuICAgIC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBgI2x1Y2lkZS1jb3B5YClcbn0pO1xuXG5cbi8qKlxuICogSWNvbiBTcHJpdGVzXG4gKi9cblxuY29uc3Qgc3ByaXRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWpzPVwic3ByaXRlc1wiXScpO1xuXG5uZXcgSWNvbnMoc3ByaXRlcy5kYXRhc2V0LnN2Z3MpO1xubmV3IEljb25zKHNwcml0ZXMuZGF0YXNldC5lbGVtZW50cyk7XG5uZXcgSWNvbnMoc3ByaXRlcy5kYXRhc2V0Lmx1Y2lkZSk7XG5uZXcgSWNvbnMoc3ByaXRlcy5kYXRhc2V0LndrbnljKTtcblxuc3ByaXRlcy5yZW1vdmUoKTtcblxuLyoqXG4gKiBXZWIgU2hhcmUgQ29uZmlndXJhdGlvblxuICovXG5cbm5ldyBXZWJTaGFyZSh7XG4gIGZhbGxiYWNrOiAoKSA9PiB7XG4gICAgbmV3IFRvZ2dsZSh7XG4gICAgICBzZWxlY3RvcjogV2ViU2hhcmUuc2VsZWN0b3JcbiAgICB9KTtcbiAgfVxufSk7XG5cbi8qKlxuICogTGFuZ3VhZ2VzXG4gKi9cblxuLy8gTW9kaWZ5IFdQTUwgTGFuZ3VhZ2UgTGlua3NcbmNvbnN0IHdwbWxMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndwbWwtbHMtbGVnYWN5LWxpc3QtaG9yaXpvbnRhbCcpO1xuY29uc3Qgd3BtbExpc3RJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndwbWwtbHMtaXRlbScpO1xuY29uc3Qgd3BtbExpbmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndwbWwtbHMtbGluaycpO1xuXG53cG1sTGlua3MuZm9yRWFjaChsaW5rID0+IHtcbiAgbGluay5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gIGxpbmsuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xufSk7XG5cbndwbWxMaXN0SXRlbS5mb3JFYWNoKGxpbmsgPT4ge1xuICBsaW5rLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbn0pO1xuXG5pZiAod3BtbExpc3QpIHtcbiAgd3BtbExpc3QucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xufVxuXG4vLyBJbml0aWFsaXplIEdvb2dsZSBUcmFuc2xhdGUgV2lkZ2V0XG5pZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmxhbmcgIT0gJ2VuJykge1xuICBnb29nbGVUcmFuc2xhdGVFbGVtZW50SW5pdCgpO1xufVxuXG4vKipcbiAqIFNldCBDU1MgcHJvcGVydGllcyBvZiB2YXJpb3VzIGVsZW1lbnQgaGVpZ2h0cyBmb3JcbiAqIGNhbGN1bGF0aW5nIHRoZSB0cnVlIHdpbmRvdyBib3R0b20gdmFsdWUgaW4gQ1NTLlxuICovXG5cbigoZWxlbWVudHMpID0+IHtcbiAgbGV0IHNldE9iamVjdEhlaWdodHMgPSAoZSkgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlWydzZWxlY3RvciddKTtcblxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShlWydwcm9wZXJ0eSddLCBgJHtlbGVtZW50LmNsaWVudEhlaWdodH1weGApO1xuICB9O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50c1tpXVsnc2VsZWN0b3InXSkpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4gc2V0T2JqZWN0SGVpZ2h0cyhlbGVtZW50c1tpXSkpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHNldE9iamVjdEhlaWdodHMoZWxlbWVudHNbaV0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KGVsZW1lbnRzW2ldWydwcm9wZXJ0eSddLCAnMHB4Jyk7XG4gICAgfVxuICB9XG59KShbXG4gIHtcbiAgICAnc2VsZWN0b3InOiAnW2RhdGEtanM9XCJuYXZpZ2F0aW9uXCJdJyxcbiAgICAncHJvcGVydHknOiAnLS13bnljLWRpbWVuc2lvbnMtbmF2aWdhdGlvbi1oZWlnaHQnXG4gIH0sXG4gIHtcbiAgICAnc2VsZWN0b3InOiAnW2RhdGEtanM9XCJmZWVkYmFja1wiXScsXG4gICAgJ3Byb3BlcnR5JzogJy0td255Yy1kaW1lbnNpb25zLWZlZWRiYWNrLWhlaWdodCdcbiAgfVxuXSk7XG5cbm5ldyBTZXRIZWlnaHRQcm9wZXJ0aWVzKHtcbiAgJ2VsZW1lbnRzJzogW1xuICAgIHtcbiAgICAgICdzZWxlY3Rvcic6ICdbZGF0YS1qcz1cIm5hdmlnYXRpb25cIl0nLFxuICAgICAgJ3Byb3BlcnR5JzogJy0tby1uYXZpZ2F0aW9uLWhlaWdodCdcbiAgICB9LFxuICAgIHtcbiAgICAgICdzZWxlY3Rvcic6ICdbZGF0YS1qcz1cImZlZWRiYWNrXCJdJyxcbiAgICAgICdwcm9wZXJ0eSc6ICctLW55Y28tZmVlZGJhY2staGVpZ2h0J1xuICAgIH1cbiAgXVxufSk7XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7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QztFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFO0VBQ25DLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDL0QsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM5RDtFQUNBO0VBQ0EsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUk7RUFDbkMsUUFBUSxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsT0FBTztFQUNsQyxVQUFVLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDNUQsT0FBTyxDQUFDLENBQUM7RUFDVCxLQUFLO0FBQ0w7RUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhO0VBQ25DLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMzRDtFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0VBQ3hELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDdkMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0M7RUFDQSxNQUFNLElBQUksS0FBSyxJQUFJLEVBQUUsSUFBSSxLQUFLO0VBQzlCLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxLQUFLLE1BQU0sSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7RUFDOUUsS0FBSztBQUNMO0VBQ0E7RUFDQTtFQUNBO0FBQ0E7RUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTO0VBQy9CLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0M7RUFDQTtFQUNBO0VBQ0E7QUFDQTtFQUNBLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7RUFDL0QsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdDO0VBQ0E7RUFDQTtFQUNBO0FBQ0E7RUFDQSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7RUFDcEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNuQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QztFQUNBLE1BQU0sSUFBSSxLQUFLLElBQUksRUFBRSxJQUFJLEtBQUs7RUFDOUIsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEtBQUssTUFBTSxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQztBQUMvRTtFQUNBO0VBQ0EsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSztFQUNyQyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7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
