import Mock from 'mockjs'

const List = []
const count = 300

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const imgurl = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    title: '@ctitle(15 , 25)',
    keyword: '@cparagraph(2)',
    description: '@cparagraph(3)',
    content: baseContent,
    class1: '@integer(1, 10)',
    class2: '@integer(1, 10)',
    class3: '@integer(1, 10)',
    imgurl,
    author: 'Timeless',
    hits: '@natural(0, 200)',
    addtime: '@datetime',
    updatetime: '@now',
    display: '@integer(0, 1)'
  }))
}

export default [
  {
    url: '/article/list',
    type: 'get',
    response: config => {
      const { class1, class2, class3, title, page = 1, limit = 20 } = config.query

      const mockList = List.filter(item => {
        if (class1 && item.class1 !== class1) return false
        if (class2 && item.class2 !== class2) return false
        if (class3 && item.class3 !== class3) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

