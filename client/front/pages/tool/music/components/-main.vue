<template>
  <div class="music-list">
    <div class="music-list-info">
      <div class="clearfix">
        <el-image class="music-list-info-logo" :src="cdinfo.cover" />
        <div class="music-list-info-text">
          <h2>{{ cdinfo.dissname }}</h2>
          <p>{{ cdinfo.desc }}</p>
          <p><span class="para-name">标签：</span>{{ cdinfo.tags | tagsFilter }}</p>
          <p><span class="para-name">歌曲数：</span>{{ cdinfo.songCount }}、<span class="para-name">播放数：</span>{{ cdinfo.playCount }}</p>
        </div>
      </div>
      <div class="music-list-menu">
        <el-button type="primary" round icon="icon-play" @click="handlePlayAll">播放全部</el-button>
        <el-button split-button round icon="el-icon-plus" @click="handleJoinAll">添加到列表</el-button>
      </div>
    </div>
    <el-table
      ref="table"
      v-el-height-adaptive-table="{bottomOffset: 100}"
      v-loading="listLoading"
      element-loading-background="transparent"
      height="233"
      size="medium"
      :data="songlist"
      :row-class-name="getRowClassName"
    >
      <el-table-column label="" width="20" />
      <el-table-column label="歌曲" min-width="220">
        <template #default="{row}">
          <span class="music-list__songname">{{ row.songname }}</span>
          <span class="music-list__albumdesc">{{ row.albumdesc }}</span>
          <div class="music-list-operate">
            <el-button
              icon="icon-play"
              circle
              @click="handlePlaySingle(row)"
            />
            <el-button
              icon="el-icon-plus"
              circle
              @click="handleJoinSingle(row)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="歌手" min-width="150">
        <template #default="{row}">
          <span class="music-list__singer">{{ row.singer | singerFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="albumname" label="专辑" min-width="150" />
      <el-table-column label="时长" width="100" align="center">
        <template #default="{row}">
          <span class="music-list__interval">{{ row.interval | intervalFilter }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { differenceBy } from 'lodash/array'
let elHeightAdaptiveTable = {}
if (process.client) {
  elHeightAdaptiveTable = require('#/directive/el-table').default
}

export default {
  directives: {
    elHeightAdaptiveTable
  },
  filters: {
    tagsFilter(tags) {
      tags = tags || []
      return tags.map(item => item).join(' 、 ')
    },
    singerFilter(singers) {
      return singers.map(item => item.name).join(' / ')
    },
    intervalFilter(time) {
      return (Math.floor(time / 60) < 10 ? '0' + Math.floor(time / 60) : Math.floor(time / 60)) + ':' + (time % 60 < 10 ? '0' + time % 60 : time % 60)
    }
  },
  props: {
    apiUrl: {
      type: String,
      default: ''
    },
    ap: {
      type: Object,
      default: () => {}
    },
    songlist: {
      type: Array,
      default: () => []
    },
    cdinfo: {
      type: Object,
      default: () => {}
    },
    listLoading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async getSongs(songmid) {
      const res = await this.$axios.get(`${this.apiUrl}/songUrl?songmid=${songmid}`)
      let result = {}
      if (!res.errno) {
        result = res.data
      }
      return result
    },
    async handleJoinAll() {
      const aplayerLists = this.ap.list.audios
      const differences = differenceBy(this.songlist, aplayerLists, 'songmid')
      const songmids = differences.map(item => item.songmid)
      const songVkey = await this.getSongs(songmids.join(','))
      const result = []
      differences.forEach((item, index) => {
        const { songmid, songname, singer, albumcover } = item
        const songUrl = songVkey.find(key => item.songmid === key.songmid)
        const current = {
          name: songname,
          artist: singer.map(item => item.name).join(' / '),
          url: songUrl?.url || '',
          cover: albumcover,
          songmid
        }
        result.push(current)
      })
      this.ap.list.add(result)
    },
    async handlePlayAll() {
      const songmids = this.songlist.map(item => item.songmid)
      const songVkey = await this.getSongs(songmids.join(','))
      const result = []
      this.songlist.forEach((item, index) => {
        const { songmid, songname, singer, albumcover } = item
        const songUrl = songVkey.find(key => item.songmid === key.songmid)
        const current = {
          name: songname,
          artist: singer.map(item => item.name).join(' / '),
          url: songUrl?.url || '',
          cover: albumcover,
          songmid
        }
        result.push(current)
      })
      this.ap.list.clear()
      this.ap.list.add(result)
    },
    async handleJoinSingle(row) {
      const { songmid, songname, singer, albumcover } = row
      const isExist = this.ap.list.audios.find(item => item.songmid === songmid)
      if (isExist) {
        this.$notify({
          title: '添加失败',
          message: '播放列表已经有这首歌啦',
          type: 'warning',
          offset: 50
        })
      } else {
        this.$notify({
          title: '添加成功',
          message: '添加播放列表成功',
          type: 'success',
          offset: 50
        })
        const songVkey = await this.getSongs(songmid)
        const songUrl = songVkey[0]?.url || ''
        const current = {
          name: songname,
          artist: singer.map(item => item.name).join(' / '),
          url: songUrl,
          cover: albumcover,
          songmid
        }
        this.ap.list.add(current)
      }
    },
    async handlePlaySingle(row) {
      const { songmid, songname, singer, albumcover } = row
      const isExist = this.ap.list.audios.findIndex(item => item.songmid === songmid)
      if (isExist > -1) {
        this.ap.list.switch(isExist)
      } else {
        const songVkey = await this.getSongs(songmid)
        const songUrl = songVkey[0]?.url || ''
        const current = {
          name: songname,
          artist: singer.map(item => item.name).join(' / '),
          url: songUrl,
          cover: albumcover,
          songmid
        }
        this.ap.list.add(current)
        this.ap.list.switch(this.ap.list.audios.length - 1)
      }
    },
    getRowClassName({ row, rowIndex }) {
      const index = this.ap.list.index
      const currentSong = this.ap.list.audios[index] || {}
      if (currentSong.songmid === row.songmid) {
        return 'playing'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.music{
  &-list{
    &-header{
      position: relative;
      padding: 0 15px 15px;
    }
    &-info{
      position: relative;
      padding: 20px;
      &-logo{
        width: 120px;
        height: 120px;
        float: left;
        border-radius: 50%;
      }
      &-text{
        overflow: hidden;
        padding-left: 15px;
        h2{
          color: #fff;
          line-height: 1.5;
          font-weight: normal;
        }
        p{
          font-size: 14px;
          line-height: 1.7;
          color: #bbb;
        }
      }
    }
    &-menu{
      position: absolute;
      bottom: 15px;
      right: 20px;
      ::v-deep .el-button{
        span{
          margin-left: 5px;
        }
      }
    }
    &__albumdesc{
      padding-left: 10px;
      color: #bbb;
    }
    &-operate{
      position: absolute;
      right: 15px;
      z-index: 99;
      top: 50%;
      margin-top: -16px;
      opacity: 0;
      transition: opacity .3s;
      .el-button{
        border: none;
      }
    }
    ::v-deep .el-table{
      &:before{
        display: none;
      }
      &,tr,th{
        background: none;
      }
      th{
        color: #bbb;
      }
      th, td{
        padding: 15px 0;
        border-bottom: none;
      }
      tr{
        color: #fff;
        &.playing{
          color: var(--color-primary);
        }
        &:hover, &.playing{
          td{
            background-color: rgba($color: #fff, $alpha: .15);
          }
        }
      }
      .el-table__row{
        position: relative;
        &:hover{
          .music-list-operate{
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
