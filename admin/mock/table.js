import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@title(10)',
    'status|1': ['未审核', '已审核'],
    author: '@name()',
    display_time: '@datetime'
  }]
})

const Comment = []
const count = 100
for (let i = 0; i < count; i++) {
  Comment.push(Mock.mock({
    id: '@increment',
    title: '@csentence(20, 30)',
    status: '@integer(0, 1)',
    username: '@name()',
    updatetime: '@datetime'
  }))
}

const Message = []
for (let i = 0; i < 30; i++) {
  Message.push(Mock.mock({
    id: '@increment',
    title: '@csentence(20, 30)',
    status: '@integer(0, 1)',
    'type|1': ['修改意见', '申请友链', '版权问题', '其它'],
    updatetime: '@datetime'
  }))
}

const Recycle = []
for (let i = 0; i < 68; i++) {
  Recycle.push(Mock.mock({
    id: '@increment',
    title: '@csentence(20, 30)',
    class: '@integer(1, 15)',
    classname: '@ctitle(5)',
    deletetime: '@datetime'
  }))
}

const avatar = 'https://www.gravatar.com/avatar/fbb31d99a24cf9a56c48b44dd0797d22?s=400&d=mm&r=g'
const Links = []
for (let i = 0; i < 18; i++) {
  Links.push(Mock.mock({
    id: '@increment',
    webname: '@csentence(10, 15)',
    weburl: '@url',
    weblogo: avatar,
    info: '@cparagraph',
    addtime: '@datetime',
    order: i
  }))
}

const Member = []
for (let i = 0; i < 18; i++) {
  Member.push(Mock.mock({
    id: '@increment',
    username: '@last',
    nickname: '@cname',
    registertime: '@datetime',
    logintime: '@now',
    status: '@integer(0, 1)'
  }))
}

export default [
  {
    url: '/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },

  {
    url: '/comment/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20 } = config.query
      const pageList = Comment.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: Comment.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/message/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20 } = config.query
      const pageList = Message.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: Message.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/recycle/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20 } = config.query
      const pageList = Recycle.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: Recycle.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/links/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 10 } = config.query
      const pageList = Links.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: Links.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/member/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 10 } = config.query
      const pageList = Member.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: Member.length,
          items: pageList
        }
      }
    }
  }
]
