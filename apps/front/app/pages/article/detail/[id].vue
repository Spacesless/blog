<template>
  <div>
    <el-row
      class="mb-[var(--grid-space)] overflow-hidden bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)] flex items-center lt-lg:block"
    >
      <el-col class="relative blog-cover" :sm="24" :md="12">
        <img
          class="block w-full h-auto"
          :src="getAbsolutePath(data?.imgurl || '')"
          :alt="data?.title"
        >
      </el-col>
      <el-col class="p-[var(--grid-space)]" :sm="24" :md="12">
        <h1
          class="pb-4 text-[32px] font-normal leading-[1.5] text-[var(--color-heading)]"
        >
          {{ data?.title }}
        </h1>
        <div
          class="mb-[var(--grid-space)] text-[15px] text-[var(--color-secondary)]"
        >
          <span class="mr-2.5">{{ formatDate(data?.updatetime || "") }}</span>
          <span class="mr-2.5">阅读：{{ data?.hits }}</span>
          <span v-if="data?.word_count" class="mr-2.5"
            >字数：{{ data?.word_count }}</span
          >
          <span v-if="readDuration" class="mr-2.5"
            >阅读时长：{{ readDuration }}</span
          >
        </div>
        <p class="article-description relative pt-3 indent-10">
          {{ data?.description }}
        </p>
      </el-col>
    </el-row>

    <div
      class="mb-[var(--grid-space)] bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]"
    >
      <div class="flex lt-xl:flex-col">
        <div
          id="js-content"
          class="flex-1 min-w-0 overflow-hidden markup p-[var(--grid-space)]"
          v-html="data?.content"
        />
        <Catalog
          v-if="isLoaded"
          class="flex-shrink-0 lt-xl:p-[var(--grid-space)]"
        />
      </div>
      <Share
        :title="data?.title"
        :cover="getAbsolutePath(data?.imgurl || '')"
        :description="data?.description"
      />
    </div>

    <ImageViewer v-if="isLoaded" />
    <SimilarList
      :detail-id="data?.id"
      category-type="article"
      :category-id="data?.category_id || 0"
      :tags="data?.tag"
    />
    <WalineComment reaction-title="你觉得这篇文章怎么样？" />
    <Adsense />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { fetchArticleDetail, recordArticleAccess } = useApi();

const monthEnum = [
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
];

function formatDate(time: string) {
  const d = new Date(time);
  return `${monthEnum[d.getMonth()]}月 ${d.getDate()}, ${d.getFullYear()}`;
}

const idOrSlug = route.params.id as string;
const isLoaded = ref(false);

const { data } = await useAsyncData(`article-detail-${idOrSlug}`, () =>
  fetchArticleDetail(idOrSlug).catch(() => null),
);

usePageSeo({
  pageType: "detail",
  data: data.value
    ? {
        title: data.value.title,
        keywords: data.value.keywords,
        description: data.value.description,
        category_id: data.value.category_id,
      }
    : undefined,
});

const readDuration = computed(() => {
  if (!data.value) return "";
  const averageVelocity = 8.3;
  let total = (data.value.word_count || 0) / averageVelocity;
  const imageCount = data.value.content?.match(/<img/g)?.length || 0;
  total += imageCount * 12;
  return total ? Math.ceil(total / 60) + " 分钟" : "";
});

onMounted(() => {
  nextTick(() => {
    isLoaded.value = true;
    const nuxtApp = useNuxtApp();

    // 给代码块添加 line-numbers class
    document
      .querySelectorAll("#js-content pre")
      .forEach((pre) => pre.classList.add("line-numbers"));

    // 注册自定义工具栏按钮
    registerPrismButtons(nuxtApp);

    // 执行代码高亮
    nuxtApp.$prism?.highlightAll();
  });

  const timer = setTimeout(() => {
    recordArticleAccess(idOrSlug);
  }, 5000);

  onUnmounted(() => clearTimeout(timer));
});

// 注册 Prism 工具栏按钮
function registerPrismButtons(nuxtApp: any) {
  const Prism = nuxtApp.$prism;
  if (!Prism?.plugins?.toolbar) return;

  // 注册语言名称显示（按注册顺序排列在最左侧）
  Prism.plugins.toolbar.registerButton("show-language", (env: any) => {
    const pre = env.element.parentNode;
    if (!pre || !pre.classList) return undefined;
    const lang =
      (Array.from(pre.classList) as string[])
        .find((c) => c.startsWith("language-"))
        ?.replace("language-", "")
        ?.toUpperCase() || "CODE";
    const span = document.createElement("span");
    span.textContent = lang;
    return span;
  });

  // 注册复制按钮
  Prism.plugins.toolbar.registerButton("copy", (env: any) => {
    const button = document.createElement("button");
    const icon = document.createElement("i");
    const tooltip = document.createElement("em");

    button.className = "toolbar-item-button";
    icon.className = "icon-fuzhi";
    tooltip.className = "toolbar-item-button__tips";
    tooltip.innerText = "复制";

    button.appendChild(icon);
    button.appendChild(tooltip);

    let copyTimer: ReturnType<typeof setTimeout>;
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(env.code);
        icon.className = "icon-wancheng";
        ElNotification({
          title: "复制成功",
          message: "转载最好带上出处哟",
          type: "success",
          offset: 40,
        });
        clearTimeout(copyTimer);
        copyTimer = setTimeout(() => {
          icon.className = "icon-fuzhi";
        }, 3000);
      } catch {
        ElNotification.error({
          title: "复制失败了呢",
          message: "请使用 Ctrl + V 来复制吧",
        });
      }
    });

    return button;
  });

  // 注册换行按钮
  Prism.plugins.toolbar.registerButton("newline", (env: any) => {
    const button = document.createElement("button");
    const icon = document.createElement("i");
    const tooltip = document.createElement("em");

    button.className = "toolbar-item-button";
    icon.className = "icon-danhangwenben";
    tooltip.className = "toolbar-item-button__tips";
    tooltip.innerText = "换行";

    button.appendChild(icon);
    button.appendChild(tooltip);

    button.addEventListener("click", () => {
      const parent = env.element.parentNode;
      if (!parent) return;

      if (parent.classList.contains("line-numbers--newline")) {
        parent.classList.remove("line-numbers--newline");
        icon.className = "icon-danhangwenben";
      } else {
        parent.classList.add("line-numbers--newline");
        icon.className = "icon-duohangwenben";
      }

      Prism.plugins.lineNumbers?.resize?.(env.element);
    });

    return button;
  });

  // 注册全屏按钮
  Prism.plugins.toolbar.registerButton("fullscreen", (env: any) => {
    const button = document.createElement("button");
    const icon = document.createElement("i");
    const tooltip = document.createElement("em");

    button.className = "toolbar-item-button";
    icon.className = "icon-quanping";
    tooltip.className = "toolbar-item-button__tips";
    tooltip.innerText = "全屏";

    button.appendChild(icon);
    button.appendChild(tooltip);

    button.addEventListener("click", () => {
      const codeToolbar = env.element.parentNode?.parentNode;
      if (!codeToolbar) return;

      if (codeToolbar.classList.contains("code-toolbar--fullscreen")) {
        document.body.classList.remove("overflow-hidden");
        codeToolbar.classList.remove("code-toolbar--fullscreen");
        icon.className = "icon-quanping";
      } else {
        document.body.classList.add("overflow-hidden");
        codeToolbar.classList.add("code-toolbar--fullscreen");
        icon.className = "icon-tuichuquanping";
      }

      setTimeout(() => {
        Prism.plugins.lineNumbers?.resize?.(env.element);
      }, 300);
    });

    return button;
  });
}
</script>

<style scoped>
.article-description::before {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 36px;
  height: 27px;
  content: "";
  background-image: url("~/assets/image/quotee.svg");
  background-size: cover;
}
.blog-cover::after {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  pointer-events: none;
  content: "";
  background: var(--gradient-cover);
}
@media (max-width: 992px) {
  .blog-cover::after {
    display: none;
  }
}
</style>
