import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/prisma.service'

import { SupervisorSubordinateService } from '../supervisor-subordinate/supervisor-subordinate.service'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supervisorSubordinateService: SupervisorSubordinateService,
  ) {}

  async getAllSubordinates(userId: number) {
    const subordinates =
      await this.supervisorSubordinateService.getAllBySupervisorId(userId)

    const subordinatesId = subordinates.map(
      (subordinate) => subordinate.subordinateId,
    )

    return await this.prisma.user.findMany({
      where: {
        id: { in: subordinatesId },
      },
    })
  }

  async getAllSupervisors(userId: number) {
    const supervisors =
      await this.supervisorSubordinateService.getAllBySubordinateId(userId)

    const supervisorsId = supervisors.map(
      (supervisor) => supervisor.supervisorId,
    )

    return await this.prisma.user.findMany({
      where: {
        id: { in: supervisorsId },
      },
    })
  }
}
