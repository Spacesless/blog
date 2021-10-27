<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <nuxt-link class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-if="!collapse" class="sidebar-logo__name">{{ title }}</h1>
      </nuxt-link>
    </transition>
  </div>
</template>

<script>
const logo = require('@/assets/logo.jpg')

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'Timeless',
      logo
    }
  }
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'Bega';
  src: url('~@/assets/fonts/Bega-Light.ttf');
}

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  overflow: hidden;
  position: relative;
  width: 100%;
  padding-top: 15px;
  text-align: center;

  .sidebar-logo {
    display: inline-block;
    width: 60px;
    border-radius: 50%;
    vertical-align: middle;
    &-link {
      height: 100%;
      width: 100%;
    }
    &__name{
      color: #fff;
      line-height: 1.5;
      font: {
        size: 30px;
        weight: 100;
        family: 'Bega', sans-serif;
      };
      vertical-align: middle;
    }
  }

  &.collapse {
    padding: 10px 0;
    .sidebar-logo {
      width: 36px;
      margin-right: 0px;
    }
  }
}
</style>
