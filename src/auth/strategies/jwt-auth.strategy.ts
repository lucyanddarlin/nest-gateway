import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { jwtConstants } from '../constants'

import { FastifyRequest } from 'fastify'

const cookieExtractor = function (req: FastifyRequest) {
  let token = null
  if (req && req.cookies) {
    token = req.cookies['jwt']
  }
  return token
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: jwtConstants.ignoreExpiration,
      secretOrKey: jwtConstants.secret,
    })
  }

  async validate(payload: PayLoad): Promise<PayLoad> {
    return { ...payload }
  }
}
