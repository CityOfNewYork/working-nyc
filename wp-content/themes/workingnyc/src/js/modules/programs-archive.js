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

      /**
       * Setting this sets the initial app query.
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
       * @param  {String}  jobs   This is based on the 'type' setting above
       */
      endpoints: {
        terms: '/wp-json/api/v1/terms/?post_type[]=programs'
          + ((process.env.NODE_ENV === 'development') ? '&cache=1' : ''),
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
           * Jobs endpoint data map
           *
           * @raw /wp-json/wp/v2/jobs
           */
          programs: programs => ({
            id: programs.id,
            title: programs.acf.program_title,
            link: programs.link,
            status: programs.status,
            context: programs.context,
            raw: (process.env.NODE_ENV === 'development') ? {
                ...programs
              } : false
          }),

          /**
           * Terms endpoint data map
           *
           * @raw /wp-json/api/v1/terms
           */
          terms: terms => ({
            name: terms.labels.archives,
            slug: terms.name,
            filters: terms.terms.map(filters => ({
              id: filters.term_id,
              name: filters.name,
              slug: filters.slug,
              parent: terms.name,
              active: (
                  this.query.hasOwnProperty(terms.name) &&
                  this.query[terms.name].includes(filters.term_id)
                ),
              checked: (
                  this.query.hasOwnProperty(terms.name) &&
                  this.query[terms.name].includes(filters.term_id)
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
  computed: {
    /**
     * By default the application returns paged results, this computed property
     * adds all visible posts to a single array to show.
     *
     * @return  {Array}  All visible posts in one array
     */
    postsFlat() {
      let posts = this.posts.filter(page => {
        return (page && page.show) ? page.posts : false;
      }).map(page => {
        return page.posts;
      });

      return posts.flat();
    },

    /**
     * Find the total visible post by mapping each shown page and adding the
     * number of posts.
     *
     * @return  {Number}  Representing the total visible posts
     */
    totalVisible: function() {
      let show = this.posts.map(page => {
        return (page && page.show) ? page.posts.length : 0;
      });

      return (show.length) ?
        show.reduce((acc, cur) => acc + cur, 0) : 0;
    },

    /**
     * Return the total number of checked filters
     *
     * @return  {Number}  Number of checked filters
     */
    totalFilters: function() {
      return this.terms.reduce((acc, cur) => {
        return acc + cur.filters.filter(f => f.checked).length
      }, 0);
    }
  },

  /**
   * @type {Object}
   */
  methods: {
    /**
     * Proxy for the click event that toggles the filter.
     *
     * @param   {Object}  toChange  A constructed object containing:
     *                              event - The click event
     *                              data  - The term object
     *
     * @return  {Object}            Vue Instance
     */
    change: function(toChange) {
      this.$set(toChange.data, 'checked', !toChange.data.checked);

      this.click(toChange);

      return this;
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
  },

  /**
   * Focus on the first job title after the dom is updated.
   */
  updated: function() {
    this.$nextTick(function() {
      if (this.totalVisible <= 1)
        return false;

      let pages = this.posts.filter(page => {
        return (page && page.show);
      });

      if (pages) {
        let posts = pages[pages.length - 1].posts;
        let post = posts[posts.length - 1];
        let element = document.querySelector(`[data-js='job-${post.id}']`);

        if (element) {
          element.focus();
        }
      }
    })
  }
};
