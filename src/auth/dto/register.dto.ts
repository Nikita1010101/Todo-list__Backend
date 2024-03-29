import { IsArray, IsString,  } from 'class-validator'

import { LoginDto } from './login.dto'

export class RegisterDto extends LoginDto {
  @IsString()
  name: string

  @IsString()
  surname: string

  @IsString()
  patronymic: string

  @IsArray()
  supervisorsId: number[]

  @IsArray()
  subordinatesId: number[]
}
