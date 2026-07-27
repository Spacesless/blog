export function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validUsername(str: string): boolean {
  return str.trim().length >= 2
}
