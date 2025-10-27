import { Body, Controller, Post } from '@nestjs/common';
import { AuthBillingService } from './auth-billing.service';
import { AuthPayload } from './dto/auth-payload.dto';
import { LoginInput } from './dto/login.input';

@Controller('auth')
export class AuthBillingController {
  constructor(private readonly authBillingService: AuthBillingService) {}

  @Post('login')
  login(@Body() input: LoginInput): Promise<AuthPayload> {
    return this.authBillingService.login(input);
  }
}
