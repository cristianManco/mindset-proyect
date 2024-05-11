import { SetMetadata } from '@nestjs/common';

export const Privated = () => SetMetadata('IsPrivate', true);
