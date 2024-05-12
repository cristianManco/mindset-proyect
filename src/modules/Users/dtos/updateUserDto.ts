import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './createUserDto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}
