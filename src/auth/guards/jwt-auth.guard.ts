import { BUSINESS_ERROR_CODES } from '@/common/filter/business.error.codes'
import { BusinessException } from '@/common/filter/business.exception'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { IS_PUBLIC_KEY } from '../constants'

const ErrorMsg: any = {
  NO_TOKEN: 'No auth token',
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true
    return super.canActivate(context)
  }

  handleRequest<T = any>(err: any, user: any, info: any): T {
    if (err || !user) {
      if (info.message === ErrorMsg.NO_TOKEN) {
        throw new BusinessException({
          code: 401,
          message: 'No Auth Token',
        })
      }
      throw (
        err ||
        new BusinessException({
          code: BUSINESS_ERROR_CODES.TOKEN_INVALID,
          message: 'token 已失效',
        })
      )
    }
    return user
  }
}
