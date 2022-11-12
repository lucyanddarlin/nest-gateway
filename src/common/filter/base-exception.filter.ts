import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()
    request.log.error(exception)
    // 非 http 异常捕获
    response.status(HttpStatus.SERVICE_UNAVAILABLE).send(
      Object.assign(
        { status: HttpStatus.SERVICE_UNAVAILABLE },
        exception['data'] ? exception['data'] : exception,
        {
          timestamp: new Date().toISOString(),
          path: request.url,
          type: 'SERVICE ERROR',
        },
      ),
    )
  }
}
