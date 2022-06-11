Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2
  if (t < 1) {
    return c / 2 * t * t + b
  }
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
const requestAnimFrame = (function () {
  if (process.client) {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60)
      }
  }
})()

/**
 * Because it's so fucking difficult to detect the scrolling element, just move them all
 * @param {Document} element 需要滚动的元素
 * @param {number} amount
 * @summary element不传则body滚动
 */
function move (amount, element) {
  if (element) {
    element.scrollTop = amount
  } else {
    document.documentElement.scrollTop = amount
    document.body.parentNode.scrollTop = amount
    document.body.scrollTop = amount
  }
}

/**
 * 获取scrollTop
 * @param {Document} element 需要滚动的元素
 */
export function getPosition (element) {
  if (element) {
    return element.scrollTop
  } else {
    return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop
  }
}

/**
 * @param {number} to 滚动高度
 * @param {number} duration 过渡时间
 * @param {Document} element 需要滚动的元素
 * @param {Function} callback 滚动结束的回调函数
 */
export function scrollTo (to, duration, element, callback) {
  const start = getPosition(element)
  const change = to - start
  const increment = 20
  let currentTime = 0
  duration = (typeof (duration) === 'undefined') ? 500 : duration
  const animateScroll = function () {
    // increment the time
    currentTime += increment
    // find the value with the quadratic in-out easing function
    const val = Math.easeInOutQuad(currentTime, start, change, duration)
    // move the document.body
    move(val, element)
    // do the animation unless its over
    if (currentTime < duration) {
      requestAnimFrame(animateScroll)
    } else if (callback && typeof (callback) === 'function') {
      // the animation is done so lets callback
      callback()
    }
  }
  animateScroll()
}
