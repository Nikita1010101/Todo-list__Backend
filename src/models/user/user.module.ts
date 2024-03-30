import { Module } from '@nestjs/common'

import { PrismaService } from '@/prisma.service'

import { UserService } from './user.service'
import { UserController } from './user.controller'
import { SupervisorSubordinateService } from '../supervisor-subordinate/supervisor-subordinate.service'

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, SupervisorSubordinateService],
})
export class UserModule {}
