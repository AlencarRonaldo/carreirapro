import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_users_email_unique', { unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  // Subscription plan info
  @Column({ type: 'varchar', length: 20, default: 'starter' })
  plan!: 'starter' | 'pro' | 'team' | 'free' | 'premium' | string;

  @Column({ type: 'varchar', length: 20, default: '' })
  subscriptionStatus!: string; // active | trialing | canceled | cancelled | past_due | inactive | ''

  // Stripe integration fields
  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeCustomerId?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeSubscriptionId?: string | null;
}


