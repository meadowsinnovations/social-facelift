import { Module } from '@nestjs/common';
import { ProfileIntakeService } from './profile-intake.service';
import { ProfileIntakeController } from './profile-intake.controller';
import { ProfileIntakeResolver } from './profile-intake.resolver';
import { MockSocialApiProvider } from '../integrations/mocks/mock-social-api.provider';

@Module({
  controllers: [ProfileIntakeController],
  providers: [ProfileIntakeService, ProfileIntakeResolver, MockSocialApiProvider],
  exports: [ProfileIntakeService]
})
export class ProfileIntakeModule {}
