import { BUSINESS_ERROR_CODES } from '@/common/filter/business.error.codes'
import { BusinessException } from '@/common/filter/business.exception'
import {
  getAppToken,
  getUserToken,
  refreshUserToken,
} from '@/helper/feishu/auth'
import { message } from '@/helper/feishu/message'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cache } from 'cache-manager'
import { GetUserTokenDto } from './feishu.dto'

@Injectable()
export class FeishuService {
  private APP_TOKEN_CACHE_KEY
  private USER_TOKEN_CACHE_KEY
  private USER_REFRESH_TOKEN_CACHE_KEY
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.APP_TOKEN_CACHE_KEY = this.configService.get('APP_TOKEN_CACHE_KEY')
    this.USER_TOKEN_CACHE_KEY = this.configService.get('USER_TOKEN_CACHE_KEY')
    this.USER_REFRESH_TOKEN_CACHE_KEY = this.configService.get(
      'USER_REFRESH_TOKEN_CACHE_KEY',
    )
  }

  async getAppToken() {
    let appToken: string
    appToken = await this.cacheManager.get(this.APP_TOKEN_CACHE_KEY)

    if (!appToken) {
      const response = await getAppToken()
      if (response.code === 0) {
        // token 有效期为 2 小时，在此期间调用该接口 token 不会发生改变，
        // 当 token 有效期小于 30 分钟时，再次请求 token 的时候，会生成一个新的 token
        // 与此同时，旧的 token 依旧有效
        appToken = response.app_access_token
        await this.cacheManager.set(this.APP_TOKEN_CACHE_KEY, appToken, {
          ttl: response.expire - 60,
        })
      } else {
        throw new BusinessException('飞书调用异常')
      }
    }
    return appToken
  }

  async sendMessage(receive_id_type, params) {
    const app_token = await this.getAppToken()
    return message(receive_id_type, params, app_token)
  }

  async getUserToken(code: string) {
    const app_token = await this.getAppToken()
    const params: GetUserTokenDto = {
      code,
      app_token,
    }
    const res: any = await getUserToken(params)
    if (res.code !== 0) {
      throw new BusinessException(res.msg)
    }
    await this.setUserCacheToken(res.data)
    return res.data
  }

  async setUserCacheToken(tokenInfo: any) {
    const {
      refresh_token,
      access_token,
      user_id,
      expires_in,
      refresh_expires_in,
    } = tokenInfo
    await this.cacheManager.set(
      `${this.USER_TOKEN_CACHE_KEY}_${user_id}`,
      access_token,
      { ttl: expires_in - 60 },
    )

    await this.cacheManager.set(
      `${this.USER_REFRESH_TOKEN_CACHE_KEY}_${user_id}`,
      refresh_token,
      { ttl: refresh_expires_in - 60 },
    )
  }

  async getCacheUserToken(userId: any) {
    let userToken = await this.cacheManager.get(
      `${this.USER_TOKEN_CACHE_KEY}_${userId}`,
    )
    if (!userToken) {
      const refreshToken: string = await this.cacheManager.get(
        `${this.USER_REFRESH_TOKEN_CACHE_KEY}_${userId}`,
      )
      if (!refreshToken) {
        throw new BusinessException({
          code: BUSINESS_ERROR_CODES.TOKEN_INVALID,
          message: 'token 已过期',
        })
      }
      // 根据 refresh_token 更新用户 token 信息
      const userTokenInfo = await this.getUserTokenByRefreshToken(refreshToken)
      await this.setUserCacheToken(userTokenInfo)
      userToken = userTokenInfo.access_token
      return userToken
    }
    return userToken
  }

  async getUserTokenByRefreshToken(refresh_token: string) {
    return await refreshUserToken({
      refresh_token,
      app_token: await this.getAppToken(),
    })
  }
}
