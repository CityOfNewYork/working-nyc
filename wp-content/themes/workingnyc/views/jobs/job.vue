<template>
  <article class="c-card">
    <header class="c-card__header">
      <span>
        <a class="c-card__header-link" :data-js="'post-' + post.id" :href="post.link">
          <h3 class="c-card__title">
            <span class="c-card__underline" v-html="post.context.cardTitle"></span>
          </h3>
        </a>

        <p class="c-card__subtitle text-alt">
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
