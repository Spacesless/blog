declare module '#app' {
  interface NuxtApp {
    $prism: {
      highlightAll: () => void
      highlightElement: (el: Element) => void
      plugins: any
    }
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $prism: {
      highlightAll: () => void
      highlightElement: (el: Element) => void
      plugins: any
    }
  }
}

export {}
