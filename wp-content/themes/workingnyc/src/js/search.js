/**
 * Search results page
 *
 * @author NYC Opportunity
 */

/**
 * Dependencies for archive
 */

// import Vue from 'vue/dist/vue.runtime';  // development
import Vue from 'vue/dist/vue.runtime.min'; // production

/**
 * The template markup is stored in the views/search/archive.vue file Which
 * sources the application script, stored in the modules/search-archive.js
 * file. The application script extends the the NYCO Archive Vue app.
 *
 * Most of the hydration for the application is in the base app such as
 * filtering, history state, and pagination. The majority of the code in this
 * repository is needed for configuration, template mapping, and template
 * markup.
 *
 * @template  ../../views/search/archive.vue
 * @script    ./modules/job-archive.js
 * @extends   https://github.com/CityOfNewYork/nyco-wp-archive-vue
 */

import SearchArchive from '../../views/search/search-results-list.vue';
import SearchResult from '../../views/search/search-result.vue';

// feature flag
const USE_ARCHIVE_PACKAGE = false;

if (!USE_ARCHIVE_PACKAGE) {
    const baseButtonClass = 'btn-tag';
    const selectedButtonClass = 'btn-tag btn-primary';

    var allButton = document.getElementById("all-button");
    var jobsButton = document.getElementById("jobs-button");
    var programsButton = document.getElementById("programs-button");

    var searchResults = document.querySelectorAll('[data-js="search-result"]');

    // Buttons won't show up if there are no results
    if (allButton) {
        allButton.addEventListener("click", function () {
            allButton.className = selectedButtonClass;
            jobsButton.className = baseButtonClass;
            programsButton.className = baseButtonClass;
        
            for (var i = 0; i < searchResults.length; i++) {
                searchResults[i].style.display = "inherit";
            }
        });
    }

    if (jobsButton) {
        jobsButton.addEventListener("click", function () {
            allButton.className = baseButtonClass;
            jobsButton.className = selectedButtonClass;
            programsButton.className = baseButtonClass;
        
            for (var i = 0; i < searchResults.length; i++) {
                if (searchResults[i].getAttribute("data-js-result-type") == "job") {
                    searchResults[i].style.display = "inherit";
                }
                else {
                    searchResults[i].style.display = "none";
                }
            }
        });
    }

    if (programsButton) {
        programsButton.addEventListener("click", function () {
            allButton.className = baseButtonClass;
            jobsButton.className = baseButtonClass;
            programsButton.className = selectedButtonClass;
        
            for (var i = 0; i < searchResults.length; i++) {
                if (searchResults[i].getAttribute("data-js-result-type") == "program") {
                    searchResults[i].style.display = "inherit";
                }
                else {
                    searchResults[i].style.display = "none";
                }
            }
        });
    }
}

else {
    // copied from Jobs archive
    Vue.component('SearchResult', SearchResult);

    new Vue({
    render: createElement => {
        return createElement(SearchArchive, {
        props: {
            strings: {
            HOME: 'Home',
            FILTERS: 'Filters',
            CLOSE: 'Close',
            TOGGLE_ALL: 'Toggle all {{ TERM }}',
            CLOSE_AND_SEE_PROGRAMS: 'Close and see {{ NUMBER }} results',
            PAGE_TITLE: 'Posts',
            PAGE_CONTENT: '',
            WITH: 'with',
            SCHEDULE: 'Employment Type and Schedule',
            SALARY: 'Salary',
            LOCATION: 'Work Location',
            LEARN_MORE_ABOUT: 'Learn more <span class="sr-only">about {{ PROGRAM }}</span>',
            SHOWING: 'Showing {{ TOTAL_VISIBLE }} results of {{ TOTAL }}.',
            RESET: 'Click here to reset filters',
            NO_RESULTS: 'No Results. Try deselecting some filters.',
            LOADING: 'Loading',
            SHOW_MORE: 'Show more',
            BACK_TO_TOP: 'Back to top',
            SUGGEST: ''
            }
        }
        });
    }
    }).$mount('[data-js="search-results-list"]');
}