import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token, expires) {
  const maxAge = expires.maxAge / 24 / 3600 / 1000
  return Cookies.set(TokenKey, token, { expires: maxAge })
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
