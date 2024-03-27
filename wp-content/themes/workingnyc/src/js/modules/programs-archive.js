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
      filtersExpanded: false,

      /**
       * Setting this sets the initial app query.
       *
       * @type {Object}
       */
      query: {
        per_page: this.perPage,
        page: this.page,
        orderby: 'date',
        order: 'desc'
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
          'order'
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
       * @param  {String}  programs   This is based on the 'type' setting above
       */
      endpoints: {
        terms: '/wp-json/api/v1/terms/?post_type[]=programs&cache=0',
        programs: '/wp-json/wp/v2/programs'
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

  /**
   * @type {Object}
   */
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

  computed: {
    termsChecked: function() {
      let numChecked = 0;
      for (let i in this.terms) {
        let term = this.terms[i];
        for (let j in term.filters) {
          if (term.filters[j].checked) {
            numChecked += 1;
          }
        }
      }
      return numChecked > 0;
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
    this.params = [...this.params, ...Object.keys(taxonomies)];

    // Initialize the application
    this.getState()       // Get window.location.search (filter history)
      .queue()            // Initialize the first page request
      .fetch('terms')     // Get the terms from the 'terms' endpoint
      .catch(this.error); //
  }
};
