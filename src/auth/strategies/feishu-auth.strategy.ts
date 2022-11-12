import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { FastifyRequest } from 'fastify'
import { Strategy } from 'passport-custom'
import { AuthService } from '../auth.service'

@Injectable()
export class FeishuStrategy extends PassportStrategy(Strategy, 'feishu') {
  constructor(private authService: AuthService) {
    super()
  }
  async validate(req: FastifyRequest): Promise<PayLoad> {
    const query: any = req.query
    const user = await this.authService.validateFeiShuUser(query.code as string)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
