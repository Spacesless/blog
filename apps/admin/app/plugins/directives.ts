import { elHeightAdaptiveTable } from '~/directives/el-table-adaptive'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('el-height-adaptive-table', elHeightAdaptiveTable)
})
