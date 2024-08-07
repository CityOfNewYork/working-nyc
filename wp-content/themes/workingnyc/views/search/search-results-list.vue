<template>
  <div>
    <!-- Header with search bar -->
    <div class="bg-[#EEF4FF]">
      <div class="site-max-width">
        <header class="o-header pl-[0px] pr-[0px]">
          <div>
            <nav class="o-header__breadcrumbs" aria-label="Breadcrumb">
              <a v-bind:href="strings.HOME_LINK">{{ strings.HOME }}</a>
              <svg aria-hidden="true" class="o-header__breadcrumbs-chevron icon-ui rtl:flip">
                <use href="#lucide-chevron-right"></use>
              </svg>

              <b aria-current="page">Search</b>
            </nav>

            <div class="o-header__title">
              <h1 id="page-heading" class="o-header__heading">Search results</h1>
            </div>

            <div class="mb-2">
              <p>{{ strings.PAGE_SUBTITLE }}</p>
            </div>

            <form class="o-search__form w-full desktop:w-[814px]" @submit.prevent="submitSearch">
            <div class="input o-search__input rounded">
                <input class="rounded border-0" v-model="query.s"/>
                <button :disabled="query.s == ''" type="submit" class="o-search__submit">
                    <svg class="icon-ui">
                        <title>Submit</title>
                        <use href="#lucide-search"></use>
                    </svg>
                </button>
            </div>
          </form>
          </div>
        </header>
      </div>
    </div>
    <!-- Body -->
    <div class="site-max-width">

      <!-- Top filters section -->
      <div class="desktop:flex desktop:justify-center">

        <!-- Filters dropdown -->
        <div class="py-5 tablet:py-6 px-2 tablet:px-7" v-if="filtersExpanded">
          <div class="desktop:hidden">
            <div class="flex justify-end mb-5">
              <button class="no-underline flex items-center decoration-[#080707] hover:underline active:underline" @click="scrollToTop">
                <svg class="stroke-black w-3 h-3 mr-[4px]">
                    <use href="#lucide-x"></use>
                </svg>
                <span class="text-nowrap text-[18px] font-[600] text-[#080707]">{{ strings.CLOSE }}</span>
              </button>
            </div>
          </div>
          <div>
            <div class="mb-3 font-[500] text-[18px]">
              {{ strings.FILTER_BY }}
            </div>
              <div v-for="(term, index) in terms" :key="term.slug">
                <fieldset class="fieldset mb-3" tabindex="-1">
                  <div class="cursor-pointer border-b border-scale-3 flex" @click="toggleAccordion(index)">
                    <legend class="mb-2 font-[600] text-[18px]">
                      {{ term.name }}
                    </legend>
                    <span class="ml-auto">
                      <svg aria-hidden="true" class="option__graphic" tabindex="-1" v-if="indexArr.indexOf(index) !== -1">
                        <use href="#up-arrow"></use>
                      </svg> 
                      <svg aria-hidden="true" class="option__graphic" tabindex="-1" v-if="indexArr.indexOf(index) === -1">
                        <use href="#down-arrow"></use>
                      </svg>   
                    </span>  
                  </div>

                  <div class="grid gap-1" v-if="indexArr.indexOf(index) !== -1">
                    <label class="option w-full m-0" tabindex="-1" v-for="filter in term.filters" :key="filter.slug" gtm-data="test">
                      <input type="checkbox" tabindex="-1" :value="filter.slug" :checked="filter.checked" @change="click({event: $event, data: filter})">

                      <span class="option__base bg-transparent">
                        <svg aria-hidden="true" class="option__graphic" tabindex="-1">
                          <use href="#option-nyco-checkbox"></use>
                        </svg>

                        <span class="font-normal w-full">{{ filter.name }}</span>
                      </span>
                    </label>
                  </div>
                </fieldset>
              </div>
          </div>
          <div class="wrap gap-3 flex justify-center">
            <button class="btn-small tablet:btn desktop:btn btn-styled" :disabled="totalFilters == 0" v-html="strings.RESET" @click="reset"></button>
            <button class="btn-small tablet:btn desktop:btn btn-secondary" @click="scrollToTop">{{ strings.APPLY_FILTERS }}</button>
          </div>
        </div>

        <!-- Filter button (tablet and mobile) and filter tags -->
        <div 
          v-bind:class="'desktop:w-4/5 py-2 px-2 desktop:pt-7 desktop:px-0 tablet:px-7 flex desktop:flex-wrap overflow-x-auto gap-y-2 justify-start items-center shadow-[2px_2px_30px_0_#EFF1F5] desktop:shadow-none ' 
          + (totalFilters > 0 ? 'desktop:pb-5' : 'desktop:pb-0')" 
          v-else>
          <!--Hide filters when no posts for new search request -->
          <div v-if="(posts.length>0 && posts[1].posts.length >= 1) || toggleFilterMenu == true" class="desktop:hidden pr-2">
            <button :disabled="terms.length === 0" @click="filtersExpanded = true" class="btn btn-small btn-secondary bg-white text-[#30374F] border-[#30374F]">
              <span class="mie-1">{{ strings.FILTERS }}</span>
              <span class="badge badge-small bg-[#30374F] text-white font-normal">{{ totalFilters }}</span>
            </button>
          </div>
          <div class="hidden desktop:flex pr-2" v-if="totalFilters > 0">Active filters</div>
          <template v-for="term in terms">
            <template v-for="filter in term.filters">
              <div class="small rounded p-1 bg-scale-2 mr-1 flex bg-[#EFF1F5]" v-if="filter.checked">
                  <span class="text-nowrap ">{{ filter.name }}</span>
                  <button class="rounded hover:bg-[#DCDFEA] active:bg-[#DCDFEA]" @click="click({event: $event, data: filter})">
                    <svg aria-hidden="true" class="icon-ui stroke-black" tabindex="-1">
                      <use href="#lucide-x"></use>
                    </svg>
                  </button>
              </div>
            </template>
          </template>
          <button class="hidden desktop:flex small text-black no-underline hover:underline active:underline font-[600]" v-if="totalFilters > 0" @click="reset">{{ strings.RESET }}</button>
        </div>
      </div>

      <!-- Main search results section -->
      <div class="mb-5 tablet:mb-6 desktop:mb-7 mt-5 tablet:mt-6 desktop:mt-0" v-if="init" v-show="!filtersExpanded">
        <div class="flex gap-x-[5%]">

          <!-- Filters side panel -->
          <!--Hide filters when no posts for new search request -->
          <section v-if="(posts.length>0 && posts[1].posts.length >= 1) || toggleFilterMenu == true" class="hidden desktop:flex w-1/4 p-3 rounded border border-scale-3">
            <form class="w-full">
              <div>
                <div class="font-[500] text-[20px] mb-3">
                  {{ strings.FILTER_BY }}
                </div>
                <div>
                  <div v-for="(term, index) in terms" :key="term.slug">
                    <fieldset class="fieldset mb-3" tabindex="-1">
                      <div class="cursor-pointer border-b border-scale-3 flex" @click="toggleAccordion(index)">
                        <legend class="mb-2 font-[600] text-[20px]">
                          {{ term.name }}
                        </legend>
                        <span class="ml-auto">
                          <svg aria-hidden="true" class="option__graphic" tabindex="-1" v-if="indexArr.indexOf(index) !== -1">
                            <use href="#up-arrow"></use>
                          </svg> 
                          <svg aria-hidden="true" class="option__graphic" tabindex="-1" v-if="indexArr.indexOf(index) === -1">
                            <use href="#down-arrow"></use>
                          </svg>   
                        </span>
                      </div>

                      <div class="grid gap-1" v-if="indexArr.indexOf(index) !== -1">
                        <label class="option w-full m-0" tabindex="-1" v-for="filter in term.filters" :key="filter.slug" gtm-data="test">
                          <input type="checkbox" tabindex="-1" :value="filter.slug" :checked="filter.checked" @change="click({event: $event, data: filter})">

                          <span class="option__base bg-transparent border-0 items-center">
                            <svg aria-hidden="true" class="option__graphic w-3 h-3" tabindex="-1">
                              <use href="#option-nyco-checkbox"></use>
                            </svg>

                            <span class="font-normal w-full">{{ filter.name }}</span>
                          </span>
                        </label>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </form>
          </section>

          <!-- List of search results -->
          <div class="w-full desktop:w-1/2">
            <section class="page-max tablet:mx-7 desktop:mx-0">
              <div v-if="loading || submitFlag">
                <div class="flex items-center text-em justify-center py-8">
                  <svg class="spinner icon-4 block mie-2" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <circle class="spinner__path" cx="12" cy="12" r="10" fill="none"></circle>
                  </svg>
          
                  {{ strings.LOADING }}
                </div>
              </div>

                <!-- If there are no posts available, display a message indicating that -->
                <div v-else-if="none">
                  <div v-if="totalFilters == 0 && headers.total == 0 && resetFlag == true">
                    <div class="my-3 tablet:my-4 tablet:px-6">
                      <h4>No results for "{{ currentSearchTerm }}"</h4>
                      <div v-html="noResults_data"></div>
                      </div>
                  </div>
                  <div class="flex items-center text-em justify-center py-4" v-else>
                    <p>{{ strings.NO_RESULTS }} <button v-html="strings.RESET" @click="reset"></button></p>
                  </div>
                </div>

                <!-- Otherwise, display the list of posts-->
                <div v-else>
                  <div class="mb-3">
                    <h2 class="text-p font-p inline-block m-0" data-alert="text" data-dialog-focus-on-close="aria-c-filter" aria-live="polite" v-if="posts != null && totalVisible != 0">
                      <span v-html="strings.SHOWING.replace('{{ TOTAL_VISIBLE }}', totalVisible).replace('{{ TOTAL }}', headers.total)"></span>
                    </h2>
                  </div>

                  <div class="grid grid-cols-1 gap-3 mb-3">
                    <SearchResult v-for="post in postsFlat" :key="post.id" v-bind:post="post" v-bind:strings="strings"></SearchResult>
                  </div>

                  <button id="pagination" class="btn btn-primary w-full" @click="nextPage" v-if="next" data-amount="1">
                    {{ strings.SHOW_MORE }}
                  </button>
                </div>
            </section>
          </div>
        </div>
      </div>

      <!-- Loading icon if posts haven't loaded -->
      <section class="page-max desktop:px-6" v-else>
        <div class="flex items-center text-em justify-center py-8">
          <svg class="spinner icon-4 block mie-2" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <circle class="spinner__path" cx="12" cy="12" r="10" fill="none"></circle>
          </svg>
  
          {{ strings.LOADING }}
        </div>
      </section>
    </div>

  </div>
</template>
  
  <script>
    import SearchArchive from '../../src/js/modules/search-archive.js';
  
    export default SearchArchive;
  </script>
  