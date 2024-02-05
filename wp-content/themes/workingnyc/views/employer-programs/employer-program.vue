<template>
  <a :href="post.link" class="no-underline text-inherit">
    <article class="tablet:grid tablet:grid-cols-[60px_minmax(300px,1fr)] gap-x-3 p-3 rounded border border-scale-3">
      <img class="w-[60px] tablet:w-full mb-3" v-if="post.logo" :src="post.logo.url" loading="lazy" :alt="post.logo.alt"/>
      <div v-else></div>
      <div>
        <header class="border-b border-scale-3">
          <span>
            <h3 class="c-card__title">{{ post.title }}</h3>

            <p class="c-card__subtitle text-alt mb-2">{{ post.provider }}</p>
          </span>
        </header>

        <div>
          <div class="c-card__summary mt-2">
            <p>
              {{ post.preview }}
            </p>
          </div>

          <div class="flex gap-x-1">
            <div class="small rounded p-1 bg-scale-2" v-for="tag in post.tags" :key="tag.employer_program_tag">
                {{ tag.employer_program_tag }}
            </div>
          </div>

          <details v-if="post.raw">
            <summary>Raw</summary>

            <pre tabindex="-1">{{ post.raw }}</pre>
          </details>
        </div>
      </div>
    </article>
  </a>
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
