<template>
  <div element-loading-text="拼命加载中" element-loading-background="rgba(0, 0, 0, 0.1)" class="spine">
    <div class="spine-tool">
      <el-select v-model="seleteSkeleton" filterable :loading="listLoading" :filter-method="filterSkel" @change="onChangeSkel">
        <el-option
          v-for="item in filterOptions"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        >
          <span style="float: left;">{{ item.alias ? `${item.name}(${item.alias})` : item.name }}</span>
          <span style="float: right; font-size: 12px; color: #606266;">{{ item.remark }}</span>
        </el-option>
      </el-select>
      <el-select v-model="selectAnimation" @change="onChangeAnimation">
        <el-option
          v-for="item in animationOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <canvas id="canvas" class="spine-canvas" />
    <div v-loading="skelLoading" element-loading-text="拼命加载中" element-loading-background="rgba(0, 0, 0, 0)" class="spine-loading" />
    <div class="spine-scale">
      <span class="spine-scale__icon el-icon-plus" @click="addSpineScale" />
      <span class="spine-scale__icon el-icon-minus" @click="subtractSpineScale" />
    </div>
  </div>
</template>

<script>
import { spine } from '@/vendor/spine-ts/spine-webgl.js'
import { pageMeta } from '@/mixins'

export default {
  name: 'SpineGl',
  mixins: [pageMeta],
  layout: 'app',
  data () {
    return {
      seleteSkeleton: 'lafei_4',
      selectAnimation: '',
      skelOptions: [],
      listLoading: false,
      filterOptions: [],
      animationOptions: [],
      checkboxGroup1: '',
      apiUrl: '//api.timelessq.com/spine',
      spineScale: 1,
      skelLoading: false
    }
  },
  mounted () {
    this.initSpine()
    this.fetchList()
  },
  methods: {
    fetchParams () {
      return this.$axios.$get('/tool/params', {
        params: {
          id: this.findCategory.id
        }
      }).then(({ seleteSkeleton, selectAnimation }) => {
        this.seleteSkeleton = seleteSkeleton || 'lafei_4'
        this.selectAnimation = selectAnimation || 'normal'
      })
    },
    async fetchList () {
      this.listLoading = true
      await this.$axios.get(this.apiUrl + '/lists').then((res) => {
        this.filterOptions = this.skelOptions = res.data
      }).catch(() => {})
      this.listLoading = false
    },
    fetchAssets () {
      return this.$axios.get(this.apiUrl, {
        params: {
          id: this.seleteSkeleton,
          isuseCDN: true
        }
      }).then((res) => {
        this.assetsData = res.data
        this.loadAsset()
      })
    },
    async initSpine () {
      // Setup canvas and WebGL context. We pass alpha: false to canvas.getContext() so we don't use premultiplied alpha when
      // loading textures. That is handled separately by PolygonBatcher.
      this.spineCanvas = document.getElementById('canvas')
      this.spineCanvas.width = window.innerWidth
      this.spineCanvas.height = window.innerHeight
      const config = { alpha: false }
      this.gl = this.spineCanvas.getContext('webgl', config) || this.spineCanvas.getContext('experimental-webgl', config)
      if (!this.gl) {
        console.warn('WebGL is unavailable.')
        return
      }

      // Create a simple shader, mesh, model-view-projection matrix, SkeletonRenderer, and AssetManager.
      this.shader = spine.webgl.Shader.newTwoColoredTextured(this.gl)
      this.batcher = new spine.webgl.PolygonBatcher(this.gl)
      this.mvp = new spine.webgl.Matrix4()
      this.mvp.ortho2d(0, 0, this.spineCanvas.width - 1, this.spineCanvas.height - 1)
      this.skeletonRenderer = new spine.webgl.SkeletonRenderer(this.gl)
      this.assetManager = new spine.webgl.AssetManager(this.gl)
      await this.fetchParams()
      await this.fetchAssets()
      requestAnimationFrame(this.load)
    },
    loadAsset () {
      const { atlas, skelBinary, skelJson } = this.assetsData
      if (skelJson) {
        this.assetManager.loadText(skelJson)
      } else {
        this.assetManager.loadBinary(skelBinary)
      }
      this.assetManager.loadTextureAtlas(atlas)
    },
    load () {
      this.skelLoading = true
      // Wait until the AssetManager has loaded all resources, then load the skeletons.
      if (this.assetManager.isLoadingComplete()) {
        this.activeSkeleton = this.loadSkeleton(false)
        this.isChange = false
        this.lastFrameTime = Date.now() / 1000
        this.setupAnimation()
        requestAnimationFrame(this.render)
      } else {
        requestAnimationFrame(this.load)
      }
    },
    loadSkeleton (premultipliedAlpha, skin) {
      const { atlas, skelBinary, skelJson } = this.assetsData
      if (skin === undefined) { skin = 'default' }
      // Load the texture atlas using name.atlas from the AssetManager.
      const atlasData = this.assetManager.get(atlas)
      // Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
      const atlasLoader = new spine.AtlasAttachmentLoader(atlasData)
      // Set the scale to apply during parsing, parse the file, and create a new skeleton.
      let skeletonData
      if (skelJson) {
        const skeletonJson = new spine.SkeletonJson(atlasLoader)
        skeletonData = skeletonJson.readSkeletonData(this.assetManager.get(skelJson))
      } else {
        // Create a SkeletonBinary instance for parsing the .skel file.
        // var skeletonBinary = new spine.SkeletonBinary(atlasLoader);
        const skeletonBinary = new spine.SkeletonBinary(atlasLoader)
        skeletonData = skeletonBinary.readSkeletonData(this.assetManager.get(skelBinary))
      }
      const skeleton = new spine.Skeleton(skeletonData)
      this.root = skeletonData.findBone('root')
      skeleton.setSkinByName(skin)
      const bounds = this.calculateBounds(skeleton)
      // // Create an AnimationState, and set the initial animation in looping mode.
      const animationStateData = new spine.AnimationStateData(skeleton.data)
      const animationState = new spine.AnimationState(animationStateData)
      if (skeleton.data.findAnimation(this.selectAnimation) == null) {
        this.selectAnimation = skeleton.data.animations[0].name
      }
      animationState.setAnimation(0, this.selectAnimation, true)
      // Pack everything up and return to caller.
      return { skeleton, state: animationState, bounds, premultipliedAlpha }
    },
    calculateBounds (skeleton) {
      skeleton.setToSetupPose()
      skeleton.updateWorldTransform()
      const offset = new spine.Vector2()
      const size = new spine.Vector2()
      skeleton.getBounds(offset, size, [])
      return { offset, size }
    },
    render () {
      this.skelLoading = false
      if (this.isChange) {
        this.load()
        return
      }
      const now = Date.now() / 1000
      const delta = now - this.lastFrameTime
      this.lastFrameTime = now
      // Update the MVP matrix to adjust for canvas size changes
      this.resize()
      this.gl.clearColor(0.5, 0.5, 0.5, 1)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT)
      // Apply the animation state based on the delta time.
      const state = this.activeSkeleton.state
      const skeleton = this.activeSkeleton.skeleton
      const premultipliedAlpha = this.activeSkeleton.premultipliedAlpha
      state.update(delta)
      state.apply(skeleton)
      skeleton.updateWorldTransform()
      // Bind the shader and set the texture and model-view-projection matrix.
      this.shader.bind()
      this.shader.setUniformi(spine.webgl.Shader.SAMPLER, 0)
      this.shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, this.mvp.values)
      // Start the batch and tell the SkeletonRenderer to render the active skeleton.
      this.batcher.begin(this.shader)
      this.skeletonRenderer.premultipliedAlpha = premultipliedAlpha
      this.skeletonRenderer.draw(this.batcher, skeleton)
      this.batcher.end()
      this.shader.unbind()
      requestAnimationFrame(this.render)
    },
    resize () {
      const w = this.spineCanvas.clientWidth
      const h = this.spineCanvas.clientHeight
      const bounds = this.activeSkeleton.bounds
      if (this.spineCanvas.width !== w || this.spineCanvas.height !== h) {
        this.spineCanvas.width = w
        this.spineCanvas.height = h
      }
      // magic
      const centerX = bounds.offset.x + bounds.size.x / 2
      const centerY = bounds.offset.y + bounds.size.y / 2
      const scaleX = bounds.size.x / this.spineCanvas.width
      const scaleY = bounds.size.y / this.spineCanvas.height
      let scale = Math.max(scaleX, scaleY) * 1.2
      if (scale < 1) { scale = 1 }
      const width = this.spineCanvas.width * scale
      const height = this.spineCanvas.height * scale
      this.mvp.ortho2d(centerX - width / 2, centerY - height / 2, width, height)
      this.gl.viewport(0, 0, this.spineCanvas.width, this.spineCanvas.height)
    },
    setupAnimation () {
      const skeleton = this.activeSkeleton.skeleton
      this.animationOptions = skeleton.data.animations.map((item) => {
        return {
          label: item.name,
          value: item.name
        }
      })
    },
    async onChangeSkel () {
      await this.fetchAssets()
      this.isChange = true
    },
    onChangeAnimation (animationName) {
      const state = this.activeSkeleton.state
      const skeleton = this.activeSkeleton.skeleton
      skeleton.setToSetupPose()
      state.setAnimation(0, animationName, true)
    },
    handleChangeScale () {
      if (!this.root) { return }
      this.root.scaleX = this.root.scaleY = this.spineScale
    },
    addSpineScale () {
      if (this.spineScale >= 1.5) { return }
      this.spineScale += 0.1
      this.handleChangeScale()
    },
    subtractSpineScale () {
      if (this.spineScale <= 0.5) { return }
      this.spineScale -= 0.1
      this.handleChangeScale()
    },
    filterSkel (keyword) {
      if (keyword) {
        this.filterOptions = this.skelOptions.filter(item => JSON.stringify(item).toLowerCase().includes(keyword))
      } else {
        this.filterOptions = this.skelOptions
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.spine {
  position: fixed;
  width: 100%;
  height: 100%;

  &-tool {
    position: absolute;
    top: 30px;
    left: 0;
    width: 100%;
    text-align: center;

    .el-select {
      margin-bottom: 10px;
    }

    @media (max-width: 576px) {
      top: 15px;
    }
  }

  &-scale {
    position: absolute;
    right: 30px;
    bottom: 30px;

    &__icon {
      display: block;
      padding: 10px;
      color: var(--color-heading);
      cursor: pointer;
      background-color: var(--bg-normal);
      border-radius: 4px;

      &.el-icon-plus {
        border-bottom: 1px solid var(--border-color);
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
      }

      &.el-icon-minus {
        margin-top: -1px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }

      &:hover {
        background-color: var(--color-primary);
      }
    }
  }

  &-loading {
    position: absolute;
    bottom: 90px;
    left: 50%;
    width: 100px;
    height: 60px;
    margin-left: -50px;

    @media (max-width: 576px) {
      bottom: 75px;
    }
  }
}
</style>
