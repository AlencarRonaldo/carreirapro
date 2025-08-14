import Stripe from 'stripe';
export declare class StripeService {
    private stripe;
    private prices;
    constructor();
    isConfigured(): boolean;
    createCheckoutSession(input: {
        plan: 'free' | 'premium' | 'pro';
        customerEmail?: string;
        successUrl: string;
        cancelUrl: string;
    }): Promise<{
        url: string;
    }>;
    parseWebhookEvent(header: string | undefined, rawBody: Buffer): Promise<Stripe.Event | null>;
    createPortalSession(input: {
        customerEmail: string;
        returnUrl: string;
    }): Promise<{
        url: string;
    } | null>;
}
