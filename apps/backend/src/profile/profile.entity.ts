import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ExperienceEntity } from './experience.entity';
import { EducationEntity } from './education.entity';
import { SkillEntity } from './skill.entity';

@Entity('profiles')
export class ProfileEntity {
  @PrimaryColumn({ type: 'varchar' })
  id!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  fullName!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  headline!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  locationCity!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  locationState!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  locationCountry!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  linkedin!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  github!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  website!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  email!: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  phone!: string;

  @OneToMany(() => ExperienceEntity, (e) => e.profile, { cascade: true })
  experiences?: ExperienceEntity[];

  @OneToMany(() => EducationEntity, (e) => e.profile, { cascade: true })
  education?: EducationEntity[];

  @OneToMany(() => SkillEntity, (s) => s.profile, { cascade: true })
  skills?: SkillEntity[];
}



