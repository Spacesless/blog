<template>
  <div class="bangumi">
    <div class="bangumi-info">
      <el-row :gutter="10">
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
      <!-- share start -->
      <Share />
    </div>
    <div class="bangumi-content">
      <!--bangumi links-->
      <div v-if="data.players.length" class="bangumi-links">
        <h2 class="app-main__title">传送门</h2>
        <div v-for="item in data.players" :key="item.id">
          <a v-if="item.url.includes('bilibili')" class="bangumi-links-item" :href="item.url" target="_blank" rel="noopener noreferrer">
            <el-tooltip class="item" effect="dark" :content="item.url" placement="right">
              <span class="bangumi-links__logo">
                <i>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</i>
                <img src="/static/bangumi-bilibili.jpg" alt="bilibili">
              </span>
            </el-tooltip>
          </a>
          <a v-else class="bangumi-links-item" :href="item.url" target="_blank" rel="noopener noreferrer">
            <el-tooltip class="item" effect="dark" :content="item.url" placement="right">
              <span class="bangumi-links__logo">
                <i>腾讯视频</i>
                <img src="static/bangumi-tencent.jpg" alt="tencent">
              </span>
            </el-tooltip>
          </a>
        </div>
      </div>
      <!--bangumi content-->
      <div class="Tinymce" v-html="data.content" />
      <el-image ref="preview" class="app-preview" :src="previewSrc" :preview-src-list="previewSrcList" />
    </div>
    <!-- Advertisement -->
    <Advertisement />
    <!-- comment start -->
    <Comment />
  </div>
</template>

<script>
import Share from '@/components/Share'
import Advertisement from '@/components/Advertisement'
import Comment from '@/components/Comment'
import { globalFilter, contentPage } from '@/mixins'

export default {
  components: {
    Share,
    Advertisement,
    Comment
  },
  mixins: [globalFilter, contentPage],
  async asyncData({ params, $axios }) {
    const id = params.id
    const { seo, content: data } = await $axios.$get('/bangumi/content', {
      params: { id }
    })
    return { seo, data }
  },
  data() {
    return {
      audios: [],
      showViewer: false,
      previewSrc: '',
      previewSrcList: []
    }
  },
  mounted() {
    this.accessStatistics(3, this.data.id)
  },
  methods: {
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
    margin-top: 15px;
    &-text{
      padding: 0 10px;
      padding-right: 15px;
      color: #606266;
      font-size: 14px;
      line-height: 1.7;
      p{
        margin-bottom: 5px;
        letter-spacing: 1px;
      }
      .para-name{
        padding-right: 5px;
        color: #909399;
      }
    }
    &__title{
      padding: 10px 0 5px;
      color: $primary;
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
      padding-top: 15px;
    }
  }
  &-content{
    margin-top: 15px;
    padding: 15px;
  }
  &-links{
    &-item{
      display: inline-block;
      margin-bottom: 10px;
      color: #606266;
      font-size: 14px;
      &:hover{
        color: $primary;
      }
    }
    &__logo{
      i, img{
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
</style>
