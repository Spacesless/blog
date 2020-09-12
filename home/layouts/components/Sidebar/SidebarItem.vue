<template>
  <div>
    <div v-if="!item.children" class="aside-item">
      <nuxt-link :to="item.url" :title="item.name">
        <el-menu-item :index="item.url">
          <i v-if="!isNest" class="aside-menu__icon tl-icon" v-html="item.icon" />
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </nuxt-link>
    </div>

    <el-submenu v-else :index="item.url">
      <template slot="title">
        <i v-if="!isNest" class="aside-menu__icon tl-icon" v-html="item.icon" />
        <span slot="title">{{ item.name }}</span>
      </template>
      <nuxt-link :to="item.url" :title="item.mark_name">
        <el-menu-item :index="item.url">
          <span>{{ item.mark_name }}</span>
        </el-menu-item>
      </nuxt-link>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        class="nest-menu"
      />
    </el-submenu>
  </div>
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
