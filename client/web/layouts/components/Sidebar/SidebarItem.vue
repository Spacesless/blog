<template>
  <nuxt-link v-if="!item.children" role="menuitem" :to="item.url" :title="item.name">
    <el-menu-item :index="item.url" :role="null">
      <i v-if="!isNest" class="aside-menu__icon tl-icon" v-html="item.icon" />
      <span slot="title">{{ item.name }}</span>
    </el-menu-item>
  </nuxt-link>

  <el-submenu v-else :index="item.url" popper-class="aside-submenu">
    <template slot="title">
      <i v-if="!isNest" class="aside-menu__icon tl-icon" v-html="item.icon" />
      <span slot="title">{{ item.name }}</span>
    </template>
    <el-menu-item :index="item.url">
      <nuxt-link :to="item.url" :title="item.mark_name">
        <span>{{ item.mark_name }}</span>
      </nuxt-link>
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
