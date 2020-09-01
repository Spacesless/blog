const rainy = {
  speed: 1,
  // - color of particles
  color: {
    r: '255',
    g: '255',
    b: '255',
    a: '0.5'
  },
  started: false,
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  dpr: window.devicePixelRatio || 1,
  // time since last drop
  dropTime: 0,
  // ideal time between drops (changed with mouse/finger)
  dropDelay: 25,
  // wind applied to rain (changed with mouse/finger)
  wind: -5,
  rainColor: null,
  rainColorClear: null,
  rain: [],
  rainPool: [],
  drops: [],
  dropPool: [],
  init: () => {
    if (!this.started) {
      this.started = true
      this.canvas = document.getElementById('weatherCanvas')
      this.ctx = rainy.canvas.getContext('2d')
      const color = this.color
      this.rainColor = `rgba(${color.r},${color.g},${color.b},${color.a})`
      this.rainColorClear = `rgba(${color.r},${color.g},${color.b},0)`
      this.resize()
      Ticker.addListener(this.step)
    }
  },
  resize: () => {
    const rain = this.rain
    const drops = this.drops
    for (let i = rain.length - 1; i >= 0; i--) {
      rain.pop().recycle()
    }
    for (let i = drops.length - 1; i >= 0; i--) {
      drops.pop().recycle()
    }
    this.width = document.body.clientWidth
    this.height = document.body.clientHeight
    this.canvas.width = this.width * this.dpr
    this.canvas.height = this.height * this.dpr
  },
  step: (time, lag) => {
    const speed = this.speed
    const width = this.width
    const height = this.height
    const wind = this.wind
    const rain = this.rain
    const rainPool = this.rainPool
    const drops = this.drops

    const multiplier = speed * lag

    this.dropTime += time * speed
    while (this.dropTime > this.dropDelay) {
      this.dropTime -= this.dropDelay
      const newRain = rainPool.pop() || new Rain()
      newRain.init()
      const windExpand = Math.abs(height / newRain.speed * wind)
      let spawnX = Math.random() * (width + windExpand)
      if (wind > 0) spawnX -= windExpand
      newRain.x = spawnX
      rain.push(newRain)
    }

    // rain physics
    for (let i = rain.length - 1; i >= 0; i--) {
      const r = rain[i]
      r.y += r.speed * r.z * multiplier
      r.x += r.z * wind * multiplier
      // remove rain when out of view
      if (r.y > height) {
        // if rain reached bottom of view, show a splash
        r.splash()
      }
      // recycle rain
      if (r.y > height + Rain.height * r.z || (wind < 0 && r.x < wind) || (wind > 0 && r.x > width + wind)) {
        r.recycle()
        rain.splice(i, 1)
      }
    }

    const dropMaxSpeed = Drop.maxSpeed
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i]
      d.x += d.speedX * multiplier
      d.y += d.speedY * multiplier
      d.speedY += 0.3 * multiplier
      d.speedX += wind / 25 * multiplier

      if (d.speedX < -dropMaxSpeed) {
        d.speedX = -dropMaxSpeed
      } else if (d.speedX > dropMaxSpeed) {
        d.speedX = dropMaxSpeed
      }

      if (d.y > height + d.radius) {
        d.recycle()
        drops.splice(i, 1)
      }
    }
    rainy.draw()
  },
  draw: () => {
    const width = this.width
    const height = this.height
    const dpr = this.dpr
    const rain = this.rain
    const drops = this.drops
    const ctx = this.ctx

    ctx.clearRect(0, 0, width * dpr, height * dpr)
    ctx.beginPath()

    const rainHeight = Rain.height * dpr
    for (let i = rain.length - 1; i >= 0; i--) {
      const r = rain[i]
      const realX = r.x * dpr
      const realY = r.y * dpr
      ctx.moveTo(realX, realY)
      ctx.lineTo(realX - rainy.wind * r.z * dpr * 1.5, realY - rainHeight * r.z)
    }
    ctx.lineWidth = Rain.width * dpr
    ctx.strokeStyle = rainy.rainColor
    ctx.stroke()

    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i]
      const realX = d.x * dpr - d.radius
      const realY = d.y * dpr - d.radius
      ctx.drawImage(d.canvas, realX, realY)
    }
  }
}

class Rain {
  constructor() {
    this.x = 0
    this.y = 0
    this.z = 0
    this.speed = 25
    this.splashed = false
    this.width = 2
    this.height = 40
  }

  init() {
    this.y = Math.random() * -100
    this.z = Math.random() * 0.5 + 0.5
    this.splashed = false
  }

  recycle() {
    rainy.rainPool.push(this)
  }

  splash() {
    if (!this.splashed) {
      this.splashed = true
      const drops = rainy.drops
      const dropPool = rainy.dropPool

      for (let i = 0; i < 16; i++) {
        const drop = dropPool.pop() || new Drop()
        drops.push(drop)
        drop.init(this.x)
      }
    }
  }
}

class Drop {
  constructor() {
    this.x = 0
    this.y = 0
    this.radius = Math.round(Math.random() * 2 + 1) * rainy.dpr
    this.speedX = 0
    this.speedY = 0
    this.maxSpeed = 5
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')

    const diameter = this.radius * 2
    this.canvas.width = diameter
    this.canvas.height = diameter

    const grd = this.ctx.createRadialGradient(this.radius, this.radius, 1, this.radius, this.radius, this.radius)
    grd.addColorStop(0, rainy.rainColor)
    grd.addColorStop(1, rainy.rainColorClear)
    this.ctx.fillStyle = grd
    this.ctx.fillRect(0, 0, diameter, diameter)
  }

  init(x) {
    this.x = x
    this.y = rainy.height
    const angle = Math.random() * Math.PI - (Math.PI * 0.5)
    const speed = Math.random() * Drop.maxSpeed
    this.speedX = Math.sin(angle) * speed
    this.speedY = -Math.cos(angle) * speed
  }

  recycle() {
    rainy.dropPool.push(this)
  }
}

const Ticker = (() => {
  const PUBLICAPI = {}
  let started = false
  let lastTimestamp = 0
  const listeners = []

  PUBLICAPI.addListener = function addListener(fn) {
    if (typeof fn !== 'function') throw new Error('Ticker.addListener() requires a function reference passed in.')
    listeners.push(fn)
    if (!started) {
      started = true
      queueFrame()
    }
  }

  function queueFrame() {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(frameHandler)
    } else {
      window.webkitRequestAnimationFrame(frameHandler)
    }
  }
  function frameHandler(timestamp) {
    let frameTime = timestamp - lastTimestamp
    lastTimestamp = timestamp
    if (frameTime < 0) {
      frameTime = 17
    } else if (frameTime > 68) {
      frameTime = 68
    }
    for (let i = 0, len = listeners.length; i < len; i++) {
      listeners[i].call(window, frameTime, frameTime / 16.67)
    }
    queueFrame()
  }
  return PUBLICAPI
})()
