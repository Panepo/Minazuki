import { Strategy, ExtractJwt } from 'passport-jwt'
import logger from '../services/logger.service'
import { environment } from '../environment/environment'
import Auth from '../models/auth'

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = environment.jwtSecret

const config = passport => {
  passport.use(
    new Strategy(opts, (jwtPayload, done) => {
      Auth.findById(jwtPayload.id)
        .then(user => {
          if (user) {
            return done(null, user)
          }
          return done(null, false)
        })
        .catch(err => logger.error(err))
    })
  )
}

export default config
