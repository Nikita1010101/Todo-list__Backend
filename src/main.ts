import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { PrismaService } from './prisma.service'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  app.setGlobalPrefix('api')
  app.enableCors({ credentials: true, origin: 'http://localhost:3000' })
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(4200)
}
bootstrap()
