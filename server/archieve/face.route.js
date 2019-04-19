import express from 'express'
import bodyparser from 'body-parser'
import {
  lstatSync,
  readFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
  writeFile,
  unlinkSync
} from 'fs'
import { join } from 'path'
import { rootFolder, dataFolder } from '../services/storage.service'
import rimraf from 'rimraf'
import multer from 'multer'
import sharp from 'sharp'
import { sendError } from '../helpers/generic.helper'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw'

sharp.cache(false)

const faceRoutes = express.Router()
faceRoutes.use(bodyparser.json())

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, dataFolder)
  },
  filename: function(req, file, callback) {
    const fileComponents = file.originalname.split('.')
    const fileExtension = fileComponents[fileComponents.length - 1]
    const filename = `${file.originalname}_${dayjs()}.${fileExtension}`
    callback(null, filename)
  }
})

const getUserPhotos = user => {
  const dataFolder = join(dataFolder, user)
  const isFile = source => !lstatSync(source).isDirectory()
  const getFiles = source =>
    readdirSync(source)
      .map(name => join(source, name))
      .filter(isFile)
      .map(name => {
        const photo = name.replace(rootFolder, '').replace(/\\/g, '/')
        return !photo.startsWith('/') ? '/' + photo : photo
      })
  const result = getFiles(dataFolder)
  return result
}

faceRoutes.get('/getAll', (req, res) => {
  const isDirectory = source => lstatSync(source).isDirectory()
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
          photos: getUserPhotos(name)
        }
      })
  const result = getDirectories(dataFolder)
  res.json(result)
})

faceRoutes.post('/get-photos', (req, res) => {
  const result = getUserPhotos(req.body.user)
  res.json(result)
})

faceRoutes.post('/register', (req, res) => {
  if (req.body.name) {
    const newFolder = join(dataFolder, req.body.name)
    if (!existsSync(newFolder)) {
      mkdirSync(newFolder)
      res.json('ok')
    } else {
      res.status(500).json({
        error: 'User already exists'
      })
    }
  } else {
    res.status(500).json({
      error: 'User name is mandatory.'
    })
  }
})

faceRoutes.post('/delete', async (req, res) => {
  if (req.body.name) {
    const oldFolder = join(dataFolder, req.body.name)
    if (existsSync(oldFolder)) {
      await deleteFolder(oldFolder)
        .then(() => res.json('ok'))
        .catch(e =>
          res.status(500).json({
            error: e
          })
        )
    } else {
      res.status(500).json({
        error: "User doesn't exist"
      })
    }
  } else {
    res.status(500).json({
      error: 'User name is required'
    })
  }
})

faceRoutes.post('/upload', async (req, res) => {
  const upload = multer({
    storage: storage
  }).array('fileUpload')
  await uploadFile(upload, req, res)
    .then(result => res.send(result))
    .catch(err => {
      sendError(err)
      res.status(500).json(err)
    })
})

faceRoutes.post('/uploadBase64', async (req, res) => {
  await uploadBase64(req.body.upload)
    .then(result => res.send(result))
    .catch(err => {
      sendError(err)
      res.status(500).json(err)
    })
})

faceRoutes.post('/deletePhoto', async (req, res) => {
  if (req.body.upload.user && req.body.upload.file) {
    const file = join(dataFolder, req.body.upload.user, req.body.upload.file)
    try {
      unlinkSync(file)
      res.send('ok')
    } catch (e) {
      res.status(500).json({
        error: e
      })
    }
  } else {
    res.status(500).json({
      error: 'User name is required'
    })
  }
})

async function deleteFolder(name) {
  return new Promise(async (resolve, reject) => {
    rimraf(name, err => {
      if (err) {
        reject(new Error(err))
      }
      resolve()
    })
  })
}

async function uploadFile(upload, req, res) {
  return new Promise(async (resolve, reject) => {
    await upload(req, res, async err => {
      if (err) {
        reject(new Error('Error uploading file'))
        return
      }

      const result = []
      await Promise.all(
        req.files.map(async file => {
          try {
            const oldPath = join(dataFolder, file.filename)
            const newPath = join(dataFolder, req.body.user, file.filename)
            const buffer = readFileSync(oldPath)

            await sharp(buffer)
              .resize(320, 247)
              .toFile(newPath)
              .then(() => {
                result.push(`/data/users/${req.body.user}/${file.filename}`)
                try {
                  unlinkSync(oldPath)
                } catch (ex) {
                  sendError(ex)
                }
              })
          } catch (e) {
            reject(e)
            return
          }
        })
      )
      resolve(result)
    })
  })
}

async function uploadBase64(upload) {
  const fileName = `${upload.user}_${dayjs()}.jpg`
  const imgPath = join(dataFolder, upload.user, fileName)
  const content = upload.content.split(',')[1]
  return new Promise(async (resolve, reject) => {
    writeFile(imgPath, content, 'base64', err => {
      if (err) {
        reject(new Error(err))
      }
      resolve([`/data/users/${upload.user}/${fileName}`])
    })
  })
}

export default faceRoutes
