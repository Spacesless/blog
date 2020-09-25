<template>
  <div class="spine">
    <el-row>
      <el-col :sm="24" :md="12">
        <div class="spine-tool">
          <el-select v-model="selectAnimation" placeholder="">
            <el-option
              v-for="item in animationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <canvas id="canvas" class="spine-canvas" />
      </el-col>
      <el-col :sm="24" :md="12">
        <el-form class="spine-filter">
          <el-form-item>
            <el-input v-model="checkboxGroup1" placeholder="" />
          </el-form-item>
          <el-form-item label="label">
            <el-checkbox-group v-model="checkboxGroup1">
              <el-checkbox-button label="" />
              <el-checkbox-button label="" />
              <el-checkbox-button label="" />
              <el-checkbox-button label="" />
              <el-checkbox-button label="" />
              <el-checkbox-button label="" />
              <el-checkbox-button label="" />
              <el-checkbox-button label="" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="label">
            <el-checkbox-group v-model="checkboxGroup1">
              <el-checkbox-button label="" />
              <el-checkbox-button label="" />
              <el-checkbox-button label="" />
              <el-checkbox-button label="" />
              <el-checkbox-button label="" />
              <el-checkbox-button label="" />
              <el-checkbox-button label="" />
              <el-checkbox-button label="" />
              <el-checkbox-button label="" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="label">
            <el-radio-group v-model="checkboxGroup1">
              <el-radio :label="3">备选项</el-radio>
              <el-radio :label="6">备选项</el-radio>
              <el-radio :label="9">备选项</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-scrollbar ref="scrollbar" v-loading="listLoading" class="spine-scroll" wrap-class="scrollbar-wrapper">
          <ul class="spine-list">
            <li v-for="(item,index) in skelList" :key="index">
              <el-image :src="item.thumbnail" lazy />
            </li>
          </ul>
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { spine } from '@/utils/spine-ts/spine-webgl.js'

export default {
  data() {
    return {
      activeSkeleton: '',
      seleteSkeleton: '',
      skelList: [],
      selectAnimation: '',
      animationOptions: [],
      checkboxGroup1: ''
    }
  },
  methods: {
    fetchList() {

    },
    initSpine() {
      // Setup canvas and WebGL context. We pass alpha: false to canvas.getContext() so we don't use premultiplied alpha when
      // loading textures. That is handled separately by PolygonBatcher.
      this.spineCanvas = document.getElementById('canvas')
      this.spineCanvas.width = window.innerWidth
      this.spineCanvas.height = window.innerHeight
      const config = { alpha: false }
      this.gl = this.spineCanvas.getContext('webgl', config) || this.spineCanvas.getContext('experimental-webgl', config)
      if (!this.gl) {
        alert('WebGL is unavailable.')
        return
      }

      // Create a simple shader, mesh, model-view-projection matrix, SkeletonRenderer, and AssetManager.
      this.shader = spine.webgl.Shader.newTwoColoredTextured(this.gl)
      this.batcher = new spine.webgl.PolygonBatcher(this.gl)
      const mvp = new spine.webgl.Matrix4()
      mvp.ortho2d(0, 0, this.spineCanvas.width - 1, this.spineCanvas.height - 1)
      this.skeletonRenderer = new spine.webgl.SkeletonRenderer(this.gl)
      this.assetManager = new spine.webgl.AssetManager(this.gl)

      requestAnimationFrame(this.load)

      this.spineCanvas.addEventListener('mousewheel', (e) => {
        if (!this.root) return

        if (e.deltaY > 0) {
          console.log('> 0')
        } else {
          console.log('< 0')
        }

        this.root.scaleX = 1
        this.root.scaleY = 1
      })
    },
    load() {
      // Wait until the AssetManager has loaded all resources, then load the skeletons.
      if (this.assetManager.isLoadingComplete()) {
        this.activeSkeleton = this.loadSkeleton({}, false)
        this.selectAnimation = 'normal'
        this.lastFrameTime = Date.now() / 1000
        this.setupAnimation()
        requestAnimationFrame(this.render)
      } else {
        requestAnimationFrame(this.load)
      }
    },
    fetchAssets() {
      return this.$axios.$get('').then(res => {
        this.loadAsset(res.data)
      })
    },
    loadAsset({ atlas, skelBinary, skelJson }) {
      if (skelJson) {
        this.assetManager.loadText(skelJson)
      } else {
        this.assetManager.loadBinary(skelBinary)
      }
    },
    loadSkeleton(assets, premultipliedAlpha, skin) {
      const { atlas, skelBinary, skelJson } = assets
      if (skin === undefined) skin = 'default'
      // Load the texture atlas using name.atlas from the AssetManager.
      const atlasData = this.assetManager.get(atlas)
      // Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
      const atlasLoader = new spine.AtlasAttachmentLoader(atlasData)
      // Set the scale to apply during parsing, parse the file, and create a new skeleton.
      let skeletonData
      if (skelJson) {
        var skeletonJson = new spine.SkeletonJson(atlasLoader)
        skeletonData = skeletonJson.readSkeletonData(this.assetManager.get(skelJson))
      } else {
        // Create a SkeletonBinary instance for parsing the .skel file.
        // var skeletonBinary = new spine.SkeletonBinary(atlasLoader);
        var skeletonBinary = new spine.SkeletonBinary(atlasLoader)
        skeletonData = skeletonBinary.readSkeletonData(this.assetManager.get(skelBinary))
      }
      const skeleton = new spine.Skeleton(skeletonData)
      this.root = skeletonData.findBone('root')
      skeleton.setSkinByName(skin)
      const bounds = this.calculateBounds(skeleton)
      // Create an AnimationState, and set the initial animation in looping mode.
      const animationStateData = new spine.AnimationStateData(skeleton.data)
      var animationState = new spine.AnimationState(animationStateData)
      if (this.keleton.data.findAnimation(this.selectAnimation) == null) {
        this.selectAnimation = skeleton.data.animations[0].name
      }
      animationState.setAnimation(0, this.selectAnimation, true)
      // Pack everything up and return to caller.
      return { skeleton, state: animationState, bounds, premultipliedAlpha }
    },
    calculateBounds(skeleton) {
      skeleton.setToSetupPose()
      skeleton.updateWorldTransform()
      const offset = new spine.Vector2()
      const size = new spine.Vector2()
      skeleton.getBounds(offset, size, [])
      return { offset, size }
    },
    setupAnimation() {
      const skeleton = this.activeSkeleton.skeleton
      console.log(skeleton.data.skins)
      this.animationOptions = skeleton.data.animations.map(item => {
        return {
          label: item.name,
          value: item.name
        }
      })
    },
    onChangeAnimation(animationName) {
      const state = this.activeSkeleton.state
      const skeleton = this.activeSkeleton.skeleton
      skeleton.setToSetupPose()
      state.setAnimation(0, animationName, true)
    },
    render() {
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
    resize() {
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
      if (scale < 1) scale = 1
      const width = this.spineCanvas.width * scale
      const height = this.spineCanvas.height * scale
      this.mvp.ortho2d(centerX - width / 2, centerY - height / 2, width, height)
      this.gl.viewport(0, 0, this.spineCanvas.width, this.spineCanvas.height)
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
