<template>
  <article class="c-card">
    <header class="c-card__header grid grid-cols-[1fr_4fr]">
      <img v-if="post.logo" :src="post.logo.url" loading="lazy" :alt="post.logo.alt"/>
      <div v-else></div>
      <span>
        <a class="c-card__header-link">
          <h3 class="c-card__title">
            <span class="c-card__underline">{{ post.title }}</span>
          </h3>
        </a>

        <p class="c-card__subtitle text-alt">
          <b data-program="title">{{ post.provider }}</b>
        </p>
      </span>
    </header>

    <div class="c-card__body">
      <div class="c-card__summary">
        <p>
          {{ post.preview }}
        </p>
      </div>

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
