<template>
  <div id="player" class="music-player">
    <div id="aplayer" class="aplayer" />

    <el-drawer
      title="播放列表"
      custom-class="music-playlist"
      :visible.sync="playlistVisible"
      size="300px"
      :with-header="false"
      :append-to-body="true"
    >
      <h2 class="music-playlist__title">播放列表</h2>
      <div class="music-playlist-header">
        <span>{{ playlist.length }}首歌曲</span>
        <span class="el-icon-delete music-playlist-header__clear" @click="handleClearPlaylist" />
      </div>
      <el-scrollbar class="music-playlist-wrap">
        <ul>
          <li
            v-for="(item,index) in playlist"
            :key="item.songmid"
            class="music-playlist-item"
            :class="{'music-playlist-item--playing': ap.list.index === index}"
          >
            <p class="music-playlist-item__name">{{ item.name }}</p>
            <p class="music-playlist-item__author">{{ item.artist }}</p>
            <div class="music-playlist-item-menu">
              <span class="icon-bofang" @click="handlePlaySingle(index)" />
              <span class="el-icon-delete" @click="handleDeletePlaylist(index)" />
            </div>
          </li>
        </ul>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: {
    ap: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      playlist: [],
      playlistVisible: false
    }
  },
  watch: {
    ap(newVal, oldVal) {
      if (newVal && !oldVal) {
        document.querySelector('.aplayer-icon-menu').addEventListener('click', () => {
          this.playlistVisible = true
          this.playlist = this.ap.list.audios
        })
      }
    }
  },
  methods: {
    handlePlaySingle(index) {
      this.ap.list.switch(index)
    },
    handleClearPlaylist() {
      this.ap.list.clear()
      this.playlist = []
    },
    handleDeletePlaylist(index) {
      this.ap.list.remove(index)
      this.playlist.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.music{
  &-player {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 3000;
  }
}
#player {
  ::v-deep .aplayer{
    overflow: inherit;
    margin: 0;
    background: none;
    color: #fff;
    box-shadow: none;
    &-pic{
      position: relative;
      z-index: 99;
      width: 70px;
      height: 70px;
      border-radius: 4px;
      margin: 10px 20px;
    }
    &-info{
      padding: 10px 0;
      .aplayer-title{
        font-size: 16px;
      }
      .aplayer-author{
        font-size: 12px;
        color: #bbb;
      }
    }
    &-icon {
      width: 18px;
      height: 18px;
      opacity: 1;
      path{
        fill: #fff;
      }
      &-back, &-play, &-forward{
        display: block;
        position: absolute;
        left: 108px;
        width: 26px;
        height: 26px;
        border-radius: 50%;
      }
      &-back, &-forward{
        top: 37px;
      }
      &-play{
        top: 32px;
        width: 26px;
        height: 26px;
        padding: 5px;
        margin-left: 35px;
        background-color: var(--color-primary);;
      }
      &-forward {
        margin-left: 82px;
      }
      &-menu, &-lrc{
        display: inline;
      }
    }
    &-music{
      margin: 0;
      height: auto;
    }
    &-controller{
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    &-bar{
      background: rgba($color: #fff, $alpha: .15);
      &-wrap{
        margin: -5px 0 0 0;
      }
    }
    &-volume{
      &-bar{
        &-wrap{
          bottom: 20px;
          right: 0;
        }
      }
    }
    &-time{
      top: 4px;
      bottom: 0;
      padding-right: 20px;
      color: #fff;
      font-size: 14px;
      text-align: right;
    }
    &-button{
      display: none;
    }
    &-lrc{
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: 20px;
      height: 40px;
      margin: 0;
      &:before, &:after{
        display: none;
      }
      p{
        font-size: 14px;
        height: 20px !important;
        line-height: 20px !important;
        color: #bbb;
        opacity: 1;
      }
      &-current{
        color: var(--color-primary) !important;
      }
    }
    &-list{
      display: none;
    }
  }
}
</style>

<style lang="scss">
.music {
  &-playlist{
    outline: none;
    background-color: #083b50;
    color: #fff;
    box-shadow: 0 8px 10px -5px rgba($color: #083b50, $alpha: .2),
    0 16px 24px 2px rgba($color: #083b50, $alpha: .14),
    0 6px 30px 5px rgba($color: #083b50, $alpha: .12);
    .el-drawer__body{
      height: 100%;
    }
    &__title{
      padding: 15px 20px 5px;
      font-weight: normal;
    }
    &-header{
      position: relative;
      padding: 0 20px 15px;
      line-height: 22px;
      &__clear{
        position: absolute;
        top: 2px;
        right: 20px;
        cursor: pointer;
      }
    }
    &-wrap {
      height: calc(100% - 90px);
    }
    &-item{
      position: relative;
      padding: 10px 20px;
      font-size: 14px;
      &__name, &__author{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &__author{
        color: #bbb;
      }
      &-menu{
        position: absolute;
        right: 20px;
        top: 50%;
        margin-top: -9px;
        opacity: 0;
        transition: opacity .3s;
        span{
          margin-left: 5px;
          color: #bbb;
          cursor: pointer;
          &:hover{
            color: var(--color-primary);
          }
        }
      }
      &:hover{
        background-color: rgba($color: #fff, $alpha: .15);
      }
      &:hover &__name, &:hover &__author{
        max-width: 200px;
      }
      &:hover &-menu{
        opacity: 1;
      }
      &--playing{
        .music-playlist-item{
          background-color: rgba($color: #fff, $alpha: .15);
          &__name, &__author{
            color: var(--color-primary);
          }
        }
      }
    }
  }
}
</style>
