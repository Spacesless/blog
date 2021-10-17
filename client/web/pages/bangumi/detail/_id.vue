<template>
  <div class="bangumi">
    <el-row class="bangumi-info">
      <el-col :sm="10" :lg="6">
        <div class="bangumi-info__poster">
          <img class="img-fluid" :src="data.imgurl" :alt="data.title">
        </div>
      </el-col>
      <el-col :sm="14" :lg="18">
        <div class="bangumi-info-text">
          <h1 class="bangumi-info__title">{{ data.title }}</h1>
          <p><span class="para-name">放映时间：</span>{{ data.showtime }}</p>
          <p><span class="para-name">状态：</span>{{ data.status | bangumiStatus }}</p>
          <div class="bangumi-info-ratings">
            <span class="para-name">推荐指数：</span>
            <el-rate
              :value="data.ratings / 2"
              disabled
              show-score
              :allow-half="true"
              text-color="#409eff"
              :score-template="data.ratings + ''"
            />
          </div>
          <p><span class="para-name">简介：</span>{{ data.description }}</p>
          <div class="bangumi-info-progress clearfix">
            <span class="para-name">进度：</span>
            <div class="el-progress el-progress--line">
              <div class="el-progress-bar">
                <div class="el-progress-bar__outer">
                  <div class="el-progress-bar__inner" :style="'width:' + data.current / data.total * 100 + '%'" />
                </div>
              </div>
              <div v-if="data.total" class="el-progress__text">{{ data.current }}/{{ data.total }}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--bangumi content-->
    <div ref="content" class="bangumi-content Tinymce">
      <h2>主题曲</h2>
      <div id="player">
        <p v-for="(item, index) in songList" :key="index">{{ item }}</p>
        <div id="aplayer" class="aplayer" />
      </div>
      <h2>点评</h2>
      <template v-if="hasContent">
        <div class="bangumi-content-review" v-html="data.content" />
        <el-image ref="preview" class="app-preview" :src="previewSrc" :preview-src-list="previewSrcList" />
      </template>
      <p v-else>光顾着看了，啥感悟都没有</p>
      <!-- share start -->
      <Share />
    </div>
    <!-- 文章目录 -->
    <Catalog />
    <!-- comment start -->
    <Comment :topic-id="'bangumi-' + data.id" />
  </div>
</template>

<script>
import Share from '@/components/Share'
import Comment from '#/components/Comment'
import Catalog from '@/components/Catalog'
import { globalFilter } from '@/mixins'

export default {
  components: {
    Share,
    Comment,
    Catalog
  },
  mixins: [globalFilter],
  async asyncData({ params, $axios }) {
    const id = params.id
    const { seo, content: data } = await $axios.$get('/bangumi/detail', {
      params: { id }
    })
    const songList = data.songs?.split('\n')
    return { seo, data, songList }
  },
  data() {
    return {
      showViewer: false,
      previewSrc: '',
      previewSrcList: [],
      apiUrl: '//api.timelessq.com/music/tencent'
    }
  },
  computed: {
    hasContent() {
      return this.data.content.trim().length !== 0
    }
  },
  mounted() {
    this.initAplayer()
  },
  beforeDestroy() {
    this.ap.list.clear()
  },
  methods: {
    async initAplayer() {
      // eslint-disable-next-line no-unused-expressions
      import(/* webpackChunkName: "chunk-aplayer" */'@/vendor/aplayer/APlayer.min.css')
      const { default: APlayer } = await import(/* webpackChunkName: "chunk-aplayer" */'@/vendor/aplayer/APlayer.min.js')
      this.ap = new APlayer({
        container: document.getElementById('aplayer'),
        autoplay: false,
        theme: '#409EFF',
        loop: 'all',
        order: 'list',
        preload: 'auto',
        volume: 0.7,
        listFolded: false,
        listMaxHeight: '360px',
        lrcType: 1,
        audio: []
      })
      this.ap.on('canplay', async() => {
        const index = this.ap.list.index
        if (this.ap.list.audios[index].lrc === undefined) {
          let pausedFlag = false
          if (!this.ap.audio.paused) {
            this.ap.pause()
            pausedFlag = true
          }
          const songmid = this.ap.list.audios[index].songmid
          await this.$axios.get(`${this.apiUrl}/lyric?songmid=${songmid}`).then(res => {
            const data = res.data
            const lyric = data.lyric
            const cloneList = this.ap.list.audios
            const { name, artist, url, cover, songmid } = this.ap.list.audios[index]
            cloneList[index] = { name, artist, url, cover, lrc: lyric, songmid }
            this.ap.list.clear()
            this.ap.list.add(cloneList)
            this.ap.list.switch(index)
          }).catch(() => {})
          pausedFlag && this.ap.play()
        }
      })
      this.songList?.forEach(item => {
        this.handleSearchSong(item)
      })
    },
    handleSearchSong(keyword) {
      this.$axios.get(`${this.apiUrl}/search`, {
        params: {
          keyword
        }
      }).then(async res => {
        const { list } = res.data
        const { songmid, songname, singer, albumcover } = list[0]
        if (!songmid) return
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
      })
    },
    async getSongs(songmid) {
      const res = await this.$axios.get(`${this.apiUrl}/songUrl?songmid=${songmid}`)
      let result = {}
      if (!res.errno) {
        result = res.data
      }
      return result
    },
    initPreviw() {
      const previews = document.querySelectorAll('.Tinymce img')
      this.previewSrcList = Array.from(previews).map(item => {
        return item.src
      })
      previews.forEach(item => {
        item.addEventListener('click', (e) => {
          this.previewSrc = e.target.src
          this.$refs.preview && this.$refs.preview.clickHandler()
        })
      })
    },
    closeViewer() {
      this.$refs.preview && this.$refs.preview.closeViewer()
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
  }
}
</script>

<style lang="scss" scoped>
.bangumi{
  &-info{
    overflow: hidden;
    margin-bottom: 20px;
    background-color: var(--bg-normal);
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    &__poster{
      max-height: 500px;
    }
    &-text{
      position: relative;
      padding: 0 15px;
      font-size: 14px;
      line-height: 1.7;
      p{
        margin-bottom: 5px;
        letter-spacing: 1px;
      }
      .para-name{
        padding-right: 5px;
        color: var(--color-secondary);
      }
    }
    &__title{
      padding: 10px 0 5px;
      color: var(--color-primary);
      font-size: 26px;
      font-weight: 100;
    }
    &-ratings{
      margin-bottom: 5px;
      .el-rate{
        display: inline-block;
      }
    }
    &-progress{
      .el-progress{
        display: inline-block;
        width: calc(100% - 55px);
      }
    }
  }
  &-content{
    padding: 15px;
    margin-bottom: 20px;
    background-color: var(--bg-normal);
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    #player {
      ::v-deep .aplayer{
        margin: 20px 0;
        &-music{
          margin-bottom: 0;
          padding-bottom: 0;
        }
        &-lrc{
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
      }
    }
  }
}
</style>
