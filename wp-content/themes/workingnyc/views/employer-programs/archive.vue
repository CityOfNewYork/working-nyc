<template>
  <div>
    <div class="layout-content bg-scale-3">
      <div class="page-max">
        <header class="o-header">
          <div>
            <nav class="o-header__breadcrumbs" aria-label="Breadcrumb">
              <a href="/">{{ strings.HOME }}</a>
            </nav>

            <div class="o-header__title">
              <h1 id="page-heading" class="o-header__heading">{{ strings.PAGE_TITLE }}</h1>
            </div>

            <div class="mb-2">
              <p>{{ strings.PAGE_SUBTITLE }}</p>
            </div>

            <form class="o-search__form w-full" @submit.prevent="wp">
              <div class="input o-search__input rounded">
                  <input class="rounded border-0" v-model="query.search_term"/>
                  <button type="submit" class="o-search__submit">
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

  <div class="flex m-auto justify-center gap-x-8 mt-7" v-if="init">
    <section class="w-[350px] p-3 rounded border border-scale-3">
      <form>
        <div>
          <h6 class="font-bold">
            {{ strings.FILTERS }}
          </h6>
          <div>
            <div v-for="term in terms" :key="term.slug">
              <fieldset class="fieldset mb-3" tabindex="-1">
                <div class="border-b border-scale-3">
                  <legend class="h6 mb-2 font-bold">
                    {{ term.name }}
                  </legend>
                  <svg aria-hidden="true" class="option__graphic" tabindex="-1">
                    <use href="#down-arrow"></use>
                  </svg>
                </div>

                <div class="grid gap-1">
                  <label class="option w-full m-0" tabindex="-1" v-for="filter in term.filters" :key="filter.slug" gtm-data="test">
                    <input type="checkbox" tabindex="-1" :value="filter.slug" :checked="filter.checked" @change="click({event: $event, data: filter})">

                    <span class="option__base bg-transparent">
                      <svg aria-hidden="true" class="option__graphic" tabindex="-1">
                        <use href="#option-nyco-checkbox"></use>
                      </svg>

                      <span class="font-normal">{{ filter.name }}</span>
    
                    </span>
                  </label>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </form>
    </section>
    <div class="w-1/2">
      <section class="page-max">
        <div v-if="!loading">
          <div class="mb-3">
            <h2 class="text-p font-p inline-block m-0" data-alert="text" data-dialog-focus-on-close="aria-c-filter" aria-live="polite" v-if="posts != null">
              <span v-html="strings.SHOWING.replace('{{ TOTAL_VISIBLE }}', totalVisible).replace('{{ TOTAL }}', headers.total)"></span>
            </h2>

            <!-- <button v-if="totalFilters > 0" v-html="strings.RESET" @click="reset"></button> -->
          </div>

          <div class="grid gap-3 mb-3">
            <EmployerProgram v-for="post in postsFlat" :key="post.id" v-bind:post="post" v-bind:strings="strings"></EmployerProgram>
          </div>

          <p data-alert="text" v-if="posts != null" v-html="strings.SHOWING.replace('{{ TOTAL_VISIBLE }}', totalVisible).replace('{{ TOTAL }}', headers.total)"></p>
        </div>

        <div class="flex items-center text-em justify-center py-4" v-if="none">
          <p>{{ strings.NO_RESULTS }} <button v-html="strings.RESET" @click="reset"></button></p>
        </div>
      </section>

      
    </div>
  </div>

  <section class="page-max desktop:px-6" v-else>
    <div class="flex items-center text-em justify-center py-8">
      <svg class="spinner icon-4 block mie-2" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <circle class="spinner__path" cx="12" cy="12" r="10" fill="none"></circle>
      </svg>

      {{ strings.LOADING }}
    </div>
  </section>

  </div>
</template>

<script>
  import EmployerProgramsArchive from '../../src/js/modules/employer-programs-archive.js';

  export default EmployerProgramsArchive;
</script>
