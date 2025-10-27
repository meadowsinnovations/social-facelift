import { Module } from '@nestjs/common';
import { AuthBillingService } from './auth-billing.service';
import { AuthBillingController } from './auth-billing.controller';
import { AuthBillingResolver } from './auth-billing.resolver';
import { MockStripeProvider } from '../integrations/mocks/mock-stripe.provider';

@Module({
  controllers: [AuthBillingController],
  providers: [AuthBillingService, AuthBillingResolver, MockStripeProvider],
  exports: [AuthBillingService]
})
export class AuthBillingModule {}
