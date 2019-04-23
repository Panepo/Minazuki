import express from 'express'
import bodyparser from 'body-parser'
import multer from 'multer'
import { deleteFile, getFilesInFolder } from '../services/storage.service'
import { storage, uploadFile, uploadBase64 } from '../services/upload.service'

const faceRoutes = express.Router()
faceRoutes.use(bodyparser.json())

// @route POST face/addFace
// @desc add face images of user to server
// @access Public
faceRoutes.post('/addFace', async (req, res) => {
  const upload = multer({
    storage: storage
  }).array('fileUpload')
  await uploadFile(upload, req, res)
    .then(result => res.send(result))
    .catch(err => {
      res.status(500).json(err)
    })
})

// @route POST face/addFace64
// @desc add face images of base 64 of user to server
// @access Public
faceRoutes.post('/addFace64', async (req, res) => {
  await uploadBase64(req.body.upload)
    .then(result => res.send(result))
    .catch(err => {
      res.status(500).json(err)
    })
})

// @route POST face/deleteFace
// @desc remove a face images of user on server
// @access Public
faceRoutes.post('/deleteFace', async (req, res) => {
  if (req.body.user && req.body.filename) {
    await deleteFile(req.body.user, req.body.filename)
      .then(() => res.json('ok'))
      .catch(err => {
        res.status(500).json(err)
      })
  } else {
    res.status(500).json({
      error: 'User or filename is required'
    })
  }
})

// @route GET face/getFace
// @desc get all face images of user on server
// @access Public
faceRoutes.get('/getFace', (req, res) => {
  if (req.query.user) {
    const result = getFilesInFolder(req.query.user)
    if (result) {
      res.send(result)
    } else {
      res.status(404).json({
        error: 'User not found'
      })
    }
  } else {
    res.status(500).json({
      error: 'User name is required'
    })
  }
})

export default faceRoutes
