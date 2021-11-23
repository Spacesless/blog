<template>
  <el-menu-item v-if="!item.children" :index="item.url" :title="item.name">
    <i v-if="!isNest" class="aside-menu__icon tl-icon" v-html="item.icon" />
    <span slot="title">{{ item.name }}</span>
  </el-menu-item>

  <el-submenu v-else :index="item.url" popper-class="aside-submenu">
    <template slot="title">
      <i v-if="!isNest" class="aside-menu__icon tl-icon" v-html="item.icon" />
      <span slot="title">{{ item.name }}</span>
    </template>
    <el-menu-item :index="item.url" :title="item.mark_name">
      <span>{{ item.type | getAliasName }}</span>
    </el-menu-item>

    <sidebar-item
      v-for="child in item.children"
      :key="child.path"
      :is-nest="true"
      :item="child"
      class="nest-menu"
    />
  </el-submenu>
</template>

<script>
export default {
  name: 'SidebarItem',
  filters: {
    /**
     * 获取一级栏目别名
     * @param {String} type 栏目类型
     */
    getAliasName(type) {
      const names = new Map([
        ['article', '全部文章'],
        ['bangumi', '全部追剧']
      ])

      return names.get(type) || '全部'
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    }
  }
}
</script>
