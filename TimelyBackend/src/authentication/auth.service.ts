import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserWithoutPassword } from 'src/user/type/user-without-password.type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserWithoutPassword | null> {
    const user = await this.userService.findUserWithPasswordByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserWithoutPassword) {
    const payload = { sub: user.id, username: user.username, email: user.email, fullname: user.fullname };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('JWT_EXPIRES_IN') ?? '15m',
    });

    // Bug fix #2: generate and store a refresh token
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    const hashed = await bcrypt.hash(refresh_token, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashed },
    });

    return { access_token, refresh_token };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenMatches) {
      throw new UnauthorizedException('Access denied');
    }

    const payload = { sub: user.id, username: user.username, email: user.email, fullname: user.fullname };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('JWT_EXPIRES_IN') ?? '15m',
    });
    const new_refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    const hashed = await bcrypt.hash(new_refresh_token, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashed },
    });

    return { access_token, refresh_token: new_refresh_token };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: 'Logged out successfully' };
  }
}
