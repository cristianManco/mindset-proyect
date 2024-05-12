import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../entities/User.entity';
import { CreateAdminDto, UpdateAdminDto } from '../dtos/exports';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private model: Model<Admin>) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    try {
      const existingAdmin = await this.model
        .findOne({ email: createAdminDto.email })
        .exec();
      if (existingAdmin) {
        throw new HttpException(
          'The email address is already registered',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newAdmin = await this.model.create(createAdminDto);
      return await newAdmin;
    } catch (error) {
      throw new HttpException(
        'Error creating the user: ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Admin[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<Admin> {
    const admin = await this.model.findById(id).exec();
    if (!admin) {
      throw new NotFoundException(`user with ID ${id} not found`);
    }
    return admin;
  }

  async findOneByEmail(email: string): Promise<Admin> {
    const admin = await this.model.findOne({ email }).exec();
    if (!admin) {
      throw new NotFoundException(`user with email address ${email} not found`);
    }
    return admin;
  }

  async findOneByEmailRegister(email: string): Promise<Admin> {
    const admin = await this.model.findOne({ email }).exec();
    if (admin) {
      throw new HttpException(
        `user with email   ${email} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return admin;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const updatedAdmin = await this.model
      .findByIdAndUpdate(id, updateAdminDto, { new: true })
      .exec();
    if (!updatedAdmin) {
      throw new NotFoundException(`user with ID ${id} not found`);
    }
    return updatedAdmin;
  }

  async remove(id: string): Promise<void> {
    const admin = await this.model.findByIdAndDelete(id).exec();
    if (!admin) {
      throw new NotFoundException(`user with ID ${id} not found`);
    }
  }
}
