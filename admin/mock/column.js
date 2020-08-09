import Mock from 'mockjs'

const Column = []
const count = 18

for (let i = 0; i < count; i++) {
  var class1 = null
  var class2 = null
  var class3 = null
  if (i < 6) {
    class1 = i + 1
    class2 = null
    class3 = null
  } else if (i >= 6 && i < 12) {
    class1 = i - 5
    class2 = i + 1
    class3 = null
  } else {
    class1 = i - 11
    class2 = i - 5
    class3 = i + 1
  }
  Column.push(Mock.mock({
    id: i + 1,
    order: 0,
    name: '@csentence(3)',
    foldername: '@word(5)',
    class1: class1,
    class2: class2,
    class3: class3,
    classtype: class2 ? (class3 ? 3 : 2) : 1,
    module: i % 6,
    keyword: '@cparagraph(2)',
    description: '@cparagraph(3)',
    listorder: 1,
    ishow: 1,
    nav: '@natural(0, 1)'
  }))
}

export default [
  {
    url: '/column/list',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: Column
      }
    }
  },

  {
    url: '/column/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/column/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
