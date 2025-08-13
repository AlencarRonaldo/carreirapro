import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProfileEntity } from './profile.entity';

@Entity('skills')
export class SkillEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'int', default: 1 })
  level!: number; // 1..5

  @ManyToOne(() => ProfileEntity, (p) => p.skills, { onDelete: 'CASCADE' })
  profile!: ProfileEntity;
}
