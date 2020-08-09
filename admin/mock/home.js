import Mock from 'mockjs'

const Community = {
  user: 5,
  message: 12,
  comment: 36
}
const Panel = []
const Dashboard = {
  system: 'win 32',
  server: 'nginx',
  nodejs: '10.0',
  thinkjs: '3.2.3',
  mysql: '5.6'
}

for (let i = 0; i < 6; i++) {
  Panel.push(Mock.mock({
    'name|1': ['简介', '文章', '壁纸', '追番', 'webapp', '视频'],
    count: '@integer(50, 300)'
  }))
}

export default [
  {
    url: '/home/panel',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          Community,
          Panel,
          Dashboard
        }
      }
    }
  }
]
