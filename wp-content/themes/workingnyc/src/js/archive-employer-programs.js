/**
 * Employer Programs Archive
 *
 * @author NYC Opportunity
 */

/**
 * Dependencies
 */

// import Vue from 'vue/dist/vue.runtime';  // development
import Vue from 'vue/dist/vue.runtime.min'; // production

/**
 * The template markup is stored in the views/jobs/archive.vue file Which
 * sources the application script, stored in the modules/job-archive.js
 * file. The application script extends the the NYCO Archive Vue app.
 *
 * Most of the hydration for the application is in the base app such as
 * filtering, history state, and pagination. The majority of the code in this
 * repository is needed for configuration, template mapping, and template
 * markup.
 *
 * @template  ../../views/employer-programs/archive.vue
 * @script    ./modules/employer-programs-archive.js
 * @extends   https://github.com/CityOfNewYork/nyco-wp-archive-vue
 */

import EmployerProgramsArchive from '../../views/employer-programs/archive.vue';
import EmployerProgram from '../../views/employer-programs/employer-program.vue';

/**
 * Redirect old filtering method to WP Archive Vue filtering
 */

/**
 * Mount Components
 */

Vue.component('EmployerProgram', EmployerProgram);

/**
 * Archive
 */

let config = {
  'filters': document.querySelector('[data-js="filters-label"]'),
  'title': document.querySelector('[data-js="title"]'),
  'content': document.querySelector('[data-js="content"]'),
  'suggest': document.querySelector('[data-js="suggest-a-program"]')
};

new Vue({
  render: createElement => {
    return createElement(EmployerProgramsArchive, {
      props: {
        strings: {
          HOME: 'Home',
          FILTERS: (config.filters) ? config.filters.innerHTML : 'Filters',
          CLOSE: 'Close',
          TOGGLE_ALL: 'Toggle all {{ TERM }}',
          CLOSE_AND_SEE_PROGRAMS: 'Close and see {{ number }} programs',
          PAGE_TITLE: (config.title) ? config.title.innerHTML : 'Posts',
          PAGE_CONTENT: (config.content) ? config.content.innerHTML : '',
          BY: 'by',
          SERVICES: 'Services Provided',
          SCHEDULE: 'Duration and Length',
          SUPPORTS: 'Support Provided',
          LEARN_MORE_ABOUT: 'Learn more <span class="sr-only">about {{ program }}</span>',
          SHOWING: 'Showing {{ TOTAL_VISIBLE }} Programs of {{ TOTAL }}.',
          RESET: 'Click here to reset filters',
          NO_RESULTS: 'No Results. Try deselecting some filters.',
          LOADING: 'Loading',
          SHOW_MORE: 'Show more',
          BACK_TO_TOP: 'Back to top',
          SUGGEST:  (config.suggest) ? config.suggest.innerHTML : ''
        }
      }
    });
  }
}).$mount('[data-js-archive="employer-programs"]');
