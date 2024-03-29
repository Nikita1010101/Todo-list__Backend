import { Module } from '@nestjs/common'

import { CreatorService } from './creator.service'

@Module({
  providers: [CreatorService],
})
export class CreatorModule {}
