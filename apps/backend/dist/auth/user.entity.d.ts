export declare class UserEntity {
    id: string;
    name?: string | null;
    email: string;
    passwordHash: string;
    plan: 'starter' | 'pro' | 'team' | 'free' | 'premium' | string;
    subscriptionStatus: string;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
}
