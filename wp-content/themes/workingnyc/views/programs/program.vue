<template>
  <article class="desktop-sm-card-style tablet-sm-card-style mobile-sm-card-style grid m-auto">
    <header>
      <div class="px-3 py-1 desktop:py-2 background-style float-right">
        <span class="text-style my-auto">Actively recruiting</span>
      </div>
    </header>
    <div>
      <div class="mx-3 my-2 desktop:m-3">
        <svg class="fill-text stroke-text text-brand" width="163" height="48" role="img">
          <title>Job Ready by Jobs N Y C</title>
          <use href="#logo-jnyc-footer"></use>
        </svg>
      </div>
      <div class="desktop-mb-18 mx-3 title-font-style">Lorem ipsum</div>
      <div class="mx-3 my-2 desktop:m-3">Lorem ipsum dolor sit amet consectetur. Metus faucibus tortor lacus integer integer.</div>
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
