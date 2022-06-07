<template>
  <div ref="wrap" class="music">
    <!-- 侧边栏 -->
    <Sidebar
      :platform.sync="platform"
      :disst-id.sync="disstId"
      :disst-list="disstList"
    />
    <div class="music-main">
      <!-- 头部 -->
      <Header
        :userinfo="userinfo"
        :platform="platform"
        :tencent-uid.sync="tencentUid"
        :netease-uid="neteaseUid"
        :keyword.sync="keyword"
        @handleSearch="handleSearch"
      />
      <!-- 歌曲列表 -->
      <Main
        ref="lists"
        :api-url="apiUrl"
        :ap="ap"
        :cdinfo="cdinfo"
        :songlist="songlist"
        :list-loading="listLoading"
      />
      <!-- 播放器 -->
      <Player :ap="ap" />
    </div>
  </div>
</template>

<script>
import Sidebar from './components/-sidebar'
import Header from './components/-header'
import Main from './components/-main'
import Player from './components/-player'
import { pageMeta } from '@/mixins'

const apiUrl = '//api.timelessq.com/music'
const tencentUid = 804093032
const neteaseUid = 3979052388

export default {
  name: 'Music',
  components: {
    Sidebar,
    Header,
    Main,
    Player
  },
  mixins: [pageMeta],
  data() {
    return {
      platform: 'tencent', // tencent, netease
      disstId: 0,
      ap: null,
      keyword: '',
      userinfo: {},
      disstList: [],
      cdinfo: {
        logo: ''
      },
      songlist: [],
      listLoading: false,
      isNoneMore: false,
      listQuery: {
        page: 1,
        pageSize: 20
      },
      playlist: [],
      tencentUid,
      neteaseUid
    }
  },
  computed: {
    apiUrl() {
      return `${apiUrl}/${this.platform}`
    },
    uid() {
      return this.platform === 'tencent'
        ? (this.tencentUid || tencentUid)
        : (this.neteaseUid || neteaseUid)
    }
  },
  watch: {
    uid: {
      handler() {
        this.getCdLists()
      },
      immediate: true
    },
    disstId(val) {
      val && this.getSongLists()
    }
  },
  mounted() {
    this.initAplayer()

    const element = this.$refs.lists?.$refs.table?.$refs.bodyWrapper
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
      this.ap.on('canplay', async() => {
        const index = this.ap.list.index
        if (this.ap.list.audios[index].lrc === undefined) {
          this.ap.pause()
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
          this.ap.play()
        }
      })
    },
    fetchList() {
      if (this.listType === 2) return
      this.listQuery.page += 1
      this.handleSearch()
    },
    getCdLists() {
      this.$axios.get(`${this.apiUrl}/cdList?uid=${this.uid}`).then(res => {
        const { nickname, uid, avatar, lists } = res.data
        this.userinfo = { nickname, uid, avatar }
        lists.sort((a, b) => a.tid - b.tid)
        this.disstList = lists
        this.disstId = lists[0]?.tid
      })
    },
    async getSongLists() {
      this.listType = 2
      this.listLoading = true
      await this.$axios.get(`${this.apiUrl}/songList?disstid=${this.disstId}`).then(res => {
        const { nickname, desc, dissname, cover, songlist, songCount, tags, playCount } = res.data
        this.cdinfo = { nickname, desc, dissname, cover, songlist, songCount, tags, playCount }
        this.songlist = songlist
      }).catch(() => {})
      this.listLoading = false

      // 表格返回头部
      const multipleTable = this.$refs.lists && this.$refs.lists?.$refs.table?.bodyWrapper
      if (multipleTable) multipleTable.scrollTop = 0
    },
    handleSearch(isReset) {
      this.disstId = 0
      this.listType = 1
      var { page, pageSize } = this.listQuery
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
      this.$axios.get(`${this.apiUrl}/search`, {
        params: {
          keyword: this.keyword,
          page,
          pageSize
        }
      }).then(res => {
        const { total, list } = res.data
        this.songlist = this.songlist.concat(list)
        this.listLoading = false
        if (this.songlist.length >= total) {
          this.isNoneMore = true
        }
      })
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
  &-main{
    overflow: hidden;
    position: relative;
    height: 100%;
    padding-bottom: 90px;
    background-color: rgba($color: #000, $alpha: 0.15);
    box-sizing: border-box;
  }
}
</style>
