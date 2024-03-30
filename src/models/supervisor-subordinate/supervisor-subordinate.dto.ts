import { IsNumber } from 'class-validator'

export class SupervisorSubordinateDto {
  @IsNumber()
  supervisorId: number

  @IsNumber()
  subordinateId: number
}
