<template>
  <article class="c-card">
    <header class="c-card__header">
      <a class="c-card__header-link" :data-js="'post-' + post.id" :href="post.link">
        <h3 class="c-card__title" v-html="post.context.cardTitle"></h3>
      </a>

      <p class="c-card__subtitle text-alt mb-1">
        <b v-if="post.context.sector" v-html="post.context.sector"></b>
        <span v-if="post.context.sector && post.context.organization"> {{ strings.WITH }} </span>
        <span v-html="post.context.organization"></span>
      </p>
    </header>

    <div class="c-card__body">
      <div class="c-card__summary">
        <p v-html="post.context.summary"></p>
      </div>

      <ul class="c-card__features">
        <li class="flex items-center" v-if="post.context.schedule">
          <svg class="icon-wnyc-ui flex-shrink-0 mie-1" role="img">
            <title>{{ strings.SCHEDULE }}</title>

            <use href="#feather-calendar"></use>
          </svg>

          <span v-html="post.context.schedule"></span>
        </li>

        <li class="flex items-center" v-if="post.context.salary">
          <svg class="icon-wnyc-ui flex-shrink-0 mie-1" role="img">
            <title>{{ strings.SALARY }}</title>

            <use href="#feather-dollar-sign"></use>
          </svg>

          <span v-html="post.context.salary"></span>
        </li>

        <li class="flex items-center" v-if="post.context.location">
          <svg class="icon-wnyc-ui flex-shrink-0 mie-1" role="img">
            <title>{{ strings.LOCATION }}</title>

            <use href="#feather-map-pin"></use>
          </svg>

          <span v-html="post.context.location"></span>
        </li>
      </ul>

      <a class="c-card__cta" :href="post.link">
        <svg aria-hidden="true" class="icon-wnyc-ui rtl:flip">
          <use href="#feather-arrow-left"></use>
        </svg>

        <span v-html="strings.LEARN_MORE_ABOUT.replace('{{ program }}', post.title)"></span>

        <svg aria-hidden="true" class="icon-wnyc-ui rtl:flip">
          <use href="#feather-arrow-right"></use>
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
