import { ElMessage } from 'element-plus'

const whiteList = ['/login']

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const userStore = useUserStore()
  const listStore = useListStore()
  const configStore = useConfigStore()

  document.title = useGetPageTitle((to.meta?.title as string) || '')

  const hasToken = userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      return navigateTo('/')
    }
    if (!userStore.userinfo.username) {
      try {
        await userStore.getInfo()
        await Promise.all([listStore.getCategory(), configStore.getConfigs()])
      } catch (e) {
        console.error(e)
        userStore.resetToken()
        ElMessage.error('Permission Has Error')
        return navigateTo(`/login?redirect=${to.path}`)
      }
    }
  } else if (!whiteList.includes(to.path)) {
    return navigateTo(`/login?redirect=${to.path}`)
  }
})
