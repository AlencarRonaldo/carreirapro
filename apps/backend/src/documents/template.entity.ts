import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('templates')
export class TemplateEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_templates_owner')
  @Column({ type: 'varchar', length: 64 })
  ownerId!: string;

  @Index('idx_templates_key')
  @Column({ type: 'varchar', length: 64 })
  key!: string; // chave usada pelos documentos

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', default: '' })
  body!: string; // texto com placeholders

  @Column({ type: 'text', nullable: true })
  html?: string | null; // html com placeholders

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}


