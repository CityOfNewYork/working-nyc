<template>
  <section class="px-4 tablet:px-6">
    <div class="grid gap-3 tablet:grid-cols-2 desktop:gap-5 mb-3">
      <SearchResult v-for="post in postsFlat" :key="post.id" v-bind:post="post" v-bind:strings="strings"></SearchResult>
    </div>
  </section> 
</template>

<script>
  import SearchResultsList from '../../src/js/modules/search-archive.js';

  export default SearchResultsList;
</script>
