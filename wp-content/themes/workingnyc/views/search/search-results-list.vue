<template>
  <div>
    <h2 class="text-p font-p inline-block m-0" data-alert="text" aria-live="polite">
      <span v-html="strings.SHOWING.replace('{{ TOTAL_VISIBLE }}', totalVisible).replace('{{ TOTAL }}', headers.total)"></span>
    </h2>
    <div><span v-for="post in postsFlat" :key="post.id" v-bind:post="post" v-bind:strings="strings"> {{ post.id }} </span></div>
    <div><span v-for="post in postsFlat" :key="post.id" v-bind:post="post" v-bind:strings="strings"> {{ post.title }} </span></div>
    <div><span v-for="post in postsFlat" :key="post.id" v-bind:post="post" v-bind:strings="strings"> {{ post.context.link }} </span></div>
    <div><span v-for="post in postsFlat" :key="post.id" v-bind:post="post" v-bind:strings="strings"> {{ post }} </span></div>
    <section class="px-4 tablet:px-6">
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
  </div>
</template>

<script>
  import SearchArchive from '../../src/js/modules/search-archive.js';

  export default SearchArchive;
</script>