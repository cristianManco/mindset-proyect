import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  IsEnum,
} from 'class-validator';
import { Document } from 'mongoose';

export enum UserRoles {
  SUPER_ADMIN = 'cristian',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  CODER = 'coder',
}

@Schema({ timestamps: true })
export class Admin extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @IsNotEmpty()
  @Prop({ required: true })
  documento: number;

  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  @Prop({ required: true })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 130)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'The password is not secure enough try with more characters',
  })
  @Prop({ required: true })
  password: string;

  @IsOptional()
  @IsEnum(UserRoles)
  @Prop({ type: String, enum: UserRoles, default: UserRoles.CODER })
  role: UserRoles;

  createdAt?: Date;
  updatedAt?: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
