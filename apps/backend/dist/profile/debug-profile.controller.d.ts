import { ProfileService } from './profile.service';
import { ImportLinkedinDto } from './dto/import-linkedin.dto';
export declare class DebugProfileController {
    private readonly profiles;
    constructor(profiles: ProfileService);
    debugLinkedInImport(body: ImportLinkedinDto): Promise<any>;
}
