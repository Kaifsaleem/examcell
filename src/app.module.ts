import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigProvider } from './global/providers/config.provider';
import MongooseConnProvider from './global/providers/mongooseConn.provider';
import EventEmitterProvider from './global/providers/eventEmmiter.provider';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AuthMiddleware } from './modules/auth/auth.middleware';

@Module({
  imports: [
     ConfigProvider,
    MongooseConnProvider,
    EventEmitterProvider,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
