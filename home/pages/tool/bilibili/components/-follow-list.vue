<template>
  <div v-loading="listLoading" class="follow">
    <ul class="follow-list">
      <li v-for="item in followList" :key="item.id" class="follow-list-item clearfix">
        <div class="follow-list-face">
          <a :href="item.mid | formatFollowUrl" :title="item.uname" target="_blank" rel="noopener noreferrer">
            <img class="follow-list-face__img" :src="item.face + '@96w_96h_100Q_1c.webp'" alt="">
          </a>
        </div>
        <div class="follow-list-info">
          <a class="follow-list-info-link" :href="item.mid | formatFollowUrl" :title="item.uname" target="_blank" rel="noopener noreferrer">
            <span class="follow-list-info__name">{{ item.uname }}</span>
          </a>
          <p class="follow-list-info__desc">{{ item.official_verify.desc }}</p>
        </div>
      </li>
    </ul>
    <pagination class="pagination" :total="total" :page.sync="listQuery.page" :limit="listQuery.pageSize" @pagination="fetchList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

const mid = 315883644
const apiurl = 'https://api.timelessq.com/bilibili'

export default {
  components: {
    Pagination
  },
  filters: {
    formatFollowUrl(mid) {
      return mid ? 'https://space.bilibili.com/' + mid : ''
    }
  },
  data() {
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
  mounted() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.listLoading = true
      await this.$axios.get(apiurl + '/following', {
        params: this.listQuery
      }).then(res => {
        console.log(res.data)
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
.follow{
  &-list{
    &-item{
      padding: 5px 0;
      background-color: #fff;
      margin-bottom: 3px;
    }
    &-face{
      float: left;
      width: 100px;
      text-align: center;
      &__img{
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
    }
    &-info{
      overflow: hidden;
      padding-top: 8px;
      &-link{
        color: #303133;
        &:hover{
          color: var(--color-primary);
        }
      }
      &__desc{
        font-size: 14px;
        color: #909399;
        margin-top: 5px;
      }
    }
  }
}
.pagination{
  text-align: center;
  padding: 15px;
}
</style>
