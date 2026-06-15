const callbacks: Record<string, Array<(error: Error | null, src: string) => void>> = {}

function loadedTinymce(): any {
  if (typeof window === 'undefined') return false
  return (window as any).tinymce
}

export default function dynamicLoadScript(src: string, callback?: (error: Error | null, src: string) => void) {
  const existingScript = document.getElementById(src) as HTMLScriptElement | null
  const cb = callback || function () {}

  if (loadedTinymce()) {
    cb(null, src)
    return
  }

  if (!existingScript) {
    const script = document.createElement('script')
    script.src = src
    script.id = src
    document.body.appendChild(script)
    callbacks[src] = [cb]
    const onEnd = 'onload' in script ? stdOnEnd.bind(script) : ieOnEnd.bind(script)
    onEnd(script)
  } else {
    if (callbacks[src]) callbacks[src].push(cb)
    else callbacks[src] = [cb]
  }

  function stdOnEnd(this: HTMLScriptElement, script: HTMLScriptElement) {
    script.onload = function () {
      this.onerror = this.onload = null
      for (const fn of callbacks[src] || []) fn(null, src)
      delete callbacks[src]
    }
    script.onerror = function () {
      this.onerror = this.onload = null
      for (const fn of callbacks[src] || []) fn(new Error('Failed to load ' + src), src)
      delete callbacks[src]
    }
  }

  function ieOnEnd(this: HTMLScriptElement, script: any) {
    script.onreadystatechange = function (this: any) {
      if (this.readyState !== 'complete' && this.readyState !== 'loaded') return
      this.onreadystatechange = null
      for (const fn of callbacks[src] || []) fn(null, src)
      delete callbacks[src]
    }
  }
}
