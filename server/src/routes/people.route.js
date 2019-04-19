import express from 'express'
import bodyparser from 'body-parser'
import {
  dataFolder,
  getFolder,
  createFolder,
  deleteFolder,
  renameFolder
} from '../services/storage.service'

const peopleRoutes = express.Router()
peopleRoutes.use(bodyparser.json())

// @route GET face/getPeople
// @desc get people list from the server
// @access Public
peopleRoutes.get('/getPeople', (req, res) => {
  const result = getFolder(dataFolder)
  res.send(result)
})

// @route POST face/addPeople
// @desc add people list to the server
// @access Public
peopleRoutes.post('/addPeople', (req, res) => {
  if (req.body.name) {
    const result = createFolder(req.body.name)
    if (result) {
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

// @route POST face/deletePeople
// @desc delete people on the server
// @access Public
peopleRoutes.post('/deletePeople', async (req, res) => {
  if (req.body.name) {
    await deleteFolder(req.body.name)
      .then(() => res.json('ok'))
      .catch(err =>
        res.status(500).json({
          error: err
        })
      )
  } else {
    res.status(500).json({
      error: 'User name is required'
    })
  }
})

// @route POST face/renamePeople
// @desc rename people on the server
// @access Public
peopleRoutes.post('/renamePeople', async (req, res) => {
  if (req.body.name && req.body.newName) {
    await renameFolder(req.body.name, req.body.newName)
      .then(() => res.json('ok'))
      .catch(err =>
        res.status(500).json({
          error: err
        })
      )
  } else {
    res.status(500).json({
      error: 'User name is required'
    })
  }
})

export default peopleRoutes
