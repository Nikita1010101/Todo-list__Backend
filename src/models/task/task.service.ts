import { BadRequestException, Injectable } from '@nestjs/common'

import { PrismaService } from '@/prisma.service'

import { TaskDto } from './task.dto'

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: number) {
    return await this.prisma.task.findMany({
      where: { OR: [{ userId }, { creatorId: userId }] },
      orderBy: { updatedAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            id: true,
            name: true,
            patronymic: true,
            surname: true,
            updatedAt: true,
          },
        },
      },
    })
  }

  async create({ deadline, ...dto }: TaskDto) {
    if (dto.creatorId === dto.userId) {
      throw new BadRequestException('User ID and Creator ID must be different')
    }

    return await this.prisma.task.create({
      data: { deadline: new Date(deadline), ...dto },
    })
  }

  async update(taskId: number, dto: Omit<TaskDto, 'creatorId' | 'userId'>) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      throw new BadRequestException('Task with the given ID not found')
    }

    return await this.prisma.task.update({
      where: { id: taskId },
      data: {
        deadline: dto.deadline ? new Date(dto.deadline) : task.deadline,
        description: dto.description || task.description,
        priority: dto.priority || task.priority,
        status: dto.status || task.status,
        title: dto.title || task.title,
      },
    })
  }

  async delete(taskId: number) {
    return await this.prisma.task.delete({ where: { id: taskId } })
  }
}
