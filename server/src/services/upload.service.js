import multer from 'multer'
import { readFileSync, unlinkSync, writeFile } from 'fs'
import { join } from 'path'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw'
import sharp from 'sharp'
import { dataFolder } from './storage.service'
import { sendError } from '../helpers/generic.helper'

sharp.cache(false)

export const storage = multer.diskStorage({
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

export async function uploadFile(upload, req, res) {
  return new Promise(async (resolve, reject) => {
    await upload(req, res, async err => {
      if (err) {
        sendError(err)
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
              .resize(256, 256)
              .toFile(newPath)
              .then(() => {
                result.push(`/data/${req.body.user}/${file.filename}`)
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

export async function uploadBase64(upload) {
  const fileName = `${upload.user}_${dayjs()}.jpg`
  const imgPath = join(dataFolder, upload.user, fileName)
  const content = upload.content.split(',')[1]
  return new Promise(async (resolve, reject) => {
    writeFile(imgPath, content, 'base64', err => {
      if (err) {
        sendError(err)
        reject(new Error(err))
      }
      resolve([`/data/users/${upload.user}/${fileName}`])
    })
  })
}
