import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
export declare class EducationController {
    private readonly service;
    constructor(service: EducationService);
    list(req: any): Promise<import("./education.entity").EducationEntity[]>;
    create(req: any, body: CreateEducationDto): Promise<import("./education.entity").EducationEntity>;
    update(req: any, id: string, body: UpdateEducationDto): Promise<import("./education.entity").EducationEntity>;
    remove(req: any, id: string): Promise<void>;
}
