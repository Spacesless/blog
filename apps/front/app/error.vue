<template>
  <div class="error-page">
    <!-- 氛围装饰：主色/紫色光晕 + 淡网格 -->
    <div class="error-page__glow error-page__glow--primary" aria-hidden="true" />
    <div class="error-page__glow error-page__glow--accent" aria-hidden="true" />
    <div class="error-page__grid" aria-hidden="true" />

    <main class="error-page__inner">
      <section class="error-card">
        <span class="error-card__accent" aria-hidden="true" />

        <p class="error-card__eyebrow">{{ preset.eyebrow }}</p>
        <h1 class="error-card__code">{{ statusCode }}</h1>
        <h2 class="error-card__title">{{ title }}</h2>
        <p class="error-card__desc">{{ preset.description }}</p>

        <p v-if="path" class="error-card__path">
          <span class="error-card__path-label">请求路径</span>
          <code>{{ path }}</code>
        </p>

        <div class="error-card__actions">
          <el-button type="primary" size="large" round @click="handleHome">
            <Icon name="ph:house" class="mr-1.5" />返回首页
          </el-button>
          <el-button size="large" round @click="handleBack">
            <Icon name="ph:arrow-left" class="mr-1.5" />上一页
          </el-button>
        </div>

        <nav class="error-card__links">
          <span class="error-card__links-label">或者去逛逛</span>
          <NuxtLink
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="error-card__link"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <p v-if="devDetail" class="error-card__detail">{{ devDetail }}</p>
      </section>

      <p class="error-page__foot">Timeless · 花开成景，花落成诗</p>
    </main>
  </div>
</template>

<script setup lang="ts">
interface ErrorObject {
  statusCode?: number
  statusMessage?: string
  message?: string
  url?: string
}

const props = defineProps<{ error: ErrorObject | null }>()

const quickLinks = [
  { label: '文章笔记', to: '/article' },
  { label: '追番刷剧', to: '/bangumi' },
  { label: '归档', to: '/archives' },
  { label: '关于', to: '/about' },
]

const presets: Record<
  number,
  { eyebrow: string; title: string; description: string }
> = {
  403: {
    eyebrow: 'Forbidden',
    title: '这扇门暂时不对外开放',
    description: '你没有权限查看这个页面，换条路走走吧。',
  },
  404: {
    eyebrow: 'Not Found',
    title: '这条路，通向了一片空白',
    description: '页面可能已经被移动、改名，或者从来就没有存在过。',
  },
  500: {
    eyebrow: 'Server Error',
    title: '服务器刚刚打了个盹',
    description: '页面没能顺利渲染出来，刷新一下，或者稍后再来看看。',
  },
}

const statusCode = computed(() => Number(props.error?.statusCode) || 500)

const preset = computed(
  () =>
    presets[statusCode.value] || {
      eyebrow: 'Oops',
      title: '页面出了点小状况',
      description: '别急，回到首页重新出发吧。',
    },
)

// 业务侧会给出更具体的提示（如「文章不存在或已被删除」），优先展示；
// Nuxt 内置的英文提示（Page not found: /xxx）不作为标题，改用中文文案
const title = computed(() => {
  const message = (props.error?.statusMessage || '').trim()
  if (!message || /^page not found/i.test(message)) return preset.value.title
  return message
})

const path = computed(() => {
  const url = (props.error?.url || '').trim()
  if (!url) return ''
  return url.length > 60 ? `${url.slice(0, 57)}…` : url
})

// 仅在开发环境展示原始错误信息，方便排查
const devDetail = computed(() => {
  if (!import.meta.dev) return ''
  const message = (props.error?.message || '').trim()
  if (!message || message === title.value) return ''
  return message
})

useHead({
  title: computed(() => `${statusCode.value} · ${preset.value.title}`),
  meta: [{ name: 'robots', content: 'noindex' }],
})

function handleHome() {
  clearError({ redirect: '/' })
}

function handleBack() {
  if (import.meta.client && window.history.length > 1) {
    window.history.back()
    return
  }
  clearError({ redirect: '/' })
}
</script>

<style scoped>
.error-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 40px 20px;
  overflow: hidden;
  color: var(--color-text);
  background: var(--bg);
}

/* ---------- 氛围层 ---------- */
.error-page__glow {
  position: absolute;
  width: min(46vw, 520px);
  aspect-ratio: 1;
  pointer-events: none;
  border-radius: 999px;
  filter: blur(90px);
}

.error-page__glow--primary {
  top: -14%;
  left: -8%;
  background: var(--color-primary);
  opacity: 0.3;
  animation: error-float 18s ease-in-out infinite;
}

.error-page__glow--accent {
  right: -10%;
  bottom: -16%;
  background: #7c5cff;
  opacity: 0.22;
  animation: error-float 24s ease-in-out infinite reverse;
}

.error-page__grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(
    circle at center,
    var(--color-secondary) 1px,
    transparent 1px
  );
  background-size: 26px 26px;
  opacity: 0.16;
  mask-image: radial-gradient(circle at 50% 45%, #000 15%, transparent 72%);
  -webkit-mask-image: radial-gradient(
    circle at 50% 45%,
    #000 15%,
    transparent 72%
  );
}

.error-page__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 620px;
}

/* ---------- 卡片 ---------- */
.error-card {
  position: relative;
  padding: 56px 48px 40px;
  overflow: hidden;
  text-align: center;
  background: var(--bg-normal);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  box-shadow:
    var(--shadow-3-down),
    0 28px 80px -40px rgba(24, 144, 255, 0.55);
  animation: error-rise 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.error-card__accent {
  position: absolute;
  top: 0;
  left: 50%;
  width: 132px;
  height: 3px;
  background: linear-gradient(
    130deg,
    rgb(36, 198, 220),
    var(--color-primary) 60%,
    rgb(84, 51, 255)
  );
  border-radius: 0 0 3px 3px;
  transform: translateX(-50%);
}

.error-card__eyebrow {
  margin: 0;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--color-secondary);
}

.error-card__code {
  margin: 10px 0 0;
  font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  font-size: clamp(76px, 15vw, 128px);
  font-weight: 400;
  line-height: 0.95;
  letter-spacing: -0.02em;
  background: linear-gradient(
    120deg,
    #36c6dc 0%,
    var(--color-primary) 45%,
    #7c5cff 100%
  );
  background-size: 220% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: error-gradient 9s ease infinite;
}

.error-card__title {
  margin: 16px 0 0;
  font-size: clamp(20px, 3.4vw, 25px);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--color-heading);
}

.error-card__desc {
  max-width: 34em;
  margin: 12px auto 0;
  font-size: 15px;
  line-height: 1.9;
  color: var(--color-secondary);
}

.error-card__path {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  max-width: 100%;
  margin-top: 22px;
  padding: 5px 14px;
  font-size: 12px;
  color: var(--color-secondary);
  background: rgba(0, 0, 0, 0.035);
  border: 1px dashed var(--border-color);
  border-radius: 999px;
}

.error-card__path-label {
  flex-shrink: 0;
  letter-spacing: 0.08em;
}

.error-card__path code {
  overflow: hidden;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--color-heading);
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- 操作区 ---------- */
.error-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 32px;
}

.error-card__links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 20px;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  padding-top: 22px;
  font-size: 13px;
  border-top: 1px solid var(--border-color);
}

.error-card__links-label {
  letter-spacing: 0.18em;
  color: var(--color-secondary);
}

.error-card__link {
  position: relative;
  color: var(--color-text);
  transition: color 0.25s ease;
}

.error-card__link::after {
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 1px;
  content: '';
  background: var(--color-primary);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.error-card__link:hover {
  color: var(--color-primary);
}

.error-card__link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.error-card__detail {
  margin: 18px 0 0;
  padding-top: 14px;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  line-height: 1.7;
  color: var(--color-secondary);
  word-break: break-all;
  border-top: 1px dashed var(--border-color);
}

.error-page__foot {
  margin: 28px 0 0;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-align: center;
  color: var(--color-secondary);
}

/* ---------- 暗色适配 ---------- */
html.dark .error-page__glow--primary {
  opacity: 0.22;
}

html.dark .error-page__glow--accent {
  opacity: 0.18;
}

html.dark .error-page__grid {
  opacity: 0.2;
}

html.dark .error-card {
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    var(--shadow-3-down),
    0 28px 80px -40px rgba(23, 125, 220, 0.65);
}

html.dark .error-card__path {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.14);
}

html.dark .error-card__code {
  background-image: linear-gradient(
    120deg,
    #7dd3d8 0%,
    #4aa8ff 45%,
    #a78bfa 100%
  );
}

/* ---------- 动效 ---------- */
@keyframes error-rise {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes error-gradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes error-float {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(20px, -26px, 0) scale(1.08);
  }
}

/* ---------- 响应式 ---------- */
@media (max-width: 640px) {
  .error-page {
    padding: 24px 16px;
  }

  .error-card {
    padding: 40px 22px 30px;
    border-radius: 16px;
  }

  .error-card__actions :deep(.el-button) {
    width: 100%;
    margin-left: 0;
  }

  .error-card__actions {
    gap: 10px;
  }

  /* 窄屏下让「或者去逛逛」单独占一行，避免链接被拆得零散 */
  .error-card__links {
    gap: 10px 16px;
  }

  .error-card__links-label {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .error-page__glow,
  .error-card,
  .error-card__code {
    animation: none;
  }
}
</style>
