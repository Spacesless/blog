<template>
  <div class="music">
    <div class="music-background" style="background-image: url({$ '/static/music-background.png' | static(config.thumbFormat) $})">
      <ul class="bg-bubbles">
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
      </ul>
    </div>
    <div ref="wrap" class="music">
      <div class="el-row music-wrap">
        <div class="el-col el-col-md-5 music-disst">
          <div class="music-user">
            <el-image :src="'//q1.qlogo.cn/g?b=qq&s=100&nk=' + userinfo.hostuin" />
            <p class="music-user__name">{{ userinfo.hostname }}</p>
          </div>
          <!-- <span>我的音乐</span>
          <template v-for="item in disslist">
            <p
              v-if="item.diss_name === '我喜欢'"
              :key="item.tid"
              class="music-disst__item"
              @click="getSongLists(item.tid)"
            >
              {{ item.diss_name }}
            </p>
          </template> -->
          <span>创建的歌单</span>
          <template v-for="item in disslist">
            <p
              v-if="item.tid && item.diss_name !== '我喜欢'"
              :key="item.tid"
              class="music-disst__item"
              @click="getSongLists(item.tid)"
            >
              {{ item.diss_name }}
            </p>
          </template>
        </div>
        <div class="el-col el-col-md-19 music-content">
          <div class="music-search">
            <el-select v-model="searchType" placeholder="请选择">
              <el-option label="歌曲" :value="1" />
              <el-option label="用户" :value="2" />
            </el-select>
            <el-input v-model="keyword" placeholder="请输入内容" size="medium" />
            <i class="music-search__btn el-icon-search" @click="handleSearch(true)" />
          </div>
          <div class="music-list">
            <div ref="header" class="music-list-header">
              <div v-show="cdinfo.dissname" key="cdinfo" class="music-info clearfix">
                <div class="music-info-logo">
                  <el-image :src="cdinfo.logo" />
                </div>
                <div class="music-info-text">
                  <h2>{{ cdinfo.dissname }}</h2>
                  <p>{{ cdinfo.desc }}</p>
                  <p><span class="para-name">标签：</span>{{ cdinfo.tags | tagsFilter }}</p>
                  <p><span class="para-name">歌曲数：</span>{{ cdinfo.songnum }}、<span class="para-name">播放数：</span>{{ cdinfo.visitnum }}</p>
                </div>
              </div>
              <div class="music-list-menu">
                <el-button type="primary" @click="handlePlayAll">播放全部</el-button>
                <el-dropdown split-button @click="handleJoinAll">
                  添加到列表
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handlePlaySelect">播放选中</el-dropdown-item>
                    <el-dropdown-item @click.native="handleJoinSelect">添加选中</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <el-table
              ref="lists"
              v-loading="listLoading"
              :data="songlist"
              :height="listHeight"
              @selection-change="handleSelection"
            >
              <el-table-column type="selection" width="45" align="center" />
              <el-table-column type="index" width="45" align="center" />
              <el-table-column label="歌曲" min-width="220">
                <template slot-scope="scope">
                  <span class="music-list__songname">{{ scope.row.songname }}</span>
                  <span class="music-list__albumdesc">{{ scope.row.albumdesc }}</span>
                  <div class="music-list-operate">
                    <el-button
                      icon="tl-icon-play"
                      circle
                      :disabled="scope.row.pay.payplay === 1"
                      @click="handlePlaySingle(scope.row)"
                    />
                    <el-button
                      icon="tl-icon-add"
                      :disabled="scope.row.pay.payplay === 1"
                      circle
                      @click="handleJoinSingle(scope.row)"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="歌手" min-width="150">
                <template slot-scope="scope">
                  <span class="music-list__singer">{{ scope.row.singer | singerFilter }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="albumname" label="专辑" min-width="150" />
              <el-table-column label="时长" width="80" align="center">
                <template slot-scope="scope">
                  <span class="music-list__interval">{{ scope.row.interval | intervalFilter }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div id="music-player" class="music-player">
            <div ref="aplayer" />
            <div class="music-player-control">
              <span class="tl-icon" @click="handleSwitch">&#xe78a;</span>
              <span @click="handleTogglePlay">
                <i v-show="isPlaying" key="play" class="tl-icon">&#xe7af;</i>
                <i v-show="!isPlaying" class="tl-icon">&#xe769;</i>
              </span>
              <span class="tl-icon" @click="handleSwitch(-1)">&#xe7a5;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// import Pagination from '@/components/Pagination'
import { differenceBy } from 'lodash/array'

const APIURL = '//api.timelessq.com/music'
const DISSTID = '1207922987'
const QQUIN = '804093032'

export default {
  name: 'Music',
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
  components: {
    // Pagination
  },
  // async asyncData({ app, params, $axios }) {
  //   const { seo } = await $axios.$get('/tool/content', {
  //     params: {
  //       id: params.id
  //     }
  //   })
  //   return {
  //     seo
  //   }
  // },
  data() {
    return {
      ap: null,
      keyword: '',
      searchType: 1,
      listType: 2,
      listHeight: 0,
      multipleSelection: [],
      userinfo: {},
      disslist: [],
      cdinfo: {
        logo: ''
      },
      songlist: [],
      listLoading: false,
      listnone: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      isPlaying: false
    }
  },
  watch: {
    listType() {
      this.calcTableHeight()
    }
  },
  mounted() {
    this.initAplayer()
    this.getCdLists(QQUIN)
    this.getSongLists(DISSTID)
    this.calcTableHeight()
    const element = this.$refs.lists.$refs.bodyWrapper
    element.addEventListener('scroll', () => {
      const scrollDistance = element.scrollHeight - element.scrollTop - element.clientHeight
      if (scrollDistance < 1) {
        this.fetchList()
      }
    })
  },
  methods: {
    calcTableHeight() {
      const wrapHeight = this.$refs.wrap.clientHeight
      const TOP = 85
      this.$nextTick(() => {
        const header = this.$refs.header ? this.$refs.header.clientHeight + 10 : 175
        const footer = 90
        const headerHeight = this.listType === 2 ? 100 : header - 30
        this.listHeight = wrapHeight - TOP - headerHeight - footer
      })
    },
    async initAplayer() {
      // eslint-disable-next-line no-unused-expressions
      import(/* webpackChunkName: "chunk-aplayer" */'aplayer/dist/APlayer.min.css')
      const { default: APlayer } = await import(/* webpackChunkName: "chunk-aplayer" */'aplayer/dist/APlayer.min.js')
      this.ap = new APlayer({
        container: this.$refs.aplayer,
        autoplay: true,
        theme: '#66ccff',
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
          axios.get(`${APIURL}/lyric?songmid=${songmid}`).then(response => {
            const { data } = response.data
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
      this.ap.on('play', () => {
        this.isPlaying = true
      })
      this.ap.on('pause', () => {
        this.isPlaying = false
      })
    },
    fetchList() {
      if (this.listType === 1) {
        this.listQuery.page += 1
        this.handleSearch()
      }
    },
    getCdLists(qquin) {
      const word = qquin || this.keyword
      this.listLoading = true
      axios.get(`${APIURL}/dissts?qquin=${word}`).then(response => {
        const { hostname, hostuin, totoal, disslist } = response.data.data
        this.userinfo = { hostname, hostuin, totoal }
        disslist.sort((a, b) => b.listen_num - a.listen_num)
        // const love = disslist.find(item => item.diss_name === '我喜欢')
        // if (love) love.diss_cover = 'https://y.gtimg.cn/mediastyle/global/img/cover_like.png'
        this.disslist = disslist
        this.listLoading = false
      })
    },
    getSongLists(id) {
      this.listType = 2
      this.listLoading = true
      axios.get(`${APIURL}/lists?disstid=${id}`).then(response => {
        const { nickname, desc, dissname, logo, songlist, songnum, tags, visitnum } = response.data.data
        this.cdinfo = { nickname, desc, dissname, logo, songlist, songnum, tags, visitnum }
        this.songlist = songlist
        this.listLoading = false
      })
    },
    handleSearch(isReset) {
      if (this.searchType === 1) {
        this.listType = 1
        var { page, limit } = this.listQuery
        if (isReset) {
          this.songlist = []
          page = 1
          this.listnone = false
        }
        if (this.listnone) {
          return
        }
        this.listQuery.page = page
        this.cdinfo = { logo: '' }
        this.listLoading = true
        axios.get(`${APIURL}/search`, {
          params: {
            keyword: this.keyword,
            page,
            limit
          }
        }).then(response => {
          const { curpage, totalnum, list } = response.data.data.song
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
            this.listnone = true
          }
        })
      } else {
        this.getCdLists()
      }
    },
    async getSongs(songmid) {
      const response = await axios.get(`${APIURL}/songs?songmid=${songmid}`)
      let result = {}
      if (!response.data.errno) {
        result = response.data.data
      }
      return result
    },
    handleSelection(val) {
      this.multipleSelection = val
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
    async handleJoinSelect() {
      const aplayerLists = this.ap.list.audios
      const differences = differenceBy(this.multipleSelection, aplayerLists, 'songmid')
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
      this.$message({
        message: '添加播放列表成功',
        type: 'success'
      })
      this.ap.list.add(result)
    },
    async handlePlaySelect() {
      const songmids = this.multipleSelection.map(item => item.songmid)
      const songVkey = await this.getSongs(songmids.join(','))
      const result = []
      this.multipleSelection.forEach((item, index) => {
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
    handleSwitch(order) {
      order ? this.ap.skipForward() : this.ap.skipBack()
    },
    handleTogglePlay() {
      this.ap.toggle()
    }
  },
  // head() {
  //   return {
  //     title: this.seo.title,
  //     meta: [
  //       { hid: 'description', name: 'description', content: this.seo.description },
  //       { hid: 'keyword', name: 'keyword', content: this.seo.keyword }
  //     ]
  //   }
  // },
  layout: 'app'
}
</script>

<style lang="scss" scoped>
.music{
  position: fixed;
  top: 5%;
  bottom: 5%;
  left: 10%;
  right: 10%;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  &-background {
    position: fixed;
    width: 100%;
    height: 100%;
    background-position: right center;
    background-repeat: no-repeat;
    background-size: contain;
    .bg-bubbles {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      li {
        display: block;
        position: absolute;
        bottom: -160px;
        width: 40px;
        height: 40px;
        background-color: rgba($color: $primary, $alpha: 0.15);
        list-style: none;
        animation: square 25s infinite;
        transition-timing-function: linear;
        &:nth-child(1) {
          left: 10%;
        }
        &:nth-child(2) {
          left: 20%;
          width: 80px;
          height: 80px;
          animation-delay: 2s;
          animation-duration: 17s;
        }
        &:nth-child(3) {
          left: 25%;
          animation-delay: 4s;
        }
        &:nth-child(4) {
          left: 40%;
          width: 60px;
          height: 60px;
          background-color: rgba($color: $primary, $alpha: 0.25);
          animation-duration: 22s;
        }
        &:nth-child(5) {
          left: 70%;
        }
        &:nth-child(6) {
          left: 80%;
          width: 120px;
          height: 120px;
          background-color: rgba($color: $primary, $alpha: 0.2);
          animation-delay: 3s;
        }
        &:nth-child(7) {
          left: 32%;
          width: 160px;
          height: 160px;
          animation-delay: 7s;
        }
        &:nth-child(8) {
          left: 55%;
          width: 20px;
          height: 20px;
          animation-delay: 15s;
          animation-duration: 40s;
        }
        &:nth-child(9) {
          left: 25%;
          width: 10px;
          height: 10px;
          background-color: rgba($color: $primary, $alpha: 0.3);
          animation-delay: 2s;
          animation-duration: 40s;
        }
        &:nth-child(10) {
          left: 90%;
          width: 160px;
          height: 160px;
          animation-delay: 11s;
        }
      }
    }
    @keyframes square {
      0% {
        transform: translateY(0);
        opacity: 1;
      }
      100% {
        transform: translateY(-800px) rotate(600deg);
        opacity: 0;
      }
    }
  }
  &-wrap{
    height: 100%;
  }
  &-disst{
    padding: 15px;
    &__item{
      margin: 10px 0;
      padding: 10px 0 10px 30px;
      color: #303133;
      font-size: 15px;
      cursor: pointer;
      transition: all .3s;
      &--active, &:hover{
        background-color: #ecf5ff;
      }
    }
    span{
      display: block;
      color: #909399;
      font-size: 14px;
    }
  }
  &-user{
    padding: 30px 0;
    text-align: center;
    &__name{
      font-size: 16px;
      color: #606266;
    }
  }
  &-content{
    position: relative;
    height: 100%;
    padding-bottom: 90px;
    border-left: 1px solid #E4E7ED;
    background-color: rgba($color: #fff, $alpha: 0.6);
    .el-scrollbar__bar{
      z-index: 999;
    }
  }
  &-search{
    position: relative;
    width: 300px;
    padding: 15px;
    .el-input{
      ::v-deep .el-input__inner{
        padding: 0 35px 0 65px;
      }
    }
    .el-select{
      position: absolute;
      top: 16px;
      left: 16px;
      z-index: 99;
      width: 65px;
      ::v-deep .el-input__inner{
        border: none;
        padding: 0 10px;
      }
    }
    &__btn{
      position: absolute;
      right: 20px;
      top: 20px;
      padding: 5px;
      color: #606266;
      cursor: pointer;
    }
  }
  &-list{
    &-header{
      position: relative;
      padding: 0 15px 15px;
    }
    &-menu{
      position: absolute;
      bottom: 15px;
      right: 15px;
    }
    &__songname{
      color: #303133;
    }
    &__albumdesc{
      padding-left: 10px;
      color: #909399;
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
        background: none !important;
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
    &__tips{
      color: $primary;
      font-size: 14px;
      line-height: 2;
      text-align: center;
    }
  }
  &-info{
    &-logo{
      width: 100px;
      float: left;
    }
    &-text{
      overflow: hidden;
      padding-left: 15px;
      h2{
        color: #303133;
        line-height: 1.3;
        font-weight: normal;
      }
      p{
        color: #606266;
        font-size: 15px;
        line-height: 1.5;
      }
    }
  }
  &-player {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 999;
    &-control{
      position: absolute;
      left: 110px;
      bottom: 15px;
      z-index: 99;
      span{
        display: inline-block;
        width: 40px;
        height: 40px;
        margin-right: 10px;
        color: #303133;
        line-height: 40px;
        text-align: center;
        border-radius: 50px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        cursor: pointer;
        &:hover{
          color: $primary;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.tl-icon-play{
  &:before{
    content: "\e769";
  }
}
.tl-icon-add{
  &:before{
    content: "\e81a";
  }
}
#music-player{
  .aplayer{
    overflow: inherit;
    margin: 0;
    background: none;
    box-shadow: none;
    &-music{
      margin: 0 0 13px 15px;
    }
    &-controller{
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    &-bar-wrap{
      margin: -5px 0 0 0;
    }
    &-time{
      top: 5px;
      bottom: 0;
      padding-right: 15px;
      color: #303133;
      font-size: 14px;
      text-align: right;
    }
    &-button{
      display: none;
    }
    &-lrc{
      height: 48px;
      margin: -14px 0 0;
      &:before, &:after{
        display: none;
      }
      &-contents{
        margin-top: 16px;
      }
      p{
        font-size: 14px;
      }
      &-current{
        color: $primary;
      }
    }
    &-list{
      position: absolute;
      right: 0;
      bottom: 90px;
      width: 350px;
      background-color: #fff;
    }
  }
}
</style>
