import { Global, Module, Scope } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'

import { ErrorModule } from './errors/error.module'
import { LoggingInterceptor } from './interceptors'

@Global()
@Module({
  imports: [ErrorModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: LoggingInterceptor
    }
  ]
})
export class SharedModule {}
