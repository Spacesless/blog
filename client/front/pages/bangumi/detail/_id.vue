<template>
  <div class="bangumi">
    <el-row class="bangumi-info tl-card">
      <el-col :sm="10" :lg="6">
        <div class="bangumi-info__poster">
          <img class="img-fluid" :src="data.imgurl" :alt="data.title">
        </div>
      </el-col>
      <el-col :sm="14" :lg="18">
        <div class="bangumi-info-text">
          <h1 class="bangumi-info__title">
            {{ data.title }}
          </h1>
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
          <p><span class="para-name">进度：</span>{{ data.current }}/{{ data.total }}</p>
          <div class="bangumi-info-tag">
            <span
              v-for="(tag,index) in tags"
              :key="index"
              class="tl-tag"
              :class="tag | tagClassName"
            >{{ tag }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--bangumi content-->
    <div ref="content" class="bangumi-content tl-card">
      <div v-if="(songList && songList.length) || hasContent" class="content-wrap">
        <!-- 文章目录 -->
        <Catalog v-if="isLoaded" class="content-right" />

        <div id="js-content" class="content-left ">
          <h2>主题曲</h2>
          <div v-if="songList && songList.length" id="player">
            <p v-for="(item, index) in songList" :key="index">
              {{ item }}
            </p>
            <div id="aplayer" class="aplayer" />
          </div>
          <div v-if="hasContent" class="markup">
            <h2>短评</h2>
            <!-- 文章内容 -->
            <div v-html="data.content" />
          </div>
        </div>
      </div>
      <!-- share start -->
      <Share
        :title="data.title"
        :cover="data.imgurl"
        :description="data.description"
      />
    </div>

    <!-- 图片预览 -->
    <ImageViewer v-if="isLoaded" />
    <!-- 推荐阅读 -->
    <SimilarList category-type="bangumi" :category-id="data.category_id" :tags="data.tag" />
    <!-- 评论 -->
    <Comment :topic-id="'bangumi-' + data.id" />
  </div>
</template>

<script>
import Catalog from '@/components/Catalog'
import Comment from '#/components/Comment'
import ImageViewer from '@/components/ImageViewer'
import Share from '@/components/Share'
import SimilarList from '@/components/SimilarList'
import { pageMeta } from '@/mixins'

export default {
  name: 'BangumiDetail',
  components: {
    Catalog,
    Comment,
    ImageViewer,
    Share,
    SimilarList
  },
  mixins: [pageMeta],
  async asyncData ({ params, $axios }) {
    const id = params.id
    const data = await $axios.$get('/bangumi/detail', {
      params: { id }
    })
    const songList = data?.songs?.split('\n')
    return { data, songList }
  },
  data () {
    return {
      pageType: 'detail',
      apiUrl: '//api.timelessq.com/music/tencent',
      isLoaded: false,
      songList: []
    }
  },
  computed: {
    hasContent () {
      return this.data.content.trim().length !== 0
    },
    tags () {
      return this.data.tag?.split('|') || []
    }
  },
  mounted () {
    if (this.songList?.length) {
      this.initAplayer()
    }

    this.$nextTick(() => {
      this.isLoaded = true
    })
  },
  beforeDestroy () {
    this.ap?.list.clear()
  },
  methods: {
    async initAplayer () {
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
      // 获取歌词
      this.ap.on('canplay', async () => {
        const index = this.ap.list.index
        if (this.ap.list.audios[index].lrc === undefined) {
          let pausedFlag = false
          if (!this.ap.audio.paused) {
            this.ap.pause()
            pausedFlag = true
          }
          const songmid = this.ap.list.audios[index].songmid
          await this.$axios.get(`${this.apiUrl}/lyric?songmid=${songmid}`).then((res) => {
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
      this.songList?.forEach((item) => {
        this.handleSearchSong(item)
      })
    },
    /**
     * 根据歌名搜索歌曲
     * @param {String} keyword 关键字
     */
    handleSearchSong (keyword) {
      this.$axios.get(`${this.apiUrl}/search`, {
        params: {
          keyword
        }
      }).then(async (res) => {
        const { list } = res.data
        const { songmid, songname, singer, albumcover } = list[0] || {}
        if (!songmid) { return }
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
    /**
     * 根据歌曲id获取播放地址
     * @param {String} 歌曲ID
     */
    async getSongs (songmid) {
      const res = await this.$axios.get(`${this.apiUrl}/songUrl?songmid=${songmid}`)
      let result = {}
      if (!res.errno) {
        result = res.data
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.bangumi {
  &-info {
    margin-bottom: $grid-space;
    overflow: hidden;

    &__poster {
      max-height: 500px;
    }

    &-text {
      position: relative;
      padding: 0 15px;
      font-size: 14px;
      line-height: 1.7;

      p {
        margin-bottom: 5px;
        letter-spacing: 1px;
      }

      .para-name {
        padding-right: 5px;
        color: var(--color-secondary);
      }
    }

    &__title {
      padding: 10px 0 5px;
      font-size: 26px;
      font-weight: 100;
      color: var(--color-primary);
    }

    &-ratings {
      margin-bottom: 5px;

      .el-rate {
        display: inline-block;
      }
    }

    &-tag {
      margin-bottom: $grid-space;

      .tl-tag {
        cursor: default;
      }
    }
  }

  &-content {
    margin-bottom: $grid-space;

    #player {
      ::v-deep .aplayer {
        margin: 20px 0;

        &-music {
          padding-bottom: 0;
          margin-bottom: 0;
        }

        &-lrc {
          height: 40px;
          margin: 0;

          &::before,
          &::after {
            display: none;
          }

          p {
            height: 20px !important;
            font-size: 14px;
            line-height: 20px !important;
            color: #BBBBBB;
            opacity: 1;
          }

          &-current {
            color: var(--color-primary) !important;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import '~@/styles/components/content.scss';
</style>
