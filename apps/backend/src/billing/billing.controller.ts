import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { Repository } from 'typeorm';
import type { Response } from 'express';
import { StripeService } from './stripe.service';

@Controller('billing')
export class BillingController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    private readonly stripe: StripeService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout-session')
  async createCheckoutSession(
    @Req() req: any,
    @Body() body: { plan: 'free' | 'premium' | 'pro' },
  ) {
    const plan = body?.plan ?? 'free';
    if (plan === 'free') return { checkoutUrl: '' };
    // Se Stripe configurado, tenta sessão real; em erro, usa mock
    if (this.stripe.isConfigured()) {
      try {
        const user = await this.users.findOne({ where: { id: req.user.sub } });
        const res = await this.stripe.createCheckoutSession({
          plan,
          customerEmail: user?.email,
          successUrl: `${process.env.APP_BASE_URL ?? ''}/?billing=success`,
          cancelUrl: `${process.env.APP_BASE_URL ?? ''}/?billing=canceled`,
        });
        return { checkoutUrl: res.url };
      } catch {
        // fallback para mock se preços não configurados ou erro de API
        const checkoutUrl = `/billing/mock/success?plan=${encodeURIComponent(plan)}`;
        return { checkoutUrl };
      }
    }
    const checkoutUrl = `/billing/mock/success?plan=${encodeURIComponent(plan)}`;
    return { checkoutUrl };
  }

  // Endpoint mock para ativar assinatura (somente DEV). Redireciona para frontend raiz.
  @UseGuards(JwtAuthGuard)
  @Get('mock/success')
  async mockSuccess(
    @Req() req: any,
    @Res() res: Response,
    @Query('plan') plan?: 'pro' | 'team',
  ) {
    const userId: string = req.user?.sub;
    const user = await this.users.findOne({ where: { id: userId } });
    if (user) {
      if (plan === 'pro' || plan === 'team') {
        user.plan = plan;
        user.subscriptionStatus = 'active';
        await this.users.save(user);
      }
    }
    const base = process.env.APP_BASE_URL ?? '';
    res.redirect(`${base}/?billing=success`);
  }

  // Mock de ativação via chamada autenticada (para evitar redirecionamento sem header Authorization)
  @UseGuards(JwtAuthGuard)
  @Post('mock/activate')
  async mockActivate(
    @Req() req: any,
    @Body()
    body: { plan?: 'pro' | 'team'; billingCycle?: 'monthly' | 'yearly' },
  ) {
    const userId: string = req.user?.sub;
    const user = await this.users.findOne({ where: { id: userId } });
    if (user) {
      const plan =
        body?.plan === 'team' || body?.plan === 'pro' ? body.plan : 'pro';
      user.plan = plan;
      user.subscriptionStatus = 'active';
      await this.users.save(user);
    }
    return { ok: true } as const;
  }
  @UseGuards(JwtAuthGuard)
  @Post('portal')
  async portal(@Req() req: any) {
    const user = await this.users.findOne({ where: { id: req.user.sub } });
    if (!user || !this.stripe.isConfigured()) return { url: '' };
    const res = await this.stripe.createPortalSession({
      customerEmail: user.email,
      returnUrl: `${process.env.APP_BASE_URL ?? ''}/subscription`,
    });
    return res ?? { url: '' };
  }

  // Stripe webhook endpoint - handles subscription lifecycle events
  @Post('webhook')
  async webhook(@Req() req: any, @Headers('stripe-signature') sig?: string) {
    try {
      const raw = req.rawBody as Buffer;
      const event = await this.stripe.parseWebhookEvent(sig, raw);
      if (!event) {
        console.log('No event parsed from webhook');
        return { received: true } as const;
      }

      console.log(`Received Stripe webhook event: ${event.type}`);

      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event);
          break;

        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      // Return 200 to acknowledge receipt even if processing fails
      // to prevent Stripe from retrying indefinitely
    }
    return { received: true } as const;
  }

  private async handleCheckoutCompleted(event: any) {
    const session = event.data.object;
    const email: string | undefined =
      session?.customer_details?.email || session?.customer_email;
    const customerId: string | undefined = session?.customer;
    const plan: 'free' | 'premium' | 'pro' | undefined =
      session?.metadata?.plan;

    console.log(`Checkout completed for email: ${email}, plan: ${plan}`);

    if (email) {
      const user = await this.users.findOne({ where: { email } });
      if (user) {
        // Update user with subscription info
        if (plan && plan !== 'free') {
          user.plan = plan;
          user.subscriptionStatus = 'active';
          user.stripeCustomerId = customerId;
          await this.users.save(user);
          console.log(`User ${email} subscription activated for plan: ${plan}`);
        }
      } else {
        console.log(`User with email ${email} not found in database`);
      }
    }
  }

  private async handleSubscriptionCreated(event: any) {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    const status = subscription.status;
    const priceId = subscription.items?.data?.[0]?.price?.id;

    console.log(
      `Subscription created for customer: ${customerId}, status: ${status}, price: ${priceId}`,
    );

    // Find user by Stripe customer ID
    const user = await this.users.findOne({
      where: { stripeCustomerId: customerId },
    });
    if (user) {
      // Map price ID to plan
      const plan = this.mapPriceIdToPlan(priceId);
      if (plan) {
        user.plan = plan;
        user.subscriptionStatus = status === 'active' ? 'active' : 'inactive';
        user.stripeSubscriptionId = subscription.id;
        await this.users.save(user);
        console.log(
          `User subscription created: ${user.email}, plan: ${plan}, status: ${status}`,
        );
      }
    }
  }

  private async handleSubscriptionUpdated(event: any) {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    const status = subscription.status;
    const priceId = subscription.items?.data?.[0]?.price?.id;

    console.log(
      `Subscription updated for customer: ${customerId}, status: ${status}, price: ${priceId}`,
    );

    const user = await this.users.findOne({
      where: { stripeCustomerId: customerId },
    });
    if (user) {
      const plan = this.mapPriceIdToPlan(priceId);
      if (plan) {
        user.plan = plan;
      }

      // Update subscription status
      switch (status) {
        case 'active':
          user.subscriptionStatus = 'active';
          break;
        case 'past_due':
        case 'unpaid':
          user.subscriptionStatus = 'past_due';
          break;
        case 'canceled':
        case 'incomplete_expired':
          user.subscriptionStatus = 'cancelled';
          user.plan = 'free';
          break;
        default:
          user.subscriptionStatus = 'inactive';
      }

      await this.users.save(user);
      console.log(
        `User subscription updated: ${user.email}, plan: ${user.plan}, status: ${user.subscriptionStatus}`,
      );
    }
  }

  private async handleSubscriptionDeleted(event: any) {
    const subscription = event.data.object;
    const customerId = subscription.customer;

    console.log(`Subscription deleted for customer: ${customerId}`);

    const user = await this.users.findOne({
      where: { stripeCustomerId: customerId },
    });
    if (user) {
      user.plan = 'free';
      user.subscriptionStatus = 'cancelled';
      user.stripeSubscriptionId = null;
      await this.users.save(user);
      console.log(
        `User subscription cancelled: ${user.email}, reverted to free plan`,
      );
    }
  }

  private mapPriceIdToPlan(priceId: string): 'free' | 'premium' | 'pro' | null {
    const priceMap: Record<string, 'free' | 'premium' | 'pro'> = {
      price_1Rv4VLLheOx3CRxGU3ccl6yu: 'free',
      price_1Rv4VULheOx3CRxGFoQnBFfy: 'premium',
      price_1Rv4VmLheOx3CRxGAEoX4FmG: 'pro',
    };

    return priceMap[priceId] || null;
  }
}
