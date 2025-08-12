import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
// Rate limiting é global via ThrottlerGuard (ver AppModule)
import { AuthService } from './auth.service';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { JwtAuthGuard } from './jwt-auth.guard';

class LoginDto {
  @IsEmail()
  email!: string;
  @IsString()
  password!: string;
}
class RegisterDto extends LoginDto {
  @IsString()
  @MinLength(2)
  name!: string;
  @IsOptional()
  @IsString()
  selectedPlan?: 'starter'|'pro'|'team';
}

class ForgotDto {
  @IsEmail()
  email!: string;
}

class ResetDto {
  @IsEmail()
  email!: string;
  @IsString()
  token!: string;
  @IsString()
  newPassword!: string;
}

class RefreshDto {
  @IsString()
  refreshToken!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.auth.validateAndSign(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.auth.register(body.email, body.password, body.selectedPlan, body.name);
  }

  @Post('forgot-password')
  async forgot(@Body() body: ForgotDto) {
    return this.auth.requestPasswordReset(body.email);
  }

  @Post('reset-password')
  async reset(@Body() body: ResetDto) {
    return this.auth.resetPassword(body.email, body.token, body.newPassword);
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshDto) {
    return this.auth.refreshAccessToken(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const { sub, email, plan, subscriptionStatus } = req.user ?? {};
    return { id: sub, email, plan, subscriptionStatus } as any;
  }
}


