import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(AtGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('IsPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    return isPublic || (await super.canActivate(context));
  }

  handleRequest(err, user, info: Error) {
    if (err || info) {
      console.error(`Error de JWT: ${info?.message || err}`);
      throw new UnauthorizedException(
        'The Access Token is invalid or has expired.',
      );
    }
    if (!user) {
      this.logger.warn('Access denied: Unauthorized access attempt.');
      throw new UnauthorizedException('Access denied.');
    }
    return user;
  }
}
