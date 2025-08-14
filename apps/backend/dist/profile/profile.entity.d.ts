import { ExperienceEntity } from './experience.entity';
import { EducationEntity } from './education.entity';
import { SkillEntity } from './skill.entity';
export declare class ProfileEntity {
    id: string;
    fullName: string;
    headline: string;
    locationCity: string;
    locationState: string;
    locationCountry: string;
    linkedin: string;
    github: string;
    website: string;
    email: string;
    phone: string;
    maritalStatus: string;
    experiences?: ExperienceEntity[];
    education?: EducationEntity[];
    skills?: SkillEntity[];
}
