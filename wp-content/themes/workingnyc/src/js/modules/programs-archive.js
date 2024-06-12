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
    strings: {
      type: Object
    },

    // The page numbers to display
    totalPages: {
      type: Object
    },

    // If firstPage and lastPage are true, display page numbers
    // 1, (totalPages), pages
    // Otherwise, display (totalPages)
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
       * In the response() function inherited from archive.vue, 
       * pages is set to be the total number of pages and 
       * total is set to be the total number of programs returned
       * by the query
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

    /**
     * The two functions below override functions in archive.vue because this implementation 
     * has only one page's data stored at a time, while the archive.vue implementation stores data
     * on multiple pages
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
     * This function gets executed after fetching posts data to set the Posts array.
     * We are initializing the pagination array.
     **/ 

    process: function(data, query, headers) {
      // If there are posts for this query, map them to the template.
      let posts = (Array.isArray(data)) ?
        data.map(this.maps()[this.type]) : false;

      /**
       * Set only current page posts
       * The query argument gets the current, previous, next page
       * So, we set Posts array with current page posts
       */
      
      if(this.query.page == 1){
        this.$set(this.posts[query.page], 'posts', posts);
        this.$set(this.posts[query.page], 'headers', Object.freeze(headers));
      }

      // If there are no posts, pass along to the error handler.
      if (!Array.isArray(data))
        this.error({error: data, query: query});

      this.$set(this, 'init', true);

      // Initialize the pagination array with pages 1-n if n<=6
      // or pages 1,2,3,4,5 ... n
      if(this.headers.pages<=6){
        this.firstPage = false;
        this.lastPage = false;
        this.totalPages = [];
        for(let i=1;i<=this.headers.pages;i++){
          this.totalPages.push(i);
        }
      }
      else{
        this.firstPage = true;
        this.lastPage = true;
        this.totalPages = [2,3,4,5]
      } 
    },

    /**
     * Fetch the posts of updated page
     */
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
        let headers = Object.assign({}, this.headers);
        this.posts.length=1;
        let currentPost = {
          'posts': data,
          'headers': headers,
          'query': this.query,
          'show': true
        };
        this.posts.push(currentPost);
        this.setPagination();      
      }).catch(this.error);
    },

    previousPage:function(event){
      let currPage = this.posts[1].query.page;
      this.$set(this.query, 'page', currPage-1);
      this.updatePagination();
    },

    nextPage:function(event){
      let currPage = this.posts[1].query.page;
      this.$set(this.query, 'page', currPage+1);
      this.updatePagination();
    },

    immediatePage: function(event){
      let change = parseInt(event.target.dataset.amount);
      this.$set(this.query, 'page', change);
      this.updatePagination();
    },

    /**
     * Update the pagination array
     * The maximum page numbers to display: 6
     */
    setPagination: function(){

      /**
       * If number of pages is less than 7
       *  The totalPages = [1,2,3,4,5,6]
       *  The Pagination = 1,2,3,4,5,6
       * else
       *  The totalPages = [2,3,4,5]
       *  The Pagination = firstPage,2,3,4,5..lastPage
       */

      if(this.headers.pages<=6){
        this.firstPage = false;
        this.lastPage = false;
        this.totalPages = [];
        for(let i=1;i<=this.headers.pages;i++){
          this.totalPages.push(i);
        }
      }
      else{
        this.firstPage = true;
        this.lastPage = true;

        //If current page is between 1 and 4, the totalPages = [2,3,4,5]
        if(this.query.page<=4){
          this.totalPages = [2,3,4,5]
        }
        else{
          /**
           * If the current page is greater than 4, we have to show the previous and next page number
           */ 
          if(this.headers.pages-this.query.page>4){
            let tempPages=[];
            let tempNumber=this.query.page-1;
            for(let i=0;i<4;i++){
              tempPages[i]=i+tempNumber;
            }
            this.totalPages = tempPages;
          }
          else{
            /**
             * If the total pages - current page is less than or equal to 4,
             *  we have to display the last four page numbers
             *  we se the totalPages array with [lastpage-4,lastpage-3,lastpage-2,lastpage-1]
             */
            if(this.headers.pages-this.query.page<=4){
              let tempPages=[];
              let tempNumber;
              if(this.headers.pages-this.query.page==4){
                tempNumber = this.query.page-1;
              }
              else{
                tempNumber = this.headers.pages-4;
              }
            for(let i=0;i<4;i++){
              let j=i+tempNumber;
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
