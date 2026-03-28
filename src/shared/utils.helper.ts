/**
 * Checks if an object is empty
 *
 * @param objectName Object to check
 * @returns {boolean} boolean
 */
export const isEmptyObject = (objectName: object): boolean => {
  return objectName && Object.keys(objectName).length === 0 && objectName.constructor === Object
}

export const anonymizeIp = (ip: string): string => {
  if (!ip) return 'unknown'

  if (ip.includes('.') && !ip.includes(':')) {
    const parts = ip.split('.')
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.x.x`
    }
  }

  if (ip.includes(':')) {
    return ip.substring(0, 20) + '...'
  }

  return 'unknown'
}
