<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <span class="sidebar-logo__name">{{ title }}</span>
      </router-link>
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
  height: 50px;
  background: #2b2f3a;
  line-height: 50px;
  text-align: center;

  .sidebar-logo {
    display: inline-block;
    height: 36px;
    margin-right: 8px;
    border-radius: 50%;
    vertical-align: middle;
    &-link {
      height: 100%;
      width: 100%;
    }
    &__name{
      display: inline-block;
      margin-right: 8px;
      color: #fff;
      line-height: 1.7;
      font: {
        size: 30px;
        family: 'Bega';
      };
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
