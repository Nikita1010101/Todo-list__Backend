import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { hash, verify } from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'

import { PrismaService } from '@/prisma.service'

import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { SupervisorSubordinateService } from '@/models/supervisor-subordinate/supervisor-subordinate.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly supervisorSubordinateService: SupervisorSubordinateService,
  ) {}

  private async checkRefreshToken(refreshToken: string) {
    const result = await this.jwt.verifyAsync<{ id: string }>(refreshToken)
    if (!result) throw new UnauthorizedException('Invalid refresh token!')
    return result
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } })
  }

  async delete(refreshToken: string) {
    const result = await this.checkRefreshToken(refreshToken)
    if (!result) throw new UnauthorizedException('User not authorized!')

    await this.supervisorSubordinateService.deleteManyBySupervisorId(+result.id)
    await this.supervisorSubordinateService.deleteManyBySubordinateId(
      +result.id,
    )

    return await this.prisma.user.delete({ where: { id: +result.id } })
  }

  private async findUserById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new UnauthorizedException('User not exist!')
    return user
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto)
    return await this.generateAuthData(user)
  }

  async refresh(refreshToken: string) {
    const result = await this.checkRefreshToken(refreshToken)
    const user = await this.findUserById(+result.id)
    return await this.generateAuthData(user)
  }

  async register(dto: RegisterDto) {
    const oldUser = await this.findUserByEmail(dto.email)

    if (oldUser) throw new BadRequestException('User yet exist!')

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: await hash(dto.password),
        patronymic: dto.patronymic,
        surname: dto.surname,
      },
    })

    await this.supervisorSubordinateService.createManySubordinates(
      user.id,
      dto.subordinatesId,
    )
    await this.supervisorSubordinateService.createManySupervisors(
      user.id,
      dto.supervisorsId,
    )

    return await this.generateAuthData(user)
  }

  async logout(refreshToken: string) {
    const result = await this.checkRefreshToken(refreshToken)
    return await this.findUserById(+result.id)
  }

  private async issueTokens(userId: number) {
    const data = { id: userId }

    const accessToken = this.jwt.sign(data, { expiresIn: '10m' })
    const refreshToken = this.jwt.sign(data, { expiresIn: '10d' })

    return { accessToken, refreshToken }
  }

  private returnUserFields(user: User) {
    return {
      email: user.email,
      name: user.name,
      surname: user.surname,
      patronymic: user.patronymic,
    }
  }

  private async validateUser(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })
    if (!user) throw new NotFoundException('User not found!')

    const isValid = await verify(user.password, dto.password)
    if (!isValid) throw new UnauthorizedException('Invalid Password!')

    return user
  }

  private async generateAuthData(user: User) {
    const tokens = await this.issueTokens(user.id)

    return { user: this.returnUserFields(user), ...tokens }
  }
}
