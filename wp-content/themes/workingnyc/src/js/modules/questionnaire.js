'use strict';

import Vue from 'vue/dist/vue.common';
import axios from 'axios/dist/axios';

class Questionnaire {

  constructor() {
    const baseUrl = window.location.origin + '/wp-json/wp/v2/';
    const lang = document.documentElement.lang;
    const element = document.querySelector(Questionnaire.selector);
    const elementId = element.getAttribute('id');
    const postType = element.getAttribute('data-post-type');
    const threshold = element.getAttribute('data-post-threshold');
    const taxAttrs = Array.from(document.querySelectorAll('[data-taxonomy]'));
    const filters = taxAttrs.map(function (i) {
      return i.getAttribute('data-taxonomy');
    })

    new Vue({
      delimiters: ['v{', '}'],
      el: `#${elementId}`,
      data: {
        baseUrl: baseUrl,
        lang: lang,
        postType: postType,
        programsURL: `${baseUrl}${postType}?lang=${lang}`,
        taxonomies: Questionnaire.setTaxObj(filters),
        filters: [],
        checkedFilters: [],
        totalPosts: 0,
        success: null,
        error: false,
        query: '',
        threshold: threshold
      },
      watch: {
        checkedFilters: function () {
          this.getPrograms()
        },
      },
      methods: {
        getPrograms: Questionnaire.getPrograms,
        getTax: Questionnaire.getTax,
      },
      created: function () {

        /**
         * Get the taxonomies
         */
        let vals = this.getTax()
        axios.all(vals.map(l => axios.get(l)))
          .then(axios.spread((...res) => {
            this.filters = res.map(value => value.data)
          }));
      },
    });
  }
}

/**
 * Makes Rest API call for programs
 */
Questionnaire.getPrograms = function () {

  this.success=null;
  let filters = Questionnaire.generateFilters(this);

  let url = `${this.baseUrl}${this.postType}?lang=${this.lang}&${filters}`;

  axios
    .get(url)
    .then(response => {
      this.totalPosts = response.headers['x-wp-total'];

      // total posts is less than threshold, show no more questions
      if (this.totalPosts > 0 && this.totalPosts <= this.threshold) {
        this.success = true;
      } else if (this.totalPosts > this.threshold) {
        Questionnaire.revealFieldset(this.checkedFilters.length - 1);
      } else {
        this.success = false;
        this.query = ''
      }

    })
    .catch(error => {
      console.log('Error on request: ' + error);
      this.error = true;
      this.success = null;
    });
}

/**
 * Updates the fieldset classes based on index
 * @param {*} index 
 */
Questionnaire.revealFieldset = function(index){
  const element = document.querySelector(Questionnaire.selector);
  const fieldset = element.getElementsByTagName('fieldset');

  if (fieldset[index]) {
    fieldset[index].classList.remove("hidden");
    fieldset[index].classList.add("active");
    fieldset[index].setAttribute("aria-hidden", false);
  }
}

/**
 * Creates strings of filters for the API and for the form action
 * @param {object} obj vue data object
 */
Questionnaire.generateFilters = function (obj) {

  let checked = obj.checkedFilters;

  // generate the query params
  var params = {};
  var ids = {};
  checked.forEach(function (term) {
    var key = term.taxonomy;
    params[key] = params[key] || [];
    params[key] = params[key].concat(term.slug);
    ids[key] = ids[key] || [];
    ids[key] = ids[key].concat(term.id);
  });

  // generate the string for the api call
  let combinedFilter = [];
  Object.keys(ids).forEach(function (key) {
    combinedFilter.push(`${key}[]=${ids[key].join(`&${key}[]=`)}`);
  })
  combinedFilter = combinedFilter.join('&');
  
  let stringFilter = []
  Object.keys(params).forEach(function (key) {
    stringFilter.push(`${key}=${params[key].join(`&${key}=`)}`);
  })
  stringFilter = '?' + stringFilter.join('&');
  obj.query = stringFilter;
  
  return combinedFilter;

}

/**
 * Creates an object with keys that will be populated when the user selects a term
 * @param {string} str
 */
Questionnaire.setTaxObj = function (arr) {

  let taxonomies = [];
  arr.map(function (i) {
    let arrStr = i.split(':');
    let obj = {};
    obj[arrStr[0]] = null;
    taxonomies.push(obj);
  });

  return taxonomies;
}

/**
 * Creates the array of URLS to get the taxonomies
 */
Questionnaire.getTax = function () {

  let promises = this.taxonomies.map(x => `${this.baseUrl}${Object.keys(x)[0]}?hide_empty=true`);

  return promises;

}

Questionnaire.selector = '[id*="answer-a-few-questions"]';

export default Questionnaire;


