import { UserEntity } from '../auth/user.entity';
export declare class TemplateFavoriteEntity {
    id: string;
    userId: string;
    user: UserEntity;
    templateKey: string;
    createdAt: Date;
}
