<template>
  <div class="fixed right-2 bottom-4 z-998 lt-md:hidden">
    <el-tooltip
      effect="dark"
      :content="live2dShow ? '关闭看板娘' : '打开看板娘'"
      placement="left"
    >
      <div
        class="w-10 h-10 mt-2.5 text-xl leading-10 text-center cursor-pointer select-none rounded-full bg-[var(--bg-normal)] shadow-[var(--shadow-3-right)] hover:text-[var(--color-primary)]"
        :class="
          live2dShow
            ? 'text-[var(--color-primary)]'
            : 'text-[var(--color-secondary)]'
        "
        @click="toggleWaifu"
      >
        <i class="icon-xiaolian" />
      </div>
    </el-tooltip>
    <el-tooltip
      effect="dark"
      :content="particleActive ? '关闭背景动画' : '打开背景动画'"
      placement="left"
    >
      <div
        class="w-10 h-10 mt-2.5 text-xl leading-10 text-center cursor-pointer select-none rounded-full bg-[var(--bg-normal)] shadow-[var(--shadow-3-right)] hover:text-[var(--color-primary)]"
        :class="
          particleActive
            ? 'text-[var(--color-primary)]'
            : 'text-[var(--color-secondary)]'
        "
        @click="toggleBubble"
      >
        <i class="icon-dongxiao" />
      </div>
    </el-tooltip>
    <el-tooltip
      effect="dark"
      content="点我坐电梯"
      placement="left"
      :disabled="backTopTips"
    >
      <transition name="fade-transform">
        <div
          v-show="backTopShow"
          class="group w-10 h-10 mt-2.5 text-xl leading-10 text-center cursor-pointer select-none rounded-full bg-[var(--bg-normal)] shadow-[var(--shadow-3-right)] text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
          @click="backTop"
        >
          <span class="group-hover:hidden text-sm">{{ scrollPercent }}%</span>
          <i class="icon-fanhuidingbu hidden group-hover:inline-block" />
        </div>
      </transition>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
const toolsStore = useToolsStore();
const { particleActive, live2dShow } = storeToRefs(toolsStore);

const REFERENCE = 100;
const backTopShow = ref(false);
const backTopTips = ref(false);
const scrollTop = ref(0);
const scrollPercent = ref(0);

function onScroll() {
  scrollTop.value = getScrollPosition();
}

watch(scrollTop, () => {
  backTopShow.value = scrollTop.value > REFERENCE;
  const screenHeight = window.innerHeight;
  const windowHeight =
    document.body.clientHeight || document.documentElement.clientHeight;
  const percent = Math.ceil(
    (scrollTop.value / (windowHeight - screenHeight)) * 100,
  );
  scrollPercent.value = percent > 100 ? 100 : percent;
});

onMounted(() => {
  scrollTop.value = getScrollPosition();
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});

function toggleWaifu() {
  toolsStore.setLive2d(!live2dShow.value);
}

function toggleBubble() {
  toolsStore.setParticle(!particleActive.value);
}

function backTop() {
  backTopTips.value = true;
  scrollTo(0, 800, () => {
    backTopTips.value = false;
  });
}
</script>
