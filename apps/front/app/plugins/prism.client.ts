/**
 * Prism 客户端代码高亮插件
 * 在 article 详情页 onMounted 中可调用 nuxtApp.$prism.highlightAll()
 */
export default defineNuxtPlugin(async () => {
  // @ts-expect-error prism types
  const Prism = (await import('prismjs')).default || (await import('prismjs'))

  await Promise.all([
    import('prismjs/components/prism-markup'),
    import('prismjs/components/prism-css'),
    import('prismjs/components/prism-javascript'),
    import('prismjs/components/prism-typescript'),
    import('prismjs/components/prism-json'),
    import('prismjs/components/prism-scss'),
    import('prismjs/components/prism-bash'),
    import('prismjs/components/prism-yaml'),
  ])

  return {
    provide: {
      prism: {
        highlightAll: () => Prism.highlightAll(),
        highlightElement: (el: Element) => Prism.highlightElement(el),
      },
    },
  }
})
