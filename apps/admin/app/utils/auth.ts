import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken(): string | undefined {
  return Cookies.get(TokenKey)
}

export function setToken(token: string, expires?: { maxAge?: number }): string | undefined {
  if (expires?.maxAge) {
    const days = expires.maxAge / 24 / 3600 / 1000
    return Cookies.set(TokenKey, token, { expires: days })
  }
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
