<template>
  <div class="music-sidebar">
    <div class="music-sidebar-logo">
      <img
        class="music-sidebar-logo__pic tencent"
        :class="{'music-sidebar-logo__pic--active': platform === 'tencent'}"
        src="@/assets/image/tencent-music.png"
        alt="tencent"
        @click="changePlatform('tencent')"
      >
      <img
        class="music-sidebar-logo__pic netease"
        :class="{'music-sidebar-logo__pic--active': platform === 'netease'}"
        src="@/assets/image/netease-music.png"
        alt="netease"
        @click="changePlatform('netease')"
      >
    </div>
    <el-scrollbar class="music-sidebar-disst-wrap">
      <dl class="music-sidebar-disst">
        <dt class="music-sidebar-disst__title">
          <i class="icon-yinyue" />
          <span>我的歌单</span>
        </dt>
        <template v-for="item in disstList">
          <dd
            v-if="item.tid"
            :key="item.tid"
            class="music-sidebar-disst__item"
            :class="disstId == item.tid ? 'music-sidebar-disst__item--active' : ''"
            @click="changeDisstId(item.tid)"
          >
            {{ item.name }}
          </dd>
        </template>
      </dl>
    </el-scrollbar>
    <div class="music-sidebar-fufu">
      <img class="music-sidebar-fufu__img" :src="'/static/img/music-logo.webp' | getAbsolutePath" alt="">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    platform: {
      type: String,
      default: ''
    },
    disstId: {
      type: Number,
      default: 0
    },
    disstList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    changePlatform (platform) {
      this.$emit('update:platform', platform)
    },
    changeDisstId (id) {
      this.$emit('update:disstId', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.music {
  &-sidebar {
    float: left;
    width: 250px;
    height: 100%;

    &-logo {
      padding: 35px 20px 15px;
      text-align: center;

      .tencent {
        margin-right: 35px;
      }

      &__pic {
        width: 60px;
        height: 60px;
        overflow: hidden;
        cursor: pointer;
        filter: brightness(50%);

        &--active {
          filter: brightness(100%);
        }
      }
    }

    &-disst {
      &-wrap {
        height: calc(100% - 340px);
      }

      &__title {
        height: 50px;
        padding: 0 20px;
        line-height: 50px;
        color: #FFFFFF;
      }

      &__item {
        height: 42px;
        padding: 0 40px;
        font-size: 14px;
        line-height: 42px;
        color: #D2D2D2;
        cursor: pointer;

        &:hover,
        &--active {
          background-color: rgba($color: #FFFFFF, $alpha: .15);
        }
      }
    }

    &-fufu {
      &__img {
        display: inline-block;
        width: 250px;
        vertical-align: middle;
      }
    }
  }
}
</style>
