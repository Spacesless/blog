<template>
  <div class="garbage">
    <div class="container">
      <div class="garbage-title">
        <img src="@/assets/image/garbage-title.png" alt="logo">
      </div>
      <div class="garbage-search">
        <el-select
          ref="search"
          v-model="keyword"
          class="garbage-search__input"
          size="large"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          @change="onSelectChange"
        >
          <el-option
            v-for="(item, index) in garbageOptions"
            :key="index"
            :label="item.name"
            :value="index"
          />
        </el-select>
        <div class="garbage-search-hot">
          <span class="garbage-search-hot__title">热门搜索：</span>
          <span
            v-for="(item, index) in hotSearchList"
            :key="index"
            class="garbage-search-hot__item"
            @click="handleSearch(item)"
          >{{ item }}</span>
        </div>
        <div class="garbage-result">
          <p class="garbage-result__title">{{ currentGarbage.result }}</p>
          <ul>
            <li
              v-for="(item, index) in currentGarbage.tips"
              :key="index"
              class="garbage-result__tips"
            >{{ item }}</li>
          </ul>
        </div>
      </div>
      <div class="garbage-category">
        <img src="@/assets/image/garbage.png" alt="garbage">
      </div>
      <div class="garbage-footer">查询结果仅供参考，具体分类以归属地相关部门规定为准</div>
    </div>
  </div>
</template>

<script>
const apiurl = 'https://api.timelessq.com/garbage'

const tips = {
  '湿垃圾': [
    '餐厨垃圾应沥干水分后在投放，有包装物的应取出后分类投放。',
    '大块骨头和椰子壳，榴莲壳等不宜生化降解，作为干垃圾进行投放。',
    '纯液体（如牛奶等），可直接倒入下水口。'
  ],
  '干垃圾': [
    '尽量沥干水分。',
    '难以辨别的生活垃圾应投入干垃圾容器内。',
    '餐巾纸、纸巾、纸尿裤、烟蒂等其他垃圾。'
  ],
  '有害垃圾': [
    '充电电池、纽扣电池、蓄电池投放时应注意轻放。',
    '油漆桶、杀虫剂如有残留请密闭后投放。',
    '荧光灯、节能灯易破损连带包装或包裹后投放。',
    '废药品及其包装一并投放。'
  ],
  '可回收物': [
    '清洁干燥，避免污染，轻拿轻放。',
    '废纸尽量平整，立体包装请清空内容物，清洁后压扁投放。',
    '有尖锐边角的，应包裹后投放。'
  ]
}

export default {
  layout: 'app',
  async asyncData({ app, route, $axios }) {
    const filename = route.path.split('/')
    const { seo } = await $axios.$get('/tool/content', {
      params: {
        path: filename[filename.length - 1] || 'garbage'
      }
    })
    return {
      seo
    }
  },
  data() {
    return {
      keyword: '',
      currentGarbage: {
        tips: []
      },
      garbageOptions: [],
      hotSearchList: ['鸡蛋壳', '纸巾', '湿纸巾', '玻璃杯', '锂电池', '西瓜皮'],
      loading: false
    }
  },
  methods: {
    /**
     * 远程搜索
     * @param {String} keyword 关键字
     */
    async remoteMethod(keyword) {
      if (keyword !== '') {
        this.loading = true
        await this.$axios.get(apiurl, {
          params: {
            keyword
          }
        }).then(res => {
          this.garbageOptions = res.data
        }).catch(() => {})
        this.loading = false
      } else {
        this.garbageOptions = []
      }
    },
    /**
     * 点击热门关键字
     * @param {String} keyword 热门关键字
     */
    handleSearch(keyword) {
      this.$refs.search.focus()
      this.keyword = keyword
      this.remoteMethod(keyword)
    },
    /**
     * 搜索下拉选择框值改变
     * @param {Number} 选项下标
     */
    onSelectChange(index) {
      const findGarbage = this.garbageOptions[index]
      if (findGarbage) {
        const { name, categroy } = findGarbage
        this.currentGarbage = {
          ...findGarbage,
          result: name + '属于' + categroy,
          tips: tips[categroy] || []
        }
      } else {
        this.currentGarbage = {
          tips: []
        }
      }
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
.garbage {
  position: fixed;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg,#00a2ff,#2a6cf2);
  &:before, &:after{
    content: "";
    position: absolute;
    border-radius: 50%;
    z-index: -1;
  }
  &:before{
    right: -30vw;
    top: -30vw;
    width: 60vw;
    height: 60vw;
    background: rgba($color: #1685f8, $alpha: .4);
  }
  &:after{
    left: 10vw;
    top: 10vw;
    width: 15vw;
    height: 15vw;
    background: rgba($color: #1d7df6, $alpha: .5);
  }
  &-title{
    padding: 60px 15px 30px;
    text-align: center;
    img{
      max-height: 56px;
      max-width: 100%;
    }
  }
  &-search{
    width: 80%;
    margin: 0 auto;
    @media (max-width: 1200px) {
      width: 85%;
    }
    @media (max-width: 992px) {
      width: 90%;
    }
    &__input{
      width: 100%;
    }
    &-hot{
      padding-top: 20px;
      color: #fff;
      font-size: 14px;
      &__item{
        display: inline-block;
        margin-right: 10px;
        padding: 2px 12px;
        border: 1px solid #fff;
        border-radius: 20px;
        cursor: pointer;
      }
    }
  }
  &-result{
    color: #fff;
    text-align: center;
    &__title{
      margin: 50px 0 10px;
      font-size: 18px;
    }
    &__tips{
      line-height: 1.7;
      font-size: 14px;
    }
  }
  &-category, &-footer{
    position: absolute;
    left: 0;
    width: 100%;
    text-align: center;
  }
  &-category{
    bottom: 35px;
  }
  &-footer{
    bottom: 15px;
    color: #f5f5f5;
    font-size: 14px;
  }
}
</style>
