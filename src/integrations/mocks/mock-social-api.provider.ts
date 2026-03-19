import { Provider } from '@nestjs/common';
import { SOCIAL_API_CLIENT } from '../../common/tokens';
import { SocialApiClient } from '../social-api.interface';

class MockSocialApiService implements SocialApiClient {
  async fetchLatestInsights(profileId: string) {
    return {
      reach: profileId.length * 100,
      engagementRate: 0.12
    };
  }
}

export const MockSocialApiProvider: Provider = {
  provide: SOCIAL_API_CLIENT,
  useClass: MockSocialApiService
};
