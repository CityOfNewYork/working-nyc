/**
 * Newsletter
 *
 * @author NYC Opportunity
 */

/**
 * Dependencies
 */

import Newsletter from '@nycopportunity/pttrn-scripts/src/newsletter/newsletter';
// import serialize from 'for-cerial';

// Find success message element
// Find error message element
// Find form element
// Find email element
// Find zipcode element
// Find submit element
// On submit: 
//  prevent default
//  validate email
//    if invalid, highlight email field
//  validate zipcode
//    if invalid, highlight zipcode field
//  if both valid, submit
//  Check response
//    If success, display success message
//    Else, display error message

/**
 * Init
 */

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Newsletter object copied and modified from NYC Opportunity pttrn-scripts Newsletter
// See @nycopportunity/pttrn-scripts/src/newsletter/newsletter


// /**
//  * @class  The Newsletter module
//  */
// class Newsletter {
//   /**
//    * @constructor
//    *
//    * @param   {Object}  element  The Newsletter DOM Object
//    *
//    * @return  {Class}            The instantiated Newsletter object
//    */
//   constructor(element) {
//     this._el = element;

//     this.keys = Newsletter.keys;

//     this.endpoints = Newsletter.endpoints;

//     this.selectors = Newsletter.selectors;

//     this.selector = Newsletter.selector;

//     this.stringKeys = Newsletter.stringKeys;

//     this.strings = Newsletter.strings;

//     this.templates = Newsletter.templates;

//     this.classes = Newsletter.classes;

//     this.callback = [
//       Newsletter.callback,
//       Math.random().toString().replace('0.', '')
//     ].join('');

//     // This sets the script callback function to a global function that
//     // can be accessed by the the requested script.
//     window[this.callback] = (data) => {
//       this._callback(data);
//     };

//     this.form = new Forms(this._el.querySelector('form'));

//     this.form.strings = this.strings;

//     this.form.submit = (event) => {
//       event.preventDefault();

//       this._submit(event)
//         .then(this._onload)
//         .catch(this._onerror);
//     };

//     this.form.watch();

//     return this;
//   }

//   /**
//    * The form submission method. Requests a script with a callback function
//    * to be executed on our page. The callback function will be passed the
//    * response as a JSON object (function parameter).
//    *
//    * @param   {Event}    event  The form submission event
//    *
//    * @return  {Promise}         A promise containing the new script call
//    */
//   _submit(event) {
//     event.preventDefault();

//     // Serialize the data
//     this._data = serialize(event.target, {hash: true});

//     // Switch the action to post-json. This creates an endpoint for mailchimp
//     // that acts as a script that can be loaded onto our page.
//     let action = event.target.action.replace(
//       `${this.endpoints.MAIN}?`, `${this.endpoints.MAIN_JSON}?`
//     );

//     // Add our params to the action
//     action = action + serialize(event.target, {serializer: (...params) => {
//       let prev = (typeof params[0] === 'string') ? params[0] : '';

//       return `${prev}&${params[1]}=${params[2]}`;
//     }});

//     // Append the callback reference. Mailchimp will wrap the JSON response in
//     // our callback method. Once we load the script the callback will execute.
//     action = `${action}&c=window.${this.callback}`;

//     // Create a promise that appends the script response of the post-json method
//     return new Promise((resolve, reject) => {
//       const script = document.createElement('script');

//       document.body.appendChild(script);
//       script.onload = resolve;
//       script.onerror = reject;
//       script.async = true;
//       script.src = encodeURI(action);
//     });
//   }

//   /**
//    * The script onload resolution
//    *
//    * @param   {Event}  event  The script on load event
//    *
//    * @return  {Class}         The Newsletter class
//    */
//   _onload(event) {
//     event.path[0].remove();

//     return this;
//   }

//   /**
//    * The script on error resolution
//    *
//    * @param   {Object}  error  The script on error load event
//    *
//    * @return  {Class}          The Newsletter class
//    */
//   _onerror(error) {
//     // eslint-disable-next-line no-console
//     if (process.env.NODE_ENV !== 'production') console.dir(error);

//     return this;
//   }

//   /**
//    * The callback function for the MailChimp Script call
//    *
//    * @param   {Object}  data  The success/error message from MailChimp
//    *
//    * @return  {Class}        The Newsletter class
//    */
//   _callback(data) {
//     if (this[`_${data[this._key('MC_RESULT')]}`]) {
//       this[`_${data[this._key('MC_RESULT')]}`](data.msg);
//     } else {
//       // eslint-disable-next-line no-console
//       if (process.env.NODE_ENV !== 'production') console.dir(data);
//     }

//     return this;
//   }

//   /**
//    * Submission error handler
//    *
//    * @param   {string}  msg  The error message
//    *
//    * @return  {Class}        The Newsletter class
//    */
//   _error(msg) {
//     this._elementsReset();
//     this._messaging('WARNING', msg);

//     return this;
//   }

//   /**
//    * Submission success handler
//    *
//    * @param   {string}  msg  The success message
//    *
//    * @return  {Class}        The Newsletter class
//    */
//   _success(msg) {
//     this._elementsReset();
//     this._messaging('SUCCESS', msg);

//     return this;
//   }

//   /**
//    * Present the response message to the user
//    *
//    * @param   {String}  type  The message type
//    * @param   {String}  msg   The message
//    *
//    * @return  {Class}         Newsletter
//    */
//   _messaging(type, msg = 'no message') {
//     let strings = Object.keys(this.stringKeys);
//     let handled = false;

//     let alertBox = this._el.querySelector(this.selectors[type]);

//     let alertBoxMsg = alertBox.querySelector(
//       this.selectors.ALERT_TEXT
//     );

//     // Get the localized string, these should be written to the DOM already.
//     // The utility contains a global method for retrieving them.
//     let stringKeys = strings.filter(s => msg.includes(this.stringKeys[s]));
//     msg = (stringKeys.length) ? this.strings[stringKeys[0]] : msg;
//     handled = (stringKeys.length) ? true : false;

//     // Replace string templates with values from either our form data or
//     // the Newsletter strings object.
//     for (let x = 0; x < this.templates.length; x++) {
//       let template = this.templates[x];
//       let key = template.replace('{{ ', '').replace(' }}', '');
//       let value = this._data[key] || this.strings[key];
//       let reg = new RegExp(template, 'gi');

//       msg = msg.replace(reg, (value) ? value : '');
//     }

//     if (handled) {
//       alertBoxMsg.innerHTML = msg;
//     } else if (type === 'ERROR') {
//       alertBoxMsg.innerHTML = this.strings.ERR_PLEASE_TRY_LATER;
//     }

//     if (alertBox) this._elementShow(alertBox, alertBoxMsg);

//     return this;
//   }

//   /**
//    * The main toggling method
//    *
//    * @return  {Class}  Newsletter
//    */
//   _elementsReset() {
//     let targets = this._el.querySelectorAll(this.selectors.ALERTS);

//     for (let i = 0; i < targets.length; i++)
//       if (!targets[i].classList.contains(this.classes.HIDDEN)) {
//         targets[i].classList.add(this.classes.HIDDEN);

//         this.classes.ANIMATE.split(' ').forEach((item) =>
//           targets[i].classList.remove(item)
//         );

//         // Screen Readers
//         targets[i].setAttribute('aria-hidden', 'true');
//         targets[i].querySelector(this.selectors.ALERT_TEXT)
//           .setAttribute('aria-live', 'off');
//       }

//     return this;
//   }

//   /**
//    * The main toggling method
//    *
//    * @param   {object}  target   Message container
//    * @param   {object}  content  Content that changes dynamically that should
//    *                             be announced to screen readers.
//    *
//    * @return  {Class}            Newsletter
//    */
//   _elementShow(target, content) {
//     target.classList.toggle(this.classes.HIDDEN);

//     this.classes.ANIMATE.split(' ').forEach((item) =>
//       target.classList.toggle(item)
//     );

//     // Screen Readers
//     target.setAttribute('aria-hidden', 'false');

//     if (content) {
//       content.setAttribute('aria-live', 'polite');
//     }

//     return this;
//   }

//   /**
//    * A proxy function for retrieving the proper key
//    *
//    * @param   {string}  key  The reference for the stored keys.
//    *
//    * @return  {string}       The desired key.
//    */
//   _key(key) {
//     return this.keys[key];
//   }
// }

// /** @type  {Object}  API data keys */
// Newsletter.keys = {
//   MC_RESULT: 'result',
//   MC_MSG: 'msg'
// };

// /** @type  {Object}  API endpoints */
// Newsletter.endpoints = {
//   MAIN: '/post',
//   MAIN_JSON: '/post-json'
// };

// /** @type  {String}  The Mailchimp callback reference. */
// Newsletter.callback = 'NewsletterCallback';

/**
 * Newsletter Form
 */
(element => {
  let newsletter = null;

  if (element) {
    newsletter = new Newsletter(element);
    newsletter.form.selectors.ERROR_MESSAGE_PARENT = '.c-question__container';

    newsletter.form.submit = (event) => {
      event.preventDefault();

      // TBD validate fields

      newsletter._submit(event)
        .then(newsletter._onload)
        .catch(newsletter._onerror);
    };
  }

  let params = new URLSearchParams(window.location.search);
  let response = params.get('response');

  if (response && newsletter) {
    // hide form fields and submit button
    let submit = element.querySelector('[type=submit]');
    let fields = element.querySelector('[data-js="form-fields"]');

    console.log(submit);
    console.log(submit.classList);
    console.log(newsletter.classes.HIDDEN);

    if (!submit.classList.contains(newsletter.classes.HIDDEN)) {
      submit.classList.add(newsletter.classes.HIDDEN);

      console.log(submit.classList);

      // Screen Readers
      submit.setAttribute('aria-hidden', 'true');
      submit.querySelector(newsletter.selectors.ALERT_TEXT)
        .setAttribute('aria-live', 'off');
    }

    if (!fields.classList.contains(newsletter.classes.HIDDEN)) {
      fields.classList.add(newsletter.classes.HIDDEN);

      // Screen Readers
      fields.setAttribute('aria-hidden', 'true');
      fields.querySelector(newsletter.selectors.ALERT_TEXT)
        .setAttribute('aria-live', 'off');
    }

    // show return home button
    let homeButton = element.querySelector('[data-js="home-button"]');
    newsletter._elementShow(homeButton);

    let email = params.get('email');
    let input = element.querySelector('input[name="EMAIL"]');

    if (EMAIL_REGEX.test(String(email).toLowerCase())) {
      input.value = email;
    }
    
    newsletter._data = {
      'result': params.get('result'),
      'msg': 'Test message',
      'EMAIL': email
    };

    newsletter._callback(newsletter._data);
  }

  // if (element) {
  //   let form = element.querySelector('form');
  //   let submit = element.querySelector('[type=submit]');
  //   let error = element.querySelector('[data-js="alert-error"]');
  //   let success = element.querySelector('[data-js="alert-success"]');

  //   console.log(form);
  //   console.log(submit);
  //   console.log(error);
  //   console.log(success);

  //   let emailField = form.querySelector('[id="mce-EMAIL"]');
  //   let zipcodeField = form.querySelector('[id="mce-ZIPCODE"]');

  //   console.log(emailField);
  //   console.log(zipcodeField);

  //   console.log(emailField.checkValidity());
  //   console.log(zipcodeField.checkValidity());

  //   form.addEventListener('submit', (event) => {
  //     event.preventDefault();
  //     console.log('1');
  //     console.log(emailField.checkValidity());
  //     console.log('2');
  //     console.log(EMAIL_REGEX.test(String(emailField.value).toLowerCase()))
  //     console.log('3');
  //     console.log(zipcodeField.checkValidity());
  //   })

  // }
})(document.querySelector('[data-js="newsletter-form"]'));
