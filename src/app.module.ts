import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { TaskModule } from './models/task/task.module'
import { UserModule } from './models/user/user.module'
import { CreatorModule } from './models/creator/creator.module'
import { SupervisorSubordinateModule } from './models/supervisor/supervisor-subordinate.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    TaskModule,
    UserModule,
    CreatorModule,
    SupervisorSubordinateModule,
  ],
})
export class AppModule {}
