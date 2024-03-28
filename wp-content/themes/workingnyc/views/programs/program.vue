<template>
  <article class="c-card">
    <header class="bg-[#F0F6FA] py-2 tablet:py-3 px-5 min-h-[128px]" :data-js="'post-' + post.id">
      <h3 class="text-[20px] tablet:text-[23px] text-[#080707] mb-2" v-html="post.context.program_plain_language_title"></h3>
      <p class="text-[18px] desktop:text-[20px] text-alt">
        <span data-program="title" v-html="post.context.program_title"></span>
        <span v-if="post.context.program_agency"> {{ strings.BY }} </span>
        <span v-if="post.context.program_agency" v-html="post.context.program_agency"></span>
      </p>
    </header>

    <div class="c-card__body py-3 px-5 tablet:py-5 min-h-[206px] justify-between">
      <div class="mb-0">
        <p class="c-card__status flex items-center" v-if="post.context.status">
          <mark class="badge mie-2" data-program="recruiting" v-if="post.context.status.recruiting">
            {{ post.context.status.recruiting.name }}<span class="sr-only">.</span>
          </mark>

          <span class="flex mie-2" v-if="post.context.status.disability">
            <svg class="icon text-em" role="img">
              <title v-html="post.context.status.disability.name"></title>

              <use href="#nyco-accessibility"></use>
            </svg>
          </span> <span v-if="post.context.status.disability" class="sr-only">&nbsp;</span>

          <span class="flex me-2" v-if="post.context.status.language">
            <svg class="icon-ui text-em" role="img">
              <title v-html="post.context.status.language.name"></title>

              <use href="#nyco-languages"></use>
            </svg>
          </span>
        </p>

        <p class="mb-3">
          <span v-if="post.context.preview" v-html="post.context.preview"></span>
        </p>
      </div>
      <div>
        <ul v-if="post.context.services || post.context.schedule || post.context.supports" class="c-card__features">
          <li v-if="post.context.services">
            <svg class="icon-ui c-card__feature-icon h-22 w-22" role="img">
              <title>{{ strings.SERVICES }}</title>

              <use href="#lucide-award"></use>
            </svg>

            <span v-html="post.context.services"></span>
          </li>

          <li v-if="post.context.schedule">
            <svg class="icon-ui c-card__feature-icon h-22 w-22" role="img">
              <title>{{ strings.SCHEDULE }}</title>

              <use href="#lucide-calendar"></use>
            </svg>

            <span v-html="post.context.schedule"></span>
          </li>

          <li v-if="post.context.supports">
            <svg class="icon-ui c-card__feature-icon h-22 w-22" role="img">
              <title>{{ strings.SUPPORTS }}</title>

              <use href="#lucide-heart-handshake"></use>
            </svg>

            <span v-html="post.context.supports"></span>
          </li>
        </ul>

        <a class="btn btn-secondary desktop:w-fit w-full break-words" :href="post.context.link" :target="(post.context.external) ? '_blank' : false" :rel="(post.context.external) ? 'noopener' : false">
          <span class="text-[22px] font-[700] break-words" v-if="post.context.external" v-html="post.context.link_label"></span>
          <span class="text-[22px] font-[700] break-words" v-else v-html="strings.LEARN_MORE_ABOUT.replace('{{ program }}', post.context.program_plain_language_title)"></span>
          <svg aria-hidden="true" class="icon-ui rtl:flip h-22 w-22">
            <use :href="(post.context.external) ? '#lucide-external-link' : '#lucide-arrow-right'"></use>
          </svg>
        </a>

        <details v-if="post.raw">
          <summary>Raw</summary>

          <pre tabindex="-1">{{ post.raw }}</pre>
        </details>
      </div>
    </div>
  </article>
</template>

<script>
  export default {
    props: {
      post: {
        type: Object
      },
      strings: {
        type: Object
      }
    }
  };
</script>
