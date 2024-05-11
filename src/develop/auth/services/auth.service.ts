import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/develop/shared/hash/hash.service';
import { AdminService } from 'src/modules/Users/services/User.service';
import { UserLoginDto, SignUpDto } from '../dtos/export';
import { Tokens, JwtPayload } from '../types/export';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
    private readonly hashService: HashService,
  ) {}

  async login(loginDto: UserLoginDto): Promise<Tokens> {
    const { email, password } = loginDto;
    const user = await this.adminService.findOneByEmail(email);

    if (!user || !(await this.hashService.compare(password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return this.getTokens({ sub: user.id });
  }

  async register(signUPDto: SignUpDto): Promise<Tokens> {
    await this.validateEmailForSignUp(signUPDto.email);

    const hashedPassword = await this.hashService.hash(signUPDto.password);

    const user = await this.adminService.create({
      name: signUPDto.name,
      phone: signUPDto.phone,
      email: signUPDto.email,
      password: hashedPassword,
      role: signUPDto.role,
    });

    return await this.getTokens({
      sub: user.id,
    });
  }

  async getTokens(jwtPayload: JwtPayload): Promise<Tokens> {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error('JWT_SECRET is not set or es invalit');
    }
    const accessTokenOptions = {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '30m',
    };

    const accessToken = await this.signToken(
      jwtPayload,
      secretKey,
      accessTokenOptions,
    );

    return { access_token: accessToken };
  }

  async signToken(payload: JwtPayload, secretKey: string, options: any) {
    return await this.jwtService.signAsync(payload, {
      secret: secretKey,
      ...options,
    });
  }

  async validateEmailForSignUp(email: string): Promise<boolean | undefined> {
    const user = await this.adminService.findOneByEmailRegister(email);

    if (user) {
      throw new HttpException('Email already exists! Try again', 400);
    }
    return true;
  }
}
