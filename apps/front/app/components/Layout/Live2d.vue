<template>
  <div
    v-if="isShow"
    ref="waifuRef"
    class="group fixed z-997 w-52 h-55 transition-[margin-top] duration-300 lt-lg:hidden"
    :style="{ left: x + 'px', top: y + 'px', cursor: isDragging ? 'grabbing' : 'grab' }"
  >
    <transition name="fade-transform" mode="out-in">
      <div
        v-show="tipsShow"
        class="absolute top-0 w-[185px] h-15 px-2.5 py-1.5 overflow-hidden text-xs text-[#303133] text-ellipsis bg-white/80 border border-[var(--color-primary)] rounded-xl shadow-[0_1px_3px_#66ccff]"
        v-html="tips"
      />
    </transition>
    <canvas
      id="js-live2d"
      width="208"
      height="208"
      class="relative top-4"
      @click="onMouseClick"
      @mouseenter="onMouseEnter('live2d')"
    />
    <div class="absolute bottom-0 left-2.5 hidden text-sm group-hover:block">
      <i
        class="icon-shouye block mb-2.5 text-xl text-[var(--color-text)] cursor-pointer hover:text-[var(--color-primary)]"
        @click="navigatorToHome"
        @mouseenter="onMouseEnter('home')"
      />
      <i
        class="icon-qiehuan block mb-2.5 text-xl text-[var(--color-text)] cursor-pointer hover:text-[var(--color-primary)]"
        @click="loadOtherModel"
        @mouseenter="onMouseEnter('model')"
      />
      <i
        class="icon-pifu block mb-2.5 text-xl text-[var(--color-text)] cursor-pointer hover:text-[var(--color-primary)]"
        @click="loadOtherTexture"
        @mouseenter="onMouseEnter('textures')"
      />
      <i
        class="icon-paizhao block mb-2.5 text-xl text-[var(--color-text)] cursor-pointer hover:text-[var(--color-primary)]"
        @click="handleTakePhoto"
        @mouseenter="onMouseEnter('photo')"
      />
      <i
        class="icon-guanbi block mb-2.5 text-xl text-[var(--color-text)] cursor-pointer hover:text-[var(--color-primary)]"
        @click="handleHideLive2d"
        @mouseenter="onMouseEnter('close')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from "@vueuse/core"

// 声明 live2d 全局类型
declare global {
  interface Window {
    loadlive2d?: (canvasId: string, modelUrl: string) => void;
    Live2D?: {
      captureName: string;
      captureFrame: boolean;
    };
  }
}

const toolsStore = useToolsStore();
const appStore = useAppStore();
const router = useRouter();
const { live2dShow } = storeToRefs(toolsStore);

const apiurl = "//api.timelessq.com/live2d";
const tips = ref("");
const isShow = ref(false);
const tipsShow = ref(false);
const isLoaded = ref(false);
const waifuRef = ref<HTMLDivElement>();
let timer: ReturnType<typeof setTimeout> | null = null;

const { x, y, isDragging } = useDraggable(waifuRef, {
  initialValue: { x: 0, y: 0 },
  onMove: (position) => {
    const el = waifuRef.value;
    if (!el) return position;

    const clientWidth = window.innerWidth;
    const clientHeight = window.innerHeight;
    const elWidth = el.clientWidth;
    const elHeight = el.clientHeight;

    // 边界限制
    if (position.x < 0) position.x = 0;
    else if (position.x > clientWidth - elWidth)
      position.x = clientWidth - elWidth;

    if (position.y < 0) position.y = 0;
    else if (position.y > clientHeight - elHeight)
      position.y = clientHeight - elHeight;

    return position;
  },
});

const modelId = computed(() => Number(appStore.configs?.live2d_model) || 100);
const texturesId = computed(
  () => Number(appStore.configs?.live2d_texture) || 1,
);

const mouseTips: Record<string, string | string[]> = {
  live2d: ["(๑•́ ₃ •̀๑)", ".^◡^.", "ᖗ乛◡乛ᖘ"],
  home: "点击前往首页",
  model: "๑乛◡乛๑ 让我的好朋友见见你",
  textures: "(๑¯◡¯๑) 要看看其它的衣服么",
  photo: "123茄子",
  close: "つ﹏⊂ 真的到了要分开的时候了么",
};

const clickTips = [
  "萝莉控是什么呀",
  "(๑•́ ∀ •̀๑)",
  "๑乛◡乛๑嘿嘿",
  "！⌇●﹏●⌇",
  "(ó﹏ò｡)",
];

// 在组件顶层使用 useHead，条件式加载脚本
useHead({
  script: [
    {
      src: "/vendor/live2d/index.js",
      defer: true,
    },
  ],
});

watch(live2dShow, async (val) => {
  if (val) {
    if (!isLoaded.value) {
      isLoaded.value = true;
      await sleep(2000);
    }
    handleShowLive2d();
  } else {
    handleHideLive2d();
  }
});

function showMessage(text: string, duration = 3000) {
  if (!text) return;
  tips.value = text;
  tipsShow.value = true;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    tipsShow.value = false;
  }, duration);
}

function loadModel(mId: number, tId = 1) {
  if (import.meta.client && window.loadlive2d) {
    window.loadlive2d(
      "js-live2d",
      `${apiurl}/get?id=${mId}&texture=${tId}&isuseCDN=true`,
    );
  }
}

function loadOtherModel() {
  showMessage("换个新朋友~");
  loadModel(modelId.value, texturesId.value);
}

function loadOtherTexture() {
  showMessage("我的新衣服好看嘛");
  loadModel(modelId.value, texturesId.value);
}

function navigatorToHome() {
  router.push("/");
}

function handleShowLive2d() {
  isShow.value = true;
  nextTick(() => {
    // 初始定位到右下角
    x.value = window.innerWidth - 208;
    y.value = window.innerHeight - 220;
    loadModel(modelId.value, texturesId.value);
    showMessage("锵锵锵锵~ 本宝宝又回来了", 1500);
  });
}

function handleHideLive2d() {
  showMessage("愿你有一天能与重要的人重逢", 1500);
  setTimeout(() => {
    toolsStore.setLive2d(false);
    isShow.value = false;
  }, 1500);
}

function handleTakePhoto() {
  showMessage("照好了嘛，是不是很可爱呐？");
  if (import.meta.client && window.Live2D) {
    window.Live2D.captureName = "Pio.png";
    window.Live2D.captureFrame = true;
  }
}

function onMouseEnter(key: string) {
  const t = mouseTips[key];
  if (!t) return;

  let text: string;
  if (Array.isArray(t)) {
    text = t[Math.floor(Math.random() * t.length)]!;
  } else {
    text = t;
  }
  showMessage(text);
}

function onMouseClick() {
  const text = clickTips[Math.floor(Math.random() * clickTips.length)]!;
  showMessage(text);
}
</script>
