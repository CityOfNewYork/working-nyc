<template>
  <div>
    <div class="c-dropdown c-dropdown-max layout-content sticky top-0 bg-scale-1 z-20">
      <div class="c-utility wrap">
        <a class="link-icon mie-auto" href="/">
          <svg aria-hidden="true" class="icon-wnyc-ui rtl:flip">
            <use href="#feather-chevron-left"></use>
          </svg>

          <span>{{ strings.HOME }}</span>
        </a>

        <button :disabled="terms.length === 0" aria-controls="aria-c-filter" aria-expanded="false" class="btn btn-small btn-secondary light:btn-primary" data-dialog="open" data-dialog-lock="true" data-js="dialog">
          <span class="mie-1">{{ strings.FILTERS }}</span>

          <span class="badge badge-small status-secondary light:status-primary">{{ totalFilters }}</span>
        </button>
      </div>

      <div aria-hidden="true" class="hidden" id="aria-c-filter">
        <div class="layout-content">
          <div class="wrap text-end relative z-20">
            <button aria-controls="aria-c-filter" aria-expanded="false" class="btn btn-primary btn-small" data-dialog="close" data-js="dialog" tabindex="-1">
              <svg aria-hidden="true" class="icon-wnyc-ui" tabindex="-1">
                <use href="#feather-x"></use>
              </svg>

              <span>{{ strings.CLOSE }}</span>
            </button>
          </div>
        </div>

        <form tabindex="-1">
          <div class="layout-content">
            <div>
              <div class="mb-8" v-for="term in terms" :key="term.slug">
                <fieldset class="fieldset mb-2" tabindex="-1">
                  <legend class="h5 block w-full m-0 py-2 mb-1 tablet:py-3 pis-4 text-alt sticky top-0 z-10 bg-scale-1" tabindex="-1">
                    {{ term.name }}
                  </legend>

                  <div class="wrap grid gap-2 tablet:grid-cols-2 tablet:gap-3">
                    <label class="option w-full m-0" tabindex="-1" v-for="filter in term.filters" :key="filter.slug" gtm-data="test">
                      <input type="checkbox" tabindex="-1" :value="filter.slug" :checked="filter.checked" @change="change({event: $event, data: filter})">

                      <span class="option__base">
                        <svg aria-hidden="true" class="option__graphic" tabindex="-1">
                          <use href="#option-wnyc-checkbox"></use>
                        </svg>

                        <span class="option__label">{{ filter.name }}</span>
                      </span>
                    </label>
                  </div>
                </fieldset>

                <div class="pis-4">
                  <button class="text-small" type="button" tabindex="-1"
                    @click="toggle({event: $event, data: {parent: term.slug}})"
                    :aria-pressed="term.filters.filter(f => f.checked).length === term.filters.length ? 'true' : 'false'"
                    v-html="strings.TOGGLE_ALL.replace('{{ TERM }}', term.name.toLowerCase())">
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="layout-content shadow-up py-2 sticky bottom-0 z-10 text-center bg-scale-1">
            <div class="wrap">
              <button aria-controls="aria-c-filter" aria-expanded="false" class="btn btn-secondary w-full" data-js="dialog" tabindex="-1" v-html="strings.CLOSE_AND_SEE_PROGRAMS.replace('{{ number }}', headers.total)"></button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="layout-content">
      <div class="page-max">
        <header class="o-header">
          <div>
            <h1 class="o-header__title">{{ strings.PAGE_TITLE }}</h1>

            <!-- <h2 class="o-header__subtitle" v-if="checkedFilters.length">Exploring <span v-for="f, i in checkedFilters"><span v-if="checkedFilters.length > 1 && i == checkedFilters.length - 1">and </span>v{ f.name }<span v-if="checkedFilters.length > 2 && i < checkedFilters.length - 1">,</span><span v-if="i == checkedFilters.length - 1">.</span><span v-else>&nbsp;</span></span></h2> -->

            <div class="mb-3" v-if="strings.PAGE_CONTENT" v-html="strings.PAGE_CONTENT"></div>

            <nav class="o-header__breadcrumbs" aria-label="Breadcrumb">
              <a href="/">{{ strings.HOME }}</a>

              <svg aria-hidden="true" class="o-header__breadcrumbs-chevron icon-wnyc-ui rtl:flip">
                <use href="#feather-chevron-right"></use>
              </svg>

              <b aria-current="page">{{ strings.PAGE_TITLE }}</b>
            </nav>
          </div>
        </header>
      </div>
    </div>

    <section class="page-max desktop:px-6" v-if="init">
      <div class="wrap desktop:px-6" v-if="!loading">
        <h2 class="text-p font-p" data-alert="text" aria-live="polite" v-if="posts != null">
          <span v-html="strings.SHOWING.replace('{{ TOTAL_VISIBLE }}', totalVisible).replace('{{ TOTAL }}', headers.total)"></span>

          <button v-if="totalFilters > 0" v-html="strings.RESET" @click="reset"></button>
        </h2>

        <div class="grid gap-3 tablet:grid-cols-2 desktop:gap-5 mb-3" ref="results">
          <Program v-for="post in postsFlat" :key="post.id" v-bind:post="post" v-bind:strings="strings"></Program>
        </div>

        <p data-alert="text" v-if="posts != null" v-html="strings.SHOWING.replace('{{ TOTAL_VISIBLE }}', totalVisible).replace('{{ TOTAL }}', headers.total)"></p>
      </div>

      <div class="flex items-center text-em justify-center py-4" v-if="none">
        <p>{{ strings.NO_RESULTS }}</p>
      </div>
    </section>

    <section class="page-max desktop:px-6" v-else>
      <div class="flex items-center text-em justify-center py-8">
        <svg class="spinner icon-4 block mie-2" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <circle class="spinner__path" cx="12" cy="12" r="10" fill="none"></circle>
        </svg>

        {{ strings.LOADING }}
      </div>
    </section>

    <div class="layout-content py-6 pb-8 mb-4" v-if="init">
      <div class="wrap">
        <button id="pagination" class="btn btn-primary w-full" @click="nextPage" v-if="next" data-amount="1">
          {{ strings.SHOW_MORE }}
        </button>

        <article class="c-alert mb-3" data-js="alert-help" v-else-if="strings.SUGGEST" v-html="strings.SUGGEST"></article>
      </div>
    </div>
  </div>
</template>

<script>
  import ProgramsArchive from '../../src/js/modules/programs-archive.js';

  export default ProgramsArchive;
</script>
