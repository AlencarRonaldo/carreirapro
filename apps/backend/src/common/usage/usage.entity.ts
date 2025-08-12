import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usage_counters')
@Index(['userId', 'metric', 'period'], { unique: true })
export class UsageCounterEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() userId!: string;
  @Column({ type: 'varchar', length: 50 }) metric!: 'job_analyses' | 'ai_requests' | 'exports';
  @Column({ type: 'varchar', length: 7 }) period!: string; // YYYY-MM
  @Column({ type: 'int', default: 0 }) count!: number;
  @CreateDateColumn() createdAt!: Date;
}


