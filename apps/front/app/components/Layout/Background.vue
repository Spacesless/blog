<template>
  <div
    class="fixed inset-0 -z-1 overflow-hidden pointer-events-none opacity-65 bg-[url('/background.png')] bg-no-repeat bg-[length:30%_auto] bg-right-top"
  >
    <canvas
      v-show="particleActive"
      id="flower"
      ref="canvasRef"
      width="1900"
      height="1080"
      class="w-full h-full"
    />
    <div
      class="fixed -top-1/2 -left-1/2 w-[200%] h-[200%] origin-bottom"
      :class="[
        isShowChange ? 'animate-[theme-rotate_2s_cubic-bezier(0.7,0,0,1)]' : '',
        isDark ? 'theme--dark' : '',
      ]"
    >
      <div
        class="absolute top-[30%] left-[58%] w-10 h-10 rounded-full bg-[#ffc53d] shadow-[0_0_32px_#ffc53d] transition-opacity duration-1000 delay-1000 theme__sun"
      />
      <div
        class="absolute top-[30%] left-[58%] w-10 h-10 rounded-full bg-[#f5f5f5] shadow-[0_0_32px_#f5f5f5] opacity-0 transition-opacity duration-1000 delay-1000 theme__moon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ParticleCanvas from "~/utils/particle";
import { debounce, sleep } from "~/utils";

const props = defineProps<{
  particleActive: boolean;
}>();

const colorMode = useColorMode();
const canvasRef = ref<HTMLCanvasElement>();
const isShowChange = ref(false);
const isLoaded = ref(false);
const isDark = computed(() => colorMode.preference === "dark");

let particleInstance: ParticleCanvas | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let resizeHandler: (() => void) | null = null;

const initParticle = () => {
  particleInstance = new ParticleCanvas("flower", [
    {
      type: { typeName: "image", url: "/img/spring/flower-1.png" },
      number: 8,
      op: { min: 0.7, max: 1 },
      size: { min: 50, max: 60 },
      speed: { min: 2, max: 4 },
      angle: { value: 140, float: 20 },
      area: { leftTop: [0, 0], rightBottom: [0, 1000] },
      rota: { value: 30, speed: 2, floatValue: 120, floatSpeed: 1 },
      reIn: "reverseDirection",
    },
    {
      type: { typeName: "image", url: "/img/spring/flower-2.png" },
      number: 9,
      size: { min: 50, max: 60 },
      speed: { min: 3, max: 5 },
      area: { leftTop: [500, 300], rightBottom: [1000, 4000] },
      angle: { value: 130, float: 20 },
      reIn: "reverseDirection",
    },
    {
      type: { typeName: "image", url: "/img/spring/flower-3.png" },
      number: 8,
      size: { min: 50, max: 60 },
      speed: { min: 3, max: 5 },
      area: { leftTop: [500, 400], rightBottom: [1000, 4000] },
      angle: { value: 140, float: 30 },
      reIn: "reverseDirection",
    },
    {
      type: { typeName: "image", url: "/img/spring/flower-4.png" },
      number: 7,
      size: { min: 50, max: 60 },
      speed: { min: 3, max: 4 },
      area: { leftTop: [500, 600], rightBottom: [1000, 4000] },
      angle: { value: 140, float: 30 },
      reIn: "reverseDirection",
    },
    {
      type: { typeName: "image", url: "/img/spring/flower-5.png" },
      number: 6,
      size: { min: 50, max: 60 },
      speed: { min: 3, max: 5 },
      area: { leftTop: [0, 1400], rightBottom: [800, 4300] },
      angle: { value: 140, float: 40 },
      reIn: "reverseDirection",
    },
  ]);
};

watch(isDark, () => {
  isShowChange.value = true;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    isShowChange.value = false;
  }, 2000);
});

watch(
  () => props.particleActive,
  async (val) => {
    if (!import.meta.client) return;
    if (val) {
      if (!particleInstance) {
        if (!isLoaded.value) {
          isLoaded.value = true;
          await sleep(2000);
        }
        initParticle();
      } else {
        particleInstance.resize();
        particleInstance.draw();
      }
    } else {
      particleInstance?.stopDraw();
    }
  },
  { immediate: true },
);

onMounted(() => {
  resizeHandler = debounce(() => {
    particleInstance?.resize();
  }, 100);
  window.addEventListener("resize", resizeHandler);
});

onBeforeUnmount(() => {
  if (resizeHandler) window.removeEventListener("resize", resizeHandler);
  particleInstance?.stopDraw();
  particleInstance = null;
});
</script>

<style scoped>
.theme--dark .theme__sun {
  opacity: 0;
}
.theme--dark .theme__moon {
  opacity: 1;
}

@keyframes theme-rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
