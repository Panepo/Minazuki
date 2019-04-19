import express from 'express'
import bodyparser from 'body-parser'
// import { sendError } from '../helpers/generic.helper'

const faceRoutes = express.Router()
faceRoutes.use(bodyparser.json())

export default faceRoutes
