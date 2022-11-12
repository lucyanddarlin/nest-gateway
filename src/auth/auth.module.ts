import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '@/user-center/user/user.module'
import { JwtStrategy } from './strategies/jwt-auth.strategy'
import { FeishuStrategy } from './strategies/feishu-auth.strategy'
import { jwtConstants } from './constants'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FeishuStrategy],
})
export class AuthModule {}
