<template>
  <div>
    <div class="bg-[#E3F1FD]">
      <div class="site-max-width">
        <div>
          <header class="o-header px-0 pb-5 tablet:pb-6 desktop:pb-7">
            <div>
              <nav class="o-header__breadcrumbs flex flex-wrap" aria-label="Breadcrumb">
                <a v-bind:href="strings.HOME_LINK">{{ strings.HOME }}</a>

                <div>
                  <svg aria-hidden="true" class="o-header__breadcrumbs-chevron icon-ui rtl:flip">
                    <use href="#lucide-chevron-right"></use>
                  </svg>

                  <b aria-current="page">{{ strings.PAGE_TITLE }}</b>
                </div>
              </nav>

              <div class="o-header__title">
                <h1 id="page-heading" class="o-header__heading">{{ strings.PAGE_TITLE }}</h1>
              </div>

              <div v-if="strings.PAGE_CONTENT" v-html="strings.PAGE_CONTENT"></div>
            </div>
          </header>
        </div>
      </div>
    </div>

    <section class="site-max-width mt-5" v-if="init">
      <div v-if="!loading">
        <div class="mb-3">
          <h2 class="text-p font-p inline-block m-0" data-alert="text" data-dialog-focus-on-close="aria-c-filter" aria-live="polite" v-if="posts != null">
            <span v-html="strings.SHOWING.replace('{{ TOTAL_VISIBLE }}', totalVisible).replace('{{ TOTAL }}', headers.total)"></span>
          </h2>

          <button v-if="totalFilters > 0" v-html="strings.RESET" @click="reset"></button>
        </div>

        <div class="grid gap-3 grid-cols-1 tablet:grid-cols-2 desktop:gap-5 mb-3 max-w-full">
          <Program v-for="post in postsFlat" :key="post.id" v-bind:post="post" v-bind:strings="strings"></Program>
        </div>

        <p data-alert="text" v-if="posts != null" v-html="strings.SHOWING.replace('{{ TOTAL_VISIBLE }}', totalVisible).replace('{{ TOTAL }}', headers.total)"></p>
      </div>

      <div class="flex items-center text-em justify-center py-4" v-if="none">
        <p>{{ strings.NO_RESULTS }} <button v-html="strings.RESET" @click="reset"></button></p>
      </div>
    </section>

    <section class="site-max-width mt-5" v-else>
      <div class="flex items-center text-em justify-center py-8">
        <svg class="spinner icon-4 block mie-2" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <circle class="spinner__path" cx="12" cy="12" r="10" fill="none"></circle>
        </svg>

        {{ strings.LOADING }}
      </div>
    </section>

    <div class="site-max-width py-6 pb-8 mb-4" v-if="init">
    
    </div>
  </div>
</template>

<script>
  import ProgramsArchive from '../../src/js/modules/programs-archive.js';

  export default ProgramsArchive;
</script>
