<template>
  <div class="text-[15px] leading-loose text-[var(--color-text)]">
    <PageBanner
      title="友情链接"
      subtitle="山水一程，三生有幸。"
      extra="感谢在茫茫网海中与你相遇，愿我们都能在各自的世界里熠熠生辉。"
      :background-image="linkBg"
    />

    <el-row :gutter="16">
      <el-col v-for="item in linkList" :key="item.id" :sm="12" :md="8" :lg="6">
        <a
          class="block p-2.5 mb-[var(--grid-space)] text-[var(--color-text)] bg-[var(--bg-normal)] border-t-3 border-[var(--color-primary)] rounded shadow-[var(--shadow-3-down)] transition-all duration-300 hover:-translate-y-1.5 clearfix"
          :href="item.website"
          :title="item.name"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="float-left w-16.25 h-16.25 overflow-hidden rounded-full">
            <el-image class="block w-16.25 h-16.25" :src="item.logo">
              <template #error>
                <div
                  class="flex items-center justify-center w-full h-full bg-[var(--bg)]"
                >
                  <Icon name="ph:image" />
                </div>
              </template>
            </el-image>
          </div>
          <div class="pl-2.5 overflow-hidden">
            <p class="text-base leading-[22px] text-[var(--color-primary)]">
              {{ item.name }}
            </p>
            <p class="h-10.5 overflow-hidden text-[13px] leading-relaxed">
              {{ item.description }}
            </p>
          </div>
        </a>
      </el-col>
    </el-row>

    <div
      class="px-4 py-5 pt-px mb-[var(--grid-space)] bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]"
    >
      <h2
        class="my-[var(--grid-space)] text-xl font-normal text-[var(--color-heading)]"
      >
        友链要求
      </h2>
      <p>1、优先考虑博客类、ACG、国风相关的网站</p>
      <p>2、需有原创内容，内容积极向上，如有广告需适量</p>
      <p>
        3、不定期检查链接(๑＞ڡ＜)☆，长时间打不开的站会被删掉的，如要恢复请打call
      </p>
      <p>4、申请前先添加本站为友链的最好不过了，能拉满成功率</p>
      <p>
        5、ฅ^ω^ฅ 各位大神、二次元小伙伴可大幅降低以上要求，如不嫌弃随时欢迎入驻
      </p>
      <h2
        class="my-[var(--grid-space)] text-xl font-normal text-[var(--color-heading)]"
      >
        申请方式
      </h2>
      <p>可以通过邮件、留言评论等方式申请，格式如下：</p>
      <p>名称：Timeless's博客</p>
      <p>
        描述：花开成景，花落成诗 <span class="text-red-500 ml-4">可选</span>
      </p>
      <p>网址：https://www.timelessq.com</p>
      <p>
        头像/Logo：https://www.timelessq.com/static/avatar.jpg
        <span class="text-red-500 ml-4">可选</span>
      </p>
    </div>
    <WalineComment />
    <Adsense />
  </div>
</template>

<script setup lang="ts">
import linkBg from "~/assets/image/link.jpg";

const { fetchFriendLinks } = useApi();

usePageSeo({ pageType: "page", pageName: "友情链接" });

const { data } = await useAsyncData("friend-links", () =>
  fetchFriendLinks().catch(() => []),
);
const linkList = computed(() => data.value || []);
</script>
