import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './entities/User.entity';
import { AdminController } from './controllers/User.controller';
import { AdminService } from './services/User.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Admin.name,
        schema: AdminSchema,
      },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
