import { Body, Controller, Post } from '@nestjs/common'

import { Auth } from '@/common/decorators/auth.decorator'

import { SupervisorSubordinateService } from './supervisor-subordinate.service'
import { SupervisorSubordinateDto } from './supervisor-subordinate.dto'

@Controller('supervisor-subordinate')
export class SupervisorSubordinateController {
  constructor(
    private readonly supervisorSubordinateService: SupervisorSubordinateService,
  ) {}

  @Post('create')
  @Auth()
  async create(@Body() dto: SupervisorSubordinateDto) {
    return this.supervisorSubordinateService.create(
      dto.supervisorId,
      dto.subordinateId,
    )
  }

  @Post('delete')
  @Auth()
  async delete(@Body() dto: SupervisorSubordinateDto) {
    return this.supervisorSubordinateService.delete(
      dto.supervisorId,
      dto.subordinateId,
    )
  }
}
