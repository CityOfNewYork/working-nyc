<template>
  <div>
    <div class="layout-content">
      <div class="page-max">
        <header class="o-header">
          <div>
            <nav class="o-header__breadcrumbs" aria-label="Breadcrumb">
              <a href="/">{{ strings.HOME }}</a>

              <svg aria-hidden="true" class="o-header__breadcrumbs-chevron icon-ui rtl:flip">
                <use href="#lucide-chevron-right"></use>
              </svg>

              <b aria-current="page">{{ strings.PAGE_TITLE }}</b>
            </nav>

            <div class="o-header__title">
              <h1 id="page-heading" class="o-header__heading">{{ strings.PAGE_TITLE }}</h1>
            </div>

            <div class="mb-3" v-if="strings.PAGE_CONTENT" v-html="strings.PAGE_CONTENT"></div>
          </div>
        </header>
      </div>
    </div>

    <div class="bg-scale-4 p-4">
      <form class="o-search__form w-full">
        <div class="input o-search__input rounded">
            <input class="rounded border-0"/>
            <button type="submit" class="o-search__submit">
                <svg class="icon-ui">
                    <title>Submit</title>
                    <use href="#lucide-search"></use>
                </svg>
            </button>
        </div>
      </form>
    </div>
  

  <div class="grid grid-cols-[1fr_2fr]">
    <section>
      <form>
        <div class="layout-content">
          <div>
            <div class="mb-8" v-for="term in terms" :key="term.slug">
              <fieldset class="fieldset mb-2" tabindex="-1">
                <legend class="h5 block w-full m-0 py-2 mb-1 tablet:py-3 pis-4 text-alt sticky top-0 z-10 bg-scale-1" tabindex="-1">
                  {{ term.name }}
                </legend>

                <div class="wrap grid gap-2 tablet:grid-cols-2 tablet:gap-3">
                  <label class="option w-full m-0" tabindex="-1" v-for="filter in term.filters" :key="filter.slug" gtm-data="test">
                    <input type="checkbox" tabindex="-1" :value="filter.slug" :checked="filter.checked" @change="click({event: $event, data: filter})">

                    <span class="option__base">
                      <svg aria-hidden="true" class="option__graphic" tabindex="-1">
                        <use href="#option-nyco-checkbox"></use>
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
      </form>
    </section>
    <div>
      <section class="page-max desktop:px-6" v-if="init">
        <div class="wrap desktop:px-6" v-if="!loading">
          <div class="mb-3">
            <h2 class="text-p font-p inline-block m-0" data-alert="text" data-dialog-focus-on-close="aria-c-filter" aria-live="polite" v-if="posts != null">
              <span v-html="strings.SHOWING.replace('{{ TOTAL_VISIBLE }}', totalVisible).replace('{{ TOTAL }}', headers.total)"></span>
            </h2>

            <button v-if="totalFilters > 0" v-html="strings.RESET" @click="reset"></button>
          </div>

          <div class="grid gap-3 tablet:grid-cols-2 desktop:gap-5 mb-3">
            <EmployerProgram v-for="post in postsFlat" :key="post.id" v-bind:post="post" v-bind:strings="strings"></EmployerProgram>
          </div>

          <p data-alert="text" v-if="posts != null" v-html="strings.SHOWING.replace('{{ TOTAL_VISIBLE }}', totalVisible).replace('{{ TOTAL }}', headers.total)"></p>
        </div>

        <div class="flex items-center text-em justify-center py-4" v-if="none">
          <p>{{ strings.NO_RESULTS }} <button v-html="strings.RESET" @click="reset"></button></p>
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
    </div>
  </div>

  </div>
</template>

<script>
  import EmployerProgramsArchive from '../../src/js/modules/employer-programs-archive.js';

  export default EmployerProgramsArchive;
</script>
