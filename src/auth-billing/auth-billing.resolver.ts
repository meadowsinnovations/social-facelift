import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthBillingService } from './auth-billing.service';
import { AuthPayload } from './dto/auth-payload.dto';
import { LoginInput } from './dto/login.input';

@Resolver(() => AuthPayload)
export class AuthBillingResolver {
  constructor(private readonly authBillingService: AuthBillingService) {}

  @Mutation(() => AuthPayload, { name: 'login' })
  login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    return this.authBillingService.login(input);
  }
}
