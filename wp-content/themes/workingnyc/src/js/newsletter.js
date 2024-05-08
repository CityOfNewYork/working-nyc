/**
 * Newsletter
 *
 * @author NYC Opportunity
 */

/**
 * Dependencies
 */

import Newsletter from './modules/newsletter-helper';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Newsletter Form
 */
(element => {
  let newsletter = null;

  if (element) {
    newsletter = new Newsletter(element);
  }

  let params = new URLSearchParams(window.location.search);
  let response = params.get('response');

  if (response && newsletter) {
    // hide form fields and submit button
    let submit = element.querySelector('[type=submit]');
    let fields = element.querySelector('[data-js="form-fields"]');

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
})(document.querySelector('[data-js="newsletter-form"]'));
