import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common'
import { Request, Response } from 'express'

import { REFRESH_TOKEN } from '@/common/constants/token.constant'

import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { RefreshDto } from './dto/refresh-token.dto'
import { Auth } from '../common/decorators/auth.decorator'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Delete('delete')
  @Auth()
  async delete(@Req() req: Request) {
    const { refreshToken } = req.cookies as RefreshDto
    return await this.authService.delete(refreshToken)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.login(dto)
    res.cookie(REFRESH_TOKEN, data.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    })

    return data
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @Auth()
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { refreshToken } = req.cookies as RefreshDto
    await this.authService.logout(refreshToken)
    res.clearCookie(REFRESH_TOKEN)
  }

  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken } = req.cookies as RefreshDto
    const data = await this.authService.refresh(refreshToken)
    res.cookie(REFRESH_TOKEN, data.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    })

    return data
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async registration(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.register(dto)
    res.cookie(REFRESH_TOKEN, data.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    })

    return data
  }
}
