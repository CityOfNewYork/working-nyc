<template>
  <article class="c-card">
    <header class="c-card__header">
      <span>
        <a class="c-card__header-link">
          <h3 class="c-card__title">
            <span class="c-card__underline">Placeholder</span>
          </h3>
        </a>

        <p class="c-card__subtitle text-alt">
          <b data-program="title">Placeholder1</b>
        </p>
      </span>
    </header>

    <div class="c-card__body">
      <p class="c-card__status flex items-center">
        Placeholder2
      </p>

      <div class="c-card__summary">
        <p>
          Placeholder3
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
