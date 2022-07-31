<template>
  <div v-loading="listLoading" class="follow">
    <el-scrollbar class="follow-list-scrollbar" wrap-class="follow-scrollbar-wrapper">
      <ul class="follow-list">
        <li v-for="item in followList" :key="item.id" class="follow-list-item clearfix">
          <div class="follow-list-face">
            <a :href="item.mid | formatFollowUrl" :title="item.uname" target="_blank" rel="noopener noreferrer">
              <img class="follow-list-face__img" :src="item.face + '@96w_96h_100Q_1c.webp'" alt="" referrerpolicy="no-referrer">
            </a>
          </div>
          <div class="follow-list-info">
            <a class="follow-list-info-link" :href="item.mid | formatFollowUrl" :title="item.uname" target="_blank" rel="noopener noreferrer">
              <span class="follow-list-info__name">{{ item.uname }}</span>
            </a>
            <span class="follow-list-info__desc">({{ item.official_verify.desc }})</span>
            <p class="follow-list-info__sign">
              {{ item.sign }}
            </p>
          </div>
        </li>
      </ul>
    </el-scrollbar>
    <pagination
      class="pagination"
      :is-admin="false"
      :total="total"
      :page.sync="listQuery.page"
      :limit="listQuery.pageSize"
      @pagination="fetchList"
    />
  </div>
</template>

<script>
import Pagination from '#/components/Pagination'

const mid = 315883644
const apiurl = 'https://api.timelessq.com/bilibili'

export default {
  components: {
    Pagination
  },
  filters: {
    formatFollowUrl (mid) {
      return mid ? 'https://space.bilibili.com/' + mid : ''
    }
  },
  data () {
    return {
      followList: [],
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 20,
        mid
      },
      total: 0
    }
  },
  mounted () {
    this.fetchList()
  },
  methods: {
    async fetchList () {
      this.listLoading = true
      await this.$axios.get(apiurl + '/following', {
        params: this.listQuery
      }).then((res) => {
        const { total, list } = res.data
        this.total = total
        this.followList = list
      }).catch(() => {})
      this.listLoading = false
    }
  }

}
</script>

<style lang="scss" scoped>
.follow {
  height: 100%;

  &-list {
    &-scrollbar {
      height: calc(100% - 72px);
    }

    &-item {
      padding: 10px 0;
      margin-bottom: 3px;
      background-color: #FFFFFF;
      border-bottom: 1px solid #E6E6E6;
    }

    &-face {
      float: left;
      padding: 0 24px;

      &__img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
    }

    &-info {
      padding-top: 8px;
      padding-right: 24px;
      overflow: hidden;

      &-link {
        color: #303133;

        &:hover {
          color: var(--color-primary);
        }
      }

      &__desc {
        margin-left: 8px;
        font-size: 12px;
        color: #606266;
      }

      &__sign {
        margin-top: 5px;
        font-size: 14px;
        color: #909399;
      }
    }
  }
}
</style>
