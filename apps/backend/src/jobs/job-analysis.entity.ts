import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../auth/user.entity';

@Entity('job_analyses')
export class JobAnalysisEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user!: UserEntity;

  @Column({ type: 'varchar', length: 255 })
  company!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  sourceUrl!: string | null;

  @Column({ type: 'json' })
  requiredSkills!: string[];

  @Column({ type: 'json' })
  responsibilities!: string[];

  @Column({ type: 'json' })
  keywords!: string[];

  @CreateDateColumn()
  createdAt!: Date;
}
