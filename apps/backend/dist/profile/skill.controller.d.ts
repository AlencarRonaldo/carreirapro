import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
export declare class SkillController {
    private readonly service;
    constructor(service: SkillService);
    list(req: any): Promise<import("./skill.entity").SkillEntity[]>;
    create(req: any, body: CreateSkillDto): Promise<import("./skill.entity").SkillEntity>;
    update(req: any, id: string, body: UpdateSkillDto): Promise<import("./skill.entity").SkillEntity>;
    remove(req: any, id: string): Promise<void>;
}
