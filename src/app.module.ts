// Código para la aplicación de la cadena de hoteles
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './develop/persistence/db_config';
import { PersistenceModule } from './develop/persistence/persistence.module';
import { AuthModule } from './develop/auth/auth.module';
import { AdminModule } from './modules/Users/User.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './develop/auth/Guard/jwt.guard';
import { CoderModule } from './modules/coders/coder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [dbConfig],
      isGlobal: true,
    }),
    AdminModule,
    CoderModule,
    AuthModule,
    PersistenceModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
