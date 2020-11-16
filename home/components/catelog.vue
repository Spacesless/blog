<template>
  <div class="catalog">
    <ul class="catalog-list">
      <li
        v-for="(item, index) in catalogList"
        :key="index"
        class="catalog-item"
        :class="[
          'catalog-item--heading' + item.value,
          {
            'catalog-item--active': index === 1
          }
        ]"
      >{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catalogList: [{
        value: 1,
        name: '标题一'
      },
      {
        value: 2,
        name: '标题二'
      },
      {
        value: 2,
        name: '标题二'
      },
      {
        value: 1,
        name: '标题一标题一标题一标题一标题一标题一标题一'
      },
      {
        value: 2,
        name: '标题二'
      },
      {
        value: 3,
        name: '标题三'
      },
      {
        value: 4,
        name: '标题四'
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
.industry{
  height: 3000px;
}
.catalog{
  position: fixed;
  top: 100px;
  right: 0;
  width: 290px;
  &-list{
    padding: 0 15px;
  }
  &-item{
    position: relative;
    color: #303133;
    line-height: 24px;
    margin-bottom: 2px;
    cursor: pointer;
    &:before{
      content: '';
      position: absolute;
      left: -18px;
      top: 0;
      width: 12px;
      height: 12px;
      border-left: 1px dashed #DCDFE6;
      border-bottom: 1px dashed #DCDFE6;
    }
    &--heading1{
      overflow: hidden;
    }
    &--heading2{
      margin-left: 24px;
    }
    &--heading3{
      margin-left: 48px;
    }
    &--heading4{
      margin-left: 72px;
    }
    &--active{
      color: $--color-primary;
    }
  }
}
</style>
