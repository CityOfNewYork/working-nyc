(function () {
  'use strict';

  /**
   * Newsletter
   *
   * @author NYC Opportunity
   */

  /**
   * Dependencies
   */

  // import ... from ...

  /**
   * Init
   */

  (function (window) {

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
  })(window);

})();
