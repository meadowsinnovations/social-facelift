import { Query, Resolver } from '@nestjs/graphql';
import { ProfileIntakeService } from './profile-intake.service';
import { Profile } from './dto/profile.dto';

@Resolver(() => Profile)
export class ProfileIntakeResolver {
  constructor(private readonly profileIntakeService: ProfileIntakeService) {}

  @Query(() => Profile, { name: 'currentProfile' })
  getCurrentProfile(): Promise<Profile> {
    return this.profileIntakeService.currentProfile();
  }
}
