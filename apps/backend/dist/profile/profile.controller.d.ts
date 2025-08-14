import { ProfileService } from './profile.service';
import type { Profile } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ImportLinkedinDto } from './dto/import-linkedin.dto';
export declare class ProfileController {
    private readonly profiles;
    constructor(profiles: ProfileService);
    getMine(req: any): Promise<Profile>;
    updateMine(req: any, body: UpdateProfileDto): Promise<Profile>;
    importFromLinkedin(req: any, body: ImportLinkedinDto): Promise<Profile>;
    importFromResume(req: any, file: any, overwrite?: string): Promise<Profile>;
    importFromPdf(req: any, file: any, overwrite?: string): Promise<Profile>;
    importFromCv(req: any, file: any, overwrite?: string): Promise<Profile>;
    debugLinkedInImport(body: ImportLinkedinDto): Promise<any>;
}
