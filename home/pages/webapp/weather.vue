<template>
  <div id="weather" class="weather">
    <div class="background" />
    <div class="container">
      <div class="location">
        <span class="location-map">
          <i class="el-icon-location-information" />
          {{ basic.location }}
        </span>
        <el-cascader
          ref="chinaAreas"
          v-model="areas"
          :props="props"
          @change="handleSearch"
        />
      </div>
      <!-- realtime start -->
      <div class="realtime">
        <p class="realtime__updatetime">{{ update.loc }} 中央气象台发布</p>
        <div class="realtime-main">
          <strong class="realtime-main__tem">{{ now.tmp }}°</strong>
          <span class="realtime-main__cond">{{ now.cond_txt }}</span>
          <img class="realtime-main__wea" :src="'/static/weather/' + now.cond_code + '.png'">
        </div>
        <div class="realtime-air">
          <el-popover
            v-model="airVisible"
            placement="top"
            width="160"
          >
            <span slot="reference" class="realtime-air__quality">
              <i class="tl-icon">&#xe617;</i> {{ airs.aqi }} {{ airs.qlty }}
            </span>
            <div>
              <p>主要污染物：{{ airs.main }}</p>
              <p>pm10: {{ airs.pm10 }}</p>
              <p>pm25: {{ airs.pm25 }}</p>
              <p>二氧化氮: {{ airs.no2 }}</p>
              <p>二氧化硫: {{ airs.so2 }}</p>
              <p>一氧化碳: {{ airs.co }}</p>
              <p>臭氧: {{ airs.o3 }}</p>
            </div>
          </el-popover>
        </div>
        <div class="realtime-wind">
          <i v-if="now.wind_deg" class="tl-icon">&#xe649;</i>
          <i v-else class="realtime-wind__direction tl-icon">&#xe679;</i>
          <span>{{ now.wind_dir }}</span>
          <span>{{ now.wind_sc }}级</span>
          <span>风速 {{ now.wind_spd }}km/h</span>
        </div>
        <div class="realtime-other">
          <span>相对湿度 {{ now.hum }}%</span>
          <span>降水量 {{ now.pcpn }}mm</span>
          <span>气压 {{ now.pres }}hPa</span>
          <span>能见度 {{ now.vis }}km</span>
        </div>
      </div>
      <!-- realtime start -->
      <div class="lifestyle">
        <h3 class="weather-title">生活指数</h3>
        <div class="el-row">
          <div
            v-for="item in lifestyle"
            :key="item.type"
            class="el-col el-col-24 el-col-sm-8 el-col-md-6 el-col-lg-4"
          >
            <div class="lifestyle-item">
              <div class="lifestyle-item__intr">
                <span>{{ item.type | lifestyleText }}</span>
                <p>{{ item.brf }}</p>
              </div>
              <div class="lifestyle-item__desc">
                <p>{{ item.txt }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- hourly start -->
      <div class="hourly">
        <h3 class="weather-title">逐小时预报</h3>
        <el-scrollbar wrap-class="weather-wrap">
          <div class="hourly-wrap">
            <div
              v-for="item in hourly"
              :key="item.time"
              class="hourly-item"
            >
              <p class="hourly-item__time">{{ item.time }}</p>
              <img class="hourly-item__icon" :src="'/static/weather/' + item.cond_code + '.png'" alt="">
              <p class="hourly-item__cond">{{ item.cond_txt }}</p>
              <p class="hourly-item__other">降雨概率 {{ item.pop }}</p>
              <p class="hourly-item__other">{{ item.wind_dir + item.wind_sc }}级</p>
              <p class="hourly-item__other">相对湿度 {{ item.hum }}</p>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <!-- forecast start -->
      <div class="forecast">
        <h3 class="weather-title">未来天气预报</h3>
        <div class="forecast-info clearfix">
          <div
            v-for="(item,index) in forecast"
            v-cloak
            :key="item.date"
            class="forecast-item"
            :class="index === 0 ? 'current' : ''"
          >
            <p class="forecast-item__date">{{ item.date }}</p>
            <p class="forecast-item__cond">{{ item.cond_txt_d }}</p>
            <img class="forecast-item__day" :src="'/static/weather/' + item.cond_code_d + '.png'" alt="">
            <img class="forecast-item__night" :src="'/static/weather/' + item.cond_code_n + '.png'" alt="">
            <p class="forecast-item__cond">{{ item.cond_txt_n }}</p>
            <p class="forecast-item__other">{{ item.wind_dir + item.wind_sc }}级</p>
            <p class="forecast-item__other">降水量 {{ item.pcpn }}</p>
            <p class="forecast-item__other">降水概率 {{ item.pop }}</p>
            <p class="forecast-item__other">紫外线 {{ item.uv_index }}</p>
          </div>
        </div>
        <div id="chart" ref="chartContext" class="forecast-chart" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Weather',
  layout: 'app',
  filters: {
    lifestyleText(style) {
      const lifestyleMap = {
        comf: '舒适度',
        cw: '洗车',
        drsg: '穿衣',
        flu: '感冒',
        sport: '运动',
        trav: '旅游',
        uv: '紫外线',
        air: '空气污染扩散',
        ac: '空调开启',
        ag: '过敏',
        gl: '太阳镜',
        mu: '化妆',
        airc: '晾晒',
        ptfc: '交通',
        fsh: '钓鱼',
        spi: '防晒指数'
      }
      return lifestyleMap[style] + '指数'
    }
  },
  data() {
    return {
      baseUrl: 'https://free-api.heweather.net/s6',
      action: '',
      weatherType: '',
      key: '5a37d479509e43bea5fc74ccc2e5f40c',
      location: 'auto_ip',
      areas: [],
      basic: {},
      update: {},
      now: {
        cond_code: 999
      },
      airs: {},
      forecast: [],
      hourly: [],
      lifestyle: [],
      airVisible: false,
      props: {
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          const { level, value } = node
          axios.get(`//api.timelessq.com/cascade/citys?code=${value || ''}`).then(response => {
            const { data } = response.data
            const nodes = data.map(item => {
              return {
                value: item.value,
                label: item.label,
                leaf: level >= 2
              }
            })
            resolve(nodes)
          })
        }
      }
    }
  },
  computed: {
    apiUrl() {
      return `${this.baseUrl}/${this.action}/${this.weatherType}?location=${this.location}&key=${this.key}`
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.getWeather('now')
      this.getWeather('forecast')
      this.getWeather('hourly')
      this.getWeather('lifestyle')
      this.getAirQuality()
    },
    getWeather(type) {
      this.action = 'weather'
      this.weatherType = type
      axios.get(this.apiUrl).then(response => {
        const data = response.data.HeWeather6[0] || {}
        const { status, basic, update, now, daily_forecast: forecast, hourly, lifestyle } = data
        if (status !== 'ok') {
          const typeLists = {
            now: '实时天气',
            forecast: '天气预报',
            hourly: '逐小时天气',
            lifestyle: '生活指数'
          }
          this.$notify.error({
            title: '',
            message: `找不着${typeLists[type]}相关信息`
          })
        }
        this.basic = basic
        this.update = update
        this.now = now || this.now
        this.forecast = forecast || this.forecast
        this.hourly = hourly || this.hourly
        this.lifestyle = lifestyle || this.lifestyle
        if (type === 'forecast') this.initChart()
      })
    },
    getAirQuality() {
      this.action = 'air'
      this.weatherType = 'now'
      axios.get(this.apiUrl).then(response => {
        const data = response.data.HeWeather6[0]
        if (data.status !== 'ok') {
          this.$notify.error({
            title: '',
            message: `找不着空气指数相关信息`
          })
        }
        this.airs = data.air_now_city || {}
      })
    },
    getAlarmInfo() {
      this.action = 'alarm'
      this.weatherType = '../'
      axios.get(this.apiUrl).then(response => {
        const data = response.data.HeWeather6
        this.alarms = data
      })
    },
    async initChart() {
      // 引入 ECharts 主模块
      const echarts = await import(/* webpackChunkName: "chunk-aplayer" */'echarts/lib/echarts')
      // 引入折线图
      await import(/* webpackChunkName: "chunk-aplayer" */'echarts/lib/chart/line')
      const xAxisData = []
      const maxTem = []
      const minTem = []
      this.forecast.forEach(item => {
        xAxisData.push(item.date)
        maxTem.push(parseInt(item.tmp_max))
        minTem.push(parseInt(item.tmp_min))
      })
      const yAxisMin = Math.min.apply(null, minTem)
      const yAxisMax = Math.max.apply(null, maxTem)
      const myChart = echarts.init(this.$refs.chartContext, 'light')
      myChart.setOption({
        color: ['#FFB800', '#1E9FFF'],
        grid: {
          width: '100%',
          height: '120px',
          left: 0,
          top: '30px',
          right: 0,
          bottom: '10px'
        },
        xAxis: {
          show: false,
          data: xAxisData
        },
        yAxis: {
          show: false,
          min: yAxisMin,
          max: yAxisMax
        },
        series: [
          {
            name: '最高温',
            type: 'line',
            data: maxTem,
            symbol: 'circle',
            symbolSize: 6,
            smooth: true,
            label: {
              show: true,
              formatter: '{c}°C'
            }
          },
          {
            name: '最低温',
            type: 'line',
            data: minTem,
            symbol: 'circle',
            symbolSize: 6,
            smooth: true,
            label: {
              show: true,
              formatter: '{c}°C'
            }
          }
        ]
      })
    },
    handleSearch() {
      const areas = this.$refs.chinaAreas.getCheckedNodes()[0].pathLabels
      this.location = areas ? areas[areas.length - 1].replace(/市|区/, '') : ''
      if (this.location) this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.weather{
  .background{
    position: fixed;
    z-index: -1;
    width: 100%;
    height: 100%;
    background: url('/static/weather/background.jpg') no-repeat center;
    background-size: cover;
    opacity: .6;
  }
  .location{
    line-height: 50px;
    text-align: right;
    &-map{
      margin-right: 15px;
      color: $primary;
      font-size: 15px;
      vertical-align: middle;
    }
  }
  &-title{
    padding: 15px;
    border-bottom: 1px solid #f7f7f7;
    color: #303133;
    font-size: 16px;
    font-weight: 100;
    line-height: 1;
    &:before{
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      margin-right: 5px;
      background-color: $primary;
      border-radius: 50%;
      vertical-align: middle;
    }
  }
  .realtime{
    position: relative;
    padding: 15px 0;
    &__updatetime{
      color: #909399;
      font-size: 14px;
    }
    &-main{
      padding: 15px 0 5px;
      &__tem{
        color: $primary;
        font-size: 80px;
        font-weight: 100;
        line-height: 1em;
      }
      &__cond{
        color: #303133;
      }
      &__wea{
        position: absolute;
        right: 0;
        top: 50%;
        height: 160px;
        margin-top: -80px;
      }
    }
    &-air{
      padding-bottom: 5px;
      &__quality{
        padding: 3px 5px;
        background-color: #67C23A;
        color: #fff;
        font-size: 14px;
        border-radius: 15px;
        i{
          font-size: 16px;
        }
      }
    }
    &-wind, &-other{
      color: #606266;
      line-height: 2em;
      span{
        margin-right: 5px;
      }
    }
  }
  .lifestyle{
    overflow: hidden;
    margin-top: 10px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    &-item{
      overflow: hidden;
      height: 120px;
      border-right: 1px solid #f7f7f7;
      border-bottom: 1px solid #f7f7f7;
      &:hover{
        .lifestyle-item__intr{
          margin-top: -110px;
        }
      }
      &__intr{
        height: 90px;
        padding: 10px;
        text-align: center;
        transition: margin-top .3s;
        span{
          display: inline-block;
          padding-top: 30px;
          color: #303133;
        }
        p{
          color: #606266;
          font-size: 14px;
          line-height: 1.7;
        }
      }
      &__desc{
        height: 90px;
        padding: 15px;
        p{
          font-size: 13px;
          line-height: 1.5;
          color: #606266;
        }
      }
    }
  }
  .hourly{
    margin-top: 15px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    user-select: none;
    &-wrap{
      width: 300%
    }
    &-item{
      float: left;
      width: 130px;
      padding: 15px 0;
      text-align: center;
      &:hover{
        background-color: #f7f7f7;
      }
      p{
        font-size: 15px;
        line-height: 1.5;
      }
      &__time{
        width: 100px;
        margin: 0 auto;
        color: #606266;
        font-size: 14px;
        line-height: 1.5;
      }
      &__cond{
        padding-bottom: 10px;
        color: $primary;
      }
      &__other{
        color: #909399;
      }
      &__icon{
        width: 50px;
      }
    }
  }
  .forecast{
    overflow: hidden;
    position: relative;
    margin: 15px 0;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    &-item{
      float: left;
      width: 14.36%;
      margin-left: -1px;
      padding: 15px 0;
      text-align: center;
      border-left: 1px solid #f7f7f7;
      box-sizing: border-box;
      &.current{
        background-color: #ecf5ff;
      }
      p{
        margin-bottom: 10px;
        font-size: 14px;
      }
      &__date{
        margin-bottom: 10px;
        color: #303133;
        font-size: 15px;
      }
      &__cond{
        color: $primary;
      }
      &__other{
        color: #909399;
      }
      img{
        display: block;
        width: 30%;
        margin: 0 auto;
      }
      &__day{
        padding-bottom: 180px;
      }
      &__night{
        padding-bottom: 10px;
      }
    }
    &-chart{
      display: block;
      position: absolute;
      left: 0;
      top: 175px;
      width: 100%;
      height: 160px;
    }
  }
}
</style>
