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
      type: 'employer-programs',

      filtersExpanded: false,

      /**
       * Setting this sets the initial app query.
       *
       * @type {Object}
       */
      query: {
        post_type: 'employer-programs',
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
       * Note that the employer-programs query fails without the 'rest_employer-programs_collection_params'
       * filter in wp-content/mu-plugins/rest-collection-params.php, because the orderby query parameter
       * must be added as an option there
       *
       * @type  {Object}
       *
       * @param  {String}  terms  A required endpoint for the list of filters
       * @param  {String}  employer-programs   This is based on the 'type' setting above
       */
      endpoints: {
        terms: '/wp-json/api/v1/terms/?post_type[]=employer-programs&orderby=slug&order=ASC&cache=0',
        'employer-programs': '/wp-json/api/v1/searchRelevanssi'
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
           * @raw /wp-json/wp/v2/employer-programs
           */
          'employer-programs': employer_program => ({
            id: employer_program.id,
            title: employer_program.acf.employer_program_title,
            link: employer_program.link,
            provider: employer_program.acf.employer_program_provider,
            preview: employer_program.acf.employer_program_preview,
            logo: employer_program.acf.employer_program_logo,
            tags: employer_program.acf.employer_program_tags,
            raw: (process.env.NODE_ENV === 'development') ? { ...employer_program } : false
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
    termsChecked: function() {
      let numChecked = 0;
      for (let i in this.terms) {
        // numChecked.push(term);
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
      'employer_needs': 'wnyc_emn',
      'industries': 'wnyc_ind',
      'talent_availability': 'wnyc_avl',
      'occupations': 'wnyc_occ'
    };

    // Add map of WP Query terms < to > Window history state
    this.$set(this.history, 'map', taxonomies);

    // Add custom taxonomy queries to the list of safe params
    this.params = [...this.params, ...Object.keys(taxonomies), 'post_type', 'search_term'];

    // Initialize the application
    this.getState()       // Get window.location.search (filter history)
      .queue()            // Initialize the first page request
      .fetch('terms')     // Get the terms from the 'terms' endpoint
      .catch(this.error); //
  }
};
