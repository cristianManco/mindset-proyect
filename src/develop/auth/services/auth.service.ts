import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/develop/shared/hash/hash.service';
import { AdminService } from 'src/modules/Users/services/User.service';
import { UserLoginDto, SignUpDto } from '../dtos/export';
import { Tokens, JwtPayload } from '../types/export';
import { Admin } from 'src/modules/Users/entities/User.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
    private readonly hashService: HashService,
  ) {}

  async validateUser(payload: JwtPayload) {
    const user = await this.adminService.findOne(payload.sub.toString());
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async login(loginDto: UserLoginDto): Promise<Tokens> {
    const { email, password } = loginDto;
    const user = await this.adminService.findOneByEmail(email);

    if (!user || !(await this.hashService.compare(password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return this.getTokens({ sub: user.id });
  }

  async register(signUPDto: SignUpDto): Promise<Admin> {
    await this.validateEmailForSignUp(signUPDto.email);

    const hashedPassword = await this.hashService.hash(signUPDto.password);

    const user = await this.adminService.create({
      ...signUPDto,
      password: hashedPassword,
    });

    await user.save();
    return user;
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
