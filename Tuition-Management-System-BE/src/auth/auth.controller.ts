import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Res, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response, CookieOptions } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { ttl: 60000, limit: 5 } }) // 5 registrations per minute per IP
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(registerDto);
    this.setRefreshTokenCookie(response, result.tokens.refreshToken);

    return {
      user: result.user,
      tokens: {
        accessToken: result.tokens.accessToken,
      },
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 5 } }) // 5 login attempts per minute per IP
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);
    this.setRefreshTokenCookie(response, result.tokens.refreshToken);

    return {
      user: result.user,
      tokens: {
        accessToken: result.tokens.accessToken,
      },
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 10 } }) // 10 refresh requests per minute
  async refresh(
    @Req() request: Request,
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshTokenFromCookie = request.cookies?.refreshToken as string | undefined;
    const refreshToken = refreshTokenFromCookie || refreshTokenDto?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.authService.refreshToken(refreshToken);
    this.setRefreshTokenCookie(response, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
    };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request,
    @Body() logoutDto: LogoutDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshTokenFromCookie = request.cookies?.refreshToken as string | undefined;
    const refreshToken = refreshTokenFromCookie || logoutDto?.refreshToken;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    response.clearCookie('refreshToken', {
      ...this.getRefreshCookieOptions(),
      maxAge: undefined,
      expires: new Date(0),
    });

    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@CurrentUser() user: any) {
    return this.authService.getCurrentUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 3 } }) // 3 password changes per minute
  async changePassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, changePasswordDto);
  }

  private setRefreshTokenCookie(response: Response, refreshToken: string): void {
    response.cookie('refreshToken', refreshToken, this.getRefreshCookieOptions());
  }

  private getRefreshCookieOptions(): CookieOptions {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    const refreshExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRY') || '7d';

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/api/auth',
      maxAge: this.parseDurationToMs(refreshExpiry),
    };
  }

  private parseDurationToMs(duration: string): number {
    const value = parseInt(duration, 10);
    if (duration.endsWith('d')) return value * 24 * 60 * 60 * 1000;
    if (duration.endsWith('h')) return value * 60 * 60 * 1000;
    if (duration.endsWith('m')) return value * 60 * 1000;
    if (duration.endsWith('s')) return value * 1000;
    return 7 * 24 * 60 * 60 * 1000;
  }
}
