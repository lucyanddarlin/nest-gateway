import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { BusinessException } from './business.exception'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()
    const error =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as object)
    // 处理业务异常
    if (exception instanceof BusinessException) {
      response.status(HttpStatus.OK).send(
        Object.assign(error, {
          data: {},
          timestamp: new Date().toISOString(),
          success: 'false',
          type: 'BUSINESS ERROR',
        }),
      )
      return
    }

    response.status(status).send(
      Object.assign(error, {
        timestamp: new Date().toISOString(),
        path: request.url,
        success: 'false',
        type: 'HTTP ERROR',
      }),
    )
  }
}
