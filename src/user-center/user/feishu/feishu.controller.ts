import { Public } from '@/auth/constants'
import {
  Body,
  Controller,
  Post,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FeishuMessageDto, GetUserTokenDto } from './feishu.dto'
import { FeishuService } from './feishu.service'

@ApiTags('飞书')
@Controller('feishu')
export class FeishuController {
  constructor(private readonly feishuService: FeishuService) {}

  @Public()
  @ApiOperation({ summary: '消息推送' })
  @Post('sendMessage')
  @Version([VERSION_NEUTRAL])
  sendMessage(@Body() params: FeishuMessageDto) {
    const { receive_id_type, ...rest } = params
    return this.feishuService.sendMessage(receive_id_type, rest)
  }

  @ApiOperation({ summary: '获取用户凭证' })
  @Post('user_token')
  getUserToken(@Body() params: GetUserTokenDto) {
    const { code } = params
    return this, this.feishuService.getUserToken(code)
  }
}
