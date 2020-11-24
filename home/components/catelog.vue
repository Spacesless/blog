<template>
  <div class="catalog">
    <ul class="catalog-list">
      <li
        v-for="(item, index) in catalogList"
        :key="index"
        class="catalog-item"
        :class="[
          'catalog-item--H' + item.value,
          {
            'catalog-item--active': index === 1
          }
        ]"
      >
        <p class="catalog-item__text">{{ item.name }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catalogList: [{
        value: 2,
        name: '标题二'
      },
      {
        value: 2,
        name: '标题二'
      },
      {
        value: 2,
        name: '标题二标题一标题一标题一标题一标题一标题一'
      },
      {
        value: 3,
        name: '标题三'
      },
      {
        value: 4,
        name: '标题四'
      }, {
        value: 5,
        name: '标题五'
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
  width: 250px;
  &-list{
    border-left: 1px solid #ebeef5;
  }
  &-item{
    position: relative;
    padding-right: 15px;
    color: #303133;
    cursor: pointer;
    &__text{
      overflow: hidden;
      font-size: 14px;
      line-height: 24px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &--H2{
      padding-left: 15px;
    }
    &--H3{
      padding-left: 30px;
    }
    &--H4{
      padding-left: 45px;
    }
    &--H5{
      padding-left: 60px;
    }
    &--active{
      color: $--color-primary;
      &:before{
        content: '';
        position: absolute;
        left: -1px;
        top: 0;
        z-index: 1;
        width: 1px;
        height: 100%;
        background-color: $--color-primary;
      }
    }
  }
}
</style>
