<template>
  <div class="app-main">
    <section>
      <slot />
    </section>
  </div>
</template>

<style scoped>
.app-main {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 84px);
  padding-top: 84px;
  overflow: hidden;
  background-color: #f0f2f5;
}
</style>
