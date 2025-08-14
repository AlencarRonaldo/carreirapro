"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../auth/user.entity");
const typeorm_2 = require("typeorm");
const stripe_service_1 = require("./stripe.service");
let BillingController = class BillingController {
    users;
    stripe;
    constructor(users, stripe) {
        this.users = users;
        this.stripe = stripe;
    }
    async createCheckoutSession(req, body) {
        const plan = body?.plan ?? 'free';
        if (plan === 'free')
            return { checkoutUrl: '' };
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
            }
            catch {
                const checkoutUrl = `/billing/mock/success?plan=${encodeURIComponent(plan)}`;
                return { checkoutUrl };
            }
        }
        const checkoutUrl = `/billing/mock/success?plan=${encodeURIComponent(plan)}`;
        return { checkoutUrl };
    }
    async mockSuccess(req, res, plan) {
        const userId = req.user?.sub;
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
    async mockActivate(req, body) {
        const userId = req.user?.sub;
        const user = await this.users.findOne({ where: { id: userId } });
        if (user) {
            const plan = body?.plan === 'team' || body?.plan === 'pro' ? body.plan : 'pro';
            user.plan = plan;
            user.subscriptionStatus = 'active';
            await this.users.save(user);
        }
        return { ok: true };
    }
    async portal(req) {
        const user = await this.users.findOne({ where: { id: req.user.sub } });
        if (!user || !this.stripe.isConfigured())
            return { url: '' };
        const res = await this.stripe.createPortalSession({
            customerEmail: user.email,
            returnUrl: `${process.env.APP_BASE_URL ?? ''}/subscription`,
        });
        return res ?? { url: '' };
    }
    async webhook(req, sig) {
        try {
            const raw = req.rawBody;
            const event = await this.stripe.parseWebhookEvent(sig, raw);
            if (!event) {
                console.log('No event parsed from webhook');
                return { received: true };
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
        }
        catch (error) {
            console.error('Webhook processing error:', error);
        }
        return { received: true };
    }
    async handleCheckoutCompleted(event) {
        const session = event.data.object;
        const email = session?.customer_details?.email || session?.customer_email;
        const customerId = session?.customer;
        const plan = session?.metadata?.plan;
        console.log(`Checkout completed for email: ${email}, plan: ${plan}`);
        if (email) {
            const user = await this.users.findOne({ where: { email } });
            if (user) {
                if (plan && plan !== 'free') {
                    user.plan = plan;
                    user.subscriptionStatus = 'active';
                    user.stripeCustomerId = customerId;
                    await this.users.save(user);
                    console.log(`User ${email} subscription activated for plan: ${plan}`);
                }
            }
            else {
                console.log(`User with email ${email} not found in database`);
            }
        }
    }
    async handleSubscriptionCreated(event) {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const status = subscription.status;
        const priceId = subscription.items?.data?.[0]?.price?.id;
        console.log(`Subscription created for customer: ${customerId}, status: ${status}, price: ${priceId}`);
        const user = await this.users.findOne({
            where: { stripeCustomerId: customerId },
        });
        if (user) {
            const plan = this.mapPriceIdToPlan(priceId);
            if (plan) {
                user.plan = plan;
                user.subscriptionStatus = status === 'active' ? 'active' : 'inactive';
                user.stripeSubscriptionId = subscription.id;
                await this.users.save(user);
                console.log(`User subscription created: ${user.email}, plan: ${plan}, status: ${status}`);
            }
        }
    }
    async handleSubscriptionUpdated(event) {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const status = subscription.status;
        const priceId = subscription.items?.data?.[0]?.price?.id;
        console.log(`Subscription updated for customer: ${customerId}, status: ${status}, price: ${priceId}`);
        const user = await this.users.findOne({
            where: { stripeCustomerId: customerId },
        });
        if (user) {
            const plan = this.mapPriceIdToPlan(priceId);
            if (plan) {
                user.plan = plan;
            }
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
            console.log(`User subscription updated: ${user.email}, plan: ${user.plan}, status: ${user.subscriptionStatus}`);
        }
    }
    async handleSubscriptionDeleted(event) {
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
            console.log(`User subscription cancelled: ${user.email}, reverted to free plan`);
        }
    }
    mapPriceIdToPlan(priceId) {
        const priceMap = {
            price_1Rv4VLLheOx3CRxGU3ccl6yu: 'free',
            price_1Rv4VULheOx3CRxGFoQnBFfy: 'premium',
            price_1Rv4VmLheOx3CRxGAEoX4FmG: 'pro',
        };
        return priceMap[priceId] || null;
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('checkout-session'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createCheckoutSession", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('mock/success'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('plan')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "mockSuccess", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('mock/activate'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "mockActivate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('portal'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "portal", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "webhook", null);
exports.BillingController = BillingController = __decorate([
    (0, common_1.Controller)('billing'),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stripe_service_1.StripeService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map