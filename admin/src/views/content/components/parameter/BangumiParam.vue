<template>
  <div class="form-para">
    <el-form-item label="放映日期">
      <el-row>
        <el-col :xs="24" :md="12" :lg="5">
          <el-date-picker
            v-model="options.showtime"
            type="date"
            placeholder="选择日期"
          />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="总集数">
      <el-row>
        <el-col :xs="24" :md="12" :lg="5">
          <el-input v-model="options.total" />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="进度">
      <el-row>
        <el-col :xs="24" :md="12" :lg="5">
          <el-input v-model="options.current" />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="状态">
      <el-row>
        <el-col :xs="24" :md="12" :lg="5">
          <el-select v-model="options.status" placeholder="请选择状态">
            <el-option label="连载中" :value="1" />
            <el-option label="已完结" :value="2" />
            <el-option label="未上映" :value="3" />
          </el-select>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="推荐指数">
      <el-row>
        <el-col :xs="24" :md="12" :lg="5">
          <el-input-number v-model="options.ratings" controls-position="right" :min="5" :max="10" :step="0.1" />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item v-for="(item, index) in options.players" :key="index" :label="'播放地址' + (index + 1)">
      <el-row class="form-para__players">
        <el-col :span="8">
          <el-input v-model="item.url" placeholder="播放地址" />
        </el-col>
        <el-button type="warning" @click="deletePlayer(item)">删除</el-button>
      </el-row>
    </el-form-item>
    <el-form-item label="播放地址">
      <el-button type="primary" plain @click="addPlayer">添加地址</el-button>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    deletePlayer(item) {
      const index = this.options.players.indexOf(item)
      if (index !== -1) {
        this.options.players.splice(index, 1)
      }
    },
    addPlayer() {
      this.options.players.push({
        url: ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-para{
  &__players{
    .el-col{
      margin-right: 15px;
    }
  }
}
</style>
