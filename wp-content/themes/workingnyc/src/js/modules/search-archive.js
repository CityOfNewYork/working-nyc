'use strict';

import Archive from '@nycopportunity/wp-archive-vue/src/archive.vue';

export default {
  extends: Archive,
  props: {
    perPage: {
      type: Number,
      default: 24
    },
    page: {
      type: Number,
      default: 1
    },
    pages: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    paginationNextLink: {
      type: String
    },
    strings: {
      type: Object
    },
    resetFlag: {
      type: Boolean,
      default: true
    },
    submitFlag: {
      type: Boolean,
      default: true
    },
    toggleFilterMenu: {
      type: Boolean,
      default: false
    },
    noResults_data:{
      type: Object
    }
  },
  data: function() {

    return {
      /**
       * This is our custom post type to query
       *
       * @type {String}
       */
      type: 'programs',
      indexArr: [0],
      currentSearchTerm: '',

      filtersExpanded: false,

      /**
       * Setting this sets the initial app query.
       *
       * @type {Object}
       */
      query: {
        post_type: 'programs',
        per_page: this.perPage,
        page: this.page,
        orderby: 'menu_order',
        order: 'asc'
      },

      /**
       * Setting this sets the initial headers of the app's query
       *
       * @type {Object}
       */
      headers: {
        pages: this.pages,
        total: this.total,
        link: 'rel="next";'
      },

      /**
       * Modify how the URL history is written
       *
       * @type {Object}
       */
       history: {
        omit: [
          'page',
          'per_page',
          'orderby',
          'order',
          'post_type'
        ],
        map: {},
        filterParams: false
      },

      /**
       * This is the endpoint list for terms and post requests
       *
       * @type  {Object}
       *
       * @param  {String}  terms  A required endpoint for the list of filters
       * @param  {String}  employer-programs   This is based on the 'type' setting above
       */
      endpoints: {
        terms: '/wp-json/api/v1/terms/?post_type[]=programs&orderby=slug&order=ASC&cache=0',
        'programs': '/wp-json/api/v1/searchRelevanssi'
      },

      /**
       * Each endpoint above will access a map to take the data from the request
       * and transform it for the app's display purposes
       *
       * @type    {Function}
       *
       * @return  {Object}    Object with a mapping function for each endpoint
       */
      maps: function() {
       
        return {
          /**
           * Data mapping function for results from the Programs endpoint
           *
           * @raw /wp-json/wp/v2/programs
           */
          programs: programs => ({
            id: programs.id,
            title: programs.acf.program_title,
            link: programs.link,
            status: programs.status,
            context: programs.context,
            raw: (process.env.NODE_ENV === 'development') ? { ...programs } : false
          }),

          /**
           * Data mapping function for results from the Terms endpoint
           *
           * @raw /wp-json/api/v1/terms
           */
          terms: terms => ({
            name: terms.taxonomy.labels.archives,
            slug: terms.taxonomy.name,
            filters: terms.terms.map(filters => ({
              id: filters.term_id,
              name: filters.name,
              slug: filters.slug,
              parent: terms.taxonomy.name,
              checked: (
                this.query.hasOwnProperty(terms.taxonomy.name) &&
                this.query[terms.taxonomy.name].includes(filters.term_id)
              )
            }))
          })
        };
      }
    };
  },
  
  computed: {
    loading: function() {
      if (!this.posts.length) return false;

      let page = this.posts[1];
      
      if(page.posts.length==0) return false;

      return this.init && !page.posts.length && page.show;
    },
  },

  methods: {
    toggleAccordion(index) {
      if(this.indexArr.indexOf(index) === -1){
        this.indexArr.push(index);
      }else{
        this.indexArr.splice(this.indexArr.indexOf(index), 1);
      }
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
        });
      this.filtersExpanded = false;
    },
    submitSearch() {
      this.reset(); // to clear the existing filters when new request is made
      this.resetFlag = true;
      this.submitFlag = true;
      this.wp();
      this.currentSearchTerm = this.query.s;
      this.toggleFilterMenu = false; // Set toggleFilterMenu to hide the side filter
    },
    /**
     * Proxy for pagination. This will shift focus on the next page's first
     * result once pagination is complete.
     * 
     * Copied from programs-archive.js
     *
     * @param   {Object}  event  The bound click event
     */
    nextPage: function(event) {
      let _this = this;

      (async (_this) => {
        await _this.paginate(event);

        if (_this.totalVisible <= 1)
          return false;

        let pages = _this.posts.filter(page => {
          return (page && page.show);
        });

        if (pages) {
          let posts = pages[pages.length - 1].posts;
          let element = document.querySelector(`[data-js='post-${posts[0].id}']`);

          if (element) {
            element.focus();
          }
        }
      })(_this);
    },

    /**
     * Setting the resetFlag to not display "no results" when Posts array is empty
     * Setting the toggleFilterMenu to toggle the side filter
     */
    reset: function(event) {
      this.resetFlag = false;
      this.toggleFilterMenu = true;
      for (let index = 0; index < this.terms.length; index++) {
        this.$set(this.query, this.terms[index].slug, []);
        this.$set(this.terms[index], 'checked', false);
        
        this.terms[index].filters.forEach(f => {
          this.$set(f, 'checked', false);
        });
      }
      this.$set(this.query, 'page', 1);
      this.wp();
    },

    //Setting the toggleFilterMenu to toggle the side filter
    click: function(event) {
      this.toggleFilterMenu = true;
      this.resetFlag = false;
      let taxonomy = event.data.parent;
      let term = event.data.id || false;

      if (term) {
        // set the individual filter to checked
        this.$set(event.data, 'checked', !event.data.checked);

        // check the parent taxonomy if all filters are checked,
        // set parent to truthy checked state if so
        let tax = this.terms.find(t => t.slug === taxonomy);
        let checked = (tax.filters.filter(t => t.checked).length === tax.filters.length);

        this.$set(tax, 'checked', checked);

        this.filter(taxonomy, term);
      } else {
        this.filterAll(taxonomy);
      }

      return this;
    },
    
    process: function(data, query, headers) {
      // If there are posts for this query, map them to the template.
      let posts = (Array.isArray(data)) ?
        data.map(this.maps()[this.type]) : false;

      // Set posts and store a copy of the query for reference.
      this.$set(this.posts[query.page], 'posts', posts);
      this.$set(this.posts[query.page], 'headers', Object.freeze(headers));

      this.submitFlag = false;

      // If there are no posts, pass along to the error handler.
      if (!Array.isArray(data))
        this.error({error: data, query: query});
      
      this.$set(this, 'init', true);
      
    },

    // When there is a query has made and if there are no current, previous or next page results,
    // set the submitFlag to display the existing results and stop loading the screen
    
    queue: function(queries = [0, 1]) {
      // Set a benchmark query to compare the upcomming query to.
      let Obj1 = Object.assign({}, this.query); // create copy of object.
      delete Obj1.page; // delete the page attribute because it will be different.
      Object.freeze(Obj1); // prevent changes to our comparison.

      // The function is async because we want to wait until each promise
      // is query is finished before we run the next. We don't want to bother
      // sending a request if there are no previous or next pages. The way we
      // find out if there are previous or next pages relative to the current
      // page query is through the headers of the response provided by the
      // WP REST API.
      (async () => {
        for (let i = 0; i < queries.length; i++) {
          let query = Object.assign({}, this.query);
          // eslint-disable-next-line no-undef
          let promise = new Promise(resolve => resolve());
          let pages = this.headers.pages;
          let page = this.query.page;
          let current = false;
          let next = false;
          let previous = false;

          // Build the query and set its page number.
          Object.defineProperty(query, 'page', {
            value: page + queries[i],
            enumerable: true
          });

          // There will never be a page 0 or below, so skip this query.
          if (query.page <= 0) continue;

          // Check to see if we have the page that we are going to queued
          // and the query structure of that page matches the current query
          // structure (other than the page, which will obviously be
          // different). This will help us determine if we need to make a new
          // request.
          let havePage = (this.posts[query.page]) ? true : false;
          let pageQueryMatches = false;

          if (havePage) {
            let Obj2 = Object.assign({}, this.posts[query.page].query);
            delete Obj2.page;
            pageQueryMatches = (JSON.stringify(Obj1) === JSON.stringify(Obj2));
          }

          if (havePage && pageQueryMatches) continue;

          // If this is the current page we want the query to go through.
          current = (query.page === page);

          // If there is a next or previous page, we'll prefetch them.
          // We'll know there's a next or previous page based on the
          // headers sent by the current page query.
          next = (page < pages && query.page > page);
          previous = (page > 1 && query.page < page);

          if (current || next || previous)
            await promise.then(() => {
              return this.wpQuery(query);
            })
            .then(this.response)
            .then(data => {
              let headers = Object.assign({}, this.headers);

              // If this is the current page, replace the browser history state.
              if (current) this.replaceState(query);

              this.process(data, query, headers);
            }).catch(this.error);

            else this.submitFlag = false;
        }
      })();

      return this;
    },
  },

  /**
   * The created hook starts the application
   *
   * @url https://vuejs.org/v2/api/#created
   *
   * @type {Function}
   */
  created: function() {
 
    /**
     * Query Vars to map to the WP Archive Vue history state. These are
     * different from registered query vars so that they don't interfere
     * with the WordPress Query.
     *
     * These are registered in wp-content/mu-plugins/query-vars.php
     *
     * @var {Object}
     */
    let taxonomies = {
      'agency': 'wnyc_agy',
      'services': 'wnyc_ser',
      'recruitment_status': 'wnyc_rst',
      'schedule': 'wnyc_sch',
      'duration': 'wnyc_dur',
      'locations': 'wnyc_loc',
      'populations': 'wnyc_pop',
      'age_ranges_served': 'wnyc_age',
      'sectors': 'wnyc_sec'
    };

    // Add map of WP Query terms < to > Window history state
    this.$set(this.history, 'map', taxonomies);

    // Add custom taxonomy queries to the list of safe params
    this.params = [...this.params, ...Object.keys(taxonomies), 'post_type', 's'];

    // getState() sets all query parameters to be arrays; manually pass in the search term
    // as a string
    // TODO there may be a cleaner implementation for this

    const URLparams = new URLSearchParams(window.location.search);
    this.currentSearchTerm = URLparams.get('s');

    const query = {
      's': this.currentSearchTerm
    };

    // Initialize the application
    this.getState(query)       // Get window.location.search (filter history)
      .queue()            // Initialize the first page request
      .fetch('terms')     // Get the terms from the 'terms' endpoint
      .catch(this.error); //
  },

  mounted: function(){
    fetch('/wp-json/acf/v3/options/options')
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.noResults_data = data.acf.no_search_results_text;
    })
    .catch(error => {
      console.error(error);
    });
  }
};