<template>
  <section class="px-4 tablet:px-6">
    <h2 class="text-p font-p inline-block m-0" data-alert="text" aria-live="polite">
      <span v-html="strings.SHOWING.replace('{{ TOTAL_VISIBLE }}', totalVisible).replace('{{ TOTAL }}', headers.total)"></span>
    </h2>
    <div class="mb-8" v-for="term in terms" :key="term.slug">
      <div>
        <div>
          {{ term.name }}
        </div>
        <label class="option w-full m-0" tabindex="-1" v-for="filter in term.filters" :key="filter.slug" gtm-data="test">
          <input type="checkbox" tabindex="-1" :value="filter.slug" :checked="filter.checked">

          <span class="option__base">
            <svg aria-hidden="true" class="option__graphic" tabindex="-1">
              <use href="#option-nyco-checkbox"></use>
            </svg>

            <span class="option__label">{{ filter.name }}</span>
          </span>
        </label>
      </div>
    </div>
    <div class="grid gap-3 tablet:grid-cols-2 desktop:gap-5 mb-3">
      <SearchResult v-for="post in postsFlat" :key="post.id" v-bind:post="post" v-bind:strings="strings"></SearchResult>
    </div>
    <div class="layout-content py-6 pb-8 mb-4" v-if="init">
      <div class="wrap">
        <button id="pagination" class="btn btn-primary w-full" @click="nextPage" v-if="next" data-amount="1">
          {{ strings.SHOW_MORE }}
        </button>
      </div>
    </div>
  </section>
</template>

<script>
  import SearchResultsList from '../../src/js/modules/search-archive.js';

  export default SearchResultsList;
</script>
