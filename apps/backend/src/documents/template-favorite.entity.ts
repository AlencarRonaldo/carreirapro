import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from '../auth/user.entity';

@Entity('template_favorites')
@Unique(['userId', 'templateKey'])
export class TemplateFavoriteEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user!: UserEntity;

  @Column({ type: 'varchar', length: 255 })
  templateKey!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
