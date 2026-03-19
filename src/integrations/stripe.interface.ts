export interface StripeClient {
  createCheckoutSession(profileId: string): Promise<{ sessionId: string; url: string }>;
}
