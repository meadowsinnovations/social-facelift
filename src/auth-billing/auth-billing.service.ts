import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_CLIENT } from '../common/tokens';
import { StripeClient } from '../integrations/stripe.interface';
import { AuthPayload } from './dto/auth-payload.dto';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthBillingService {
  constructor(
    @Inject(STRIPE_CLIENT)
    private readonly stripeClient: StripeClient
  ) {}

  async login(input: LoginInput): Promise<AuthPayload> {
    const session = await this.stripeClient.createCheckoutSession(input.email);

    return {
      accessToken: `access-${Buffer.from(input.email).toString('base64url')}`,
      refreshToken: `refresh-${Date.now()}`,
      customerId: session.sessionId
    };
  }
}
