import { Roles } from './../../../develop/decorators/roles.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminService } from '../services/User.service';
import { CreateAdminDto, UpdateAdminDto } from '../dtos/exports';

@ApiTags('Admins')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Roles('admin')
  @Post('new')
  async create(@Body() createAdminDto: CreateAdminDto) {
    return await this.service.create(createAdminDto);
  }

  @Roles('admin, teacher')
  @Get('all')
  async findAll() {
    return await this.service.findAll();
  }

  @Roles('teacher')
  @Get(':id')
  async findOne(@Param('_id') id: string) {
    return await this.service.findOne(id);
  }

  @Roles('admin')
  @Put(':id')
  async update(
    @Param('_id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return await this.service.update(id, updateAdminDto);
  }

  @Roles('cristian')
  @Delete(':id')
  async remove(@Param('_id') id: string) {
    return await this.service.remove(id);
  }
}
