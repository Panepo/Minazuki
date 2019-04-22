import {
  existsSync,
  mkdirSync,
  lstatSync,
  readdirSync,
  renameSync,
  unlinkSync
} from 'fs'
import { join } from 'path'
import rimraf from 'rimraf'
import { sendError } from '../helpers/generic.helper'

const dataDir = 'data'

// Create the log directory if it does not exist
if (!existsSync(dataDir)) {
  mkdirSync(dataDir)
}

export const rootFolder = join(__dirname, '../../')
export const dataFolder = join(rootFolder, dataDir)

export function createFolder(name) {
  const newFolder = join(dataFolder, name)
  if (!existsSync(newFolder)) {
    mkdirSync(newFolder)
    return true
  } else {
    return false
  }
}

export async function deleteFolder(name) {
  return new Promise(async (resolve, reject) => {
    const oldFolder = join(dataFolder, name)
    if (existsSync(oldFolder)) {
      rimraf(oldFolder, err => {
        if (err) {
          sendError(err)
          reject(new Error(err))
        }
        resolve()
      })
    } else {
      reject(new Error('folder not found'))
    }
  })
}

export async function renameFolder(name, newName) {
  return new Promise(async (resolve, reject) => {
    const oldFolder = join(dataFolder, name)
    const newFolder = join(dataFolder, newName)
    if (!existsSync(oldFolder)) {
      reject(new Error('folder not found'))
    } else if (existsSync(newFolder)) {
      reject(new Error('target folder already exists'))
    } else {
      renameSync(oldFolder, newFolder)
      resolve()
    }
  })
}

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

export async function deleteFile(folder, name) {
  return new Promise(async (resolve, reject) => {
    const file = join(dataFolder, folder, name)
    if (existsSync(file)) {
      try {
        unlinkSync(file)
        resolve()
      } catch (err) {
        sendError(err)
        reject(new Error(err))
      }
    } else {
      reject(new Error('folder not found'))
    }
  })
}
