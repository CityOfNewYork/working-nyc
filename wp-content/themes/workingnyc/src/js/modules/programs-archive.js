'use strict';

import Archive from '@nycopportunity/wp-archive-vue/src/archive.vue';

export default {
  extends: Archive,
  props: {
    perPage: {
      type: Number,
      default: 7
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
    totalPages: {
      type: Object
    },
    firstPage: {
      type: Boolean,
      default: false
    },
    lastPage: {
      type: Boolean,
      default: false
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

  computed: {
    /**
     * Wether there are no posts to show but a query is being made
     *
     * @type {Boolean}
     */
    loading: function() {
      if (!this.posts.length) return false;

      let page = this.posts[1];

      if(page === undefined) return false;

      return this.init && !page.posts.length && page.show;
    },

    next: function() {
      let number = this.query.page;
      let total = this.headers.pages;

      if (!this.posts.length) return false;

      //let page = this.posts[number];

      return (number < total);
    },

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
    },

    process: function(data, query, headers) {
      // If there are posts for this query, map them to the template.
      let posts = (Array.isArray(data)) ?
        data.map(this.maps()[this.type]) : false;

      // Set posts and store a copy of the query for reference.
      this.$set(this.posts[query.page], 'posts', posts);
      this.$set(this.posts[query.page], 'headers', Object.freeze(headers));

      // If there are no posts, pass along to the error handler.
      if (!Array.isArray(data))
        this.error({error: data, query: query});

      this.$set(this, 'init', true);

      if(this.headers.pages<=6){
        this.firstPage = false;
        this.lastPage = false;
        this.totalPages = this.headers.pages;
      }
      else{
        this.firstPage = true;
        this.lastPage = true;
        this.totalPages = [2,3,4,5]
      } 
    },

    updatePagination: function(){
      this.scrollToTop();
      let url = [
        this.domain,
        this.lang.path,
        this.endpoints[this.type],
        this.buildUrlQuery(this.query)
      ].join('');

      fetch(url)
      .then(this.response)
      .then(data => {
      let query = this.query;
      let headers = Object.assign({}, this.headers);

      this.posts.length=1;

      let currentPost = {
        'posts': data,
        'headers': headers,
        'query': this.query,
        'show': true
      };

      this.posts.push(currentPost);

      this.posts.map(post=>{
        if(post.query.page != query.page){
          this.$set(post, 'show', false);
        }
      });
      this.setPagination();      
      }).catch(this.error);
    },

    previousPage:function(event){
      let currPage = this.posts[1].query.page;
      this.$set(this.query, 'page', currPage-1);
      this.updatePagination();
    },

    nextPagination:function(event){
      let currPage = this.posts[1].query.page;
      this.$set(this.query, 'page', currPage+1);
      this.updatePagination();
    },

    immediatePage: function(event){
      let change = parseInt(event.target.dataset.amount);
      this.$set(this.query, 'page', change);
      this.updatePagination();
    },

    updateQuery: function(taxonomy, terms) {
      return new Promise((resolve) => { // eslint-disable-line no-undef
        this.$set(this.query, taxonomy, terms);
        this.$set(this.query, 'page', 1);
        // hide all of the posts
        this.posts.map((value, index) => {
          //if (value) this.$set(this.posts[index], 'show', false);
          if (value) this.posts.length=1;
          return value;
        });
        resolve();
      })
      .then(this.wp)
      .catch(message => {
      });
    },

    setPagination: function(){
      if(this.headers.pages<=6){
        this.firstPage = false;
        this.lastPage = false;
        this.totalPages = this.headers.pages;
      }
      else{
        this.firstPage = true;
        this.lastPage = true;
        if(this.query.page<=4){
          this.totalPages = [2,3,4,5]
        }
        else{
          if((this.query.page!=this.totalPages[1])&&this.headers.pages-this.query.page>4){
            let tempPages=[4];
            let tempNumber;
            if(this.query.page==this.totalPages[0]){
              tempNumber = this.totalPages[0]-1;
            }
            else{
              tempNumber = this.totalPages[1];
            }
            for(let i=0;i<4;i++){
              tempPages[i]=i+tempNumber;
            }
            this.totalPages = tempPages;
          }
          else{
            if(this.headers.pages-this.query.page<=4){
              let tempPages=[4];
              let bufferFlag;
              if(this.headers.pages-this.query.page==4){
                bufferFlag = this.query.page-1;
              }
              else{
                bufferFlag = this.headers.pages-4;
              }
            for(let i=0;i<4;i++){
              let j=i+bufferFlag;
              tempPages[i]=j;
            }
            this.totalPages = tempPages;
            } 
          }
        }
      }    
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
  },

};
