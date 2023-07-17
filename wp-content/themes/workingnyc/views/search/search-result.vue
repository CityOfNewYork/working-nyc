<template>
  <!-- If the search result is a job, format it using a job card (copied from jobs/job.vue) -->
  <!-- Otherwise, it must be a program (but we still have a check to confirm that it is): -->
  <!-- format it using a program card (copied from programs/program.vue) -->
  <!-- In the future, search results could be formatted differently from job and program cards -->
  <article v-if="post.type == 'jobs'" class="c-card">
    <header class="c-card__header">
      <span>
        <a class="c-card__header-link" :data-js="'post-' + post.id" :href="post.link">
          <h3 class="c-card__title">
            <span class="c-card__underline" v-html="post.context.cardTitle"></span>
          </h3>
        </a>

        <p class="c-card__subtitle text-alt">
          <b v-if="post.context.sector" v-html="post.context.sector"></b>
          <span v-if="post.context.sector && post.context.organization"> {{ strings.WITH }} </span>
          <span v-html="post.context.organization"></span>
        </p>
      </span>
    </header>

    <div class="c-card__body">
      <div class="c-card__summary">
        <p v-html="post.context.summary"></p>
      </div>

      <ul class="c-card__features">
        <li v-if="post.context.schedule">
          <svg class="icon-ui c-card__feature-icon" role="img">
            <title>{{ strings.SCHEDULE }}</title>

            <use href="#lucide-calendar"></use>
          </svg>

          <span v-html="post.context.schedule"></span>
        </li>

        <li v-if="post.context.salary">
          <svg class="icon-ui c-card__feature-icon" role="img">
            <title>{{ strings.SALARY }}</title>

            <use href="#lucide-dollar-sign"></use>
          </svg>

          <span v-html="post.context.salary"></span>
        </li>

        <li v-if="post.context.location">
          <svg class="icon-ui c-card__feature-icon" role="img">
            <title>{{ strings.LOCATION }}</title>

            <use href="#lucide-map-pin"></use>
          </svg>

          <span v-html="post.context.location"></span>
        </li>
      </ul>

      <a class="c-card__cta" :href="post.link">
        <svg aria-hidden="true" class="icon-ui rtl:flip">
          <use href="#lucide-arrow-left"></use>
        </svg>

        <span v-html="strings.LEARN_MORE_ABOUT.replace('{{ program }}', post.title)"></span>

        <svg aria-hidden="true" class="icon-ui rtl:flip">
          <use href="#lucide-arrow-right"></use>
        </svg>
      </a>

      <details v-if="post.raw">
        <summary>Raw</summary>

        <pre tabindex="-1">{{ post.raw }}</pre>
      </details>
    </div>
  </article>
  <article v-else-if="post.type == 'programs'" class="c-card">
    <header class="c-card__header">
      <span>
        <a class="c-card__header-link" :data-js="'post-' + post.id" :href="post.context.link" :target="(post.context.external) ? '_blank' : false" :rel="(post.context.external) ? 'noopener' : false">
          <h3 class="c-card__title">
            <span class="c-card__underline" v-html="post.context.program_plain_language_title"></span>

            <svg v-if="post.context.external" aria-hidden="true" class="icon-ui rtl:flip">
              <use href="#lucide-external-link"></use>
            </svg>
          </h3>
        </a>

        <p class="c-card__subtitle text-alt">
          <b data-program="title" v-html="post.context.program_title"></b>
          <span v-if="post.context.program_agency"> {{ strings.BY }} </span>
          <span v-if="post.context.program_agency" v-html="post.context.program_agency"></span>
        </p>
      </span>
    </header>

    <div class="c-card__body">
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

      <div class="c-card__summary">
        <p>
          <span v-if="post.context.preview" v-html="post.context.preview"></span>
          <span v-if="post.context.populations" v-html="post.context.populations"></span>
        </p>
      </div>

      <ul class="c-card__features">
        <li v-if="post.context.services">
          <svg class="icon-ui c-card__feature-icon" role="img">
            <title>{{ strings.SERVICES }}</title>

            <use href="#lucide-award"></use>
          </svg>

          <span v-html="post.context.services"></span>
        </li>

        <li v-if="post.context.schedule">
          <svg class="icon-ui c-card__feature-icon" role="img">
            <title>{{ strings.SCHEDULE }}</title>

            <use href="#lucide-calendar"></use>
          </svg>

          <span v-html="post.context.schedule"></span>
        </li>

        <li v-if="post.context.supports">
          <svg class="icon-ui c-card__feature-icon" role="img">
            <title>{{ strings.SUPPORTS }}</title>

            <use href="#lucide-heart-handshake"></use>
          </svg>

          <span v-html="post.context.supports"></span>
        </li>
      </ul>

      <a class="c-card__cta" :href="post.context.link" :target="(post.context.external) ? '_blank' : false" :rel="(post.context.external) ? 'noopener' : false">
        <span v-if="post.context.external" v-html="post.context.link_label"></span>
        <span v-else v-html="strings.LEARN_MORE_ABOUT.replace('{{ program }}', post.context.program_plain_language_title)"></span>

        <svg aria-hidden="true" class="icon-ui rtl:flip">
          <use :href="(post.context.external) ? '#lucide-external-link' : '#lucide-arrow-right'"></use>
        </svg>
      </a>

      <details v-if="post.raw">
        <summary>Raw</summary>

        <pre tabindex="-1">{{ post.raw }}</pre>
      </details>
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
