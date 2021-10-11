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
    <!--bangumi content-->
    <div v-if="hasContent" class="bangumi-content">
      <h2 class="app-main__title">观后感</h2>
      <div class="Tinymce" v-html="data.content" />
      <el-image ref="preview" class="app-preview" :src="previewSrc" :preview-src-list="previewSrcList" />
    </div>
    <!-- comment start -->
    <Comment :topic-id="'bangumi-' + data.id" />
  </div>
</template>

<script>
import Share from '@/components/Share'
import Comment from '#/components/Comment'
import { globalFilter } from '@/mixins'

export default {
  components: {
    Share,
    Comment
  },
  mixins: [globalFilter],
  async asyncData({ params, $axios }) {
    const id = params.id
    const { seo, content: data } = await $axios.$get('/bangumi/detail', {
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
  computed: {
    hasContent() {
      return this.data.content.trim().length !== 0
    }
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
      padding-top: 15px;
    }
  }
  &-content{
    padding: 15px;
  }
}
</style>
