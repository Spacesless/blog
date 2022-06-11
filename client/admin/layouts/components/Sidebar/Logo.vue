<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <nuxt-link class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-if="!collapse" class="sidebar-logo__name">
          {{ title }}
        </h1>
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
  data () {
    return {
      title: 'Timeless',
      logo
    }
  }
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: Bega;
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
      line-height: 1.5;
      color: #FFFFFF;
      vertical-align: middle;
      font: {
        size: 30px;
        weight: 100;
        family: 'Bega', sans-serif;
      };
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
