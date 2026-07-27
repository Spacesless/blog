/* eslint-disable @typescript-eslint/no-explicit-any */
// 粒子动画（落花 canvas）—— 移植自旧版 client/utils/particle.js，保持运行时行为一致。

export interface ParticleParam {
  type?: { typeName: 'image' | 'circle' | 'shape'; url?: string; vertexData?: number[][]; lineWidth?: number }
  reIn?: 'reverseDirection' | string
  color?: string
  number?: number
  rota?: { value: number; speed?: number; floatValue?: number; floatSpeed?: number }
  zoom?: { min: number; max: number }
  size?: { min: number; max: number }
  speed?: { min: number; max: number }
  angle?: { value: number; float: number }
  op?: { min: number; max: number }
  area?: { leftTop: [number, number]; rightBottom: [number, number] }
  respondMouse?: 'on' | 'off'
  flowAngle?: 'on' | 'off'
}

class Point {
  constructor(param: any, canvas: HTMLCanvasElement) {
    // 点原形
    const tempPoint: any = {
      type: param.type,
      reIn: param.reIn,
      cacheImage: null, // 离屏缓存,减少API消耗.
      color: param.color,
      x: null,
      y: null,
      reInX: null,
      reInY: null,
      rota: {},
      zoom: param.zoom.min + (param.zoom.max - param.zoom.min) * Math.random(),
      speed: (param.speed.min + (param.speed.max - param.speed.min) * Math.random()) >> 0,
      size: null,
      flowAngle: param.flowAngle,
      mouseAngle: null,
      opc: param.op.min + (param.op.max - param.op.min) * Math.random(),
      angle: param.angle.value + (param.angle.float * Math.random() - param.angle.float / 2),
      img: null,
    }
    // 初始化size
    tempPoint.size = this.dealSize(param.type, param.size)

    // 初始化旋转属性
    if (param.rota.value !== 0) {
      const tempRota = this.dealRota(param.rota)
      tempPoint.rota.value = tempRota.value
      tempPoint.rota.speed = tempRota.speed
    }
    // 生成初始坐标
    const tempposition = this.createPosition(param.area)
    tempPoint.x = tempposition.x
    tempPoint.y = tempposition.y

    // 计算重新进入画布的坐标
    const tempReIn = this.reIn(canvas, tempPoint.reIn, tempPoint.angle, tempPoint.x, tempPoint.y, tempPoint.size, tempPoint.speed)
    tempPoint.reInX = tempReIn.x
    tempPoint.reInY = tempReIn.y

    /* 生成离屏缓存 */
    tempPoint.cacheImage = this.drawPoint(tempPoint.type, tempPoint.size, tempPoint.opc, tempPoint.color, tempPoint.zoom)
    // 离屏缓存会改变size大小,重新获取一次
    tempPoint.size = tempPoint.cacheImage.width

    return tempPoint as any
  }

  /* 绘制单点离屏缓存图像 */
  drawPoint(type: any, size: number, opc: number, color: string, zoom: number) {
    const cacheCanvas = document.createElement('canvas')
    const cacheCtx = cacheCanvas.getContext('2d') as CanvasRenderingContext2D
    switch (type.typeName) {
      case 'circle': {
        cacheCanvas.width = size * 2
        cacheCanvas.height = size * 2
        cacheCtx.globalAlpha = opc
        cacheCtx.fillStyle = color
        cacheCtx.beginPath()
        cacheCtx.arc(size, size, size, 0, Math.PI * 2, true)
        cacheCtx.closePath()
        cacheCtx.fill()
        break
      }
      case 'image': {
        cacheCanvas.width = size
        cacheCanvas.height = size
        const img = new Image()
        img.src = type.url
        if (img.complete) {
          cacheCtx.drawImage(img, 0, 0, size, size)
        } else {
          img.onload = function () {
            cacheCtx.drawImage(img, 0, 0, size, size)
          }
          img.onerror = function () {
            console.log(type.url + '加载失败，请重试')
          }
        }
        break
      }
      case 'shape': {
        size = size * zoom
        cacheCanvas.width = size
        cacheCanvas.height = size

        cacheCtx.globalAlpha = opc
        cacheCtx.fillStyle = color
        cacheCtx.strokeStyle = color
        cacheCtx.lineWidth = type.lineWidth

        const tempVertexData = type.vertexData
        cacheCtx.scale(zoom, zoom)
        cacheCtx.beginPath()
        cacheCtx.moveTo(tempVertexData[0][0], tempVertexData[0][1])
        for (let j = tempVertexData.length, i = 1; i < j; ++i) {
          cacheCtx.lineTo(tempVertexData[i][0], tempVertexData[i][1])
        }
        cacheCtx.lineTo(tempVertexData[0][0], tempVertexData[0][1])
        cacheCtx.stroke()
        cacheCtx.fill()
        cacheCtx.closePath()
      }
    }
    return cacheCanvas
  }

  /* 计算重新进入画布的位置 */
  reIn(canvas: HTMLCanvasElement, way: string, angle: number, initX: number, initY: number, size: number, speed: number) {
    let rX: number, rY: number, tempX = initX, tempY = initY, radian: number, opAngle: number
    switch (way) {
      case 'reverseDirection': {
        opAngle = angle - 180
        radian = (opAngle / 180) * Math.PI
        for (let j = 1; j <= canvas.width; j += speed) {
          tempX = initX + Math.cos(radian) * j
          tempY = initY + Math.sin(radian) * j
          if (angle > 270 && angle <= 360) {
            if (tempX <= 0 || tempY >= canvas.height) {
              tempX -= size
              tempY += size
              break
            }
          } else if (angle > 180 && angle <= 270) {
            if (tempX >= canvas.width || tempY >= canvas.height) {
              tempX += size
              tempY += size
              break
            }
          } else if (angle > 90 && angle <= 180) {
            if (tempX >= canvas.width || tempY <= 0) {
              tempX += size
              tempY -= size
              break
            }
          } else if (tempX <= 0 || tempY <= 0) {
            tempX -= size
            tempY -= size
            break
          }
        }
        rX = tempX
        rY = tempY
        break
      }
      default: {
        rX = initX
        rY = initY
        break
      }
    }
    return { x: rX, y: rY }
  }

  /* 随机生成初始点 */
  createPosition(area: { leftTop: [number, number]; rightBottom: [number, number] }) {
    const x = (Math.random() * (area.rightBottom[0] - area.leftTop[0]) + area.leftTop[0]) >> 0
    const y = (Math.random() * (area.rightBottom[1] - area.leftTop[1]) + area.leftTop[1]) >> 0
    return { x, y }
  }

  /* 处理旋转信息 */
  dealRota(rota: any) {
    let value: number | undefined, speed: number | undefined
    if (rota.floatValue) value = Math.random() * rota.floatValue - rota.floatValue / 2 + rota.value
    if (rota.floatSpeed) speed = Math.random() * rota.floatSpeed - rota.floatSpeed / 2 + rota.speed
    return { value, speed }
  }

  /* 初始化size */
  dealSize(tpye: any, size: any) {
    let tempSize: number
    switch (tpye.typeName) {
      case 'shape': {
        let maxX: number, maxY: number
        const temp = tpye.vertexData
        maxX = temp[0][0]
        maxY = temp[0][1]
        for (let i = temp.length - 1; i >= 0; --i) {
          if (temp[i][0] > maxX) maxX = temp[i][0]
          if (temp[i][0] > maxY) maxY = temp[i][1]
        }
        tempSize = maxX > maxY ? maxX : maxY
        break
      }
      default: {
        tempSize = size.min + (size.max - size.min) * Math.random()
        break
      }
    }
    return tempSize
  }
}

const dealMouse = function (event: any, width: number, height: number) {
  event = event || (window as any).event
  event.preventDefault ? event.preventDefault() : (event.returnValue = false)
  const touches = event.touches ? event.touches[0] : event
  const x = touches.pageX
    ? touches.pageX
    : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft)
  const y = touches.pageY
    ? touches.pageY
    : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop)

  const dx = x - width / 2
  const dy = y - height / 2
  const dd = Math.sqrt(dx * dx + dy * dy)
  const acos = Math.acos(dx / dd)
  if (dy >= 0) {
    ;(window as any).particleCanvasMouseAngle = ((acos * 180) / Math.PI) >> 0
  } else {
    ;(window as any).particleCanvasMouseAngle = (180 - (acos * 180) / Math.PI + 180) >> 0
  }
}

export default class ParticleCanvas {
  private defaultParameter: any
  private canvasE!: HTMLCanvasElement
  private ctx!: CanvasRenderingContext2D
  private canvasWidth!: number
  private canvasHeight!: number
  private canvasId!: string
  private useParameter: any[] = []
  private pointGroup: any[][] = []
  private mouseArrayIndex: number[] | null = null
  private stopAni = 0

  constructor(canvasId: string, paramArray: ParticleParam[]) {
    this.defaultParameter = {
      area: {
        leftTop: [0, 0],
        rightBottom: [this.canvasWidth, this.canvasHeight],
      },
      number: 50,
      type: { typeName: 'circle' },
      rota: { value: 0, speed: 0, floatValue: 100, floatSpeed: 0.1 },
      zoom: { min: 1, max: 1 },
      reIn: 'reverseDirection',
      color: '#FF4040',
      size: { min: 2, max: 2 },
      speed: { min: 4, max: 4 },
      angle: { value: 30, float: 0 },
      op: { min: 1, max: 1 },
      respondMouse: 'off',
      flowAngle: 'off',
    }

    /* 获取canvas画布 */
    this.canvasE = document.getElementById(canvasId) as HTMLCanvasElement
    this.canvasE.width = this.canvasE.clientWidth
    this.canvasE.height = this.canvasE.clientHeight
    this.ctx = this.canvasE.getContext('2d') as CanvasRenderingContext2D
    this.canvasWidth = this.canvasE.clientWidth
    this.canvasHeight = this.canvasE.clientHeight

    /* 格式化参数 */
    if (paramArray.length !== 0) {
      this.canvasId = canvasId
      const temp: any[] = []
      for (let i = 0, j = paramArray.length; i < j; ++i) {
        temp.push(paramArray[i])
      }
      this.useParameter = this.formatParameter(temp)
    } else {
      console.log('没有找到组件实例化参数')
      return
    }

    /* 生成点数组 */
    this.pointGroup = this.createpointGroup()

    this.mouseArrayIndex = this.onMouse()
    if (this.pointGroup.length > 0) {
      this.draw()
    } else {
      console.log('没有可绘制的图像,检测number参数是否大于0')
    }
  }

  /* 格式化参数 */
  formatParameter(data: any) {
    let temp: any
    const tempUseParameter: any[] = []
    data = data || {}
    for (const index in data) {
      temp = {}
      for (const key in this.defaultParameter) {
        temp[key] = data[index][key] ? data[index][key] : this.defaultParameter[key]
      }
      tempUseParameter.push(temp)
    }
    return tempUseParameter
  }

  /* 创建点数组 */
  createpointGroup() {
    let temp: any, tempPoints: any[]
    const tempArray: any[][] = []
    for (const index in this.useParameter) {
      tempPoints = []
      temp = this.useParameter[index]
      for (let i = temp.number; i > 0; --i) {
        tempPoints.push(new Point(temp, this.canvasE) as any)
      }
      tempArray.push(tempPoints)
    }
    return tempArray
  }

  /* 更新图像点数据 */
  update() {
    let tempArray: any[], tempPoint: any
    if (this.mouseArrayIndex !== null) {
      for (let i = this.mouseArrayIndex.length - 1; i >= 0; --i) {
        const tempPointGroup = this.pointGroup[this.mouseArrayIndex[i]]
        for (let j = tempPointGroup.length - 1; j >= 0; --j) {
          if ((window as any).particleCanvasMouseAngle !== undefined) {
            tempPointGroup[j].mouseAngle = (window as any).particleCanvasMouseAngle
          }
        }
      }
    }
    for (const index in this.pointGroup) {
      tempArray = this.pointGroup[index]
      for (let i = tempArray.length - 1; i >= 0; --i) {
        tempPoint = tempArray[i]
        if (
          tempPoint.x < -tempPoint.size - tempPoint.speed - 10 ||
          tempPoint.y < -tempPoint.size - tempPoint.speed - 10 ||
          tempPoint.x > this.canvasWidth + tempPoint.size + tempPoint.speed + 10 ||
          tempPoint.y > this.canvasHeight + tempPoint.size + tempPoint.speed + 10
        ) {
          tempPoint.x = tempPoint.reInX
          tempPoint.y = tempPoint.reInY
        } else {
          tempPoint.x += Math.cos((tempPoint.angle / 180) * Math.PI) * tempPoint.speed
          tempPoint.y += Math.sin((tempPoint.angle / 180) * Math.PI) * tempPoint.speed
        }
        if (tempPoint.rota.value !== 0) {
          tempPoint.rota.value += tempPoint.rota.speed
        }
      }
    }
  }

  /* 绘制函数 */
  draw() {
    let temp: any, tempArray: any[], tempSize: number
    this.canvasE.width = this.canvasWidth
    for (const index in this.pointGroup) {
      tempArray = this.pointGroup[index]
      for (let i = tempArray.length - 1; i >= 0; --i) {
        temp = tempArray[i]
        if (temp.mouseAngle !== null) {
          temp.angle = temp.mouseAngle
        }
        if (temp.rota.speed === 0) {
          this.ctx.drawImage(temp.cacheImage, temp.x - temp.size, temp.y - temp.size)
        } else if (temp.flowAngle === 'on') {
          this.ctx.save()
          tempSize = temp.size / 2
          this.ctx.translate(temp.x + tempSize, temp.y + tempSize)
          this.ctx.rotate((temp.angle * Math.PI) / 180)
          this.ctx.translate(-temp.x - tempSize, -temp.y - tempSize)
          this.ctx.drawImage(temp.cacheImage, temp.x, temp.y)
          this.ctx.restore()
        } else {
          this.ctx.save()
          tempSize = temp.size / 2
          this.ctx.translate(temp.x + tempSize, temp.y + tempSize)
          this.ctx.rotate((temp.rota.value * Math.PI) / 180)
          this.ctx.translate(-temp.x - tempSize, -temp.y - tempSize)
          this.ctx.drawImage(temp.cacheImage, temp.x, temp.y)
          this.ctx.restore()
        }
      }
    }
    this.update()
    this.stopAni = requestAnimationFrame(this.draw.bind(this))
  }

  stopDraw() {
    window.cancelAnimationFrame(this.stopAni)
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
  }

  resize() {
    this.canvasE.width = this.canvasE.clientWidth
    this.canvasE.height = this.canvasE.clientHeight
    this.canvasWidth = this.canvasE.clientWidth
    this.canvasHeight = this.canvasE.clientHeight
  }

  onMouse() {
    const temp: number[] = []
    for (let i = this.useParameter.length - 1; i >= 0; --i) {
      if (this.useParameter[i].respondMouse === 'on') {
        temp.push(i)
      }
    }
    if (temp.length === 0) {
      return null
    } else {
      ;(document.getElementById(this.canvasId) as HTMLCanvasElement).onmousemove = function (e: MouseEvent) {
        dealMouse(e, 1000, 600)
      }
      return temp
    }
  }
}
