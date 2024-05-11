import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCoderDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @IsNotEmpty()
  @IsString()
  readonly country: string;

  // Otros campos necesarios para la creación de hoteles
}
