class Point {
  constructor (param, canvas) {
    // 点原形
    const tempPoint = {
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
      speed: param.speed.min + (param.speed.max - param.speed.min) * Math.random() >> 0,
      size: null,
      flowAngle: param.flowAngle,
      mouseAngle: null,
      opc: param.op.min + (param.op.max - param.op.min) * Math.random(),
      angle: param.angle.value + (param.angle.float * Math.random() - param.angle.float / 2),
      img: null // 为了兼容IE8以下,引入的excanvas不支持离屏缓存,每次都要实例一个img对象.所以这里存放一个实例,只实例一次,也避免了闪烁.
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

    return tempPoint
  }

  /* 绘制单点离屏缓存图像 */
  drawPoint (type, size, opc, color, zoom) {
    let cacheCanvas
    // 创建离屏
    cacheCanvas = document.createElement('canvas')
    // 为了兼容ie8,引入了excanvas.js,但是动态创建canvas需要手动实例化
    if (window.G_vmlCanvasManager !== undefined) {
      cacheCanvas = window.G_vmlCanvasManager.initElement(cacheCanvas)
    }
    const cacheCtx = cacheCanvas.getContext('2d')
    switch (type.typeName) {
      case 'circle':
      {
        // 设置离屏缓存大小
        cacheCanvas.width = size * 2
        cacheCanvas.height = size * 2
        // 设置透明度,因为只操作这一个,不用保存和恢复画布
        cacheCtx.globalAlpha = opc
        // 设置颜色
        cacheCtx.fillStyle = color
        // 开始绘制
        cacheCtx.beginPath()
        cacheCtx.arc(size, size, size, 0, Math.PI * 2, true)
        cacheCtx.closePath()
        cacheCtx.fill()
        break
      }
      case 'image':
      {
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
      case 'shape':
      {
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
    // 绘制完成返回
    return cacheCanvas
  }

  /* 计算重新进入画布的位置 */
  reIn (canvas, way, angle, initX, initY, size, speed) {
    let rX, rY, tempX, tempY, radian, opAngle
    switch (way) {
      /* 根据角度去找点移出屏幕之后,重新进入屏幕的点. */
      case 'reverseDirection':
      { // 找到相反的方向
        opAngle = angle - 180
        // 相反方向对应的弧度
        radian = opAngle / 180 * Math.PI
        // 根据相反的方向弧度去计算重新进入屏幕时的坐标
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
      default:
      {
        rX = initX
        rY = initY
        break
      }
    }
    return {
      x: rX,
      y: rY
    }
  }

  /* 随机生成初始点 */
  createPosition (area) {
    const x = Math.random() * (area.rightBottom[0] - area.leftTop[0]) + area.leftTop[0] >> 0
    const y = Math.random() * (area.rightBottom[1] - area.leftTop[1]) + area.leftTop[1] >> 0
    return {
      x,
      y
    }
  }

  /* 处理旋转信息 */
  dealRota (rota) {
    let value, speed
    if (rota.floatValue) { value = Math.random() * rota.floatValue - rota.floatValue / 2 + rota.value }
    if (rota.floatSpeed) { speed = Math.random() * rota.floatSpeed - rota.floatSpeed / 2 + rota.speed }
    return {
      value,
      speed
    }
  }

  /* 初始化size */
  dealSize (tpye, size) {
    let tempSize
    switch (tpye.typeName) {
      case 'shape':
      {
        let maxX, maxY

        const temp = tpye.vertexData
        maxX = temp[0][0]
        maxY = temp[0][1]

        for (let i = temp.length - 1; i >= 0; --i) {
          // 找出最大X
          if (temp[i][0] > maxX) {
            maxX = temp[i][0]
          }
          // 找出最大Y
          if (temp[i][0] > maxY) {
            maxY = temp[i][1]
          }
        }
        // 现在找出的最大的值作为正方形的高宽,还不能支持矩形,减少性能消耗,后期改进
        if (maxX > maxY) {
          tempSize = maxX
        } else {
          tempSize = maxY
        }
        break
      }
      default:
      {
        tempSize = size.min + (size.max - size.min) * Math.random()
        break
      }
    }
    return tempSize
  }
}

const dealMouse = function (event, width, height) {
  event = event || window.event
  // 阻止其他相同事件,IE10以下不支持则不阻止
  event.preventDefault ? event.preventDefault() : (event.returnValue = false)
  // 获取鼠标垫,兼容IE10以下不支持pageX/Y
  const touches = event.touches ? event.touches[0] : event
  const x = (touches.pageX) ? touches.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft)
  const y = (touches.pageY) ? touches.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop)

  // 计算鼠标点与canvas中心点的角度
  const dx = x - width / 2
  const dy = y - height / 2
  const dd = Math.sqrt(dx * dx + dy * dy)
  const acos = Math.acos(dx / dd)
  // 因为acos接收的参数是-1~1.所以求出来的弧度也是在0-PI,不适合当前0-2PI(360度)的设定.所以需要早度数超过180的时候,也就是dy<0的时候,取180度的对角.
  if (dy >= 0) {
    window.particleCanvasMouseAngle = acos * 180 / Math.PI >> 0
  } else {
    window.particleCanvasMouseAngle = 180 - (acos * 180 / Math.PI) + 180 >> 0
  }
}

class ParticleCanvas {
  constructor (canvasId, paramArray) {
    this.defaultParameter = {
      area: {
        leftTop: [0, 0],
        rightBottom: [this.canvasWidth, this.canvasHeight]
      },
      number: 50, // 点数量
      type: {
        typeName: 'circle'
      },
      rota: {
        value: 0,
        speed: 0,
        floatValue: 100,
        floatSpeed: 0.1
      },
      zoom: {
        min: 1,
        max: 1
      },
      reIn: 'reverseDirection',
      color: '#FF4040', // 点颜色,支持16进制/RGB/RGBA
      size: { // 点大小
        min: 2,
        max: 2
      },
      speed: { // 移动速度
        min: 4,
        max: 4
      },
      angle: { // 移动角度
        value: 30,
        float: 0
      },
      op: {
        min: 1,
        max: 1
      },
      respondMouse: 'off',
      flowAngle: 'off' // on
    }
    /** *组件构造函数***/
    /* 获取canvas画布 */
    this.canvasE = document.getElementById(canvasId)
    this.canvasE.width = this.canvasE.clientWidth
    this.canvasE.height = this.canvasE.clientHeight
    this.ctx = this.canvasE.getContext('2d')
    // 获取画布宽高
    this.canvasWidth = this.canvasE.clientWidth
    this.canvasHeight = this.canvasE.clientHeight

    /* 格式化参数 */
    if (paramArray.length !== 0) { // 获取列表参数
      // 获取canvas的id
      this.canvasId = canvasId
      // 获取定义的点数组参数
      const temp = []
      for (let i = 0, j = paramArray.length; i < j; ++i) {
        temp.push(paramArray[i])
      }
      // 把传入的点相关参数和默认参数合并到最终使用的"使用参数"
      this.useParameter = this.formatParameter(temp)
    } else { // 没有参数列表,报错跳出.
      console.log('没有找到组件实例化参数')
      return
    }

    /* 生成点数组 */
    this.pointGroup = this.createpointGroup()

    // 获取开启了鼠标响应的点数组下标
    this.mouseArrayIndex = this.onMouse()
    /* 绘制 */
    if (this.pointGroup.length > 0) {
      // 通知绘制函数绘制
      this.draw(this)
    } else {
      console.log('没有可绘制的图像,检测number参数是否大于0')
    }
  }

  /* 格式化参数 */
  formatParameter (data) {
    let temp
    const tempUseParameter = []
    data = data || {}
    // 把参数合并,没有填的参数使用默认参数
    for (const index in data) {
      temp = {}
      for (const key in this.defaultParameter) {
        temp[key] = (data[index][key]) ? data[index][key] : this.defaultParameter[key]
      }
      tempUseParameter.push(temp)
    }
    return tempUseParameter
  }

  /* 创建点数组 */
  createpointGroup () {
    let temp, tempPoints
    const tempArray = [] // 全部点数组的集合
    for (const index in this.useParameter) {
      tempPoints = [] // 某一组的点集合
      temp = this.useParameter[index]
      // 根据这一组对应的number生成点
      for (let i = temp.number; i > 0; --i) {
        tempPoints.push(new Point(temp, this.canvasE))
      }
      tempArray.push(tempPoints)
    }
    return tempArray
  }

  /* 更新图像点数据 */
  update () {
    let tempArray, tempPoint
    if (this.mouseArrayIndex !== null) {
      for (let i = this.mouseArrayIndex.length - 1; i >= 0; --i) {
        const tempPointGroup = this.pointGroup[this.mouseArrayIndex[i]]
        for (let j = tempPointGroup.length - 1; j >= 0; --j) {
          if (window.particleCanvasMouseAngle !== undefined) {
            tempPointGroup[j].mouseAngle = window.particleCanvasMouseAngle
          }
        }
      }
    }
    for (const index in this.pointGroup) {
      tempArray = this.pointGroup[index]
      for (let i = tempArray.length - 1; i >= 0; --i) {
        tempPoint = tempArray[i]
        // 更新位置信息
        if (tempPoint.x < -tempPoint.size - tempPoint.speed - 10 ||
          tempPoint.y < -tempPoint.size - tempPoint.speed - 10 ||
          tempPoint.x > this.canvasWidth + tempPoint.size + tempPoint.speed + 10 ||
          tempPoint.y > this.canvasHeight + tempPoint.size + tempPoint.speed + 10) {
          // 如果超出屏幕了,回到重进画布的位置
          tempPoint.x = tempPoint.reInX
          tempPoint.y = tempPoint.reInY
        } else {
          // 没有超出屏幕,继续移动
          tempPoint.x += Math.cos(tempPoint.angle / 180 * Math.PI) * tempPoint.speed
          tempPoint.y += Math.sin(tempPoint.angle / 180 * Math.PI) * tempPoint.speed
        }
        // 更新旋转信息
        if (tempPoint.rota.value !== 0) {
          tempPoint.rota.value += tempPoint.rota.speed
        }
      }
    }
  }

  /* 绘制函数 */
  draw (data) {
    // 这里把原对象作为data传递进来,解决requestAnimationFrame执行函数时,this指向了window
    let temp, tempArray, tempSize
    // 清理画布
    this.canvasE.width = this.canvasWidth
    // 循环绘制
    for (const index in this.pointGroup) {
      tempArray = this.pointGroup[index]
      for (let i = tempArray.length - 1; i >= 0; --i) {
        temp = tempArray[i]
        // 如果开启了鼠标响应,把鼠标的角度传递给现在的角度
        if (temp.mouseAngle !== null) {
          temp.angle = temp.mouseAngle
        }
        // 如果没有旋转
        if (temp.rota.speed === 0) {
          this.ctx.drawImage(temp.cacheImage, temp.x - temp.size, temp.y - temp.size)
        } else if (temp.flowAngle === 'on') {
          // 如果有角度跟随
          this.ctx.save()
          tempSize = temp.size / 2
          this.ctx.translate(temp.x + tempSize, temp.y + tempSize)
          this.ctx.rotate(temp.angle * Math.PI / 180)
          this.ctx.translate(-temp.x - tempSize, -temp.y - tempSize)
          this.ctx.drawImage(temp.cacheImage, temp.x, temp.y)
          this.ctx.restore()
        } else {
          this.ctx.save()
          tempSize = temp.size / 2
          this.ctx.translate(temp.x + tempSize, temp.y + tempSize)
          this.ctx.rotate(temp.rota.value * Math.PI / 180)
          this.ctx.translate(-temp.x - tempSize, -temp.y - tempSize)
          this.ctx.drawImage(temp.cacheImage, temp.x, temp.y)
          this.ctx.restore()
        }
      }
    }
    // 绘制完成,更新数据
    this.update()
    // 设置下一次绘制
    // rAF(function() {
    //    data.draw(data);
    // });
    this.stopAni = requestAnimationFrame(this.draw.bind(this))
  }

  stopDraw () {
    window.cancelAnimationFrame(this.stopAni)
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
  }

  onMouse () {
    const temp = [] // 开启角度移动的组
    for (let i = this.useParameter.length - 1; i >= 0; --i) {
      if (this.useParameter[i].respondMouse === 'on') {
        temp.push(i)
      }
    }
    // 没有组开启鼠标响应,退出
    if (temp.length === 0) {
      return null
    } else { // 如果有,添加鼠标移动事件
      document.getElementById(this.canvasId).onmousemove = function () {
        dealMouse(event, 1000, 600)
      }
      return temp
    }
  }
}

export default ParticleCanvas
