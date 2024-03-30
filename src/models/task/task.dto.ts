import { TaskPriority, TaskStatus } from '@prisma/client'
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator'

export class TaskDto {
  @IsOptional()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description: string

  @IsOptional()
  @IsDate()
  deadline: Date

  @IsOptional()
  @IsString()
  priority: TaskPriority

  @IsOptional()
  @IsString()
  status: TaskStatus

  @IsOptional()
  @IsNumber()
  userId: number

  @IsOptional()
  @IsNumber()
  creatorId: number
}
