import 'core-js/stable'
import 'regenerator-runtime/runtime'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import passport from 'passport'
import passportConfig from './config/passport'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw'

import initMongoDB from './services/database.service'
import logger from './services/logger.service'

import dataRoutes from './routes/data.route'
import authRoutes from './routes/auth.route'
import peopleRoutes from './routes/people.route'
import faceRoutes from './routes/face.route'

const app = express()

// Days locale
dayjs.locale('zh-tw')

// Database
initMongoDB()

// MIDDLEWARES
if (process.env.NODE_ENV !== 'production') app.use(cors())
app.use(passport.initialize())
passportConfig(passport)
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// ROUTES
app.use('/auth', authRoutes)
app.use('/data', dataRoutes)
app.use('/face', peopleRoutes)
app.use('/face', faceRoutes)

// By using (!module.parent) condition, we avoid EADDRINUSE when testing because app will start once
let startApp = process.env.NODE_ENV != 'test'
if (process.env.NODE_ENV == 'test' && !module.parent) startApp = true

if (startApp) {
  app.listen(3001, () => {
    if (!process.env.NODE_ENV) {
      logger.error(`> No environment !! Server will not start`)
      process.exit(0)
      return
    }

    logger.info('> Listening on port 3001...')
    logger.info(`> Current environment is => ${process.env.NODE_ENV}`)
  })
}

export default app
