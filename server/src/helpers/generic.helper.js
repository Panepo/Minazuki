import logger from '../services/logger.service'
import { environment } from '../environment/environment'

export const sendError = err => {
  const message = '> ' + err.message || err.errmsg
  logger.error(message)
  if (environment.production !== 'production') console.log(err)
}

export const hasOwnProperties = (obj, properties) => {
  for (let i = 0; i < properties.length; i++) {
    if (!obj.hasOwnProperty(properties[i])) return false
  }
  return true
}

export function simpleTemplate(string, data) {
  let result = string
  for (const entry in data) {
    if (!entry) continue
    result = result.replace(new RegExp('{' + entry + '}', 'g'), data[entry])
  }
  return result
}

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
