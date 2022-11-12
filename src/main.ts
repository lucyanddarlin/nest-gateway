import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import fastify from 'fastify'
import { AppModule } from './app.module'
import { BaseExceptionFilter } from './common/filter/base-exception.filter'
import { HttpExceptionFilter } from './common/filter/http-exception.filter'
import { WrapResponseInterceptor } from './common/interceptor/wrap-response.interceptor'
import { FastifyLogger } from './common/logger'
import { generateDocument } from './doc'
import fastifyCookie from '@fastify/cookie'
import * as cookieParser from 'cookie-parser'

declare const module: any

async function bootstrap() {
  const fastifyInstance = fastify({
    logger: FastifyLogger,
  })
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance),
  )

  app.register(fastifyCookie, {
    secret: 'my-secret',
  })

  // 接口版本化管理
  app.enableVersioning({ type: VersioningType.URI })
  app.useGlobalInterceptors(new WrapResponseInterceptor())
  app.useGlobalFilters(new BaseExceptionFilter(), new HttpExceptionFilter())
  app.use(cookieParser())
  // 启用全局字段校验，保证请求接口字段校验正确
  app.useGlobalPipes(new ValidationPipe())
  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
  generateDocument(app)
  await app.listen(3000)
}
bootstrap()
