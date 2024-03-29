import { Module } from '@nestjs/common'

import { PrismaService } from '@/prisma.service'

import { SupervisorSubordinateService } from './supervisor-subordinate.service'

@Module({
  providers: [PrismaService, SupervisorSubordinateService],
})
export class SupervisorSubordinateModule {}
