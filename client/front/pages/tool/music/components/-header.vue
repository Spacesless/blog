<template>
  <div class="music-header clearfix">
    <div class="music-search">
      <el-input v-model="sword" size="small" placeholder="请输入歌曲" @keyup.enter.native="handleSearch(true)" />
      <i class="music-search__btn el-icon-search" @click="handleSearch(true)" />
    </div>
    <div class="music-user" @click="handleChangeUser">
      <el-image class="music-user__avator" :src="userinfo.avatar" />
      <span class="music-user__name">{{ userinfo.nickname || 'Timeless' }}</span>
      <i class="music-user__icon icon-qiehuan" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userinfo: {
      type: Object,
      default: () => {}
    },
    platform: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      sword: ''
    }
  },
  methods: {
    handleSearch (isReset) {
      this.$emit('update:keyword', this.sword)
      this.$emit('handleSearch', isReset)
    },
    handleChangeUser () {
      const message = '请输入' + (this.platform === 'tencent' ? 'QQ号' : '网易云uid')
      this.$prompt(message, '切换用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (this.platform === 'tencent') {
          this.$emit('update:tencentUid', value)
        } else {
          this.$emit('update:neteaseUid', value)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.music {
  &-header {
    line-height: 50px;
  }

  &-search {
    position: relative;
    float: left;
    width: 250px;
    padding: 0 20px;

    .el-input {
      ::v-deep .el-input__inner {
        padding-right: 30px;
        color: #FFFFFF;
        background: none;
      }
    }

    &__btn {
      position: absolute;
      top: 13px;
      right: 25px;
      padding: 5px;
      color: #FFFFFF;
      cursor: pointer;
    }
  }

  &-user {
    float: right;
    margin-right: 20px;
    color: #FFFFFF;
    cursor: pointer;

    &__avator {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      border-radius: 50%;
    }

    &__name {
      margin-left: 5px;
      vertical-align: middle;
    }

    &__icon {
      margin-left: 5px;
      vertical-align: sub;
    }
  }
}
</style>
