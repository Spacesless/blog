<template>
  <div class="wallpaper">
    <div class="wallpaper-preview">
      <div class="wallpaper-preview__img">
        <el-tooltip effect="dark" content="点击预览原图" placement="bottom">
          <img ref="source" class="img-fluid" :src="data.preview" :data-src="data.imgurl" :alt="data.title" @click="openViewer" />
        </el-tooltip>
        <el-image ref="preview" class="app-preview" :src="previewSrc" :preview-src-list="previewSrcList"></el-image>
      </div>
      <div class="wallpaper-preview__size">
        <p>当前为预览，点击查看原始尺寸哟！</p>
        <div class="text-center">
          <a
            class="el-button el-button--primary el-button--small"
            :href="configs.siteurl + '/download?file=' + data.imgurl + '&filename=' + data.title + '-' + data.imgwidth + 'x' + data.imgheight"
            target="_blank"
          >
            <i class="el-icon-download"></i>
            下载原图 {{ data.imgwidth }}x{{ data.imgheight }}
          </a>
          <el-select v-model="downloadSize" clearable placeholder="下载其它分辨率" @change="downloadTheSize">
            <el-option value="1920x1080">
              <span class="filter-item__option">1920x1080</span>
              <span class="filter-item__desc">Full HD</span>
            </el-option>
            <el-option label="1920x1200" value="1920x1200">
              <span class="filter-item__option">1920x1200</span>
            </el-option>
            <el-option label="2560x1440" value="2560x1440">
              <span class="filter-item__option">2560x1440</span>
              <span class="filter-item__desc">QuadHD 2K</span>
            </el-option>
            <el-option value="3840x2160">
              <span class="filter-item__option">3840x2160</span>
              <span class="filter-item__desc">UltraHD 4K</span>
            </el-option>
            <el-option value="5120x2880">
              <span class="filter-item__option">5120x2880</span>
              <span class="filter-item__desc">5K Retina</span>
            </el-option>
            <el-option value="7680x4320">
              <span class="filter-item__option">7680x4320</span>
              <span class="filter-item__desc">UltraHD 8K</span>
            </el-option>
          </el-select>
          <el-button type="primary"  @click="initCropper" plain>自定义裁剪</el-button>
        </div>

        <el-dialog
          title="自定义图片裁剪"
          :fullscreen="true"
          :visible.sync="cropperVisible"
          custom-class="cropper-dialog"
        >
          <div class="cropper-wrap" :style="{ height: wrapHeight + 'px' }" v-if="cropperIsExist">
            <img ref="cropper" class="img-fluid" :alt="data.title">
          </div>
          <div ref="footer" slot="footer" class="dialog-footer">
            <el-form class="cropper-info" label-width="50px" :inline="true">
              <el-form-item label="X">
                <el-input v-model.number="croped.x" @change="onChange"></el-input>
              </el-form-item>
              <el-form-item label="Y">
                <el-input v-model.number="croped.y" @change="onChange"></el-input>
              </el-form-item>
              <el-form-item label="宽">
                <el-input v-model.number="croped.width" @change="onChange"></el-input>
              </el-form-item>
              <el-form-item label="高">
                <el-input v-model.number="croped.height" @change="onChange"></el-input>
              </el-form-item>
              <el-form-item label="旋转">
                <el-input v-model.number="croped.rotate" @change="onChange"></el-input>
              </el-form-item>
              <el-form-item label="scaleX">
                <el-input v-model.number="croped.scaleX" @change="onChange"></el-input>
              </el-form-item>
              <el-form-item label="scaleY">
                <el-input v-model.number="croped.scaleY" @change="onChange"></el-input>
              </el-form-item>
            </el-form>
            <div class="cropper-opatate">
              <el-select v-model="aspectRatio" placeholder="请选择宽高比">
                <el-option label="无比例限制" value="无比例限制"></el-option>
                <el-option label="1:1" :value="1"></el-option>
                <el-option label="4:3" :value="4 / 3"></el-option>
                <el-option label="16:9" :value="16 / 9"></el-option>
                <el-option label="16:10" :value="16 / 10"></el-option>
              </el-select>
              <el-button-group>
                <el-tooltip content="下载裁剪的图片" placement="top">
                  <el-button type="primary" icon="el-icon-download" @click="downloadCrop"></el-button>
                </el-tooltip>
                <el-tooltip content="重置" placement="top">
                  <el-button type="primary" icon="el-icon-refresh" @click="refreshCrop"></el-button>
                </el-tooltip>
              </el-button-group>
              <el-button-group>
                <el-tooltip content="向左旋转45度" placement="top">
                  <el-button type="primary" icon="el-icon-refresh-left" plain @click="rotateCrop(-45)"></el-button>
                </el-tooltip>
                <el-tooltip content="向右旋转45度" placement="top">
                  <el-button type="primary" icon="el-icon-refresh-right" plain @click="rotateCrop(45)"></el-button>
                </el-tooltip>
              </el-button-group>
              <el-button-group>
                <el-tooltip content="水平翻转图片" placement="top">
                  <el-button type="primary" icon="tl-icon-horizontal" plain @click="turnCrop('horizontal')"></el-button>
                </el-tooltip>
                <el-tooltip content="垂直翻转图片" placement="top">
                  <el-button type="primary" icon="tl-icon-vertical" plain @click="turnCrop('vertical')"></el-button>
                </el-tooltip>
              </el-button-group>
              <el-button type="danger" @click="cropperVisible = false">取消</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>

    <div class="wallpaper-content">
      <div class="Tinymce">
        <h1 class="wallpaper-content__title">{{ data.title }}</h1>
        <div class="wallpaper-content__isuse">
          <span>
            <i class="tl-icon">&#xe601;</i>{{ data.hits }}
          </span>
          <span>
            <i class="tl-icon">&#xe70b;</i>{{ data.updatetime }}
          </span>
        </div>
        <div class="share-desc" v-html="data.content"></div>
      </div>
      <!-- share start -->
      <Share />
    </div>
    <!-- Advertisement -->
    <Advertisement />
    <!-- comment start -->
    <Comment />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import 'cropperjs/dist/cropper.css'
import Share from '@/components/Share'
import Advertisement from '@/components/Advertisement'
import Comment from '@/components/Comment'
import { contentPage } from '@/mixins'

export default {
  async asyncData({ app, params, $axios }) {
    const id = params.id
    const { seo, content: data } = await $axios.$get('/wallpaper/content', {
      params: { id }
    })
    return { seo, data }
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
  components: {
    Share,
    Advertisement,
    Comment
  },
  mixins: [contentPage],
  data() {
    return {
      previewSrc: '',
      previewSrcList: [],
      resolutions: '1920x1080',
      downloadSize: '',
      cropperVisible: false,
      cropperIsExist: false,
      cropper: null,
      aspectRatio: '无比例限制',
      ouputSize: 1,
      wrapHeight: 600,
      file: {},
      croped: {}
    }
  },
  computed: {
    ...mapGetters(['configs'])
  },
  watch: {
    aspectRatio(val) {
      this.cropper.setAspectRatio(val)
    }
  },
  mounted() {
    const source = this.$refs.source
    this.imgurl = source.dataset.src
    const isDev = process.env.NODE_ENV === 'development'
    const { name, ext } = this.formatPath(this.imgurl)
    this.file = {
      path: isDev ? this.imgurl : `//cdn.timelessq.com${this.imgurl}`,
      name,
      ext
    }
    this.outputType = ext === 'jpg' ? 'jpeg' : (ext || '')

    this.accessStatistics(2, this.data.id)
  },
  methods: {
    downloadTheSize(val) {
      if (val === '') return
      const title = this.$refs.source.alt
      const { dir, name, ext } = this.formatPath(this.imgurl)
      const dest = `${dir}/thumb/${name}-${val}${ext}`
      window.open(`/download?file=${dest}&filename=${title}-${val}`)
    },
    openViewer() {
      this.previewSrcList = [this.data.imgurl]
      this.previewSrc = this.data.imgurl
      this.$nextTick(() => {
        this.$refs.preview && this.$refs.preview.clickHandler()
      })
    },
    closeViewer() {
      this.$refs.preview && this.$refs.preview.closeViewer()
    },
    async initCropper() {
      const { default: Cropper } = await import(
        /* webpackChunkName: "chunk-cropper" */
        'cropperjs'
      )
      this.cropperVisible = true
      if (this.cropperIsExist) return
      this.cropperIsExist = true

      await this.$nextTick()
      const cropper = this.$refs.cropper
      if (!cropper.src) cropper.src = this.file.path
      this.wrapHeight = document.documentElement.clientHeight - 104 - this.$refs.footer.clientHeight

      this.cropper = new Cropper(cropper, {
        viewMode: 2, // https://github.com/fengyuanchen/cropperjs
        dragMode: 'move',
        crop: (event) => {
          const { x, y, width, height, rotate, scaleX, scaleY } = event.detail
          this.croped = {
            x: Math.round(x),
            y: Math.round(y),
            width: Math.round(width),
            height: Math.round(height),
            rotate, scaleX, scaleY
          }
        }
      })
    },
    formatPath(path) {
      const format = path.split('/')
      const filename = [...format].pop()
      const filenameArray = filename.split('.')
      return {
        dir: format.slice(0, format.length - 1).join('/'),
        name: filenameArray[0],
        ext: '.' + filenameArray[1]
      }
    },
    onChange() {
      this.cropper.setData(this.croped)
    },
    downloadCrop() {
      if (!this.linkEle) {
        this.linkEle = document.createElement('a')
      }
      const { width, height } = this.croped
      this.linkEle.download = `${this.file.name}-${width}x${height}.${this.file.ext}`
      const dataURL = this.cropper.getCroppedCanvas().toDataURL(`image/${this.outputType}`, this.ouputSize)

      this.linkEle.href = dataURL
      this.linkEle.click()
    },
    refreshCrop() {
      // clear
      this.cropper.reset()
    },
    rotateCrop(deg) {
      // 旋转图片
      this.cropper.rotate(deg)
    },
    turnCrop(type) {
      switch (type) {
        case 'horizontal':
          this.cropper.scaleX(-this.croped.scaleX)
          break
        case 'vertical':
          this.cropper.scaleY(-this.croped.scaleY)
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wallpaper{
  &-preview{
    margin: 15px 0;
    &__img{
      cursor: pointer;
    }
    &__size{
      padding: 15px;
      p{
        font-size: 15px;
        color: #F56C6C;
        padding-bottom: 10px;
      }
    }
    ::vue-deep .el-dialog__body{
      padding: 10px 20px;
    }
  }
  &-content{
    &__title{
      font-size: 26px;
      font-weight: 100;
      color: $primary;
    }
    &__isuse{
      font-size: 15px;
      color: #909399;
      span{
        margin-left: 10px;
      }
      i{
        padding-right: 3px;
      }
    }
  }
}
.cropper-dialog{
  .dialog-footer{
    i{
      font-size: 18px;
    }
  }
  .cropper-info{
    .el-form-item{
      margin-bottom: 10px;
    }
    .el-input{
      width: 100px;
    }
  }
  .el-button-group{
    .el-button{
      padding: 6px 20px;
    }
    ::vue-deep .tl-icon-horizontal{
      &:before{
        content: '\e662'
      }
    }
    ::vue-deep .tl-icon-vertical{
      &:before{
        content: '\e661'
      }
    }
  }
}
</style>
