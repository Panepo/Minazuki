import mongoose from 'mongoose'
import { environment } from '../environment/environment'
import { sendError } from '../helpers/generic.helper'
import logger from './logger.service'

const databaseKey =
  process.env.NODE_ENV === 'testing' ? 'databaseTest' : 'database'
const database = environment[databaseKey]

// MONGO_DB
const initMongoDB = () => {
  const mongoUrl =
    process.env.MONGO_URL ||
    `mongodb://${database.host}:${database.port}/${database.name}`
  mongoose.connect(mongoUrl, { useNewUrlParser: true }, err => {
    if (err) {
      sendError(err)
      process.exit(1)
    }
    logger.info('> MongoDB connected...')
  })
}

export default initMongoDB
