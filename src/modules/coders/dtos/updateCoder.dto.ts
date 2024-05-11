import { PartialType } from '@nestjs/mapped-types';
import { CreateCoderDto } from './createCoder.dto';

export class UpdateCoderDto extends PartialType(CreateCoderDto) {}
