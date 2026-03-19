import { Inject, Injectable } from '@nestjs/common';
import { SOCIAL_API_CLIENT } from '../common/tokens';
import { SocialApiClient } from '../integrations/social-api.interface';
import { Profile } from './dto/profile.dto';

@Injectable()
export class ProfileIntakeService {
  constructor(
    @Inject(SOCIAL_API_CLIENT)
    private readonly socialApiClient: SocialApiClient
  ) {}

  async currentProfile(): Promise<Profile> {
    const insights = await this.socialApiClient.fetchLatestInsights('demo-profile');

    return {
      id: 'demo-profile',
      displayName: 'Demo Creator',
      primaryPlatform: `Instagram (Reach ${insights.reach})`
    };
  }
}
