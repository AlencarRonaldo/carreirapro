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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = __importDefault(require("stripe"));
let StripeService = class StripeService {
    stripe = null;
    prices = {
        free: process.env.STRIPE_PRICE_FREE || 'price_1Rv4VLLheOx3CRxGU3ccl6yu',
        premium: process.env.STRIPE_PRICE_PREMIUM || 'price_1Rv4VULheOx3CRxGFoQnBFfy',
        pro: process.env.STRIPE_PRICE_PRO || 'price_1Rv4VmLheOx3CRxGAEoX4FmG',
    };
    constructor() {
        const key = process.env.STRIPE_SECRET_KEY;
        if (key)
            this.stripe = new stripe_1.default(key, { apiVersion: '2024-06-20' });
        else if (process.env.NODE_ENV === 'production') {
        }
    }
    isConfigured() {
        return !!this.stripe;
    }
    async createCheckoutSession(input) {
        if (!this.stripe)
            throw new Error('Stripe não configurado');
        const price = this.prices[input.plan];
        if (!price)
            throw new Error('Preço não configurado');
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
        return { url: session.url };
    }
    async parseWebhookEvent(header, rawBody) {
        if (!this.stripe)
            return null;
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!secret)
            return null;
        return this.stripe.webhooks.constructEvent(rawBody, header || '', secret);
    }
    async createPortalSession(input) {
        if (!this.stripe)
            return null;
        const list = await this.stripe.customers.list({
            email: input.customerEmail,
            limit: 1,
        });
        const customer = list.data?.[0];
        if (!customer)
            return null;
        const session = await this.stripe.billingPortal.sessions.create({
            customer: customer.id,
            return_url: input.returnUrl,
        });
        return { url: session.url };
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StripeService);
//# sourceMappingURL=stripe.service.js.map