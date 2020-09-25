'use strict';

import Vue from 'vue/dist/vue.common';
import axios from 'axios/dist/axios';
import router from './router'

class Programs {

  constructor() {
    const baseUrl = window.location.origin + '/wp-json/wp/v2/';
    const lang = document.documentElement.lang;
    const element = document.querySelector('[id*="vue"]');
    const elementId = element.getAttribute('id');
    const postType = elementId.replace('vue-', '');
    const filters = element.getAttribute('data-filters');

    new Vue({
      delimiters: ['v{', '}'],
      el: `#${elementId}`,
      router,
      data: {
        baseUrl: baseUrl,
        lang: lang,
        postType: postType,
        programsURL: `${baseUrl}${postType}?lang=${lang}&orderby=menu_order&order=asc`,
        posts: null,
        labels: Programs.setTaxObj(filters, true),
        taxonomies: Programs.setTaxObj(filters, false),
        filters: [],
        checkedFilters: [],
        totalFilters: 0,
        totalPosts: 0,
        totalVisible: 0,
        perPage: 6,
        page: 1
      },
      watch: {
        // checkedFilters: 'getPrograms',
        checkedFilters: function() {
          this.page = 1
          this.getPrograms()
        },
        page: 'getPrograms'
      },
      methods: {
        getPrograms: Programs.getPrograms,
        getTax: Programs.getTax,
        postUrl: Programs.postUrl,
      },
      created: function() {
        
        /**
         * Get the taxonomies
         */
        let vals = this.getTax()
        axios.all(vals.map(l => axios.get(l)))
          .then(axios.spread((...res) => {
            this.filters = res.map(value => value.data)

            if (Object.keys(this.$route.query).length > 0){
              Programs.parseQuery(this)
            }
          }));
      },
      mounted: function () {
        if (Object.keys(this.$route.query).length == 0) {
          this.getPrograms()
        }
      },
      filters: {
        stripHtml: function (str) {
          return str.replace(/<\/?[^>]+>/ig, '')
        },
        combineStr: function (arr, tax, bool) {
          if (!arr) {return}
          if (bool) {
            let names = arr.map(value => `<b class="text-alt" data-program="taxonomy.${tax}">${value.name}</b>`);
            let joined = names.join(', ').replace(/, ([^,]*)$/, ', and $1');
            return joined;
          } else {
            let names = arr.map(value => `<span data-program="taxonomy.${tax}">${value.name}</span>`);
            let joined = names.join(', ');
            return joined;
          }
        }
      }
    })
  }
}

/**
 * Update the router based on the filters and returns the filters
 * @param {object} obj 
 */
Programs.generateFilters = function(obj) {

  let checked = obj.checkedFilters

  obj.totalFilters = checked.length
  
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

  // update the router based on the filters
  if (JSON.stringify(obj.$route.query) != JSON.stringify(params)) {
    obj.$router.push({ query: params });
  }

  // generate the string for the api call
  let combinedFilter = []
  Object.keys(ids).forEach(function (key) {
    combinedFilter.push(`${key}[]=${ids[key].join(`&${key}[]=`)}`)
  })
  combinedFilter = combinedFilter.join('&')

  return combinedFilter;

}

/**
 * Extracts the filters in the URL and updates the checkedFilters
 * @param {object} obj 
 */
Programs.parseQuery = function(obj){
  let query = obj.$route.query;
  const filters = obj.filters

  // find the slugs in the taxonomies and add them to checkedFilters
  let checked = []
  let terms = [].concat.apply([], filters);
  Object.keys(query).forEach(function (key) {
    
    if (Array.isArray(query[key])){
      query[key].forEach(function(term){
        checked.push(terms.filter(x => x.slug === term)[0])
      })
    } else {
      checked.push(terms.find(item => item.slug === query[key]));
    }
  });

  // reassigns the checked filters
  obj.checkedFilters = checked;
}

/**
 * Request to get the programs and update router
 **/
Programs.getPrograms = function () {
  
  let filters =  Programs.generateFilters(this)

  let url = `${this.programsURL}&per_page=${this.perPage}&page=${this.page}&${filters}`;

  axios
    .get(url)
    .then(response => {
      this.totalPosts = response.headers['x-wp-total']
      if (this.posts != null && this.page > 1){
        this.posts = this.posts.concat(response.data);
      } else {
        this.posts = response.data
      }
      this.totalVisible = this.posts.length
    })
    .catch(error => {
      console.log('Error on request: ' + error)
    });
}

/**
 * Creates an object with keys that will be populated when the user filters
 * OR creates an array of labels
 * @param {string} str 
 * @param {boolean} labels 
 */
Programs.setTaxObj = function(str, labels) {

  const arr = str.split(',')

  let taxonomies = []
  arr.map(function (i) {
    let arrStr = i.split(':')
    if (labels){
      taxonomies.push(arrStr[1])
    } else {
      let obj = {};
      obj[arrStr[0]] = null;
      taxonomies.push(obj)
    }
  });

  return taxonomies;
}

/** 
 * Creates the array of URLS to get the taxonomies
 */
Programs.getTax = function() {

  let promises = this.taxonomies.map(x => `${this.baseUrl}${Object.keys(x)[0]}?hide_empty=true`);

  return promises
  
}

/**
 * Returns the correct url for the programs detail
 * @param {string} slug 
 */
Programs.postUrl = function(slug){
  let url = '';
  
  if (this.lang != 'en') {
    url = [this.lang, this.postType, slug].join('/');
  } else {
    url = [this.postType, slug].join('/');
  }

  return '/' + url;

}
export default Programs;


