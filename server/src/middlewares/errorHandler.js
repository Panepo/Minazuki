import { INTERNAL_SERVER_ERROR } from 'http-status-codes'
import { sendError } from '../helpers/error.helper'

const errorHandler = (err, req, res, next) => {
  if (!err) return next()

  sendError(err)

  if (res.headersSent) return next(err)
  res.status(INTERNAL_SERVER_ERROR).send('Internal server error')
}

export default errorHandler
