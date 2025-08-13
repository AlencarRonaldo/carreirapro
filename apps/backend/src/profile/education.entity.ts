import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProfileEntity } from './profile.entity';

@Entity('education')
export class EducationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  institution!: string;

  @Column({ type: 'varchar', length: 255 })
  degree!: string;

  @Column({ type: 'date', nullable: true })
  startDate?: string | null;

  @Column({ type: 'date', nullable: true })
  endDate?: string | null;

  @ManyToOne(() => ProfileEntity, (p) => p.education, { onDelete: 'CASCADE' })
  profile!: ProfileEntity;
}
