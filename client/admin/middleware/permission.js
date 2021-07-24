import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

const whiteList = ['/login'] // no redirect whitelist

export default async function({ redirect, store, route }) {
  const { meta, path } = route
  // set page title
  document.title = getPageTitle(meta[meta.length - 1]?.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (path === '/login') {
      // if is logged in, redirect to the home page
      redirect({ path: '/' })
    } else {
      const hasGetUserInfo = store.getters.userinfo.username
      if (!hasGetUserInfo) {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          store.dispatch('list/getCategory')
          store.dispatch('config/getConfigs')
        } catch (error) {
          console.error(error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error('Permission Has Error')
          redirect(`/login?redirect=${path}`)
        }
      }
    }
  } else {
    /* has no token*/
    if (!whiteList.includes(path)) {
      // other pages that do not have permission to access are redirected to the login page.
      redirect(`/login?redirect=${path}`)
    }
  }
}
