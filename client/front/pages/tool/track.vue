<template>
  <div class="tour">
    <div id="map" />
    <div v-loading="fetchLoading" class="tour-list" element-loading-background="rgba(0, 0, 0, 0.6)">
      <div class="tour-list-filter">
        <el-input
          v-model="keyword"
          clearable
          placeholder="输入关键字进行过滤"
        />
      </div>
      <el-scrollbar class="tour-list-scrollbar" wrap-class="tour-list-scrollbar-wrapper">
        <dl v-for="(item, index) in filterTree" :key="index">
          <dt>{{ item.name }}({{ item.count }})</dt>
          <dd
            v-for="(child, childIndex) in item.children"
            :key="childIndex"
            @click="handleClickNode(child.cityCode)"
          >{{ child.name }}({{ child.count }})</dd>
        </dl>
      </el-scrollbar>
    </div>
    <div class="tour-overview">
      <p class="tour-overview-item">
        <span class="tour-overview-item__count">{{ cityCount }}</span>
        <span class="tour-overview-item__desc">座城已点亮</span>
      </p>
      <p class="tour-overview-item">
        <span class="tour-overview-item__count">{{ trackCount }}</span>
        <span class="tour-overview-item__desc">个打卡地点</span>
      </p>
    </div>
  </div>
</template>

<script>
import { pageMeta } from '@/mixins'

export default {
  layout: 'app',
  mixins: [pageMeta],
  data() {
    return {
      tourTree: [],
      keyword: '',
      cityCount: 0,
      trackCount: 0,
      fetchLoading: false
    }
  },
  computed: {
    filterTree() {
      if (this.keyword) {
        return this.filterNodesDeep(this.tourTree, node => node.name.indexOf(this.keyword) > -1)
      } else {
        return [...this.tourTree]
      }
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    async initMap() {
      const AMap = window.AMap
      this.mapInstance = new AMap.Map('map', {
        resizeEnable: true, // 是否监控地图容器尺寸变化
        mapStyle: 'amap://styles/grey'
      })
      this.mapInstance.addControl(new AMap.ToolBar({
        position: 'RT'
      }))
      this.mapInstance.addControl(new AMap.Scale({
        position: 'RB'
      }))

      this.addClusterLayer()
    },
    async fetchList() {
      this.fetchLoading = true
      await this.$axios.$get('/tool/params', {
        params: {
          id: this.findCategory.id
        }
      }).then(res => {
        const treeData = JSON.parse(JSON.stringify(res))
        treeData.forEach(item => {
          item.count = 0
          item.children.forEach(child => {
            const length = child.children.length
            this.cityCount += 1
            this.trackCount += length
            item.count += length
            child.count = length
            child.children = []
          })
        })
        this.tourTree = treeData

        const { province, point } = this.flattenDeep(res)
        this.topAdcodes = province
        this.tourList = point
      }).catch(error => {
        console.log(error)
      })
      this.fetchLoading = false
    },
    flattenDeep(source, province = [], point = []) {
      source.forEach(item => {
        const { children, provCode, coordinates } = item
        if (children && children.length) {
          this.flattenDeep(item.children, province, point)
        }
        if (provCode) province.push(provCode)
        if (coordinates) point.push(item)
      })
      return { province, point }
    },
    addClusterLayer(excludedAdcodes) {
      const refresh = () => {
        const zoom = this.mapInstance.getZoom()

        // 获取 pointStyle
        const pointStyle = this.pointSimplifierIns.getRenderOptions().pointStyle

        // 根据当前zoom调整点的尺寸
        pointStyle.width = pointStyle.height = 2 * Math.pow(1.2, this.mapInstance.getZoom() - 3)

        if (zoom < 8) {
          this.pointSimplifierIns.hide()
        } else {
          this.pointSimplifierIns.show()
        }
      }

      this.mapInstance.on('zoomend', function() {
        refresh()
      })

      // 加载相关组件
      window.AMapUI.load(
        ['ui/geo/DistrictCluster', 'ui/misc/PointSimplifier'],
        async(DistrictCluster, PointSimplifier) => {
          await this.fetchList()

          // 启动页面
          this.renderCluster(DistrictCluster, PointSimplifier)

          this.distCluster.setData(this.tourList)

          this.pointSimplifierIns.setData(this.tourList)

          refresh()
        })
    },
    renderCluster(DistrictCluster, PointSimplifier) {
      this.pointSimplifierIns = new PointSimplifier({
        map: this.mapInstance, // 所属的地图实例
        autoSetFitView: false, // 禁止自动更新地图视野
        zIndex: 110,
        getPosition: function(item) {
          if (!item) {
            return null
          }

          const parts = item.coordinates

          // 返回经纬度
          return [parseFloat(parts[0]), parseFloat(parts[1])]
        },
        getHoverTitle: function(dataItem, idx) {
          return dataItem.name
        },
        renderOptions: {
          // 点的样式
          pointStyle: {
            width: 6,
            height: 6,
            fillStyle: '#00FFFF'
          },
          // 鼠标hover时的title信息
          hoverTitleStyle: {
            position: 'top'
          }
        }
      })

      this.distCluster = new DistrictCluster({
        zIndex: 100,
        map: this.mapInstance, // 所属的地图实例
        topAdcodes: this.topAdcodes,
        getPosition: function(item) {
          if (!item) {
            return null
          }

          const parts = item.coordinates

          // 返回经纬度
          return [parseFloat(parts[0]), parseFloat(parts[1])]
        },
        renderOptions: {
          getFeatureStyle: function(feature, dataItems) {
            const length = dataItems.length
            if (length) {
              return {
                fillStyle: `rgba(24,144,255,${length > 5 ? (length > 10 ? 0.5 : 0.3) : 0.1})`
              }
            }

            return {
              fillStyle: 'rgba(24,144,255,0)',
              strokeStyle: 'rgba(24,144,255,0)'
            }
          }
        }
      })
    },
    /**
  * 递归过滤节点，但保留原树结构，即符合条件节点的父路径上所有节点不管是否符合条件都保留
  * @param {Node[]} nodes 要过滤的节点
  * @param {node => boolean} predicate 过滤条件，符合条件的节点保留
  * @return 过滤后的根节点数组
  * @see https://segmentfault.com/q/1010000018197249/a-1020000018203261
  */
    filterNodesDeep(nodes, predicate) {
    // 如果已经没有节点了，结束递归
      if (!(nodes && nodes.length)) {
        return
      }

      const newChildren = []
      for (const node of nodes) {
        const subs = this.filterNodesDeep(node.children, predicate)

        // 以下两个条件任何一个成立，当前节点都应该加入到新子节点集中
        // 1. 子孙节点中存在符合条件的，即 subs 数组中有值
        // 2. 自己本身符合条件
        if ((subs && subs.length) || predicate(node)) {
          node.children = subs
          newChildren.push(node)
        }
      }
      return newChildren.length ? newChildren : void 0
    },
    /**
     * 点击树节点，定位地图
     * @param {String} cityCode 城市区域编码
     */
    handleClickNode(cityCode) {
      if (!cityCode) return
      const { idealZoom, center } = this.distCluster.getAreaNodeProps(cityCode)
      idealZoom && center && this.mapInstance.setZoomAndCenter(idealZoom - 1, center)
    }
  },
  head() {
    return {
      title: this.meta.title,
      meta: [
        { hid: 'description', name: 'description', content: this.meta.description },
        { hid: 'keyword', name: 'keyword', content: this.meta.keywords }
      ],
      script: [
        {
          type: 'text/javascript',
          src: '//webapi.amap.com/maps?v=1.4.15&key=e5f8a818ff67f77976be46e54f4a9d51&plugin=AMap.Scale,AMap.ToolBar,AMap.MarkerClusterer'
        },
        {
          type: 'text/javascript',
          src: '//webapi.amap.com/ui/1.1/main.js'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
$sidebar-width: 200px;
.tour{
  width: 100%;
  height: 100%;
  &-list{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: $sidebar-width;
    background-color: #1a232c;
    box-shadow: 0 2px 5px rgba($color: #000000, $alpha: .6);
    &-filter{
      height: 70px;
      padding: 0 15px;
      line-height: 70px;
    }
    &-scrollbar{
      height: calc(100% - 180px);
    }
    dl{
      padding: 0 10px;
      color: #f7f7f7;
      font-size: 14px;
      line-height: 1.7;
      dd{
        padding-left: 15px;
        cursor: pointer;
      }
    }
    ::v-deep .el-icon-caret-right:before{
      content: "\e6e0";
    }
    &__item{
      font-size: 14px;
    }
  }
  &-overview{
    position: fixed;
    bottom: 10px;
    left: 0;
    width: $sidebar-width;
    text-align: center;
    &-item{
      color: #fff;
      &__count{
        font-size: 36px;
      }
    }
  }
}
#map{
  position: fixed;
  left: $sidebar-width;
  right: 0;
  height: 100%;
  ::v-deep .amap{
    &-logo{
      display: none !important;
    }
    &-toolbar{
      right: 25px !important;
      top: 20px !important;
    }
    &-scalecontrol{
      right: 25px !important;
    }
    &-scale-text{
      text-shadow: 0 1px #fff;
    }
  }
}
</style>
