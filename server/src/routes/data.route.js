import express from 'express'
import bodyparser from 'body-parser'
import { writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { dataFolder } from '../services/storage.service'
import { sendError } from '../helpers/generic.helper'

const dataRoutes = express.Router()
dataRoutes.use(bodyparser.json())

const facesFileName = 'faces.json'

// @route GET data/load
// @desc get faces.json from server
// @access Public
dataRoutes.get('/load', (req, res) => {
  const facesFile = join(dataFolder, facesFileName)
  if (!existsSync(facesFile)) {
    sendError('faces.json is missing')
    return res.status(404).json({ error: 'File not found' })
  }

  delete require.cache[facesFile]
  const result = require(facesFile)
  res.send(result)
})

// @route GET data/save
// @desc save faces.json to server
// @access Public
dataRoutes.post('/save', async (req, res) => {
  const content = JSON.stringify(req.body.data)
  writeFileSync(join(dataFolder, facesFileName), content)
  res.json({ success: true })
})

export default dataRoutes
