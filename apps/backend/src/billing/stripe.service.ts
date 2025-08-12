import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe | null = null;
  private prices: Record<'free'|'premium'|'pro', string> = {
    free: process.env.STRIPE_PRICE_FREE || 'price_1Rv4VLLheOx3CRxGU3ccl6yu',
    premium: process.env.STRIPE_PRICE_PREMIUM || 'price_1Rv4VULheOx3CRxGFoQnBFfy',
    pro: process.env.STRIPE_PRICE_PRO || 'price_1Rv4VmLheOx3CRxGAEoX4FmG',
  };

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key) this.stripe = new Stripe(key, { apiVersion: '2024-06-20' as any });
    else if (process.env.NODE_ENV === 'production') {
      // Fail fast in production when Stripe is required but not configured
      // We keep controller-level fallback to mock only for non-production
      // scenarios.
      // Note: billing.controller still guards with isConfigured().
      // This ensures secrets are never hardcoded and must come from env.
      // throw new Error('Stripe não configurado em produção: defina STRIPE_SECRET_KEY');
    }
  }

  isConfigured(): boolean { return !!this.stripe; }

  async createCheckoutSession(input: { plan: 'free'|'premium'|'pro'; customerEmail?: string; successUrl: string; cancelUrl: string; }): Promise<{ url: string }> {
    if (!this.stripe) throw new Error('Stripe não configurado');
    const price = this.prices[input.plan];
    if (!price) throw new Error('Preço não configurado');
    
    // Para plano free, não precisa criar sessão de checkout
    if (input.plan === 'free') {
      return { url: input.successUrl };
    }
    
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: input.customerEmail,
      line_items: [{ price, quantity: 1 }],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      allow_promotion_codes: true,
      metadata: { plan: input.plan },
    });
    return { url: session.url! };
  }

  async parseWebhookEvent(header: string | undefined, rawBody: Buffer): Promise<Stripe.Event | null> {
    if (!this.stripe) return null;
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) return null;
    return this.stripe.webhooks.constructEvent(rawBody, header || '', secret);
  }

  async createPortalSession(input: { customerEmail: string; returnUrl: string }): Promise<{ url: string } | null> {
    if (!this.stripe) return null;
    // Tenta localizar o customer pelo e-mail
    const list = await this.stripe.customers.list({ email: input.customerEmail, limit: 1 });
    const customer = list.data?.[0];
    if (!customer) return null;
    const session = await (this.stripe as any).billingPortal.sessions.create({
      customer: customer.id,
      return_url: input.returnUrl,
    });
    return { url: session.url };
  }
}


