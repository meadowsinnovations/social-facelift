import { Provider } from '@nestjs/common';
import { STRIPE_CLIENT } from '../../common/tokens';
import { StripeClient } from '../stripe.interface';

class MockStripeService implements StripeClient {
  async createCheckoutSession(profileId: string) {
    return {
      sessionId: `sess_${profileId}`,
      url: `https://mock.stripe.test/checkout/${profileId}`
    };
  }
}

export const MockStripeProvider: Provider = {
  provide: STRIPE_CLIENT,
  useClass: MockStripeService
};
