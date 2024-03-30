import { Module } from '@nestjs/common'

import { PrismaService } from '@/prisma.service'

import { SupervisorSubordinateService } from './supervisor-subordinate.service'
import { SupervisorSubordinateController } from './supervisor-subordinate.controller'

@Module({
  providers: [PrismaService, SupervisorSubordinateService],
  controllers: [SupervisorSubordinateController],
})
export class SupervisorSubordinateModule {}
