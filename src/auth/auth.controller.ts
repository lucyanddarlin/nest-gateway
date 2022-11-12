import { PayloadUser } from '@/helper'
import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyReply } from 'fastify'
import { AuthService } from './auth.service'
import { Public } from './constants'
import { GetTokenByApplications } from './dto/auth.dto'
import { FeiShuGuard } from './guards/feishu-auth.guard'

@ApiTags('用户认证')
@Controller({ path: 'auth', version: [VERSION_NEUTRAL] })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '飞书 Auth2 授权登录',
    description:
      '通过 code 获取`access_token`https://open.feishu.cn/open-apis/authen/v1/user_auth_page_beta?app_id=cli_a3d080b5fa3ed00c&redirect_uri=http%3A%2F%2Fwww.wanjiacloud.top%2F',
  })
  @UseGuards(FeiShuGuard)
  @Public()
  @Get('/feishu/auth2')
  async getFeiShuTokenByApplications(
    @PayloadUser() user: PayLoad,
    @Res({ passthrough: true }) response: FastifyReply,
    @Query() query: GetTokenByApplications,
  ) {
    const { access_token } = await this.authService.login(user)
    response.setCookie('jwt', access_token, { path: '/' })
    return access_token
  }

  @ApiOperation({
    summary: '解析 token',
    description: '解析 token 信息',
  })
  @Get('token/info')
  async getTokenInfo(@PayloadUser() user: PayLoad) {
    return user
  }
}
