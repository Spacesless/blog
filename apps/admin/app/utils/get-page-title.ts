const title = 'Timeless · Admin'

export default function getPageTitle(pageTitle?: string): string {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return title
}
