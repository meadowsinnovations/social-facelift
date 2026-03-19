export interface SocialApiClient {
  fetchLatestInsights(profileId: string): Promise<{ reach: number; engagementRate: number }>;
}
