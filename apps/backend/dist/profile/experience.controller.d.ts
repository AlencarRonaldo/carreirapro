import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
export declare class ExperienceController {
    private readonly service;
    constructor(service: ExperienceService);
    list(req: any): Promise<import("./experience.entity").ExperienceEntity[]>;
    create(req: any, body: CreateExperienceDto): Promise<import("./experience.entity").ExperienceEntity>;
    update(req: any, id: string, body: UpdateExperienceDto): Promise<import("./experience.entity").ExperienceEntity>;
    remove(req: any, id: string): Promise<void>;
}
