import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coder } from '../entities/coder.entity';
import { CreateCoderDto, UpdateCoderDto } from '../dtos/export';

@Injectable()
export class CoderService {
  constructor(@InjectModel(Coder.name) private model: Model<Coder>) {}

  async create(createCoder: CreateCoderDto): Promise<Coder> {
    try {
      const createdCoder = new this.model(createCoder);
      return createdCoder.save();
    } catch (error) {
      throw new HttpException(
        'Error al crear el Coder',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Coder[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<Coder> {
    const coder = await this.model.findById(id).exec();
    if (!coder) {
      throw new NotFoundException(`Coder with ID ${id} not found`);
    }
    return coder;
  }

  async update(id: string, updateCoder: UpdateCoderDto): Promise<Coder> {
    const updatedCoder = await this.model
      .findByIdAndUpdate(id, updateCoder, { new: true })
      .exec();
    if (!updatedCoder) {
      throw new NotFoundException(`Coder with ID ${id} not found`);
    }
    return updatedCoder;
  }

  async remove(id: string): Promise<void> {
    const coder = await this.model.findByIdAndDelete(id).exec();
    if (!coder) {
      throw new NotFoundException(`Coder with ID ${id} not found`);
    }
  }
}
