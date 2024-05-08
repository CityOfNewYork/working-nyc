/**
 * Newsletter
 *
 * @author NYC Opportunity
 */

/**
 * Dependencies
 */

// import Newsletter from '@nycopportunity/pttrn-scripts/src/newsletter/newsletter';

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

/**
 * Newsletter Form
 */
(element => {
  let newsletter = null;

  if (element) {
    // let emailField = element.querySelector('[id="mce-EMAIL"]');
    // let zipcodeField = form.querySelector('[id="mce-ZIPCODE"]');
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
    })
  }

  let params = new URLSearchParams(window.location.search);
  let response = params.get('response');

  if (response && newsletter) {
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
