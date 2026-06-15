<template>
  <div v-loading="fetchLoading" class="home">
    <div class="home-welcome">
      <h2 class="home-welcome__hello">
        {{ helloText }}
      </h2>
      <p class="home-welcome__text">
        我们一日日度过的所谓的日常，实际上可能是接连不断的奇迹
      </p>
    </div>

    <el-row class="home-general" :gutter="20">
      <el-col :xs="24" :sm="12" :md="8">
        <NuxtLink class="home-general-item category" to="/category">
          <div class="home-general-icon">
            <SvgIcon icon-class="category" />
          </div>
          <div class="home-general-info">
            <p class="home-general__desc">
              Category
            </p>
            <p class="home-general__count">
              {{ count.category || 0 }}
            </p>
          </div>
        </NuxtLink>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <NuxtLink class="home-general-item article" to="/content/article">
          <div class="home-general-icon">
            <SvgIcon icon-class="content" />
          </div>
          <div class="home-general-info">
            <p class="home-general__desc">
              Article
            </p>
            <p class="home-general__count">
              {{ count.article || 0 }}
            </p>
          </div>
        </NuxtLink>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <NuxtLink class="home-general-item bangumi" to="/content/bangumi">
          <div class="home-general-icon">
            <SvgIcon icon-class="bangumi" />
          </div>
          <div class="home-general-info">
            <p class="home-general__desc">
              Bangumi
            </p>
            <p class="home-general__count">
              {{ count.bangumi || 0 }}
            </p>
          </div>
        </NuxtLink>
      </el-col>
    </el-row>

    <el-row class="home-info" :gutter="20">
      <el-col :xs="24" :sm="12">
        <HomeTodoList />
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card>
          <template #header>
            <span>运行环境</span>
          </template>
          <ul class="home-info-env">
            <li>
              <span class="home-env__desc">Node.js：{{ version.nodeVersion }}</span>
            </li>
            <li>
              <span class="home-env__desc">V8：{{ version.v8Version }}</span>
            </li>
            <li>
              <span class="home-env__desc">System：{{ version.platform }}</span>
            </li>
            <li>
              <span class="home-env__desc">Think.js：{{ version.thinkjsVersion }}</span>
            </li>
            <li>
              <span class="home-env__desc">Mysql：{{ version.mysqlVersion }}</span>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: '首页',
  icon: 'dashboard',
  affix: true,
})

const api = useApi()
const userStore = useUserStore()

const generals = ref<any>({})
const fetchLoading = ref(false)

const version = computed(() => generals.value.version || {})
const count = computed(() => generals.value.count || {})

const helloText = computed(() => {
  const nick = userStore.userinfo.nickname || ''
  const now = new Date().getHours()
  if (now > 23 || now <= 5) return `${nick}你是夜猫子呀？这么晚还不睡觉`
  if (now <= 7) return `早上好！${nick}`
  if (now <= 11) return `上午好！${nick}，工作顺利嘛`
  if (now <= 14) return '中午了，工作了一个上午，现在是午餐时间！'
  if (now <= 17) return '午后很容易犯困呢，今天的运动目标完成了吗？'
  if (now <= 19) return '傍晚了！窗外夕阳的景色很美丽呢'
  if (now <= 21) return `晚上好，${nick}，今天过得怎么样？`
  if (now <= 23) return '已经这么晚了呀，早点休息吧，晚安~'
  return `Hello ${nick}，祝你开心每一天`
})

async function fetchData() {
  fetchLoading.value = true
  try {
    const res: any = await api.GetGeneral()
    generals.value = res.data || {}
  } catch {}
  fetchLoading.value = false
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.home {
  &-welcome {
    padding: 30px;
    margin-bottom: 20px;
    background-color: #FFFFFF;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    &__hello {
      margin-bottom: 15px;
      font-weight: normal;
    }

    &__text {
      font-size: 14px;
      color: #606266;
    }
  }

  &-general {
    padding: 0 20px;

    &-item {
      display: block;
      height: 110px;
      margin-bottom: 20px;
      cursor: pointer;
      border-radius: 6px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    &-icon {
      float: left;
      width: 120px;
      line-height: 110px;
      color: #FFFFFF;
      text-align: center;

      :deep(.svg-icon) {
        width: 50px;
        height: 50px;
      }
    }

    &-info {
      overflow: hidden;
    }

    &__desc {
      padding: 25px 0 6px;
      font-size: 22px;
      color: #EFEFEF;
    }

    &__count {
      font-size: 30px;
      color: #FFFFFF;
    }

    .category { background-image: linear-gradient(to right, #FF4D4F, #FFA940); }
    .article { background-image: linear-gradient(to right, #FFC53D, #BAE637); }
    .bangumi { background-image: linear-gradient(to right, #73D13D, #40A9FF); }
  }

  &-info {
    padding: 0 20px;

    .el-col { margin-bottom: 20px; }

    &-env {
      min-height: 335px;

      li { margin-bottom: 15px; }
    }
  }

  &-env__desc {
    font-size: 14px;
    color: #606266;
  }
}
</style>
