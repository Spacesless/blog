<template>
  <div class="similar tl-card">
    <h2 class="similar-title tl-card__title">
      推荐阅读
    </h2>

    <el-row class="similar-list" :gutter="2">
      <el-col v-for="(item, index) in similarList" :key="item.id" :md="12">
        <div class="similar-list-item">
          <span class="similar-list__count">{{ index + 1 }}</span>
          <p class="similar-list__title">
            <nuxt-link :to="'/article/detail/' + item.id" :title="item.title">
              {{ item.title }}
            </nuxt-link>
          </p>
          <p class="similar-list__desc">
            {{ item.description }}
          </p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'SimilarList',
  props: {
    detailId: {
      type: Number,
      default: 0
    },
    categoryType: {
      type: String,
      default: ''
    },
    categoryId: {
      type: Number,
      default: 0
    },
    tags: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      similarList: [],
      fetchLoading: false
    }
  },
  watch: {
    categoryId: {
      handler () {
        this.fetchList()
      },
      immediate: true
    }
  },
  methods: {
    async fetchList () {
      this.fetchLoading = true
      await this.$axios.$get(`/${this.categoryType}/same`, {
        params: {
          id: this.detailId,
          categoryId: this.categoryId,
          tags: this.tags
        }
      }).then((res) => {
        this.similarList = res || []
      }).catch(() => {})
      this.fetchLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.similar {
  padding: $grid-space;
  margin-bottom: $grid-space;

  &-list {
    &-item {
      position: relative;
      padding: 16px;
      padding-left: 64px;
      margin-bottom: 2px;
      background-color: var(--bg);
      border-radius: 6px;
    }

    &__count {
      position: absolute;
      top: 50%;
      left: 0;
      width: 64px;
      margin-top: -24px;
      font-size: 36px;
      font-style: italic;
      text-align: center;
    }

    &__title {
      padding-bottom: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      a {
        color: var(--color-heading);

        &:hover {
          color: var(--color-primary);
        }
      }
    }

    &__desc {
      height: 44px;
      overflow: hidden;
      font-size: 14px;
      line-height: 22px;
      color: var(--color-text);
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
}
</style>
