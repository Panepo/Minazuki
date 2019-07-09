import { existsSync, lstatSync, readdirSync } from 'fs'
import { join } from 'path'

const dataDir = '../../server/data'
export const rootFolder = join(__dirname, '../../')
export const dataFolder = join(__dirname, dataDir)

const isDirectory = source => lstatSync(source).isDirectory()
export const getFolder = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory)
    .map(name =>
      name
        .replace(dataFolder, '')
        .replace(/\\/g, '')
        .replace(/\//g, '')
    )

const isFile = source => !lstatSync(source).isDirectory()
const getFiles = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isFile)
    .map(name => {
      const photo = name.replace(rootFolder, '').replace(/\\/g, '/')
      return !photo.startsWith('/') ? '/' + photo : photo
    })
export const getFilesInFolder = user => {
  const userFolder = join(dataFolder, user)
  if (existsSync(userFolder)) {
    const result = getFiles(userFolder)
    return result
  } else {
    return null
  }
}
const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory)
    .map(name =>
      name
        .replace(dataFolder, '')
        .replace(/\\/g, '')
        .replace(/\//g, '')
    )
    .map(name => {
      return {
        name: name,
        files: getFilesInFolder(name)
      }
    })
export const getAll = () => getDirectories(dataFolder)
