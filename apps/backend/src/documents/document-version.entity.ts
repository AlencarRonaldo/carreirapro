import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DocumentEntity } from './document.entity';

@Entity('document_versions')
export class DocumentVersionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => DocumentEntity, { onDelete: 'CASCADE' })
  document!: DocumentEntity;

  @Column({ type: 'text' })
  content!: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}


