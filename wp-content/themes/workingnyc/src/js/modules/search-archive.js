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
    searchTerm: {
      type: String
    },
  },
  data: function() {
    return {
      /**
       * In the parent Archive class, this represents a post type to query, but here it is
       * the endpoint to use
       * @type {String}
       */
      type: 'search',

      /**
       * Setting this sets the initial app query
       *
       * @type {Object}
       */
      query: {
        per_page: this.perPage,
        page: this.page,
        orderby: 'menu_order',
        order: 'asc'
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
          'order'
        ],
        map: {},
        filterParams: false
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
       * This is the endpoint list for terms and post requests
       *
       * @type  {Object}
       *
       * @param  {String}  terms  A required endpoint for the list of filters
       * @param  {String}  jobs   This is based on the 'type' setting above
       */
      endpoints: {
        terms: '/wp-json/api/v1/terms/?post_type[]=jobs&cache=0',
        search: '/wp-json/api/v1/searchRelevanssi'
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
           * Data mapping function for results from the Search endpoint
           *
           * @raw /wp-json/api/v1/searchRelevanssi
           */
          search: result => ({
            id: result.id,
            title: result.title,
            link: result.url,
            type: result.type,
            context: result.context,
            raw: (process.env.NODE_ENV === 'development') ? { ...result } : false
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

  /**
   * @type {Object}
   */
  methods: {
    /**
     * TODO: Set focus to results when the filter dropdown is closed. This
     * method is not currently working when bound to the "close and see" button.
     * That button uses the patterns scripts dialog method which interfere
     * with DOM event propagation.
     */
    resultsFocus: function() {
      document.querySelector('body').style.overflow = ''; // unlocks the dialog

      this.$refs.results.setAttribute('tabindex', '-1');

      this.$refs.results.focus();
    },

    /**
     * Proxy for pagination. This will shift focus on the next page's first
     * result once pagination is complete.
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
    }
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
      'sectors': 'wnyc_sec',
      'source': 'wnyc_src',
      'salary': 'wnyc_sal'
    };

    // Add map of WP Query terms < to > Window history state
    this.$set(this.history, 'map', taxonomies);

    // Add custom taxonomy queries to the list of safe params, including the search param
    this.params = [...this.params, ...Object.keys(taxonomies), 's'];

    // getState() sets all query parameters to be arrays; manually pass in the search term
    // as a string
    // TODO there may be a cleaner implementation for this
    const URLparams = new URLSearchParams(window.location.search);

    const query = {
      's': URLparams.get('s')
    };
  
    this.getState(query)   // Initialize the application
      .queue()            // Initialize the first page request
      .fetch('terms')     // Get the terms from the 'terms' endpoint
      .catch(this.error); //
  }
};
