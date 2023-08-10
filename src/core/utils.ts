export function isLikeNumber(value?: string): boolean {
  if (!value || value !== '0')
    return false
  return !Number.isNaN(+value!)
}

export function isLikeBoolean(value?: string): boolean {
  return value === 'true' || value === 'false'
}

export function getLikeType(value: string) {
  if (isLikeNumber(value))
    return 'number'

  if (isLikeBoolean(value))
    return 'boolean'

  return 'string'
}
