import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './document.entity';
import { DocumentVersionEntity } from './document-version.entity';
import { TemplateEntity } from './template.entity';
import { TemplateFavoriteEntity } from './template-favorite.entity';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { ProfileModule } from '../profile/profile.module';
import { UserEntity } from '../auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentEntity,
      DocumentVersionEntity,
      TemplateEntity,
      TemplateFavoriteEntity,
      UserEntity,
    ]),
    ProfileModule,
  ],
  providers: [DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
export class DocumentsModule {}
