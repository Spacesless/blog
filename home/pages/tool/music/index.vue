<template>
  <div ref="wrap" class="music">
    <div class="music-sidebar">
      <div class="music-sidebar-logo">
        <h1 class="music-sidebar-logo__title">Timeless</h1>
      </div>
      <el-scrollbar class="music-sidebar-disst-wrap">
        <dl class="music-sidebar-disst">
          <dt class="music-sidebar-disst__title">
            <i class="tl-icon">&#xf116;</i>
            <span>我的歌单</span>
          </dt>
          <template v-for="item in disslist">
            <dd
              v-if="item.tid"
              :key="item.tid"
              class="music-sidebar-disst__item"
              :class="disstId == item.tid ? 'music-sidebar-disst__item--active' : ''"
              @click="getSongLists(item.tid)"
            >{{ item.diss_name }}</dd>
          </template>
        </dl>
      </el-scrollbar>
      <div class="music-sidebar-fufu">
        <img class="music-sidebar-fufu__img" :src="'/static/img/music-logo.webp' | replaceUrlPrefix" alt="">
      </div>
    </div>
    <div class="music-main">
      <div class="music-header clearfix">
        <div class="music-search">
          <el-input v-model="keyword" size="small" placeholder="请输入歌曲" @keyup.enter.native="handleSearch(true)" />
          <i class="music-search__btn el-icon-search" @click="handleSearch(true)" />
        </div>
        <div class="music-user" @click="handleChangeUser">
          <el-image class="music-user__avator" :src="'//q1.qlogo.cn/g?b=qq&s=100&nk=' + userinfo.hostuin" />
          <span class="music-user__name">{{ userinfo.hostname || 'Timeless' }}</span>
          <i class="tl-icon music-user__icon">&#xe613;</i>
        </div>
      </div>
      <div class="music-list">
        <div class="music-list-info">
          <div class="clearfix">
            <el-image class="music-list-info-logo" :src="cdinfo.logo" />
            <div class="music-list-info-text">
              <h2>{{ cdinfo.dissname }}</h2>
              <p>{{ cdinfo.desc }}</p>
              <p><span class="para-name">标签：</span>{{ cdinfo.tags | tagsFilter }}</p>
              <p><span class="para-name">歌曲数：</span>{{ cdinfo.songnum }}、<span class="para-name">播放数：</span>{{ cdinfo.visitnum }}</p>
            </div>
          </div>
          <div class="music-list-menu">
            <el-button type="primary" round icon="tl-icon-play" @click="handlePlayAll">播放全部</el-button>
            <el-button split-button round icon="el-icon-plus" @click="handleJoinAll">添加到列表</el-button>
          </div>
        </div>
        <el-table
          ref="lists"
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
                  icon="tl-icon-play"
                  circle
                  :disabled="row.pay.payplay === 1"
                  @click="handlePlaySingle(row)"
                />
                <el-button
                  icon="el-icon-plus"
                  :disabled="row.pay.payplay === 1"
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
      <div id="player" class="music-player">
        <div id="aplayer" class="aplayer" />
      </div>
    </div>

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
              <span class="tl-icon" @click="handlePlaySingle(item)">&#xe769;</span>
              <span class="el-icon-delete" @click="handleDeletePlaylist(index)" />
            </div>
          </li>
        </ul>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script>
import { differenceBy } from 'lodash/array'
let elHeightAdaptiveTable = {}
if (process.client) {
  elHeightAdaptiveTable = require('@/directive/el-table').default
}

const APIURL = '//api.timelessq.com/music'
const DISSTID = '1207922987'
const QQUIN = '804093032'

export default {
  name: 'Music',
  directives: {
    elHeightAdaptiveTable
  },
  filters: {
    tagsFilter(tags) {
      tags = tags || []
      return tags.map(item => item.name).join(' 、 ')
    },
    singerFilter(singers) {
      return singers.map(item => item.name).join(' / ')
    },
    intervalFilter(time) {
      return (Math.floor(time / 60) < 10 ? '0' + Math.floor(time / 60) : Math.floor(time / 60)) + ':' + (time % 60 < 10 ? '0' + time % 60 : time % 60)
    }
  },
  async asyncData({ app, route, $axios }) {
    const filename = route.path.split('/')
    const { seo } = await $axios.$get('/tool/content', {
      params: {
        path: filename[filename.length - 1] || 'music'
      }
    })
    return {
      seo
    }
  },
  data() {
    return {
      seo: {},
      disstId: 0,
      ap: null,
      keyword: '',
      userinfo: {},
      disslist: [
        { tid: 1, diss_name: 'Timeless' },
        { tid: 2, diss_name: '华语' }
      ],
      cdinfo: {
        logo: ''
      },
      songlist: [],
      listLoading: false,
      isNoneMore: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      playlist: [],
      playlistVisible: false,
      songDetailVisble: false
    }
  },
  mounted() {
    this.initAplayer()
    this.getCdLists(QQUIN)
    this.getSongLists(DISSTID)
    const element = this.$refs.lists.$refs.bodyWrapper
    element.addEventListener('scroll', () => {
      const scrollDistance = element.scrollHeight - element.scrollTop - element.clientHeight
      if (scrollDistance < 1) {
        this.fetchList()
      }
    })
  },
  methods: {
    async initAplayer() {
      // eslint-disable-next-line no-unused-expressions
      import(/* webpackChunkName: "chunk-aplayer" */'@/vendor/aplayer/APlayer.min.css')
      const { default: APlayer } = await import(/* webpackChunkName: "chunk-aplayer" */'@/vendor/aplayer/APlayer.min.js')
      this.ap = new APlayer({
        container: document.getElementById('aplayer'),
        autoplay: true,
        theme: '#409EFF',
        loop: 'all',
        order: 'list',
        preload: 'auto',
        volume: 0.7,
        listFolded: true,
        listMaxHeight: '360px',
        lrcType: 1,
        audio: []
      })
      this.ap.on('canplay', () => {
        const index = this.ap.list.index
        if (this.ap.list.audios[index].lrc === undefined) {
          this.ap.pause()
          const songmid = this.ap.list.audios[index].songmid
          this.$axios.get(`${APIURL}/lyric?songmid=${songmid}`).then(res => {
            const data = res.data
            const lyric = data.lyric
            const cloneList = this.ap.list.audios
            const { name, artist, url, cover, songmid } = this.ap.list.audios[index]
            cloneList[index] = { name, artist, url, cover, lrc: lyric, songmid }
            this.ap.list.clear()
            this.ap.list.add(cloneList)
            this.ap.list.switch(index)
            this.ap.play()
          })
        }
      })
      document.querySelector('.aplayer-icon-menu').addEventListener('click', () => {
        this.playlistVisible = true
        this.playlist = this.ap.list.audios
      })
    },
    fetchList() {
      if (this.listType === 2) return
      this.listQuery.page += 1
      this.handleSearch()
    },
    getCdLists(qquin) {
      const word = qquin || this.keyword
      this.listLoading = true
      this.$axios.get(`${APIURL}/cdList?qquin=${word}`).then(res => {
        const { hostname, hostuin, totoal, disslist } = res.data
        this.userinfo = { hostname, hostuin, totoal }
        disslist.sort((a, b) => b.listen_num - a.listen_num)
        this.disslist = disslist
        this.listLoading = false
      })
    },
    getSongLists(id) {
      this.listType = 2
      this.disstId = id
      this.listLoading = true
      this.$axios.get(`${APIURL}/songList?disstid=${id}`).then(res => {
        const { nickname, desc, dissname, logo, songlist, songnum, tags, visitnum } = res.data
        this.cdinfo = { nickname, desc, dissname, logo, songlist, songnum, tags, visitnum }
        this.songlist = songlist
        this.listLoading = false
      })

      // 表格返回头部
      const multipleTable = this.$refs.lists && this.$refs.lists.bodyWrapper
      if (multipleTable) multipleTable.scrollTop = 0
    },
    handleSearch(isReset) {
      this.listType = 1
      var { page, limit } = this.listQuery
      if (isReset) {
        this.songlist = []
        page = 1
        this.isNoneMore = false
      }
      if (this.isNoneMore) {
        return
      }
      this.listQuery.page = page
      this.cdinfo = { logo: '' }
      this.listLoading = true
      this.$axios.get(`${APIURL}/search`, {
        params: {
          keyword: this.keyword,
          page,
          limit
        }
      }).then(res => {
        const { curpage, totalnum, list } = res.data.song
        this.listQuery.page = curpage
        const songlists = list.map(item => {
          const { album, interval, name, mid, singer, pay } = item
          return {
            albumdesc: album.subtitle,
            albumid: album.id,
            albummid: album.mid,
            albumname: album.name,
            interval,
            pay,
            singer,
            songmid: mid,
            songname: name
          }
        })
        this.songlist = this.songlist.concat(songlists)
        this.listLoading = false
        if (this.songlist.length >= totalnum) {
          this.isNoneMore = true
        }
      })
    },
    async getSongs(songmid) {
      const res = await this.$axios.get(`${APIURL}/songUrl?songmid=${songmid}`)
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
        const { songmid, songname, singer, albummid } = item
        const albumpic = this.getAlbumCover(albummid)
        const { sip, lists } = songVkey
        const songUrl = (sip[0] || '') + (lists[index] ? this.getSongUrl(lists[index].purl) : '')
        const current = {
          name: songname,
          artist: singer.map(item => item.name).join(' / '),
          url: songUrl,
          cover: albumpic,
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
        const { songmid, songname, singer, albummid } = item
        const albumpic = this.getAlbumCover(albummid)
        const { sip, lists } = songVkey
        const songUrl = (sip[0] || '') + (lists[index] ? this.getSongUrl(lists[index].purl) : '')
        const current = {
          name: songname,
          artist: singer.map(item => item.name).join(' / '),
          url: songUrl,
          cover: albumpic,
          songmid
        }
        result.push(current)
      })
      this.ap.list.clear()
      this.ap.list.add(result)
    },
    async handleJoinSingle(row) {
      const { songmid, songname, singer, albummid } = row
      const isExist = this.ap.list.audios.find(item => item.songmid === songmid)
      if (isExist) {
        this.$message({
          message: '播放列表已经有这首歌啦',
          type: 'warning'
        })
      } else {
        this.$message({
          message: '添加播放列表成功',
          type: 'success'
        })
        const albumpic = this.getAlbumCover(albummid)
        const songVkey = await this.getSongs(songmid)
        const { sip, lists } = songVkey
        const songUrl = (sip[0] || '') + (lists[0] ? this.getSongUrl(lists[0].purl) : '')
        const current = {
          name: songname,
          artist: singer.map(item => item.name).join(' / '),
          url: songUrl,
          cover: albumpic,
          songmid
        }
        this.ap.list.add(current)
      }
    },
    async handlePlaySingle(row) {
      const { songmid, songname, singer, albummid } = row
      const isExist = this.ap.list.audios.findIndex(item => item.songmid === songmid)
      if (isExist > -1) {
        this.ap.list.switch(isExist)
      } else {
        const albumpic = this.getAlbumCover(albummid)
        const songVkey = await this.getSongs(songmid)
        const { sip, lists } = songVkey
        const songUrl = (sip[0] || '') + (lists[0] ? this.getSongUrl(lists[0].purl) : '')
        const current = {
          name: songname,
          artist: singer.map(item => item.name).join(' / '),
          url: songUrl,
          cover: albumpic,
          songmid
        }
        this.ap.list.add(current)
        this.ap.list.switch(this.ap.list.audios.length - 1)
      }
    },
    getAlbumCover(id) {
      return id ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${id}.jpg?max_age=2592000` : ''
    },
    getSongUrl(url) {
      return url.split('/').pop()
    },
    handleClearPlaylist() {
      this.ap.list.clear()
      this.playlist = []
    },
    handleDeletePlaylist(index) {
      this.ap.list.remove(index)
      this.playlist.splice(index, 1)
    },
    handleChangeUser() {
      this.$prompt('请输入QQ号', '切换用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.getCdLists(value)
      })
    },
    getRowClassName({ row, rowIndex }) {
      const index = this.ap.list.index
      const currentSong = this.ap.list.audios[index] || {}
      if (currentSong.songmid === row.songmid) {
        return 'playing'
      }
    }
  },
  head() {
    return {
      title: this.seo.title,
      meta: [
        { hid: 'description', name: 'description', content: this.seo.description },
        { hid: 'keyword', name: 'keyword', content: this.seo.keyword }
      ]
    }
  },
  layout: 'app'
}
</script>

<style lang="scss" scoped>
.music{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: {
    image: url('~@/assets/image/music-background.png');
    repeat: no-repeat;
    size: contain;
    color: #083b50;
  };
  ::v-deep .tl-icon-play{
    &:before{
      content: "\e769";
    }
  }
  &-sidebar{
    float: left;
    width: 250px;
    height: 100%;
    &-logo{
      padding: 35px 20px 15px;
      &__title{
        color: var(--color-primary);
        font-family: 'Bega';
        font-size: 36px;
      }
    }
    &-disst{
      &-wrap{
        height: calc(100% - 320px);
      }
      &__title{
        padding: 0 20px;
        color: #fff;
        height: 50px;
        line-height: 50px;
      }
      &__item{
        padding: 0 40px;
        color: #d2d2d2;
        font-size: 14px;
        height: 42px;
        line-height: 42px;
        cursor: pointer;
        &:hover, &--active{
          background-color: rgba($color: #fff, $alpha: .15);
        }
      }
    }
    &-fufu{
      &__img{
        display: inline-block;
        width: 250px;
        vertical-align: middle;
      }
    }
  }
  &-main{
    overflow: hidden;
    position: relative;
    height: 100%;
    padding-bottom: 90px;
    background-color: rgba($color: #000, $alpha: 0.15);
    box-sizing: border-box;
    .el-scrollbar__bar{
      z-index: 999;
    }
  }
  &-header{
    line-height: 50px;
  }
  &-search{
    position: relative;
    float: left;
    width: 250px;
    padding: 0 20px;
    .el-input{
      ::v-deep .el-input__inner{
        background: none;
        color: #fff;
        padding-right: 30px;
      }
    }
    &__btn{
      position: absolute;
      right: 25px;
      top: 13px;
      padding: 5px;
      color: #fff;
      cursor: pointer;
    }
  }
  &-user{
    float: right;
    margin-right: 20px;
    color: #fff;
    cursor: pointer;
    &__avator{
      width: 32px;
      height: 32px;
      border-radius: 50%;
      vertical-align: middle;
    }
    &__name{
      margin-left: 5px;
      vertical-align: middle;
    }
    &__icon{
      margin-left: 5px;
      vertical-align: sub;
    }
  }
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
