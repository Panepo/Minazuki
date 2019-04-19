import express from 'express'
import bodyparser from 'body-parser'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Auth from '../models/auth'
import {
  validateLoginInput,
  validateRegisterInput
} from '../helpers/auth.helper'
import { environment } from '../environment/environment'
import { sendError } from '../helpers/generic.helper'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw'

const authRoutes = express.Router()
authRoutes.use(bodyparser.json())

// @route POST auth/register
// @desc Register user
// @access Public
authRoutes.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }

  Auth.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' })
    }

    const newUser = new Auth({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      admin: false
    })

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err
        newUser.password = hash
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => sendError(err))
      })
    })
  })
})

// @route POST auth/login
// @desc Login user and return JWT token
// @access Public
authRoutes.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }

  const email = req.body.email
  const password = req.body.password

  Auth.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ emailnotfound: 'Email not found' })
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          admin: user.admin
        }

        jwt.sign(
          payload,
          environment.jwtSecret,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            })
          }
        )
        user.date = dayjs()
        user.save().catch(err => sendError(err))
      } else {
        return res.status(400).json({ passwordincorrect: 'Password incorrect' })
      }
    })
  })
})

export default authRoutes
