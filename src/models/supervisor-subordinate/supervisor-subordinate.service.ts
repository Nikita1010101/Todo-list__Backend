import { BadRequestException, Injectable } from '@nestjs/common'

import { PrismaService } from '@/prisma.service'

@Injectable()
export class SupervisorSubordinateService {
  constructor(private readonly prisma: PrismaService) {}

  async createManySubordinates(supervisorId: number, subordinateIds: number[]) {
    return await this.prisma.supervisor_subordinate.createMany({
      data: subordinateIds.map((subordinateId) => ({
        supervisorId,
        subordinateId,
      })),
    })
  }

  async createManySupervisors(subordinateId: number, supervisorIds: number[]) {
    return await this.prisma.supervisor_subordinate.createMany({
      data: supervisorIds.map((supervisorId) => ({
        supervisorId,
        subordinateId,
      })),
    })
  }

  async create(supervisorId: number, subordinateId: number) {
    const result = await this.prisma.supervisor_subordinate.create({
      data: {
        subordinateId,
        supervisorId,
      },
    })

    if (result) throw new BadRequestException('Field yet exist!')

    return result
  }

  async delete(supervisorId: number, subordinateId: number) {
    const result = await this.prisma.supervisor_subordinate.findFirst({
      where: { subordinateId, supervisorId },
    })

    if (!result) throw new BadRequestException('Field does not exist!')

    return await this.prisma.supervisor_subordinate.delete({
      where: { id: result.id },
    })
  }

  async deleteManyBySupervisorId(supervisorId: number) {
    await this.prisma.supervisor_subordinate.deleteMany({
      where: { supervisorId },
    })
  }

  async deleteManyBySubordinateId(subordinateId: number) {
    await this.prisma.supervisor_subordinate.deleteMany({
      where: { subordinateId },
    })
  }

  async getAllBySupervisorId(supervisorId: number) {
    return await this.prisma.supervisor_subordinate.findMany({
      where: { supervisorId },
    })
  }

  async getAllBySubordinateId(subordinateId: number) {
    return await this.prisma.supervisor_subordinate.findMany({
      where: { subordinateId },
    })
  }
}
