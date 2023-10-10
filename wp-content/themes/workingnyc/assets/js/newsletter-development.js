(function () {
  'use strict';

  /**
   * Utilities for Form components
   * @class
   */
  class Forms {
    /**
     * The Form constructor
     * @param  {Object} form The form DOM element
     */
    constructor(form = false) {
      this.FORM = form;

      this.strings = Forms.strings;

      this.submit = Forms.submit;

      this.classes = Forms.classes;

      this.markup = Forms.markup;

      this.selectors = Forms.selectors;

      this.attrs = Forms.attrs;

      this.FORM.setAttribute('novalidate', true);

      return this;
    }

    /**
     * Map toggled checkbox values to an input.
     * @param  {Object} event The parent click event.
     * @return {Element}      The target element.
     */
    joinValues(event) {
      if (!event.target.matches('input[type="checkbox"]'))
        return;

      if (!event.target.closest('[data-js-join-values]'))
        return;

      let el = event.target.closest('[data-js-join-values]');
      let target = document.querySelector(el.dataset.jsJoinValues);

      target.value = Array.from(
          el.querySelectorAll('input[type="checkbox"]')
        )
        .filter((e) => (e.value && e.checked))
        .map((e) => e.value)
        .join(', ');

      return target;
    }

    /**
     * A simple form validation class that uses native form validation. It will
     * add appropriate form feedback for each input that is invalid and native
     * localized browser messaging.
     *
     * See https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation
     * See https://caniuse.com/#feat=form-validation for support
     *
     * @param  {Event}         event The form submission event
     * @return {Class/Boolean}       The form class or false if invalid
     */
    valid(event) {
      let validity = event.target.checkValidity();
      let elements = event.target.querySelectorAll(this.selectors.REQUIRED);

      for (let i = 0; i < elements.length; i++) {
        // Remove old messaging if it exists
        let el = elements[i];

        this.reset(el);

        // If this input valid, skip messaging
        if (el.validity.valid) continue;

        this.highlight(el);
      }

      return (validity) ? this : validity;
    }

    /**
     * Adds focus and blur events to inputs with required attributes
     * @param   {object}  form  Passing a form is possible, otherwise it will use
     *                          the form passed to the constructor.
     * @return  {class}         The form class
     */
    watch(form = false) {
      this.FORM = (form) ? form : this.FORM;

      let elements = this.FORM.querySelectorAll(this.selectors.REQUIRED);

      /** Watch Individual Inputs */
      for (let i = 0; i < elements.length; i++) {
        // Remove old messaging if it exists
        let el = elements[i];

        el.addEventListener('focus', () => {
          this.reset(el);
        });

        el.addEventListener('blur', () => {
          if (!el.validity.valid)
            this.highlight(el);
        });
      }

      /** Submit Event */
      this.FORM.addEventListener('submit', (event) => {
        event.preventDefault();

        if (this.valid(event) === false)
          return false;

        this.submit(event);
      });

      return this;
    }

    /**
     * Removes the validity message and classes from the message.
     * @param   {object}  el  The input element
     * @return  {class}       The form class
     */
    reset(el) {
      let container = (this.selectors.ERROR_MESSAGE_PARENT)
        ? el.closest(this.selectors.ERROR_MESSAGE_PARENT) : el.parentNode;

      let message = container.querySelector('.' + this.classes.ERROR_MESSAGE);

      // Remove old messaging if it exists
      container.classList.remove(this.classes.ERROR_CONTAINER);
      if (message) message.remove();

      // Remove error class from the form
      container.closest('form').classList.remove(this.classes.ERROR_CONTAINER);

      // Remove dynamic attributes from the input
      el.removeAttribute(this.attrs.ERROR_INPUT[0]);
      el.removeAttribute(this.attrs.ERROR_LABEL);

      return this;
    }

    /**
     * Displays a validity message to the user. It will first use any localized
     * string passed to the class for required fields missing input. If the
     * input is filled in but doesn't match the required pattern, it will use
     * a localized string set for the specific input type. If one isn't provided
     * it will use the default browser provided message.
     * @param   {object}  el  The invalid input element
     * @return  {class}       The form class
     */
    highlight(el) {
      let container = (this.selectors.ERROR_MESSAGE_PARENT)
        ? el.closest(this.selectors.ERROR_MESSAGE_PARENT) : el.parentNode;

      // Create the new error message.
      let message = document.createElement(this.markup.ERROR_MESSAGE);
      let id = `${el.getAttribute('id')}-${this.classes.ERROR_MESSAGE}`;

      // Get the error message from localized strings (if set).
      if (el.validity.valueMissing && this.strings.VALID_REQUIRED)
        message.innerHTML = this.strings.VALID_REQUIRED;
      else if (!el.validity.valid &&
        this.strings[`VALID_${el.type.toUpperCase()}_INVALID`]) {
        let stringKey = `VALID_${el.type.toUpperCase()}_INVALID`;
        message.innerHTML = this.strings[stringKey];
      } else
        message.innerHTML = el.validationMessage;

      // Set aria attributes and css classes to the message
      message.setAttribute('id', id);
      message.setAttribute(this.attrs.ERROR_MESSAGE[0],
        this.attrs.ERROR_MESSAGE[1]);
      message.classList.add(this.classes.ERROR_MESSAGE);

      // Add the error class and error message to the dom.
      container.classList.add(this.classes.ERROR_CONTAINER);
      container.insertBefore(message, container.childNodes[0]);

      // Add the error class to the form
      container.closest('form').classList.add(this.classes.ERROR_CONTAINER);

      // Add dynamic attributes to the input
      el.setAttribute(this.attrs.ERROR_INPUT[0], this.attrs.ERROR_INPUT[1]);
      el.setAttribute(this.attrs.ERROR_LABEL, id);

      return this;
    }
  }

  /**
   * A dictionairy of strings in the format.
   * {
   *   'VALID_REQUIRED': 'This is required',
   *   'VALID_{{ TYPE }}_INVALID': 'Invalid'
   * }
   */
  Forms.strings = {};

  /** Placeholder for the submit function */
  Forms.submit = function() {};

  /** Classes for various containers */
  Forms.classes = {
    'ERROR_MESSAGE': 'error-message', // error class for the validity message
    'ERROR_CONTAINER': 'error', // class for the validity message parent
    'ERROR_FORM': 'error'
  };

  /** HTML tags and markup for various elements */
  Forms.markup = {
    'ERROR_MESSAGE': 'div',
  };

  /** DOM Selectors for various elements */
  Forms.selectors = {
    'REQUIRED': '[required="true"]', // Selector for required input elements
    'ERROR_MESSAGE_PARENT': false
  };

  /** Attributes for various elements */
  Forms.attrs = {
    'ERROR_MESSAGE': ['aria-live', 'polite'], // Attribute for valid error message
    'ERROR_INPUT': ['aria-invalid', 'true'],
    'ERROR_LABEL': 'aria-describedby'
  };

  var e=/^(?:submit|button|image|reset|file)$/i,t=/^(?:input|select|textarea|keygen)/i,n=/(\[[^\[\]]*\])/g;function a(e,t,a){if(t.match(n))!function e(t,n,a){if(0===n.length)return a;var r=n.shift(),l=r.match(/^\[(.+?)\]$/);if("[]"===r)return t=t||[],Array.isArray(t)?t.push(e(null,n,a)):(t._values=t._values||[],t._values.push(e(null,n,a))),t;if(l){var i=l[1],u=+i;isNaN(u)?(t=t||{})[i]=e(t[i],n,a):(t=t||[])[u]=e(t[u],n,a);}else t[r]=e(t[r],n,a);return t}(e,function(e){var t=[],a=new RegExp(n),r=/^([^\[\]]*)/.exec(e);for(r[1]&&t.push(r[1]);null!==(r=a.exec(e));)t.push(r[1]);return t}(t),a);else {var r=e[t];r?(Array.isArray(r)||(e[t]=[r]),e[t].push(a)):e[t]=a;}return e}function r(e,t,n){return n=(n=String(n)).replace(/(\r)?\n/g,"\r\n"),n=(n=encodeURIComponent(n)).replace(/%20/g,"+"),e+(e?"&":"")+encodeURIComponent(t)+"="+n}function serialize(n,l){"object"!=typeof l?l={hash:!!l}:void 0===l.hash&&(l.hash=!0);for(var i=l.hash?{}:"",u=l.serializer||(l.hash?a:r),s=n&&n.elements?n.elements:[],c=Object.create(null),o=0;o<s.length;++o){var h=s[o];if((l.disabled||!h.disabled)&&h.name&&t.test(h.nodeName)&&!e.test(h.type)){var p=h.name,f=h.value;if("checkbox"!==h.type&&"radio"!==h.type||(h.checked?"on"===h.value?f=!0:"off"===h.value&&(f=!1):f=void 0),l.empty){if("checkbox"!==h.type||h.checked||(f=!1),"radio"===h.type&&(c[h.name]||h.checked?h.checked&&(c[h.name]=!0):c[h.name]=!1),null==f&&"radio"==h.type)continue}else if(!f)continue;if("select-multiple"!==h.type)i=u(i,p,f);else {f=[];for(var v=h.options,m=!1,d=0;d<v.length;++d){var y=v[d];y.selected&&(y.value||l.empty&&!y.value)&&(m=!0,i=l.hash&&"[]"!==p.slice(p.length-2)?u(i,p+"[]",y.value):u(i,p,y.value));}!m&&l.empty&&(i=u(i,p,""));}}}if(l.empty)for(var p in c)c[p]||(i=u(i,p,""));return i}

  /**
   * @class  The Newsletter module
   */
  class Newsletter {
    /**
     * @constructor
     *
     * @param   {Object}  element  The Newsletter DOM Object
     *
     * @return  {Class}            The instantiated Newsletter object
     */
    constructor(element) {
      this._el = element;

      this.keys = Newsletter.keys;

      this.endpoints = Newsletter.endpoints;

      this.selectors = Newsletter.selectors;

      this.selector = Newsletter.selector;

      this.stringKeys = Newsletter.stringKeys;

      this.strings = Newsletter.strings;

      this.templates = Newsletter.templates;

      this.classes = Newsletter.classes;

      this.callback = [
        Newsletter.callback,
        Math.random().toString().replace('0.', '')
      ].join('');

      // This sets the script callback function to a global function that
      // can be accessed by the the requested script.
      window[this.callback] = (data) => {
        this._callback(data);
      };

      this.form = new Forms(this._el.querySelector('form'));

      this.form.strings = this.strings;

      this.form.submit = (event) => {
        event.preventDefault();

        this._submit(event)
          .then(this._onload)
          .catch(this._onerror);
      };

      this.form.watch();

      return this;
    }

    /**
     * The form submission method. Requests a script with a callback function
     * to be executed on our page. The callback function will be passed the
     * response as a JSON object (function parameter).
     *
     * @param   {Event}    event  The form submission event
     *
     * @return  {Promise}         A promise containing the new script call
     */
    _submit(event) {
      event.preventDefault();

      // Serialize the data
      this._data = serialize(event.target, {hash: true});

      // Switch the action to post-json. This creates an endpoint for mailchimp
      // that acts as a script that can be loaded onto our page.
      let action = event.target.action.replace(
        `${this.endpoints.MAIN}?`, `${this.endpoints.MAIN_JSON}?`
      );

      // Add our params to the action
      action = action + serialize(event.target, {serializer: (...params) => {
        let prev = (typeof params[0] === 'string') ? params[0] : '';

        return `${prev}&${params[1]}=${params[2]}`;
      }});

      // Append the callback reference. Mailchimp will wrap the JSON response in
      // our callback method. Once we load the script the callback will execute.
      action = `${action}&c=window.${this.callback}`;

      // Create a promise that appends the script response of the post-json method
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');

        document.body.appendChild(script);
        script.onload = resolve;
        script.onerror = reject;
        script.async = true;
        script.src = encodeURI(action);
      });
    }

    /**
     * The script onload resolution
     *
     * @param   {Event}  event  The script on load event
     *
     * @return  {Class}         The Newsletter class
     */
    _onload(event) {
      event.path[0].remove();

      return this;
    }

    /**
     * The script on error resolution
     *
     * @param   {Object}  error  The script on error load event
     *
     * @return  {Class}          The Newsletter class
     */
    _onerror(error) {
      // eslint-disable-next-line no-console
      console.dir(error);

      return this;
    }

    /**
     * The callback function for the MailChimp Script call
     *
     * @param   {Object}  data  The success/error message from MailChimp
     *
     * @return  {Class}        The Newsletter class
     */
    _callback(data) {
      if (this[`_${data[this._key('MC_RESULT')]}`]) {
        this[`_${data[this._key('MC_RESULT')]}`](data.msg);
      } else {
        // eslint-disable-next-line no-console
        console.dir(data);
      }

      return this;
    }

    /**
     * Submission error handler
     *
     * @param   {string}  msg  The error message
     *
     * @return  {Class}        The Newsletter class
     */
    _error(msg) {
      this._elementsReset();
      this._messaging('WARNING', msg);

      return this;
    }

    /**
     * Submission success handler
     *
     * @param   {string}  msg  The success message
     *
     * @return  {Class}        The Newsletter class
     */
    _success(msg) {
      this._elementsReset();
      this._messaging('SUCCESS', msg);

      return this;
    }

    /**
     * Present the response message to the user
     *
     * @param   {String}  type  The message type
     * @param   {String}  msg   The message
     *
     * @return  {Class}         Newsletter
     */
    _messaging(type, msg = 'no message') {
      let strings = Object.keys(this.stringKeys);
      let handled = false;

      let alertBox = this._el.querySelector(this.selectors[type]);

      let alertBoxMsg = alertBox.querySelector(
        this.selectors.ALERT_TEXT
      );

      // Get the localized string, these should be written to the DOM already.
      // The utility contains a global method for retrieving them.
      let stringKeys = strings.filter(s => msg.includes(this.stringKeys[s]));
      msg = (stringKeys.length) ? this.strings[stringKeys[0]] : msg;
      handled = (stringKeys.length) ? true : false;

      // Replace string templates with values from either our form data or
      // the Newsletter strings object.
      for (let x = 0; x < this.templates.length; x++) {
        let template = this.templates[x];
        let key = template.replace('{{ ', '').replace(' }}', '');
        let value = this._data[key] || this.strings[key];
        let reg = new RegExp(template, 'gi');

        msg = msg.replace(reg, (value) ? value : '');
      }

      if (handled) {
        alertBoxMsg.innerHTML = msg;
      } else if (type === 'ERROR') {
        alertBoxMsg.innerHTML = this.strings.ERR_PLEASE_TRY_LATER;
      }

      if (alertBox) this._elementShow(alertBox, alertBoxMsg);

      return this;
    }

    /**
     * The main toggling method
     *
     * @return  {Class}  Newsletter
     */
    _elementsReset() {
      let targets = this._el.querySelectorAll(this.selectors.ALERTS);

      for (let i = 0; i < targets.length; i++)
        if (!targets[i].classList.contains(this.classes.HIDDEN)) {
          targets[i].classList.add(this.classes.HIDDEN);

          this.classes.ANIMATE.split(' ').forEach((item) =>
            targets[i].classList.remove(item)
          );

          // Screen Readers
          targets[i].setAttribute('aria-hidden', 'true');
          targets[i].querySelector(this.selectors.ALERT_TEXT)
            .setAttribute('aria-live', 'off');
        }

      return this;
    }

    /**
     * The main toggling method
     *
     * @param   {object}  target   Message container
     * @param   {object}  content  Content that changes dynamically that should
     *                             be announced to screen readers.
     *
     * @return  {Class}            Newsletter
     */
    _elementShow(target, content) {
      target.classList.toggle(this.classes.HIDDEN);

      this.classes.ANIMATE.split(' ').forEach((item) =>
        target.classList.toggle(item)
      );

      // Screen Readers
      target.setAttribute('aria-hidden', 'false');

      if (content) {
        content.setAttribute('aria-live', 'polite');
      }

      return this;
    }

    /**
     * A proxy function for retrieving the proper key
     *
     * @param   {string}  key  The reference for the stored keys.
     *
     * @return  {string}       The desired key.
     */
    _key(key) {
      return this.keys[key];
    }
  }

  /** @type  {Object}  API data keys */
  Newsletter.keys = {
    MC_RESULT: 'result',
    MC_MSG: 'msg'
  };

  /** @type  {Object}  API endpoints */
  Newsletter.endpoints = {
    MAIN: '/post',
    MAIN_JSON: '/post-json'
  };

  /** @type  {String}  The Mailchimp callback reference. */
  Newsletter.callback = 'NewsletterCallback';

  /** @type  {Object}  DOM selectors for the instance's concerns */
  Newsletter.selectors = {
    ELEMENT: '[data-js="newsletter"]',
    ALERTS: '[data-js*="alert"]',
    WARNING: '[data-js="alert-warning"]',
    SUCCESS: '[data-js="alert-success"]',
    ALERT_TEXT: '[data-js-alert="text"]'
  };

  /** @type  {String}  The main DOM selector for the instance */
  Newsletter.selector = Newsletter.selectors.ELEMENT;

  /** @type  {Object}  String references for the instance */
  Newsletter.stringKeys = {
    SUCCESS_CONFIRM_EMAIL: 'Almost finished...',
    ERR_PLEASE_ENTER_VALUE: 'Please enter a value',
    ERR_TOO_MANY_RECENT: 'too many',
    ERR_ALREADY_SUBSCRIBED: 'is already subscribed',
    ERR_INVALID_EMAIL: 'looks fake or invalid'
  };

  /** @type  {Object}  Available strings */
  Newsletter.strings = {
    VALID_REQUIRED: 'This field is required.',
    VALID_EMAIL_REQUIRED: 'Email is required.',
    VALID_EMAIL_INVALID: 'Please enter a valid email.',
    VALID_CHECKBOX_BOROUGH: 'Please select a borough.',
    ERR_PLEASE_TRY_LATER: 'There was an error with your submission. ' +
                          'Please try again later.',
    SUCCESS_CONFIRM_EMAIL: 'Almost finished... We need to confirm your email ' +
                           'address. To complete the subscription process, ' +
                           'please click the link in the email we just sent you.',
    ERR_PLEASE_ENTER_VALUE: 'Please enter a value',
    ERR_TOO_MANY_RECENT: 'Recipient "{{ EMAIL }}" has too ' +
                         'many recent signup requests',
    ERR_ALREADY_SUBSCRIBED: '{{ EMAIL }} is already subscribed ' +
                            'to list {{ LIST_NAME }}.',
    ERR_INVALID_EMAIL: 'This email address looks fake or invalid. ' +
                       'Please enter a real email address.',
    LIST_NAME: 'Newsletter'
  };

  /** @type  {Array}  Placeholders that will be replaced in message strings */
  Newsletter.templates = [
    '{{ EMAIL }}',
    '{{ LIST_NAME }}'
  ];

  Newsletter.classes = {
    ANIMATE: 'animated fadeInUp',
    HIDDEN: 'hidden'
  };

  /**
   * Newsletter
   *
   * @author NYC Opportunity
   */

  /**
   * Init
   */

  /**
   * Newsletter Form
   */
  (element => {
    let newsletter = null;

    if (element) {
      let submit = element.querySelector('[type=submit]');
      let error = element.querySelector('[data-js="alert-error"]');

      newsletter = new Newsletter(element);
      newsletter.form.selectors.ERROR_MESSAGE_PARENT = '.c-question__container';

      // display error on invalid form
      submit.addEventListener('click', function() {
        if (response == null) {
          error.setAttribute('aria-hidden', 'false');

          error.classList.remove('hidden');
        }
      });
    }

    let params = new URLSearchParams(window.location.search);
    let response = params.get('response');
    let res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (response && newsletter) {
      let email = params.get('email');
      let input = element.querySelector('input[name="EMAIL"]');

      if (res.test(String(email).toLowerCase()))
        input.value = email;

      newsletter._data = {
        'result': params.get('result'),
        'msg': params.get('msg'),
        'EMAIL': email
      };

      newsletter._callback(newsletter._data);
    }
  })(document.querySelector('[data-js="newsletter-form"]'));

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3c2xldHRlci1kZXZlbG9wbWVudC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy9mb3Jtcy9mb3Jtcy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9mb3ItY2VyaWFsL2Rpc3QvaW5kZXgubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy9uZXdzbGV0dGVyL25ld3NsZXR0ZXIuanMiLCIuLi8uLi9zcmMvanMvbmV3c2xldHRlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXRpbGl0aWVzIGZvciBGb3JtIGNvbXBvbmVudHNcbiAqIEBjbGFzc1xuICovXG5jbGFzcyBGb3JtcyB7XG4gIC8qKlxuICAgKiBUaGUgRm9ybSBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGZvcm0gVGhlIGZvcm0gRE9NIGVsZW1lbnRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGZvcm0gPSBmYWxzZSkge1xuICAgIHRoaXMuRk9STSA9IGZvcm07XG5cbiAgICB0aGlzLnN0cmluZ3MgPSBGb3Jtcy5zdHJpbmdzO1xuXG4gICAgdGhpcy5zdWJtaXQgPSBGb3Jtcy5zdWJtaXQ7XG5cbiAgICB0aGlzLmNsYXNzZXMgPSBGb3Jtcy5jbGFzc2VzO1xuXG4gICAgdGhpcy5tYXJrdXAgPSBGb3Jtcy5tYXJrdXA7XG5cbiAgICB0aGlzLnNlbGVjdG9ycyA9IEZvcm1zLnNlbGVjdG9ycztcblxuICAgIHRoaXMuYXR0cnMgPSBGb3Jtcy5hdHRycztcblxuICAgIHRoaXMuRk9STS5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCB0cnVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcCB0b2dnbGVkIGNoZWNrYm94IHZhbHVlcyB0byBhbiBpbnB1dC5cbiAgICogQHBhcmFtICB7T2JqZWN0fSBldmVudCBUaGUgcGFyZW50IGNsaWNrIGV2ZW50LlxuICAgKiBAcmV0dXJuIHtFbGVtZW50fSAgICAgIFRoZSB0YXJnZXQgZWxlbWVudC5cbiAgICovXG4gIGpvaW5WYWx1ZXMoZXZlbnQpIHtcbiAgICBpZiAoIWV2ZW50LnRhcmdldC5tYXRjaGVzKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKSlcbiAgICAgIHJldHVybjtcblxuICAgIGlmICghZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJ1tkYXRhLWpzLWpvaW4tdmFsdWVzXScpKVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IGVsID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJ1tkYXRhLWpzLWpvaW4tdmFsdWVzXScpO1xuICAgIGxldCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsLmRhdGFzZXQuanNKb2luVmFsdWVzKTtcblxuICAgIHRhcmdldC52YWx1ZSA9IEFycmF5LmZyb20oXG4gICAgICAgIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpXG4gICAgICApXG4gICAgICAuZmlsdGVyKChlKSA9PiAoZS52YWx1ZSAmJiBlLmNoZWNrZWQpKVxuICAgICAgLm1hcCgoZSkgPT4gZS52YWx1ZSlcbiAgICAgIC5qb2luKCcsICcpO1xuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNpbXBsZSBmb3JtIHZhbGlkYXRpb24gY2xhc3MgdGhhdCB1c2VzIG5hdGl2ZSBmb3JtIHZhbGlkYXRpb24uIEl0IHdpbGxcbiAgICogYWRkIGFwcHJvcHJpYXRlIGZvcm0gZmVlZGJhY2sgZm9yIGVhY2ggaW5wdXQgdGhhdCBpcyBpbnZhbGlkIGFuZCBuYXRpdmVcbiAgICogbG9jYWxpemVkIGJyb3dzZXIgbWVzc2FnaW5nLlxuICAgKlxuICAgKiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9MZWFybi9IVE1ML0Zvcm1zL0Zvcm1fdmFsaWRhdGlvblxuICAgKiBTZWUgaHR0cHM6Ly9jYW5pdXNlLmNvbS8jZmVhdD1mb3JtLXZhbGlkYXRpb24gZm9yIHN1cHBvcnRcbiAgICpcbiAgICogQHBhcmFtICB7RXZlbnR9ICAgICAgICAgZXZlbnQgVGhlIGZvcm0gc3VibWlzc2lvbiBldmVudFxuICAgKiBAcmV0dXJuIHtDbGFzcy9Cb29sZWFufSAgICAgICBUaGUgZm9ybSBjbGFzcyBvciBmYWxzZSBpZiBpbnZhbGlkXG4gICAqL1xuICB2YWxpZChldmVudCkge1xuICAgIGxldCB2YWxpZGl0eSA9IGV2ZW50LnRhcmdldC5jaGVja1ZhbGlkaXR5KCk7XG4gICAgbGV0IGVsZW1lbnRzID0gZXZlbnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZWxlY3RvcnMuUkVRVUlSRUQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gUmVtb3ZlIG9sZCBtZXNzYWdpbmcgaWYgaXQgZXhpc3RzXG4gICAgICBsZXQgZWwgPSBlbGVtZW50c1tpXTtcblxuICAgICAgdGhpcy5yZXNldChlbCk7XG5cbiAgICAgIC8vIElmIHRoaXMgaW5wdXQgdmFsaWQsIHNraXAgbWVzc2FnaW5nXG4gICAgICBpZiAoZWwudmFsaWRpdHkudmFsaWQpIGNvbnRpbnVlO1xuXG4gICAgICB0aGlzLmhpZ2hsaWdodChlbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuICh2YWxpZGl0eSkgPyB0aGlzIDogdmFsaWRpdHk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBmb2N1cyBhbmQgYmx1ciBldmVudHMgdG8gaW5wdXRzIHdpdGggcmVxdWlyZWQgYXR0cmlidXRlc1xuICAgKiBAcGFyYW0gICB7b2JqZWN0fSAgZm9ybSAgUGFzc2luZyBhIGZvcm0gaXMgcG9zc2libGUsIG90aGVyd2lzZSBpdCB3aWxsIHVzZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGZvcm0gcGFzc2VkIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICogQHJldHVybiAge2NsYXNzfSAgICAgICAgIFRoZSBmb3JtIGNsYXNzXG4gICAqL1xuICB3YXRjaChmb3JtID0gZmFsc2UpIHtcbiAgICB0aGlzLkZPUk0gPSAoZm9ybSkgPyBmb3JtIDogdGhpcy5GT1JNO1xuXG4gICAgbGV0IGVsZW1lbnRzID0gdGhpcy5GT1JNLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZWxlY3RvcnMuUkVRVUlSRUQpO1xuXG4gICAgLyoqIFdhdGNoIEluZGl2aWR1YWwgSW5wdXRzICovXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gUmVtb3ZlIG9sZCBtZXNzYWdpbmcgaWYgaXQgZXhpc3RzXG4gICAgICBsZXQgZWwgPSBlbGVtZW50c1tpXTtcblxuICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMucmVzZXQoZWwpO1xuICAgICAgfSk7XG5cbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoKSA9PiB7XG4gICAgICAgIGlmICghZWwudmFsaWRpdHkudmFsaWQpXG4gICAgICAgICAgdGhpcy5oaWdobGlnaHQoZWwpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIFN1Ym1pdCBFdmVudCAqL1xuICAgIHRoaXMuRk9STS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGlmICh0aGlzLnZhbGlkKGV2ZW50KSA9PT0gZmFsc2UpXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgdGhpcy5zdWJtaXQoZXZlbnQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgdmFsaWRpdHkgbWVzc2FnZSBhbmQgY2xhc3NlcyBmcm9tIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gICB7b2JqZWN0fSAgZWwgIFRoZSBpbnB1dCBlbGVtZW50XG4gICAqIEByZXR1cm4gIHtjbGFzc30gICAgICAgVGhlIGZvcm0gY2xhc3NcbiAgICovXG4gIHJlc2V0KGVsKSB7XG4gICAgbGV0IGNvbnRhaW5lciA9ICh0aGlzLnNlbGVjdG9ycy5FUlJPUl9NRVNTQUdFX1BBUkVOVClcbiAgICAgID8gZWwuY2xvc2VzdCh0aGlzLnNlbGVjdG9ycy5FUlJPUl9NRVNTQUdFX1BBUkVOVCkgOiBlbC5wYXJlbnROb2RlO1xuXG4gICAgbGV0IG1lc3NhZ2UgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLicgKyB0aGlzLmNsYXNzZXMuRVJST1JfTUVTU0FHRSk7XG5cbiAgICAvLyBSZW1vdmUgb2xkIG1lc3NhZ2luZyBpZiBpdCBleGlzdHNcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNsYXNzZXMuRVJST1JfQ09OVEFJTkVSKTtcbiAgICBpZiAobWVzc2FnZSkgbWVzc2FnZS5yZW1vdmUoKTtcblxuICAgIC8vIFJlbW92ZSBlcnJvciBjbGFzcyBmcm9tIHRoZSBmb3JtXG4gICAgY29udGFpbmVyLmNsb3Nlc3QoJ2Zvcm0nKS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3Nlcy5FUlJPUl9DT05UQUlORVIpO1xuXG4gICAgLy8gUmVtb3ZlIGR5bmFtaWMgYXR0cmlidXRlcyBmcm9tIHRoZSBpbnB1dFxuICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLmF0dHJzLkVSUk9SX0lOUFVUWzBdKTtcbiAgICBlbC5yZW1vdmVBdHRyaWJ1dGUodGhpcy5hdHRycy5FUlJPUl9MQUJFTCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5cyBhIHZhbGlkaXR5IG1lc3NhZ2UgdG8gdGhlIHVzZXIuIEl0IHdpbGwgZmlyc3QgdXNlIGFueSBsb2NhbGl6ZWRcbiAgICogc3RyaW5nIHBhc3NlZCB0byB0aGUgY2xhc3MgZm9yIHJlcXVpcmVkIGZpZWxkcyBtaXNzaW5nIGlucHV0LiBJZiB0aGVcbiAgICogaW5wdXQgaXMgZmlsbGVkIGluIGJ1dCBkb2Vzbid0IG1hdGNoIHRoZSByZXF1aXJlZCBwYXR0ZXJuLCBpdCB3aWxsIHVzZVxuICAgKiBhIGxvY2FsaXplZCBzdHJpbmcgc2V0IGZvciB0aGUgc3BlY2lmaWMgaW5wdXQgdHlwZS4gSWYgb25lIGlzbid0IHByb3ZpZGVkXG4gICAqIGl0IHdpbGwgdXNlIHRoZSBkZWZhdWx0IGJyb3dzZXIgcHJvdmlkZWQgbWVzc2FnZS5cbiAgICogQHBhcmFtICAge29iamVjdH0gIGVsICBUaGUgaW52YWxpZCBpbnB1dCBlbGVtZW50XG4gICAqIEByZXR1cm4gIHtjbGFzc30gICAgICAgVGhlIGZvcm0gY2xhc3NcbiAgICovXG4gIGhpZ2hsaWdodChlbCkge1xuICAgIGxldCBjb250YWluZXIgPSAodGhpcy5zZWxlY3RvcnMuRVJST1JfTUVTU0FHRV9QQVJFTlQpXG4gICAgICA/IGVsLmNsb3Nlc3QodGhpcy5zZWxlY3RvcnMuRVJST1JfTUVTU0FHRV9QQVJFTlQpIDogZWwucGFyZW50Tm9kZTtcblxuICAgIC8vIENyZWF0ZSB0aGUgbmV3IGVycm9yIG1lc3NhZ2UuXG4gICAgbGV0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMubWFya3VwLkVSUk9SX01FU1NBR0UpO1xuICAgIGxldCBpZCA9IGAke2VsLmdldEF0dHJpYnV0ZSgnaWQnKX0tJHt0aGlzLmNsYXNzZXMuRVJST1JfTUVTU0FHRX1gO1xuXG4gICAgLy8gR2V0IHRoZSBlcnJvciBtZXNzYWdlIGZyb20gbG9jYWxpemVkIHN0cmluZ3MgKGlmIHNldCkuXG4gICAgaWYgKGVsLnZhbGlkaXR5LnZhbHVlTWlzc2luZyAmJiB0aGlzLnN0cmluZ3MuVkFMSURfUkVRVUlSRUQpXG4gICAgICBtZXNzYWdlLmlubmVySFRNTCA9IHRoaXMuc3RyaW5ncy5WQUxJRF9SRVFVSVJFRDtcbiAgICBlbHNlIGlmICghZWwudmFsaWRpdHkudmFsaWQgJiZcbiAgICAgIHRoaXMuc3RyaW5nc1tgVkFMSURfJHtlbC50eXBlLnRvVXBwZXJDYXNlKCl9X0lOVkFMSURgXSkge1xuICAgICAgbGV0IHN0cmluZ0tleSA9IGBWQUxJRF8ke2VsLnR5cGUudG9VcHBlckNhc2UoKX1fSU5WQUxJRGA7XG4gICAgICBtZXNzYWdlLmlubmVySFRNTCA9IHRoaXMuc3RyaW5nc1tzdHJpbmdLZXldO1xuICAgIH0gZWxzZVxuICAgICAgbWVzc2FnZS5pbm5lckhUTUwgPSBlbC52YWxpZGF0aW9uTWVzc2FnZTtcblxuICAgIC8vIFNldCBhcmlhIGF0dHJpYnV0ZXMgYW5kIGNzcyBjbGFzc2VzIHRvIHRoZSBtZXNzYWdlXG4gICAgbWVzc2FnZS5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuICAgIG1lc3NhZ2Uuc2V0QXR0cmlidXRlKHRoaXMuYXR0cnMuRVJST1JfTUVTU0FHRVswXSxcbiAgICAgIHRoaXMuYXR0cnMuRVJST1JfTUVTU0FHRVsxXSk7XG4gICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKHRoaXMuY2xhc3Nlcy5FUlJPUl9NRVNTQUdFKTtcblxuICAgIC8vIEFkZCB0aGUgZXJyb3IgY2xhc3MgYW5kIGVycm9yIG1lc3NhZ2UgdG8gdGhlIGRvbS5cbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCh0aGlzLmNsYXNzZXMuRVJST1JfQ09OVEFJTkVSKTtcbiAgICBjb250YWluZXIuaW5zZXJ0QmVmb3JlKG1lc3NhZ2UsIGNvbnRhaW5lci5jaGlsZE5vZGVzWzBdKTtcblxuICAgIC8vIEFkZCB0aGUgZXJyb3IgY2xhc3MgdG8gdGhlIGZvcm1cbiAgICBjb250YWluZXIuY2xvc2VzdCgnZm9ybScpLmNsYXNzTGlzdC5hZGQodGhpcy5jbGFzc2VzLkVSUk9SX0NPTlRBSU5FUik7XG5cbiAgICAvLyBBZGQgZHluYW1pYyBhdHRyaWJ1dGVzIHRvIHRoZSBpbnB1dFxuICAgIGVsLnNldEF0dHJpYnV0ZSh0aGlzLmF0dHJzLkVSUk9SX0lOUFVUWzBdLCB0aGlzLmF0dHJzLkVSUk9SX0lOUFVUWzFdKTtcbiAgICBlbC5zZXRBdHRyaWJ1dGUodGhpcy5hdHRycy5FUlJPUl9MQUJFTCwgaWQpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGRpY3Rpb25haXJ5IG9mIHN0cmluZ3MgaW4gdGhlIGZvcm1hdC5cbiAqIHtcbiAqICAgJ1ZBTElEX1JFUVVJUkVEJzogJ1RoaXMgaXMgcmVxdWlyZWQnLFxuICogICAnVkFMSURfe3sgVFlQRSB9fV9JTlZBTElEJzogJ0ludmFsaWQnXG4gKiB9XG4gKi9cbkZvcm1zLnN0cmluZ3MgPSB7fTtcblxuLyoqIFBsYWNlaG9sZGVyIGZvciB0aGUgc3VibWl0IGZ1bmN0aW9uICovXG5Gb3Jtcy5zdWJtaXQgPSBmdW5jdGlvbigpIHt9O1xuXG4vKiogQ2xhc3NlcyBmb3IgdmFyaW91cyBjb250YWluZXJzICovXG5Gb3Jtcy5jbGFzc2VzID0ge1xuICAnRVJST1JfTUVTU0FHRSc6ICdlcnJvci1tZXNzYWdlJywgLy8gZXJyb3IgY2xhc3MgZm9yIHRoZSB2YWxpZGl0eSBtZXNzYWdlXG4gICdFUlJPUl9DT05UQUlORVInOiAnZXJyb3InLCAvLyBjbGFzcyBmb3IgdGhlIHZhbGlkaXR5IG1lc3NhZ2UgcGFyZW50XG4gICdFUlJPUl9GT1JNJzogJ2Vycm9yJ1xufTtcblxuLyoqIEhUTUwgdGFncyBhbmQgbWFya3VwIGZvciB2YXJpb3VzIGVsZW1lbnRzICovXG5Gb3Jtcy5tYXJrdXAgPSB7XG4gICdFUlJPUl9NRVNTQUdFJzogJ2RpdicsXG59O1xuXG4vKiogRE9NIFNlbGVjdG9ycyBmb3IgdmFyaW91cyBlbGVtZW50cyAqL1xuRm9ybXMuc2VsZWN0b3JzID0ge1xuICAnUkVRVUlSRUQnOiAnW3JlcXVpcmVkPVwidHJ1ZVwiXScsIC8vIFNlbGVjdG9yIGZvciByZXF1aXJlZCBpbnB1dCBlbGVtZW50c1xuICAnRVJST1JfTUVTU0FHRV9QQVJFTlQnOiBmYWxzZVxufTtcblxuLyoqIEF0dHJpYnV0ZXMgZm9yIHZhcmlvdXMgZWxlbWVudHMgKi9cbkZvcm1zLmF0dHJzID0ge1xuICAnRVJST1JfTUVTU0FHRSc6IFsnYXJpYS1saXZlJywgJ3BvbGl0ZSddLCAvLyBBdHRyaWJ1dGUgZm9yIHZhbGlkIGVycm9yIG1lc3NhZ2VcbiAgJ0VSUk9SX0lOUFVUJzogWydhcmlhLWludmFsaWQnLCAndHJ1ZSddLFxuICAnRVJST1JfTEFCRUwnOiAnYXJpYS1kZXNjcmliZWRieSdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEZvcm1zO1xuIiwidmFyIGU9L14oPzpzdWJtaXR8YnV0dG9ufGltYWdlfHJlc2V0fGZpbGUpJC9pLHQ9L14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWF8a2V5Z2VuKS9pLG49LyhcXFtbXlxcW1xcXV0qXFxdKS9nO2Z1bmN0aW9uIGEoZSx0LGEpe2lmKHQubWF0Y2gobikpIWZ1bmN0aW9uIGUodCxuLGEpe2lmKDA9PT1uLmxlbmd0aClyZXR1cm4gYTt2YXIgcj1uLnNoaWZ0KCksbD1yLm1hdGNoKC9eXFxbKC4rPylcXF0kLyk7aWYoXCJbXVwiPT09cilyZXR1cm4gdD10fHxbXSxBcnJheS5pc0FycmF5KHQpP3QucHVzaChlKG51bGwsbixhKSk6KHQuX3ZhbHVlcz10Ll92YWx1ZXN8fFtdLHQuX3ZhbHVlcy5wdXNoKGUobnVsbCxuLGEpKSksdDtpZihsKXt2YXIgaT1sWzFdLHU9K2k7aXNOYU4odSk/KHQ9dHx8e30pW2ldPWUodFtpXSxuLGEpOih0PXR8fFtdKVt1XT1lKHRbdV0sbixhKX1lbHNlIHRbcl09ZSh0W3JdLG4sYSk7cmV0dXJuIHR9KGUsZnVuY3Rpb24oZSl7dmFyIHQ9W10sYT1uZXcgUmVnRXhwKG4pLHI9L14oW15cXFtcXF1dKikvLmV4ZWMoZSk7Zm9yKHJbMV0mJnQucHVzaChyWzFdKTtudWxsIT09KHI9YS5leGVjKGUpKTspdC5wdXNoKHJbMV0pO3JldHVybiB0fSh0KSxhKTtlbHNle3ZhciByPWVbdF07cj8oQXJyYXkuaXNBcnJheShyKXx8KGVbdF09W3JdKSxlW3RdLnB1c2goYSkpOmVbdF09YX1yZXR1cm4gZX1mdW5jdGlvbiByKGUsdCxuKXtyZXR1cm4gbj0obj1TdHJpbmcobikpLnJlcGxhY2UoLyhcXHIpP1xcbi9nLFwiXFxyXFxuXCIpLG49KG49ZW5jb2RlVVJJQ29tcG9uZW50KG4pKS5yZXBsYWNlKC8lMjAvZyxcIitcIiksZSsoZT9cIiZcIjpcIlwiKStlbmNvZGVVUklDb21wb25lbnQodCkrXCI9XCIrbn1leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuLGwpe1wib2JqZWN0XCIhPXR5cGVvZiBsP2w9e2hhc2g6ISFsfTp2b2lkIDA9PT1sLmhhc2gmJihsLmhhc2g9ITApO2Zvcih2YXIgaT1sLmhhc2g/e306XCJcIix1PWwuc2VyaWFsaXplcnx8KGwuaGFzaD9hOnIpLHM9biYmbi5lbGVtZW50cz9uLmVsZW1lbnRzOltdLGM9T2JqZWN0LmNyZWF0ZShudWxsKSxvPTA7bzxzLmxlbmd0aDsrK28pe3ZhciBoPXNbb107aWYoKGwuZGlzYWJsZWR8fCFoLmRpc2FibGVkKSYmaC5uYW1lJiZ0LnRlc3QoaC5ub2RlTmFtZSkmJiFlLnRlc3QoaC50eXBlKSl7dmFyIHA9aC5uYW1lLGY9aC52YWx1ZTtpZihcImNoZWNrYm94XCIhPT1oLnR5cGUmJlwicmFkaW9cIiE9PWgudHlwZXx8KGguY2hlY2tlZD9cIm9uXCI9PT1oLnZhbHVlP2Y9ITA6XCJvZmZcIj09PWgudmFsdWUmJihmPSExKTpmPXZvaWQgMCksbC5lbXB0eSl7aWYoXCJjaGVja2JveFwiIT09aC50eXBlfHxoLmNoZWNrZWR8fChmPSExKSxcInJhZGlvXCI9PT1oLnR5cGUmJihjW2gubmFtZV18fGguY2hlY2tlZD9oLmNoZWNrZWQmJihjW2gubmFtZV09ITApOmNbaC5uYW1lXT0hMSksbnVsbD09ZiYmXCJyYWRpb1wiPT1oLnR5cGUpY29udGludWV9ZWxzZSBpZighZiljb250aW51ZTtpZihcInNlbGVjdC1tdWx0aXBsZVwiIT09aC50eXBlKWk9dShpLHAsZik7ZWxzZXtmPVtdO2Zvcih2YXIgdj1oLm9wdGlvbnMsbT0hMSxkPTA7ZDx2Lmxlbmd0aDsrK2Qpe3ZhciB5PXZbZF07eS5zZWxlY3RlZCYmKHkudmFsdWV8fGwuZW1wdHkmJiF5LnZhbHVlKSYmKG09ITAsaT1sLmhhc2gmJlwiW11cIiE9PXAuc2xpY2UocC5sZW5ndGgtMik/dShpLHArXCJbXVwiLHkudmFsdWUpOnUoaSxwLHkudmFsdWUpKX0hbSYmbC5lbXB0eSYmKGk9dShpLHAsXCJcIikpfX19aWYobC5lbXB0eSlmb3IodmFyIHAgaW4gYyljW3BdfHwoaT11KGkscCxcIlwiKSk7cmV0dXJuIGl9XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5tanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBGb3JtcyBmcm9tICdAbnljb3Bwb3J0dW5pdHkvcHR0cm4tc2NyaXB0cy9zcmMvZm9ybXMvZm9ybXMnO1xuaW1wb3J0IHNlcmlhbGl6ZSBmcm9tICdmb3ItY2VyaWFsJztcblxuLyoqXG4gKiBAY2xhc3MgIFRoZSBOZXdzbGV0dGVyIG1vZHVsZVxuICovXG5jbGFzcyBOZXdzbGV0dGVyIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgZWxlbWVudCAgVGhlIE5ld3NsZXR0ZXIgRE9NIE9iamVjdFxuICAgKlxuICAgKiBAcmV0dXJuICB7Q2xhc3N9ICAgICAgICAgICAgVGhlIGluc3RhbnRpYXRlZCBOZXdzbGV0dGVyIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudCkge1xuICAgIHRoaXMuX2VsID0gZWxlbWVudDtcblxuICAgIHRoaXMua2V5cyA9IE5ld3NsZXR0ZXIua2V5cztcblxuICAgIHRoaXMuZW5kcG9pbnRzID0gTmV3c2xldHRlci5lbmRwb2ludHM7XG5cbiAgICB0aGlzLnNlbGVjdG9ycyA9IE5ld3NsZXR0ZXIuc2VsZWN0b3JzO1xuXG4gICAgdGhpcy5zZWxlY3RvciA9IE5ld3NsZXR0ZXIuc2VsZWN0b3I7XG5cbiAgICB0aGlzLnN0cmluZ0tleXMgPSBOZXdzbGV0dGVyLnN0cmluZ0tleXM7XG5cbiAgICB0aGlzLnN0cmluZ3MgPSBOZXdzbGV0dGVyLnN0cmluZ3M7XG5cbiAgICB0aGlzLnRlbXBsYXRlcyA9IE5ld3NsZXR0ZXIudGVtcGxhdGVzO1xuXG4gICAgdGhpcy5jbGFzc2VzID0gTmV3c2xldHRlci5jbGFzc2VzO1xuXG4gICAgdGhpcy5jYWxsYmFjayA9IFtcbiAgICAgIE5ld3NsZXR0ZXIuY2FsbGJhY2ssXG4gICAgICBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCkucmVwbGFjZSgnMC4nLCAnJylcbiAgICBdLmpvaW4oJycpO1xuXG4gICAgLy8gVGhpcyBzZXRzIHRoZSBzY3JpcHQgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYSBnbG9iYWwgZnVuY3Rpb24gdGhhdFxuICAgIC8vIGNhbiBiZSBhY2Nlc3NlZCBieSB0aGUgdGhlIHJlcXVlc3RlZCBzY3JpcHQuXG4gICAgd2luZG93W3RoaXMuY2FsbGJhY2tdID0gKGRhdGEpID0+IHtcbiAgICAgIHRoaXMuX2NhbGxiYWNrKGRhdGEpO1xuICAgIH07XG5cbiAgICB0aGlzLmZvcm0gPSBuZXcgRm9ybXModGhpcy5fZWwucXVlcnlTZWxlY3RvcignZm9ybScpKTtcblxuICAgIHRoaXMuZm9ybS5zdHJpbmdzID0gdGhpcy5zdHJpbmdzO1xuXG4gICAgdGhpcy5mb3JtLnN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5fc3VibWl0KGV2ZW50KVxuICAgICAgICAudGhlbih0aGlzLl9vbmxvYWQpXG4gICAgICAgIC5jYXRjaCh0aGlzLl9vbmVycm9yKTtcbiAgICB9O1xuXG4gICAgdGhpcy5mb3JtLndhdGNoKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZm9ybSBzdWJtaXNzaW9uIG1ldGhvZC4gUmVxdWVzdHMgYSBzY3JpcHQgd2l0aCBhIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqIHRvIGJlIGV4ZWN1dGVkIG9uIG91ciBwYWdlLiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gd2lsbCBiZSBwYXNzZWQgdGhlXG4gICAqIHJlc3BvbnNlIGFzIGEgSlNPTiBvYmplY3QgKGZ1bmN0aW9uIHBhcmFtZXRlcikuXG4gICAqXG4gICAqIEBwYXJhbSAgIHtFdmVudH0gICAgZXZlbnQgIFRoZSBmb3JtIHN1Ym1pc3Npb24gZXZlbnRcbiAgICpcbiAgICogQHJldHVybiAge1Byb21pc2V9ICAgICAgICAgQSBwcm9taXNlIGNvbnRhaW5pbmcgdGhlIG5ldyBzY3JpcHQgY2FsbFxuICAgKi9cbiAgX3N1Ym1pdChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBTZXJpYWxpemUgdGhlIGRhdGFcbiAgICB0aGlzLl9kYXRhID0gc2VyaWFsaXplKGV2ZW50LnRhcmdldCwge2hhc2g6IHRydWV9KTtcblxuICAgIC8vIFN3aXRjaCB0aGUgYWN0aW9uIHRvIHBvc3QtanNvbi4gVGhpcyBjcmVhdGVzIGFuIGVuZHBvaW50IGZvciBtYWlsY2hpbXBcbiAgICAvLyB0aGF0IGFjdHMgYXMgYSBzY3JpcHQgdGhhdCBjYW4gYmUgbG9hZGVkIG9udG8gb3VyIHBhZ2UuXG4gICAgbGV0IGFjdGlvbiA9IGV2ZW50LnRhcmdldC5hY3Rpb24ucmVwbGFjZShcbiAgICAgIGAke3RoaXMuZW5kcG9pbnRzLk1BSU59P2AsIGAke3RoaXMuZW5kcG9pbnRzLk1BSU5fSlNPTn0/YFxuICAgICk7XG5cbiAgICAvLyBBZGQgb3VyIHBhcmFtcyB0byB0aGUgYWN0aW9uXG4gICAgYWN0aW9uID0gYWN0aW9uICsgc2VyaWFsaXplKGV2ZW50LnRhcmdldCwge3NlcmlhbGl6ZXI6ICguLi5wYXJhbXMpID0+IHtcbiAgICAgIGxldCBwcmV2ID0gKHR5cGVvZiBwYXJhbXNbMF0gPT09ICdzdHJpbmcnKSA/IHBhcmFtc1swXSA6ICcnO1xuXG4gICAgICByZXR1cm4gYCR7cHJldn0mJHtwYXJhbXNbMV19PSR7cGFyYW1zWzJdfWA7XG4gICAgfX0pO1xuXG4gICAgLy8gQXBwZW5kIHRoZSBjYWxsYmFjayByZWZlcmVuY2UuIE1haWxjaGltcCB3aWxsIHdyYXAgdGhlIEpTT04gcmVzcG9uc2UgaW5cbiAgICAvLyBvdXIgY2FsbGJhY2sgbWV0aG9kLiBPbmNlIHdlIGxvYWQgdGhlIHNjcmlwdCB0aGUgY2FsbGJhY2sgd2lsbCBleGVjdXRlLlxuICAgIGFjdGlvbiA9IGAke2FjdGlvbn0mYz13aW5kb3cuJHt0aGlzLmNhbGxiYWNrfWA7XG5cbiAgICAvLyBDcmVhdGUgYSBwcm9taXNlIHRoYXQgYXBwZW5kcyB0aGUgc2NyaXB0IHJlc3BvbnNlIG9mIHRoZSBwb3N0LWpzb24gbWV0aG9kXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICBzY3JpcHQub25sb2FkID0gcmVzb2x2ZTtcbiAgICAgIHNjcmlwdC5vbmVycm9yID0gcmVqZWN0O1xuICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgICAgIHNjcmlwdC5zcmMgPSBlbmNvZGVVUkkoYWN0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc2NyaXB0IG9ubG9hZCByZXNvbHV0aW9uXG4gICAqXG4gICAqIEBwYXJhbSAgIHtFdmVudH0gIGV2ZW50ICBUaGUgc2NyaXB0IG9uIGxvYWQgZXZlbnRcbiAgICpcbiAgICogQHJldHVybiAge0NsYXNzfSAgICAgICAgIFRoZSBOZXdzbGV0dGVyIGNsYXNzXG4gICAqL1xuICBfb25sb2FkKGV2ZW50KSB7XG4gICAgZXZlbnQucGF0aFswXS5yZW1vdmUoKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzY3JpcHQgb24gZXJyb3IgcmVzb2x1dGlvblxuICAgKlxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgZXJyb3IgIFRoZSBzY3JpcHQgb24gZXJyb3IgbG9hZCBldmVudFxuICAgKlxuICAgKiBAcmV0dXJuICB7Q2xhc3N9ICAgICAgICAgIFRoZSBOZXdzbGV0dGVyIGNsYXNzXG4gICAqL1xuICBfb25lcnJvcihlcnJvcikge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIGNvbnNvbGUuZGlyKGVycm9yKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayBmdW5jdGlvbiBmb3IgdGhlIE1haWxDaGltcCBTY3JpcHQgY2FsbFxuICAgKlxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgZGF0YSAgVGhlIHN1Y2Nlc3MvZXJyb3IgbWVzc2FnZSBmcm9tIE1haWxDaGltcFxuICAgKlxuICAgKiBAcmV0dXJuICB7Q2xhc3N9ICAgICAgICBUaGUgTmV3c2xldHRlciBjbGFzc1xuICAgKi9cbiAgX2NhbGxiYWNrKGRhdGEpIHtcbiAgICBpZiAodGhpc1tgXyR7ZGF0YVt0aGlzLl9rZXkoJ01DX1JFU1VMVCcpXX1gXSkge1xuICAgICAgdGhpc1tgXyR7ZGF0YVt0aGlzLl9rZXkoJ01DX1JFU1VMVCcpXX1gXShkYXRhLm1zZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgY29uc29sZS5kaXIoZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU3VibWlzc2lvbiBlcnJvciBoYW5kbGVyXG4gICAqXG4gICAqIEBwYXJhbSAgIHtzdHJpbmd9ICBtc2cgIFRoZSBlcnJvciBtZXNzYWdlXG4gICAqXG4gICAqIEByZXR1cm4gIHtDbGFzc30gICAgICAgIFRoZSBOZXdzbGV0dGVyIGNsYXNzXG4gICAqL1xuICBfZXJyb3IobXNnKSB7XG4gICAgdGhpcy5fZWxlbWVudHNSZXNldCgpO1xuICAgIHRoaXMuX21lc3NhZ2luZygnV0FSTklORycsIG1zZyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJtaXNzaW9uIHN1Y2Nlc3MgaGFuZGxlclxuICAgKlxuICAgKiBAcGFyYW0gICB7c3RyaW5nfSAgbXNnICBUaGUgc3VjY2VzcyBtZXNzYWdlXG4gICAqXG4gICAqIEByZXR1cm4gIHtDbGFzc30gICAgICAgIFRoZSBOZXdzbGV0dGVyIGNsYXNzXG4gICAqL1xuICBfc3VjY2Vzcyhtc2cpIHtcbiAgICB0aGlzLl9lbGVtZW50c1Jlc2V0KCk7XG4gICAgdGhpcy5fbWVzc2FnaW5nKCdTVUNDRVNTJywgbXNnKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXNlbnQgdGhlIHJlc3BvbnNlIG1lc3NhZ2UgdG8gdGhlIHVzZXJcbiAgICpcbiAgICogQHBhcmFtICAge1N0cmluZ30gIHR5cGUgIFRoZSBtZXNzYWdlIHR5cGVcbiAgICogQHBhcmFtICAge1N0cmluZ30gIG1zZyAgIFRoZSBtZXNzYWdlXG4gICAqXG4gICAqIEByZXR1cm4gIHtDbGFzc30gICAgICAgICBOZXdzbGV0dGVyXG4gICAqL1xuICBfbWVzc2FnaW5nKHR5cGUsIG1zZyA9ICdubyBtZXNzYWdlJykge1xuICAgIGxldCBzdHJpbmdzID0gT2JqZWN0LmtleXModGhpcy5zdHJpbmdLZXlzKTtcbiAgICBsZXQgaGFuZGxlZCA9IGZhbHNlO1xuXG4gICAgbGV0IGFsZXJ0Qm94ID0gdGhpcy5fZWwucXVlcnlTZWxlY3Rvcih0aGlzLnNlbGVjdG9yc1t0eXBlXSk7XG5cbiAgICBsZXQgYWxlcnRCb3hNc2cgPSBhbGVydEJveC5xdWVyeVNlbGVjdG9yKFxuICAgICAgdGhpcy5zZWxlY3RvcnMuQUxFUlRfVEVYVFxuICAgICk7XG5cbiAgICAvLyBHZXQgdGhlIGxvY2FsaXplZCBzdHJpbmcsIHRoZXNlIHNob3VsZCBiZSB3cml0dGVuIHRvIHRoZSBET00gYWxyZWFkeS5cbiAgICAvLyBUaGUgdXRpbGl0eSBjb250YWlucyBhIGdsb2JhbCBtZXRob2QgZm9yIHJldHJpZXZpbmcgdGhlbS5cbiAgICBsZXQgc3RyaW5nS2V5cyA9IHN0cmluZ3MuZmlsdGVyKHMgPT4gbXNnLmluY2x1ZGVzKHRoaXMuc3RyaW5nS2V5c1tzXSkpO1xuICAgIG1zZyA9IChzdHJpbmdLZXlzLmxlbmd0aCkgPyB0aGlzLnN0cmluZ3Nbc3RyaW5nS2V5c1swXV0gOiBtc2c7XG4gICAgaGFuZGxlZCA9IChzdHJpbmdLZXlzLmxlbmd0aCkgPyB0cnVlIDogZmFsc2U7XG5cbiAgICAvLyBSZXBsYWNlIHN0cmluZyB0ZW1wbGF0ZXMgd2l0aCB2YWx1ZXMgZnJvbSBlaXRoZXIgb3VyIGZvcm0gZGF0YSBvclxuICAgIC8vIHRoZSBOZXdzbGV0dGVyIHN0cmluZ3Mgb2JqZWN0LlxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy50ZW1wbGF0ZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGVzW3hdO1xuICAgICAgbGV0IGtleSA9IHRlbXBsYXRlLnJlcGxhY2UoJ3t7ICcsICcnKS5yZXBsYWNlKCcgfX0nLCAnJyk7XG4gICAgICBsZXQgdmFsdWUgPSB0aGlzLl9kYXRhW2tleV0gfHwgdGhpcy5zdHJpbmdzW2tleV07XG4gICAgICBsZXQgcmVnID0gbmV3IFJlZ0V4cCh0ZW1wbGF0ZSwgJ2dpJyk7XG5cbiAgICAgIG1zZyA9IG1zZy5yZXBsYWNlKHJlZywgKHZhbHVlKSA/IHZhbHVlIDogJycpO1xuICAgIH1cblxuICAgIGlmIChoYW5kbGVkKSB7XG4gICAgICBhbGVydEJveE1zZy5pbm5lckhUTUwgPSBtc2c7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnRVJST1InKSB7XG4gICAgICBhbGVydEJveE1zZy5pbm5lckhUTUwgPSB0aGlzLnN0cmluZ3MuRVJSX1BMRUFTRV9UUllfTEFURVI7XG4gICAgfVxuXG4gICAgaWYgKGFsZXJ0Qm94KSB0aGlzLl9lbGVtZW50U2hvdyhhbGVydEJveCwgYWxlcnRCb3hNc2cpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG1haW4gdG9nZ2xpbmcgbWV0aG9kXG4gICAqXG4gICAqIEByZXR1cm4gIHtDbGFzc30gIE5ld3NsZXR0ZXJcbiAgICovXG4gIF9lbGVtZW50c1Jlc2V0KCkge1xuICAgIGxldCB0YXJnZXRzID0gdGhpcy5fZWwucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNlbGVjdG9ycy5BTEVSVFMpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXJnZXRzLmxlbmd0aDsgaSsrKVxuICAgICAgaWYgKCF0YXJnZXRzW2ldLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLmNsYXNzZXMuSElEREVOKSkge1xuICAgICAgICB0YXJnZXRzW2ldLmNsYXNzTGlzdC5hZGQodGhpcy5jbGFzc2VzLkhJRERFTik7XG5cbiAgICAgICAgdGhpcy5jbGFzc2VzLkFOSU1BVEUuc3BsaXQoJyAnKS5mb3JFYWNoKChpdGVtKSA9PlxuICAgICAgICAgIHRhcmdldHNbaV0uY2xhc3NMaXN0LnJlbW92ZShpdGVtKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIFNjcmVlbiBSZWFkZXJzXG4gICAgICAgIHRhcmdldHNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgIHRhcmdldHNbaV0ucXVlcnlTZWxlY3Rvcih0aGlzLnNlbGVjdG9ycy5BTEVSVF9URVhUKVxuICAgICAgICAgIC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdvZmYnKTtcbiAgICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBtYWluIHRvZ2dsaW5nIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0gICB7b2JqZWN0fSAgdGFyZ2V0ICAgTWVzc2FnZSBjb250YWluZXJcbiAgICogQHBhcmFtICAge29iamVjdH0gIGNvbnRlbnQgIENvbnRlbnQgdGhhdCBjaGFuZ2VzIGR5bmFtaWNhbGx5IHRoYXQgc2hvdWxkXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZSBhbm5vdW5jZWQgdG8gc2NyZWVuIHJlYWRlcnMuXG4gICAqXG4gICAqIEByZXR1cm4gIHtDbGFzc30gICAgICAgICAgICBOZXdzbGV0dGVyXG4gICAqL1xuICBfZWxlbWVudFNob3codGFyZ2V0LCBjb250ZW50KSB7XG4gICAgdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUodGhpcy5jbGFzc2VzLkhJRERFTik7XG5cbiAgICB0aGlzLmNsYXNzZXMuQU5JTUFURS5zcGxpdCgnICcpLmZvckVhY2goKGl0ZW0pID0+XG4gICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZShpdGVtKVxuICAgICk7XG5cbiAgICAvLyBTY3JlZW4gUmVhZGVyc1xuICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICBpZiAoY29udGVudCkge1xuICAgICAgY29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdwb2xpdGUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHByb3h5IGZ1bmN0aW9uIGZvciByZXRyaWV2aW5nIHRoZSBwcm9wZXIga2V5XG4gICAqXG4gICAqIEBwYXJhbSAgIHtzdHJpbmd9ICBrZXkgIFRoZSByZWZlcmVuY2UgZm9yIHRoZSBzdG9yZWQga2V5cy5cbiAgICpcbiAgICogQHJldHVybiAge3N0cmluZ30gICAgICAgVGhlIGRlc2lyZWQga2V5LlxuICAgKi9cbiAgX2tleShrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5rZXlzW2tleV07XG4gIH1cbn1cblxuLyoqIEB0eXBlICB7T2JqZWN0fSAgQVBJIGRhdGEga2V5cyAqL1xuTmV3c2xldHRlci5rZXlzID0ge1xuICBNQ19SRVNVTFQ6ICdyZXN1bHQnLFxuICBNQ19NU0c6ICdtc2cnXG59O1xuXG4vKiogQHR5cGUgIHtPYmplY3R9ICBBUEkgZW5kcG9pbnRzICovXG5OZXdzbGV0dGVyLmVuZHBvaW50cyA9IHtcbiAgTUFJTjogJy9wb3N0JyxcbiAgTUFJTl9KU09OOiAnL3Bvc3QtanNvbidcbn07XG5cbi8qKiBAdHlwZSAge1N0cmluZ30gIFRoZSBNYWlsY2hpbXAgY2FsbGJhY2sgcmVmZXJlbmNlLiAqL1xuTmV3c2xldHRlci5jYWxsYmFjayA9ICdOZXdzbGV0dGVyQ2FsbGJhY2snO1xuXG4vKiogQHR5cGUgIHtPYmplY3R9ICBET00gc2VsZWN0b3JzIGZvciB0aGUgaW5zdGFuY2UncyBjb25jZXJucyAqL1xuTmV3c2xldHRlci5zZWxlY3RvcnMgPSB7XG4gIEVMRU1FTlQ6ICdbZGF0YS1qcz1cIm5ld3NsZXR0ZXJcIl0nLFxuICBBTEVSVFM6ICdbZGF0YS1qcyo9XCJhbGVydFwiXScsXG4gIFdBUk5JTkc6ICdbZGF0YS1qcz1cImFsZXJ0LXdhcm5pbmdcIl0nLFxuICBTVUNDRVNTOiAnW2RhdGEtanM9XCJhbGVydC1zdWNjZXNzXCJdJyxcbiAgQUxFUlRfVEVYVDogJ1tkYXRhLWpzLWFsZXJ0PVwidGV4dFwiXSdcbn07XG5cbi8qKiBAdHlwZSAge1N0cmluZ30gIFRoZSBtYWluIERPTSBzZWxlY3RvciBmb3IgdGhlIGluc3RhbmNlICovXG5OZXdzbGV0dGVyLnNlbGVjdG9yID0gTmV3c2xldHRlci5zZWxlY3RvcnMuRUxFTUVOVDtcblxuLyoqIEB0eXBlICB7T2JqZWN0fSAgU3RyaW5nIHJlZmVyZW5jZXMgZm9yIHRoZSBpbnN0YW5jZSAqL1xuTmV3c2xldHRlci5zdHJpbmdLZXlzID0ge1xuICBTVUNDRVNTX0NPTkZJUk1fRU1BSUw6ICdBbG1vc3QgZmluaXNoZWQuLi4nLFxuICBFUlJfUExFQVNFX0VOVEVSX1ZBTFVFOiAnUGxlYXNlIGVudGVyIGEgdmFsdWUnLFxuICBFUlJfVE9PX01BTllfUkVDRU5UOiAndG9vIG1hbnknLFxuICBFUlJfQUxSRUFEWV9TVUJTQ1JJQkVEOiAnaXMgYWxyZWFkeSBzdWJzY3JpYmVkJyxcbiAgRVJSX0lOVkFMSURfRU1BSUw6ICdsb29rcyBmYWtlIG9yIGludmFsaWQnXG59O1xuXG4vKiogQHR5cGUgIHtPYmplY3R9ICBBdmFpbGFibGUgc3RyaW5ncyAqL1xuTmV3c2xldHRlci5zdHJpbmdzID0ge1xuICBWQUxJRF9SRVFVSVJFRDogJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQuJyxcbiAgVkFMSURfRU1BSUxfUkVRVUlSRUQ6ICdFbWFpbCBpcyByZXF1aXJlZC4nLFxuICBWQUxJRF9FTUFJTF9JTlZBTElEOiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwuJyxcbiAgVkFMSURfQ0hFQ0tCT1hfQk9ST1VHSDogJ1BsZWFzZSBzZWxlY3QgYSBib3JvdWdoLicsXG4gIEVSUl9QTEVBU0VfVFJZX0xBVEVSOiAnVGhlcmUgd2FzIGFuIGVycm9yIHdpdGggeW91ciBzdWJtaXNzaW9uLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicsXG4gIFNVQ0NFU1NfQ09ORklSTV9FTUFJTDogJ0FsbW9zdCBmaW5pc2hlZC4uLiBXZSBuZWVkIHRvIGNvbmZpcm0geW91ciBlbWFpbCAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnYWRkcmVzcy4gVG8gY29tcGxldGUgdGhlIHN1YnNjcmlwdGlvbiBwcm9jZXNzLCAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAncGxlYXNlIGNsaWNrIHRoZSBsaW5rIGluIHRoZSBlbWFpbCB3ZSBqdXN0IHNlbnQgeW91LicsXG4gIEVSUl9QTEVBU0VfRU5URVJfVkFMVUU6ICdQbGVhc2UgZW50ZXIgYSB2YWx1ZScsXG4gIEVSUl9UT09fTUFOWV9SRUNFTlQ6ICdSZWNpcGllbnQgXCJ7eyBFTUFJTCB9fVwiIGhhcyB0b28gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICdtYW55IHJlY2VudCBzaWdudXAgcmVxdWVzdHMnLFxuICBFUlJfQUxSRUFEWV9TVUJTQ1JJQkVEOiAne3sgRU1BSUwgfX0gaXMgYWxyZWFkeSBzdWJzY3JpYmVkICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAndG8gbGlzdCB7eyBMSVNUX05BTUUgfX0uJyxcbiAgRVJSX0lOVkFMSURfRU1BSUw6ICdUaGlzIGVtYWlsIGFkZHJlc3MgbG9va3MgZmFrZSBvciBpbnZhbGlkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICdQbGVhc2UgZW50ZXIgYSByZWFsIGVtYWlsIGFkZHJlc3MuJyxcbiAgTElTVF9OQU1FOiAnTmV3c2xldHRlcidcbn07XG5cbi8qKiBAdHlwZSAge0FycmF5fSAgUGxhY2Vob2xkZXJzIHRoYXQgd2lsbCBiZSByZXBsYWNlZCBpbiBtZXNzYWdlIHN0cmluZ3MgKi9cbk5ld3NsZXR0ZXIudGVtcGxhdGVzID0gW1xuICAne3sgRU1BSUwgfX0nLFxuICAne3sgTElTVF9OQU1FIH19J1xuXTtcblxuTmV3c2xldHRlci5jbGFzc2VzID0ge1xuICBBTklNQVRFOiAnYW5pbWF0ZWQgZmFkZUluVXAnLFxuICBISURERU46ICdoaWRkZW4nXG59O1xuXG5leHBvcnQgZGVmYXVsdCBOZXdzbGV0dGVyO1xuIiwiLyoqXG4gKiBOZXdzbGV0dGVyXG4gKlxuICogQGF1dGhvciBOWUMgT3Bwb3J0dW5pdHlcbiAqL1xuXG4vKipcbiAqIERlcGVuZGVuY2llc1xuICovXG5cbmltcG9ydCBOZXdzbGV0dGVyIGZyb20gJ0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy9uZXdzbGV0dGVyL25ld3NsZXR0ZXInO1xuXG4vKipcbiAqIEluaXRcbiAqL1xuXG4vKipcbiAqIE5ld3NsZXR0ZXIgRm9ybVxuICovXG4oZWxlbWVudCA9PiB7XG4gIGxldCBuZXdzbGV0dGVyID0gbnVsbDtcblxuICBpZiAoZWxlbWVudCkge1xuICAgIGxldCBzdWJtaXQgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1t0eXBlPXN1Ym1pdF0nKTtcbiAgICBsZXQgZXJyb3IgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWpzPVwiYWxlcnQtZXJyb3JcIl0nKVxuXG4gICAgbmV3c2xldHRlciA9IG5ldyBOZXdzbGV0dGVyKGVsZW1lbnQpO1xuICAgIG5ld3NsZXR0ZXIuZm9ybS5zZWxlY3RvcnMuRVJST1JfTUVTU0FHRV9QQVJFTlQgPSAnLmMtcXVlc3Rpb25fX2NvbnRhaW5lcic7XG5cbiAgICAvLyBkaXNwbGF5IGVycm9yIG9uIGludmFsaWQgZm9ybVxuICAgIHN1Ym1pdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHJlc3BvbnNlID09IG51bGwpIHtcbiAgICAgICAgZXJyb3Iuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXG4gICAgICAgIGVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGxldCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICBsZXQgcmVzcG9uc2UgPSBwYXJhbXMuZ2V0KCdyZXNwb25zZScpO1xuICBsZXQgcmVzID0gL14oKFtePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSsoXFwuW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKykqKXwoXCIuK1wiKSlAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFxdKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkLztcblxuICBpZiAocmVzcG9uc2UgJiYgbmV3c2xldHRlcikge1xuICAgIGxldCBlbWFpbCA9IHBhcmFtcy5nZXQoJ2VtYWlsJyk7XG4gICAgbGV0IGlucHV0ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiRU1BSUxcIl0nKTtcblxuICAgIGlmIChyZXMudGVzdChTdHJpbmcoZW1haWwpLnRvTG93ZXJDYXNlKCkpKVxuICAgICAgaW5wdXQudmFsdWUgPSBlbWFpbDtcblxuICAgIG5ld3NsZXR0ZXIuX2RhdGEgPSB7XG4gICAgICAncmVzdWx0JzogcGFyYW1zLmdldCgncmVzdWx0JyksXG4gICAgICAnbXNnJzogcGFyYW1zLmdldCgnbXNnJyksXG4gICAgICAnRU1BSUwnOiBlbWFpbFxuICAgIH07XG5cbiAgICBuZXdzbGV0dGVyLl9jYWxsYmFjayhuZXdzbGV0dGVyLl9kYXRhKTtcbiAgfVxufSkoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtanM9XCJuZXdzbGV0dGVyLWZvcm1cIl0nKSk7XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLEtBQUssQ0FBQztFQUNaO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsRUFBRSxXQUFXLENBQUMsSUFBSSxHQUFHLEtBQUssRUFBRTtFQUM1QixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3JCO0VBQ0EsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7QUFDakM7RUFDQSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUMvQjtFQUNBLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQ2pDO0VBQ0EsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDL0I7RUFDQSxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztBQUNyQztFQUNBLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQzdCO0VBQ0EsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDL0M7RUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDO0VBQ2hCLEdBQUc7QUFDSDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLFVBQVUsQ0FBQyxLQUFLLEVBQUU7RUFDcEIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUM7RUFDdkQsTUFBTSxPQUFPO0FBQ2I7RUFDQSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQztFQUN0RCxNQUFNLE9BQU87QUFDYjtFQUNBLElBQUksSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztFQUMzRCxJQUFJLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNqRTtFQUNBLElBQUksTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSTtFQUM3QixRQUFRLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyx3QkFBd0IsQ0FBQztFQUNyRCxPQUFPO0VBQ1AsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDNUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQztFQUMxQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQjtFQUNBLElBQUksT0FBTyxNQUFNLENBQUM7RUFDbEIsR0FBRztBQUNIO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRTtFQUNmLElBQUksSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztFQUNoRCxJQUFJLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxRTtFQUNBLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7RUFDOUM7RUFDQSxNQUFNLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQjtFQUNBLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNyQjtFQUNBO0VBQ0EsTUFBTSxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVM7QUFDdEM7RUFDQSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDekIsS0FBSztBQUNMO0VBQ0EsSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUM7RUFDeEMsR0FBRztBQUNIO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsRUFBRSxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssRUFBRTtFQUN0QixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDMUM7RUFDQSxJQUFJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN2RTtFQUNBO0VBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtFQUM5QztFQUNBLE1BQU0sSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNCO0VBQ0EsTUFBTSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07RUFDekMs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QUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQWdCLGtCQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7O0VDS3p0RDtFQUNBO0VBQ0E7RUFDQSxNQUFNLFVBQVUsQ0FBQztFQUNqQjtFQUNBO0VBQ0E7RUFDQTtFQUNB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SDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsRUFBRSxRQUFRLENBQUMsR0FBRyxFQUFFO0VBQ2hCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0VBQzFCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDcEM7RUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDO0VBQ2hCLEdBQUc7QUFDSDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxHQUFHLFlBQVksRUFBRTtFQUN2QyxJQUFJLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0VBQy9DLElBQUksSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ3hCO0VBQ0EsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDaEU7RUFDQSxJQUFJLElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhO0VBQzVDLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVO0VBQy9CLEtBQUssQ0FBQztBQUNOO0VBQ0E7RUFDQTtFQUNBLElBQUksSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMzRSxJQUFJLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7RUFDbEUsSUFBSSxPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxJQUFJLElBQUksR0FBRyxL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
