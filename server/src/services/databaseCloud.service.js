import MongoClient from 'mongodb'
import { environment } from '../environment/environment'
import { sendError } from '../helpers/error.helper'
import logger from './logger.service'

const databaseKey = 'databaseCloud'
const database = environment[databaseKey]

const CONNECTION_URL = `mongodb+srv://${database.username}:${database.password}@${database.connection}`
// const DATABASE_NAME = database.name;

// MONGO_DB_ATLAS
const initMongoAtlas = () => {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (err, client) => {
      if (err) {
        sendError(err)
        process.exit(1)
      }
      logger.info('> MongoDB Atlas connected...')
    }
  )
}

export default initMongoAtlas
