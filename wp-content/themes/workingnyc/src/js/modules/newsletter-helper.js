'use strict';

// adapted from @nycopportunity/pttrn-scripts/src/newsletter/newsletter.js

import Forms from './forms';
import serialize from 'for-cerial';

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

      this._submit(event);
    };

    this.form.watch(false, true);

    this.form.validateSubmit();

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
    let domain= '';

    // Switch the action to post-json. This creates an endpoint for mailchimp
    // that acts as a script that can be loaded onto our page.
    let action = "/wp-json/api/v1/addUser";

    // Add our params to the action
    action = action + serialize(event.target, {serializer: (...params) => {
      let prev = (typeof params[0] === 'string') ? params[0] : '';

      return `${prev}&${params[1]}=${params[2]}`;
    }});

    action = domain+action.replace("addUser&","addUser?");

    // Append the callback reference. Mailchimp will wrap the JSON response in
    // our callback method. Once we load the script the callback will execute.
    //action = `${action}&c=window.${this.callback}`;

    // Create a promise that appends the script response of the post-json method

    fetch(`${domain}${action}`)
      .then(response => response.json())
      .then(d => {
        window[this.callback](d);
      })
      .catch(error => {
        console.error('Error:', error);
          throw error;
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
    if (process.env.NODE_ENV !== 'production') console.dir(error);

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
    if (data == 'success') {
      this._success(data);
    } else {
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV !== 'production') console.dir(data);
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

    if (msg.includes(this.stringKeys.ERR_ALREADY_SUBSCRIBED)) {
        this._messaging('ALREADY_SUBSCRIBED');
        return this;
    }

    // Use this message instead of the message from the Mailchimp API
    this._messaging('SUCCESS');

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
    let targets = this._el.querySelectorAll(this.selectors.ALERTS + ", " + this.selectors.FORM_FIELDS + ", " + this.selectors.SUBMIT);

    for (let i = 0; i < targets.length; i++) {
      if (!targets[i].classList.contains(this.classes.HIDDEN)) {
        targets[i].classList.add(this.classes.HIDDEN);

        this.classes.ANIMATE.split(' ').forEach((item) =>
          targets[i].classList.remove(item)
        );

        // Screen Readers
        targets[i].setAttribute('aria-hidden', 'true');
        if (targets[i].querySelector(this.selectors.ALERT_TEXT)) {
            targets[i].querySelector(this.selectors.ALERT_TEXT)
                .setAttribute('aria-live', 'off');
        }
      }
    }

    this._elementShow(this._el.querySelector(this.selectors.HOME_BUTTON));

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
  ALREADY_SUBSCRIBED: '[data-js="alert-already-subscribed"]',
  ALERT_TEXT: '[data-js-alert="text"]',
  FORM_FIELDS: '[data-js="form-fields"]',
  SUBMIT: '[type=submit]',
  HOME_BUTTON: '[data-js="home-button"]'
};

/** @type  {String}  The main DOM selector for the instance */
Newsletter.selector = Newsletter.selectors.ELEMENT;

/** @type  {Object}  String references for the instance */
Newsletter.stringKeys = {
  SUCCESS_CONFIRM_EMAIL: 'Almost finished...',
  ERR_PLEASE_ENTER_VALUE: 'Please enter a value',
  ERR_TOO_MANY_RECENT: 'too many',
  ERR_ALREADY_SUBSCRIBED: 'You\'re already subscribed',
  ERR_INVALID_EMAIL: 'looks fake or invalid'
};

/** @type  {Object}  Available strings */
Newsletter.strings = {
  VALID_REQUIRED: 'This field is required.',
  VALID_EMAIL_REQUIRED: 'Email is required.',
  VALID_EMAIL_INVALID: 'Please enter a valid email.',
  VALID_ZIPCODE_REQUIRED: 'ZIP code is required.',
  VALID_ZIPCODE_INVALID: 'Please enter a valid ZIP code.',
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

export default Newsletter;
