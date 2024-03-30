import { Controller, Get, Param } from '@nestjs/common'

import { Auth } from '@/common/decorators/auth.decorator'

import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId/subordinates')
  @Auth()
  async getAllSubordinates(@Param('userId') userId: string) {
    return this.userService.getAllSubordinates(+userId)
  }

  @Get(':userId/supervisors')
  @Auth()
  async getAllSupervisors(@Param('userId') userId: string) {
    return this.userService.getAllSupervisors(+userId)
  }
}
