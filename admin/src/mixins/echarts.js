// 使用JSON格式registerTheme，js注册方式会影响equire按需引入
import theme from '@/mixins/theme.json'
/**
 * 按需引入Echarts模块
 * @param {Array} 需要引入的模块
 * @see {*} https://github.com/ywwhack/babel-plugin-equire#转化规则
 */
// eslint-disable-next-line
const echarts = equire([ // 正常打包
// const equireCharts = equireAsync([ // 动态引入，单独一个包
  // @chart
  'bar', // 柱状图
  // 'boxplot', // 箱形图
  // 'candlestick', // K线图
  // 'chord', // 弦图
  'custom', // 自定义系列
  // 'effectScatter', // 带有涟漪特效动画的散点（气泡）图
  // 'funnel', // 漏斗图
  // 'gauge', // 仪表盘
  // 'graph', // 关系图
  // 'heatmap', // 热力图
  'line', // 折线、面积图
  // 'lines', // 路径图
  // 'map', // 地图
  // 'parallel', // 平行坐标系的系列
  // 'pictorialBar', // 象形柱图
  'pie', // 饼图
  'echarts/lib/chart/radar', // 雷达图
  // 'sankey', // 桑基图
  'scatter', // 散点（气泡）图
  // 'themeRiver', // 主题河流
  // 'tree', // 树图
  // 'treemap',
  // @component
  'angleAxis', // 极坐标系的角度轴
  'axis', // 直角坐标系 grid 中的 x 轴
  'axisPointer',
  // 'brush', // 区域选择组件
  // 'calendar', // 日历坐标系组件
  'dataZoom', // 区域缩放
  'dataZoomInside', // 内置型数据区域缩放组件
  'dataZoomSelect', // 框选型数据区域缩放组件
  // 'geo', // 地理坐标系组件
  'graphic', // 原生图形元素组件
  'grid', // 直角坐标系内绘图网格
  // 'gridSimple',
  'legend', // 图例组件
  'legendScroll',
  // 'markArea',
  // 'markLine',
  'markPoint',
  // 'parallel', // 平行坐标系
  // 'parallelAxis', // 平行坐标系中的坐标轴
  'polar', // 极坐标系
  'echarts/lib/component/radar', // 雷达图坐标系组件
  'radiusAxis', // 极坐标系的径向轴
  'singleAxis', // 单轴
  'timeline', // 多个 ECharts option 间进行切换
  'title', // 标题组件，包含主标题和副标题
  // 'toolbox', // 工具栏
  'tooltip' // 提示框组件
  // 'visualMap', // 视觉映射组件
  // 'visualMapContinuous', // 连续型视觉映射
  // 'visualMapPiecewise' // 分段型视觉映射
])

// will transform to below
// import echarts from 'echarts/lib/echarts';
// import 'echarts/lib/chart/bar';
// import 'echarts/lib/chart/line';

/**
 * 实例化Echarts
 * @param {Nodes} element DOM 容器
 * @param {Boolean} isTheme 是否注册主题
 * @param {Boolean} isExpose 是否暴露echarts，部分绘图需用到echarts的方法
 * @returns {Object} {echarts: echarts对象, instance: echarts的实例化对象}
 */
const initEcharts = (element, isTheme = true, isExpose = false) => {
  // const echarts = await equireCharts()
  if (isExpose) {
    return {
      echarts,
      instance: isTheme ? (echarts.registerTheme('walden', theme), echarts.init(element, 'walden')) : echarts.init(element)
    }
  } else {
    return isTheme ? (echarts.registerTheme('walden', theme), echarts.init(element, 'walden')) : echarts.init(element)
  }
}

export default initEcharts
