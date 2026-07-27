<template>
  <div class="sidebar-logo-container" :class="{ collapse }">
    <transition name="sidebarLogoFade">
      <NuxtLink class="sidebar-logo-link" to="/">
        <img :src="logo" class="sidebar-logo" alt="logo">
        <h1 v-if="!collapse" class="sidebar-logo__name">
          {{ title }}
        </h1>
      </NuxtLink>
    </transition>
  </div>
</template>

<script setup lang="ts">
import logo from '~/assets/logo.jpg'

defineProps<{
  collapse: boolean
}>()

const title = 'Timeless'
</script>

<style lang="scss" scoped>
@font-face {
  font-family: Bega;
  src: url('~/assets/fonts/Bega-Light.ttf');
}

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  padding-top: 15px;
  overflow: hidden;
  text-align: center;

  .sidebar-logo {
    display: inline-block;
    width: 60px;
    vertical-align: middle;
    border-radius: 50%;

    &-link {
      width: 100%;
      height: 100%;
    }

    &__name {
      font-family: 'Bega', sans-serif;
      font-size: 30px;
      font-weight: 100;
      line-height: 1.5;
      color: #FFFFFF;
      vertical-align: middle;
    }
  }

  &.collapse {
    padding: 10px 0;

    .sidebar-logo {
      width: 36px;
      margin-right: 0;
    }
  }
}
</style>
