import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { User } from '@prisma/client'

import { Auth } from '@/common/decorators/auth.decorator'
import { CurrentUser } from '@/common/decorators/user.decorator'

import { TaskService } from './task.service'
import { TaskDto } from './task.dto'

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @Auth()
  async getAll(@CurrentUser() user: User) {
    return await this.taskService.getAll(user.id)
  }

  @Post()
  @Auth()
  async create(
    @CurrentUser() user: User,
    @Body() dto: Omit<TaskDto, 'creatorId'>,
  ) {
    return this.taskService.create({ creatorId: user.id, ...dto })
  }

  @Patch('/:taskId')
  @Auth()
  async update(
    @Param('taskId') taskId: string,
    @Body() dto: Omit<TaskDto, 'creatorId' | 'userId'>,
  ) {
    return this.taskService.update(+taskId, dto)
  }

  @Delete('/:taskId')
  @Auth()
  async delete(@Param('taskId') taskId: string) {
    return this.taskService.delete(+taskId)
  }
}
