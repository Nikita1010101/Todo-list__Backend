import { IsString, MinLength } from 'class-validator'

export class LoginDto {
  @IsString()
  email: string

  @MinLength(6, { message: 'Is not correct password!' })
  @IsString()
  password: string
}
