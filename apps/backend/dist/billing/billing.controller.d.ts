import { UserEntity } from '../auth/user.entity';
import { Repository } from 'typeorm';
import type { Response } from 'express';
import { StripeService } from './stripe.service';
export declare class BillingController {
    private readonly users;
    private readonly stripe;
    constructor(users: Repository<UserEntity>, stripe: StripeService);
    createCheckoutSession(req: any, body: {
        plan: 'free' | 'premium' | 'pro';
    }): Promise<{
        checkoutUrl: string;
    }>;
    mockSuccess(req: any, res: Response, plan?: 'pro' | 'team'): Promise<void>;
    mockActivate(req: any, body: {
        plan?: 'pro' | 'team';
        billingCycle?: 'monthly' | 'yearly';
    }): Promise<{
        readonly ok: true;
    }>;
    portal(req: any): Promise<{
        url: string;
    }>;
    webhook(req: any, sig?: string): Promise<{
        readonly received: true;
    }>;
    private handleCheckoutCompleted;
    private handleSubscriptionCreated;
    private handleSubscriptionUpdated;
    private handleSubscriptionDeleted;
    private mapPriceIdToPlan;
}
