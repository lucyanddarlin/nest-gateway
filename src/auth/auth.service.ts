import { UserService } from '@/user-center/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'
import { FeishuService } from '@/user-center/user/feishu/feishu.service'
import { FeishuUserInfo } from '@/user-center/user/feishu/feishu.dto'
import { User } from '@/user-center/user/entities/user.mysql.entity'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private feishuService: FeishuService,
  ) {}

  // 验证飞书用户
  async validateFeiShuUser(code: string): Promise<PayLoad> {
    const feishuInfo: FeishuUserInfo = await this.getFeiShuTokenByApplication(
      code,
    )
    // 将用户信息同步到数据库
    const user: User = await this.userService.createOrUpdateByFeishu(feishuInfo)
    return {
      userId: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      feishuAccessToken: feishuInfo.accessToken,
      feishuUserId: feishuInfo.feishuUserId,
    }
  }

  // jwt 登录
  async login(user: PayLoad) {
    return {
      access_token: this.jwtService.sign(user),
    }
  }

  // 获取飞书用户信息
  async getFeiShuTokenByApplication(code: string) {
    const data = await this.feishuService.getUserToken(code)

    const feishuInfo: FeishuUserInfo = {
      accessToken: data.access_token,
      avatarBig: data.avatar_big,
      avatarMiddle: data.avatar_middle,
      avatarThumb: data.avatar_thumb,
      avatarUrl: data.avatar_url,
      email: data.email,
      enName: data.en_name,
      mobile: data.mobile,
      name: data.name,
      feishuUnionId: data.union_id,
      feishuUserId: data.user_id,
    }
    return feishuInfo
  }
}
