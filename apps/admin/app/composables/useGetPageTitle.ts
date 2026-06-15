import getPageTitle from '~/utils/get-page-title'

export function useGetPageTitle(pageTitle?: string): string {
  return getPageTitle(pageTitle)
}
