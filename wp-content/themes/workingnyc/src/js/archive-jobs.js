/**
 * Jobs Archive
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
 * @template  ../../views/jobs/archive.vue
 * @script    ./modules/job-archive.js
 * @extends   https://github.com/CityOfNewYork/nyco-wp-archive-vue
 */

import JobsArchive from '../../views/jobs/archive.vue';
import Job from '../../views/jobs/job.vue';

/**
 * Mount Components
 */

Vue.component('Job', Job);

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
    return createElement(JobsArchive, {
      props: {
        strings: {
          HOME: 'Home',
          FILTERS: (config.filters) ? config.filters.innerHTML : 'Filters',
          CLOSE: 'Close',
          CLOSE_AND_SEE_PROGRAMS: 'Close and see {{ number }} jobs',
          PAGE_TITLE: (config.title) ? config.title.innerHTML : 'Posts',
          PAGE_CONTENT: (config.content) ? config.content.innerHTML : '',
          WITH: 'with',
          SCHEDULE: 'Schedule',
          SALARY: 'Salary',
          LOCATION: 'Location',
          LEARN_MORE_ABOUT: 'Learn more <span class="sr-only">about {{ program }}</span>',
          SHOWING: 'Showing {{ TOTAL_VISIBLE }} results of {{ TOTAL }}',
          NO_RESULTS: 'No Results. Try deselecting some filters.',
          LOADING: 'Loading',
          SHOW_MORE: 'Show more',
          SUGGEST: (config.suggest) ? config.suggest.innerHTML : ''
        }
      }
    });
  }
}).$mount('[data-js-archive="jobs"]');
