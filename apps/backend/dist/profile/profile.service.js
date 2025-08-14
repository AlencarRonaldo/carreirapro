"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const profile_entity_1 = require("./profile.entity");
const experience_entity_1 = require("./experience.entity");
const education_entity_1 = require("./education.entity");
const skill_entity_1 = require("./skill.entity");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const resume_parser_service_1 = require("./resume-parser.service");
let ProfileService = class ProfileService {
    repo;
    experienceRepo;
    educationRepo;
    skillRepo;
    http;
    config;
    resumeParser;
    store = new Map();
    constructor(repo, experienceRepo, educationRepo, skillRepo, http, config, resumeParser) {
        this.repo = repo;
        this.experienceRepo = experienceRepo;
        this.educationRepo = educationRepo;
        this.skillRepo = skillRepo;
        this.http = http;
        this.config = config;
        this.resumeParser = resumeParser;
    }
    async getOrCreate(userId) {
        if (this.repo) {
            const found = await this.repo.findOne({
                where: { id: userId },
                relations: ['experiences', 'education', 'skills'],
            });
            if (found)
                return found;
            const created = this.repo.create({ id: userId });
            const saved = await this.repo.save(created);
            return saved;
        }
        if (!this.store.has(userId)) {
            this.store.set(userId, {
                id: userId,
                fullName: '',
                headline: '',
                locationCity: '',
                locationState: '',
                locationCountry: '',
                linkedin: '',
                github: '',
                website: '',
                email: '',
                phone: '',
                maritalStatus: '',
            });
        }
        return this.store.get(userId);
    }
    async update(userId, data) {
        if (this.repo) {
            const current = await this.getOrCreate(userId);
            const merged = this.repo.merge(current, data);
            const saved = await this.repo.save(merged);
            return this.getOrCreate(userId);
        }
        const current = await this.getOrCreate(userId);
        const updated = { ...current, ...data };
        this.store.set(userId, updated);
        return updated;
    }
    async importFromResume(userId, file, overwrite = true) {
        if (!file || !file.buffer) {
            return this.getOrCreate(userId);
        }
        const context7Key = this.config.get('CONTEXT7_API_KEY');
        const context7Url = this.config.get('CONTEXT7_API_URL') ||
            'https://api.context7.com/v1/extract/resume';
        if (!context7Key) {
            let parsedData = null;
            try {
                const text = await this.extractTextBestEffort(file);
                console.log('📄 Resume Import - Extracting data with enhanced parser...');
                parsedData = this.resumeParser.parseResumeText(text);
                console.log('📄 Resume Import - Parsed data:', JSON.stringify(parsedData, null, 2));
                const current = await this.getOrCreate(userId);
                const merged = {
                    fullName: overwrite
                        ? parsedData.fullName || current.fullName
                        : current.fullName || parsedData.fullName || '',
                    headline: overwrite
                        ? parsedData.headline || current.headline
                        : current.headline || parsedData.headline || '',
                    email: overwrite
                        ? parsedData.email || current.email
                        : current.email || parsedData.email || '',
                    phone: overwrite
                        ? parsedData.phone || current.phone
                        : current.phone || parsedData.phone || '',
                    locationCity: overwrite
                        ? parsedData.locationCity || current.locationCity
                        : current.locationCity || parsedData.locationCity || '',
                    locationState: overwrite
                        ? parsedData.locationState || current.locationState
                        : current.locationState || parsedData.locationState || '',
                    locationCountry: overwrite
                        ? parsedData.locationCountry || current.locationCountry
                        : current.locationCountry || parsedData.locationCountry || '',
                    linkedin: overwrite
                        ? parsedData.linkedin || current.linkedin
                        : current.linkedin || parsedData.linkedin || '',
                    github: overwrite
                        ? parsedData.github || current.github
                        : current.github || parsedData.github || '',
                    website: overwrite
                        ? parsedData.website || current.website
                        : current.website || parsedData.website || '',
                    maritalStatus: overwrite
                        ? parsedData.maritalStatus || current.maritalStatus
                        : current.maritalStatus || parsedData.maritalStatus || '',
                };
                if (this.repo) {
                    const entity = await this.repo.findOne({
                        where: { id: userId },
                        relations: ['experiences', 'education', 'skills'],
                    });
                    const updated = this.repo.merge(entity ?? { id: userId }, merged);
                    const savedProfile = await this.repo.save(updated);
                    if (parsedData.experiences && parsedData.experiences.length > 0) {
                        const existingExperiences = entity?.experiences ?? [];
                        for (const expData of parsedData.experiences) {
                            const isDuplicate = existingExperiences.find((e) => e.title?.toLowerCase() === expData.title?.toLowerCase() &&
                                e.company?.toLowerCase() === expData.company?.toLowerCase());
                            if (!isDuplicate && expData.title) {
                                const expEntity = this.experienceRepo.create({
                                    title: expData.title,
                                    company: expData.company || '',
                                    startDate: expData.startDate,
                                    endDate: expData.endDate,
                                    description: expData.description,
                                    profile: savedProfile,
                                });
                                await this.experienceRepo.save(expEntity);
                                console.log('📄 Resume Import - Saved experience:', expData.title, 'at', expData.company);
                            }
                        }
                    }
                    if (parsedData.education && parsedData.education.length > 0) {
                        const existingEducation = entity?.education ?? [];
                        for (const eduData of parsedData.education) {
                            const isDuplicate = existingEducation.find((e) => e.degree?.toLowerCase() === eduData.degree?.toLowerCase() &&
                                e.institution?.toLowerCase() ===
                                    eduData.institution?.toLowerCase());
                            if (!isDuplicate && eduData.degree) {
                                const eduEntity = this.educationRepo.create({
                                    degree: eduData.degree,
                                    institution: eduData.institution || '',
                                    startDate: eduData.startDate,
                                    endDate: eduData.endDate,
                                    profile: savedProfile,
                                });
                                await this.educationRepo.save(eduEntity);
                                console.log('📄 Resume Import - Saved education:', eduData.degree, 'at', eduData.institution);
                            }
                        }
                    }
                    if (parsedData.skills && parsedData.skills.length > 0) {
                        const existingSkills = entity?.skills ?? [];
                        for (const skillName of parsedData.skills) {
                            const isDuplicate = existingSkills.find((s) => s.name?.toLowerCase() === skillName?.toLowerCase());
                            if (!isDuplicate && skillName?.trim()) {
                                const skillEntity = this.skillRepo.create({
                                    name: skillName.trim(),
                                    level: 3,
                                    profile: savedProfile,
                                });
                                await this.skillRepo.save(skillEntity);
                                console.log('📄 Resume Import - Saved skill:', skillName);
                            }
                        }
                    }
                    return this.getOrCreate(userId);
                }
                const updatedMem = { ...current, ...merged };
                this.store.set(userId, updatedMem);
                return updatedMem;
            }
            catch (error) {
                console.error('📄 Resume Import - Error during parsing:', error);
                const current = await this.getOrCreate(userId);
                if (parsedData?.fullName || parsedData?.email || parsedData?.phone) {
                    try {
                        const partialUpdate = await this.update(userId, {
                            fullName: parsedData.fullName || current.fullName,
                            email: parsedData.email || current.email,
                            phone: parsedData.phone || current.phone,
                        });
                        console.log('📄 Resume Import - Saved partial data despite errors');
                        return partialUpdate;
                    }
                    catch (updateError) {
                        console.error('📄 Resume Import - Failed to save partial data:', updateError);
                    }
                }
                throw new Error(`Failed to parse resume: ${error.message}`);
            }
        }
        try {
            const formData = new (await import('form-data')).default();
            formData.append('file', file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype,
            });
            formData.append('output', 'json');
            const headers = {
                ...formData.getHeaders?.(),
                Authorization: `Bearer ${context7Key}`,
            };
            const resp = await (0, rxjs_1.firstValueFrom)(this.http.post(context7Url, formData, { headers }));
            const data = resp?.data || {};
            const fullName = data.full_name || data.name || '';
            const headline = data.headline || data.title || '';
            const email = data.email || (Array.isArray(data.emails) ? data.emails[0] : '');
            const phone = data.phone || (Array.isArray(data.phones) ? data.phones[0] : '');
            const linkedin = data.linkedin ||
                (Array.isArray(data.links)
                    ? data.links.find((l) => /linkedin\.com/i.test(l)) || ''
                    : '');
            const github = data.github ||
                (Array.isArray(data.links)
                    ? data.links.find((l) => /github\.com/i.test(l)) || ''
                    : '');
            const website = data.website ||
                (Array.isArray(data.links)
                    ? data.links.find((l) => /^https?:\/\//i.test(l) && !/linkedin|github/i.test(l)) || ''
                    : '');
            const locationCity = data.city || data.location_city || '';
            const locationState = data.state || data.location_state || '';
            const locationCountry = data.country || data.location_country || '';
            const current = await this.getOrCreate(userId);
            const merged = {
                fullName: overwrite
                    ? fullName || current.fullName
                    : current.fullName || fullName,
                headline: overwrite
                    ? headline || current.headline
                    : current.headline || headline,
                email: overwrite ? email || current.email : current.email || email,
                phone: overwrite ? phone || current.phone : current.phone || phone,
                linkedin: overwrite
                    ? linkedin || current.linkedin
                    : current.linkedin || linkedin,
                github: overwrite ? github || current.github : current.github || github,
                website: overwrite
                    ? website || current.website
                    : current.website || website,
                locationCity: overwrite
                    ? locationCity || current.locationCity
                    : current.locationCity || locationCity,
                locationState: overwrite
                    ? locationState || current.locationState
                    : current.locationState || locationState,
                locationCountry: overwrite
                    ? locationCountry || current.locationCountry
                    : current.locationCountry || locationCountry,
            };
            if (this.repo) {
                const entity = await this.repo.findOne({ where: { id: userId } });
                const updated = this.repo.merge(entity ?? { id: userId }, merged);
                await this.repo.save(updated);
                return this.getOrCreate(userId);
            }
            const updatedMem = { ...current, ...merged };
            this.store.set(userId, updatedMem);
            return updatedMem;
        }
        catch (error) {
            console.error('Context7 Import - Error:', error?.response?.data || error?.message || error);
            return this.getOrCreate(userId);
        }
    }
    async extractTextBestEffort(file) {
        const mimetype = (file.mimetype || '').toLowerCase();
        const name = String(file.originalname || '').toLowerCase();
        const buf = file.buffer;
        const isPdfByMime = /pdf/.test(mimetype) || name.endsWith('.pdf');
        const isPdfByMagic = buf && buf.length >= 4 && buf.slice(0, 4).toString('ascii') === '%PDF';
        if (isPdfByMime || isPdfByMagic) {
            try {
                const res = await (0, pdf_parse_1.default)(buf);
                let text = String(res?.text || '');
                const alphaRatio = text.replace(/\s/g, '').replace(/[^A-Za-zÀ-ÿ]/g, '').length /
                    Math.max(1, text.replace(/\s/g, '').length);
                if (text.length < 50 || alphaRatio < 0.1) {
                    try {
                        const tesseract = await import('tesseract.js');
                        const ocr = await tesseract.recognize(buf, 'por+eng');
                        const ocrText = String(ocr?.data?.text || '').trim();
                        if (ocrText.length > text.length)
                            text = ocrText;
                    }
                    catch {
                    }
                }
                return text;
            }
            catch (error) {
                console.error('PDF parsing error:', error);
            }
        }
        const isDocx = /word|officedocument|docx|msword/.test(mimetype) ||
            /\.docx?$/i.test(name) ||
            (buf && buf.length > 2 && buf.slice(0, 2).toString('ascii') === 'PK');
        if (isDocx) {
            try {
                const mammoth = await import('mammoth');
                const res = await mammoth.extractRawText({ buffer: buf });
                return res?.value || '';
            }
            catch (error) {
                console.error('DOCX parsing error:', error);
            }
        }
        try {
            const preview = buf.slice(0, 64).toString('utf8');
            const nonPrintable = (buf
                .slice(0, 256)
                .toString('utf8')
                .match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g) || []).length;
            if (nonPrintable > 10)
                return '';
            return buf.toString('utf8');
        }
        catch {
            return '';
        }
    }
    async importFromLinkedin(userId, input) {
        const timestamp = () => new Date().toLocaleTimeString('pt-BR', { hour12: false });
        console.log(`\n🔵 [${timestamp()}] LinkedIn Import - INICIO DA FUNÇÃO`);
        console.log(`🔵 [${timestamp()}] LinkedIn Import - Timestamp ISO:`, new Date().toISOString());
        console.log(`🔵 [${timestamp()}] LinkedIn Import - userId:`, userId);
        console.log(`🔵 [${timestamp()}] LinkedIn Import - input:`, JSON.stringify(input, null, 2));
        const overwrite = Boolean(input.overwrite ?? true);
        console.log(`🔵 [${timestamp()}] LinkedIn Import - overwrite:`, overwrite);
        const apifyToken = this.config.get('APIFY_TOKEN') ||
            this.config.get('APIFY_API_TOKEN') ||
            '';
        if (apifyToken) {
            console.log(`🔵 [${timestamp()}] LinkedIn Import: usando Apify (token presente)`);
            try {
                const cookiesJson = this.config.get('APIFY_LI_COOKIES_JSON') || '';
                let cookies = undefined;
                try {
                    if (cookiesJson) {
                        const parsed = JSON.parse(cookiesJson);
                        if (Array.isArray(parsed))
                            cookies = parsed;
                    }
                }
                catch { }
                const actorSlug = this.config.get('APIFY_ACTOR') || 'apimaestro~linkedin-profile-detail';
                console.log(`🔵 [${timestamp()}] LinkedIn Import - Usando ator:`, actorSlug);
                console.log(`🔵 [${timestamp()}] LinkedIn Import - Cookies carregados:`, cookies ? cookies.length : 0, 'cookies');
                if (cookies && cookies.length > 0) {
                    console.log(`🔵 [${timestamp()}] LinkedIn Import - Cookies nomes:`, cookies.map(c => c.name).join(', '));
                }
                let inputPayload;
                if (actorSlug.includes('logical_scrapers~linkedin-profile-scraper')) {
                    inputPayload = {
                        urls: [input.url],
                        cookies: cookies && cookies.length > 0 ? cookies : [],
                    };
                }
                else {
                    inputPayload = {
                        profiles: [input.url.replace('https://www.linkedin.com/in/', '').replace('/', '')],
                        maxItems: 1,
                        saveHtml: false,
                    };
                }
                console.log(`🔵 [${timestamp()}] LinkedIn Import - Input payload:`, JSON.stringify(inputPayload, null, 2));
                const headers = {
                    'Content-Type': 'application/json',
                };
                console.log(`\n🚀 [${timestamp()}] LinkedIn Import: Iniciando Apify run-sync`);
                console.log(`🚀 [${timestamp()}] LinkedIn Import: Ator:`, actorSlug);
                console.log(`🚀 [${timestamp()}] LinkedIn Import: URL alvo:`, input.url);
                console.log(`🚀 [${timestamp()}] LinkedIn Import: Payload:`, JSON.stringify(inputPayload, null, 2));
                const startTime = Date.now();
                try {
                    const syncResp = await (0, rxjs_1.firstValueFrom)(this.http.post(`https://api.apify.com/v2/acts/${actorSlug}/run-sync?token=${apifyToken}&timeout=180000&memory=2048`, inputPayload, {
                        headers,
                        timeout: 180000,
                        validateStatus: (status) => status < 500,
                    }));
                    const responseTime = Date.now() - startTime;
                    console.log(`\n📥 [${timestamp()}] LinkedIn Import: Resposta Apify recebida em ${responseTime}ms`);
                    console.log(`📥 [${timestamp()}] LinkedIn Import: Status HTTP:`, syncResp.status);
                    console.log(`📥 [${timestamp()}] LinkedIn Import: Content-Type:`, syncResp.headers['content-type']);
                    let syncData = syncResp?.data;
                    console.log(`📥 [${timestamp()}] LinkedIn Import: Tipo de resposta:`, typeof syncData);
                    if (typeof syncData === 'string') {
                        console.log(`📥 [${timestamp()}] LinkedIn Import: Resposta é string, tentando parsear JSON`);
                        try {
                            syncData = JSON.parse(syncData);
                            console.log(`📥 [${timestamp()}] LinkedIn Import: JSON parse bem-sucedido`);
                        }
                        catch (parseError) {
                            console.error(`📥 [${timestamp()}] LinkedIn Import: Erro no parse JSON:`, parseError.message);
                            console.log(`📥 [${timestamp()}] LinkedIn Import: String bruta (500 chars):`, syncData.substring(0, 500));
                        }
                    }
                    console.log(`📥 [${timestamp()}] LinkedIn Import: Tipo processado:`, Array.isArray(syncData) ? 'array' : typeof syncData);
                    const responseCheck = {
                        isArray: Array.isArray(syncData),
                        hasItems: syncData && Array.isArray(syncData.items),
                        isObject: syncData && typeof syncData === 'object',
                        keys: syncData && typeof syncData === 'object' ? Object.keys(syncData) : null,
                        dataSize: JSON.stringify(syncData).length
                    };
                    console.log(`📥 [${timestamp()}] LinkedIn Import: Estrutura da resposta:`, responseCheck);
                    let itemFromSync = undefined;
                    if (Array.isArray(syncData)) {
                        itemFromSync = syncData[0];
                        console.log(`📥 [${timestamp()}] LinkedIn Import: Usando primeiro item do array (${syncData.length} items)`);
                    }
                    else if (syncData && Array.isArray(syncData.items)) {
                        itemFromSync = syncData.items[0];
                        console.log(`📥 [${timestamp()}] LinkedIn Import: Usando primeiro item de items array (${syncData.items.length} items)`);
                    }
                    else if (syncData && typeof syncData === 'object') {
                        itemFromSync = syncData;
                        console.log(`📥 [${timestamp()}] LinkedIn Import: Usando objeto completo como item`);
                    }
                    else {
                        console.log(`❌ [${timestamp()}] LinkedIn Import: Estrutura de dados não reconhecida`);
                    }
                    if (!itemFromSync && syncResp.status >= 200 && syncResp.status < 300) {
                        console.log(`🔄 [${timestamp()}] LinkedIn Import: run-sync sem dados, tentando buscar no dataset`);
                        let runId;
                        try {
                            if (syncResp.headers['apify-run-id']) {
                                runId = syncResp.headers['apify-run-id'];
                            }
                            else if (syncResp.headers.location) {
                                const match = syncResp.headers.location.match(/\/runs\/(\w+)/);
                                if (match)
                                    runId = match[1];
                            }
                            if (runId) {
                                console.log(`🔄 [${timestamp()}] LinkedIn Import: Encontrado runId ${runId}, buscando dataset`);
                                const runInfo = await (0, rxjs_1.firstValueFrom)(this.http.get(`https://api.apify.com/v2/actor-runs/${runId}?token=${apifyToken}`, { headers, timeout: 30000 }));
                                const datasetId = runInfo?.data?.data?.defaultDatasetId;
                                console.log(`🔄 [${timestamp()}] LinkedIn Import: DatasetId encontrado:`, datasetId);
                                if (datasetId) {
                                    const itemsResp = await (0, rxjs_1.firstValueFrom)(this.http.get(`https://api.apify.com/v2/datasets/${datasetId}/items?clean=true&limit=1&token=${apifyToken}`, { headers, timeout: 30000 }));
                                    const items = Array.isArray(itemsResp?.data) ? itemsResp.data : [];
                                    itemFromSync = items[0];
                                    console.log(`📦 [${timestamp()}] LinkedIn Import: Dataset items encontrados:`, items.length);
                                    if (itemFromSync) {
                                        console.log(`✅ [${timestamp()}] LinkedIn Import: Dados recuperados do dataset`);
                                    }
                                }
                            }
                        }
                        catch (datasetError) {
                            console.error(`❌ [${timestamp()}] LinkedIn Import: Erro ao buscar dataset:`, datasetError.message);
                        }
                    }
                    if (itemFromSync) {
                        console.log(`\n✅ [${timestamp()}] LinkedIn Import: Item encontrado, iniciando mapeamento`);
                        console.log(`✅ [${timestamp()}] LinkedIn Import: Item keys:`, Object.keys(itemFromSync));
                        console.log(`📝 [${timestamp()}] LinkedIn Import: DADOS IMPORTANTES:`, {
                            firstName: itemFromSync.firstName || itemFromSync.first_name,
                            lastName: itemFromSync.lastName || itemFromSync.last_name,
                            fullName: itemFromSync.fullName || itemFromSync.full_name,
                            name: itemFromSync.name,
                            headline: itemFromSync.headline,
                            education: itemFromSync.education ? itemFromSync.education.length : 0,
                            experience: itemFromSync.experience ? itemFromSync.experience.length : 0,
                            skills: itemFromSync.skills ? itemFromSync.skills.length : 0,
                            allKeys: Object.keys(itemFromSync)
                        });
                        const current = await this.getOrCreate(userId);
                        const basicInfo = itemFromSync.basic_info || itemFromSync;
                        console.log(`🔄 [${timestamp()}] LinkedIn Import: Basic info keys:`, Object.keys(basicInfo));
                        console.log(`🔄 [${timestamp()}] LinkedIn Import: Dados básicos encontrados:`, {
                            hasName: !!(basicInfo.fullName || basicInfo.firstName || basicInfo.lastName),
                            hasHeadline: !!basicInfo.headline,
                            hasLocation: !!(basicInfo.location || basicInfo.locationCity),
                            hasSkills: !!(itemFromSync.skills && itemFromSync.skills.length > 0),
                            hasExperience: !!(itemFromSync.experience && itemFromSync.experience.length > 0),
                            hasEducation: !!(itemFromSync.education && itemFromSync.education.length > 0)
                        });
                        const firstName = itemFromSync.firstName || itemFromSync.first_name || basicInfo.firstName || basicInfo.first_name || '';
                        const lastName = itemFromSync.lastName || itemFromSync.last_name || basicInfo.lastName || basicInfo.last_name || '';
                        const possibleNames = [
                            itemFromSync.fullName,
                            itemFromSync.full_name,
                            itemFromSync.name,
                            itemFromSync.displayName,
                            itemFromSync.display_name,
                            basicInfo.fullname,
                            basicInfo.fullName,
                            basicInfo.profileName,
                            basicInfo.name,
                            basicInfo.full_name,
                            basicInfo.display_name,
                            (firstName && lastName) ? `${firstName} ${lastName}` : '',
                            firstName || lastName
                        ];
                        const fullName = possibleNames.find(name => name && name.trim()) || '';
                        console.log(`👤 [${timestamp()}] LinkedIn Import: Nome encontrado: "${fullName}"`);
                        console.log(`👤 [${timestamp()}] LinkedIn Import: Componentes do nome:`, { firstName, lastName });
                        console.log(`👤 [${timestamp()}] LinkedIn Import: Testados:`, possibleNames.filter(n => n).slice(0, 5));
                        const headline = basicInfo.headline || basicInfo.title || '';
                        const location = basicInfo.location || {};
                        const locationCity = location.city || basicInfo.city || basicInfo.locationCity || '';
                        const locationState = location.state || basicInfo.state || basicInfo.locationState || '';
                        const locationCountry = location.country || basicInfo.country || basicInfo.locationCountry || '';
                        const email = basicInfo.email || itemFromSync.email || '';
                        const phone = basicInfo.phone || itemFromSync.phone || '';
                        const linkedin = input.url;
                        const github = Array.isArray(itemFromSync.links)
                            ? itemFromSync.links.find((l) => /github\.com/i.test(l)) || ''
                            : '';
                        const website = Array.isArray(itemFromSync.links)
                            ? itemFromSync.links.find((l) => /^https?:\/\//i.test(l) && !/linkedin|github/i.test(l)) || ''
                            : '';
                        const merged = {
                            fullName: overwrite ? fullName || current.fullName : current.fullName || fullName,
                            headline: overwrite ? headline || current.headline : current.headline || headline,
                            email: overwrite ? email || current.email : current.email || email,
                            phone: overwrite ? phone || current.phone : current.phone || phone,
                            linkedin: overwrite ? linkedin || current.linkedin : current.linkedin || linkedin,
                            github: overwrite ? github || current.github : current.github || github,
                            website: overwrite ? website || current.website : current.website || website,
                            locationCity: overwrite
                                ? locationCity || current.locationCity
                                : current.locationCity || locationCity,
                            locationState: overwrite
                                ? locationState || current.locationState
                                : current.locationState || locationState,
                            locationCountry: overwrite
                                ? locationCountry || current.locationCountry
                                : current.locationCountry || locationCountry,
                        };
                        if (this.repo) {
                            const entity = await this.repo.findOne({
                                where: { id: userId },
                                relations: ['experiences', 'education', 'skills'],
                            });
                            const updated = this.repo.merge(entity ?? { id: userId }, merged);
                            const savedProfile = await this.repo.save(updated);
                            const experiencesRaw = (Array.isArray(itemFromSync.experience) && itemFromSync.experience) ||
                                (Array.isArray(itemFromSync.experiences) && itemFromSync.experiences) ||
                                (Array.isArray(itemFromSync.positions) && itemFromSync.positions) ||
                                [];
                            if (experiencesRaw.length > 0) {
                                const existing = entity?.experiences ?? [];
                                for (const xp of experiencesRaw) {
                                    const title = xp.title || xp.position || '';
                                    const company = xp.company || xp.companyName || '';
                                    if (!title)
                                        continue;
                                    const isDuplicate = existing.find((e) => e.title?.toLowerCase() === title.toLowerCase() &&
                                        (e.company || '').toLowerCase() === (company || '').toLowerCase());
                                    if (isDuplicate)
                                        continue;
                                    const expEntity = this.experienceRepo.create({
                                        title,
                                        company,
                                        startDate: xp.start_date?.year ? `${xp.start_date.year}-${String(xp.start_date.month || 1).padStart(2, '0')}-01` :
                                            xp.startDate || null,
                                        endDate: xp.end_date?.year ? `${xp.end_date.year}-${String(xp.end_date.month || 12).padStart(2, '0')}-01` :
                                            xp.endDate || null,
                                        description: xp.description || null,
                                        profile: savedProfile,
                                    });
                                    await this.experienceRepo.save(expEntity);
                                }
                            }
                            const educationRaw = (Array.isArray(itemFromSync.education) && itemFromSync.education) ||
                                (Array.isArray(itemFromSync.educations) && itemFromSync.educations) ||
                                (Array.isArray(itemFromSync.schools) && itemFromSync.schools) ||
                                (Array.isArray(itemFromSync.academic) && itemFromSync.academic) ||
                                [];
                            console.log(`🎓 [${timestamp()}] LinkedIn Import: Educação encontrada:`, educationRaw.length, 'items');
                            if (educationRaw.length > 0) {
                                console.log(`🎓 [${timestamp()}] LinkedIn Import: Dados de educação:`, JSON.stringify(educationRaw, null, 2));
                                const existing = entity?.education ?? [];
                                for (const edu of educationRaw) {
                                    const degree = edu.degree || edu.field || edu.field_of_study || edu.area || edu.course || edu.program || '';
                                    const institution = edu.institution || edu.school || edu.schoolName || edu.school_name || edu.university || edu.college || '';
                                    console.log(`🎓 [${timestamp()}] LinkedIn Import: Processando educação:`, { degree, institution });
                                    if (!degree)
                                        continue;
                                    const isDuplicate = existing.find((e) => e.degree?.toLowerCase() === degree.toLowerCase() &&
                                        (e.institution || '').toLowerCase() === (institution || '').toLowerCase());
                                    if (isDuplicate)
                                        continue;
                                    const eduEntity = this.educationRepo.create({
                                        degree,
                                        institution,
                                        startDate: edu.start_date?.year ? `${edu.start_date.year}-${String(edu.start_date.month || 1).padStart(2, '0')}-01` :
                                            edu.startDate || null,
                                        endDate: edu.end_date?.year ? `${edu.end_date.year}-${String(edu.end_date.month || 12).padStart(2, '0')}-01` :
                                            edu.endDate || null,
                                        profile: savedProfile,
                                    });
                                    await this.educationRepo.save(eduEntity);
                                }
                            }
                            const skillsRaw = (Array.isArray(itemFromSync.skills_and_endorsements) && itemFromSync.skills_and_endorsements) ||
                                (Array.isArray(itemFromSync.skills) && itemFromSync.skills) ||
                                (Array.isArray(itemFromSync.skill_keywords) && itemFromSync.skill_keywords) ||
                                [];
                            if (skillsRaw.length > 0) {
                                const existing = entity?.skills ?? [];
                                for (const s of skillsRaw) {
                                    const name = typeof s === 'string' ? s : s?.name || '';
                                    if (!name?.trim())
                                        continue;
                                    const isDuplicate = existing.find((e) => e.name?.toLowerCase() === name.toLowerCase());
                                    if (isDuplicate)
                                        continue;
                                    const skillEntity = this.skillRepo.create({
                                        name: name.trim(),
                                        level: 3,
                                        profile: savedProfile,
                                    });
                                    await this.skillRepo.save(skillEntity);
                                }
                            }
                            return this.getOrCreate(userId);
                        }
                        const updatedMem = { ...current, ...merged };
                        this.store.set(userId, updatedMem);
                        return updatedMem;
                    }
                    else {
                        console.warn('📥 LinkedIn Import: No valid item found in sync response');
                        console.log('📥 LinkedIn Import: Raw syncData for debugging:', JSON.stringify(syncData, null, 2));
                    }
                }
                catch (e) {
                    console.error(`⚠️ [${timestamp()}] LinkedIn Import: Apify run-sync failed, details:`);
                    console.error(`⚠️ [${timestamp()}] LinkedIn Import: Error message:`, e.message);
                    console.error(`⚠️ [${timestamp()}] LinkedIn Import: Error response status:`, e.response?.status);
                    console.error(`⚠️ [${timestamp()}] LinkedIn Import: Error response data:`, e.response?.data);
                    console.warn(`⚠️ [${timestamp()}] LinkedIn Import: Fallback to async mode (runs + polling)`);
                }
                console.log('🔄 LinkedIn Import: Starting async actor execution');
                console.log('🔄 LinkedIn Import: Actor:', actorSlug);
                console.log('🔄 LinkedIn Import: URL:', input.url);
                const start = await (0, rxjs_1.firstValueFrom)(this.http.post(`https://api.apify.com/v2/acts/${actorSlug}/runs?token=${apifyToken}&timeout=180000&memory=2048`, inputPayload, {
                    headers,
                    validateStatus: (status) => status < 500,
                }));
                console.log('🔄 LinkedIn Import: Start response status:', start.status);
                if (start.status !== 200 && start.status !== 201) {
                    console.error('🔄 LinkedIn Import: Failed to start run:', start.data);
                    throw new Error(`Failed to start actor run: ${start.status} ${JSON.stringify(start.data)}`);
                }
                const runId = start?.data?.data?.id;
                let datasetId = start?.data?.data?.defaultDatasetId;
                console.log('🆔 Apify run iniciado:', { runId, datasetIdInitial: datasetId });
                const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
                for (let i = 0; i < 20 && !datasetId; i++) {
                    await sleep(i < 5 ? 1000 : 2000);
                    const run = await (0, rxjs_1.firstValueFrom)(this.http.get(`https://api.apify.com/v2/actor-runs/${runId}?token=${apifyToken}`, { headers, timeout: 180000 }));
                    datasetId = run?.data?.data?.defaultDatasetId;
                    const status = run?.data?.data?.status;
                    console.log(`⏳ [${timestamp()}] Apify polling (${i + 1}/20):`, { status, datasetId });
                    if (status && ['FAILED', 'ABORTED', 'TIMED_OUT'].includes(status))
                        break;
                    if (status === 'SUCCEEDED' && datasetId)
                        break;
                }
                let item;
                if (datasetId) {
                    await sleep(2000);
                    console.log(`📦 [${timestamp()}] Buscando dados do dataset ${datasetId}`);
                    for (let attempt = 0; attempt < 3; attempt++) {
                        const itemsResp = await (0, rxjs_1.firstValueFrom)(this.http.get(`https://api.apify.com/v2/datasets/${datasetId}/items?clean=true&limit=10&token=${apifyToken}`, { headers, timeout: 180000 }));
                        const items = Array.isArray(itemsResp?.data) ? itemsResp.data : [];
                        console.log(`📦 [${timestamp()}] Dataset tentativa ${attempt + 1}: ${items.length} items encontrados`);
                        if (items.length > 0) {
                            item = items[0];
                            console.log(`✅ [${timestamp()}] Dados recuperados do dataset:`, {
                                hasName: !!(item.fullName || item.firstName || item.lastName),
                                hasHeadline: !!item.headline,
                                hasExperience: !!(item.experience && item.experience.length > 0),
                                keys: Object.keys(item).slice(0, 10)
                            });
                            break;
                        }
                        if (attempt < 2) {
                            console.log(`🔄 [${timestamp()}] Dataset vazio, aguardando 3s antes da próxima tentativa...`);
                            await sleep(3000);
                        }
                    }
                }
                const current = await this.getOrCreate(userId);
                if (!item) {
                    console.warn('⚠️ Apify não retornou item. Aplicando fallback: atualizar somente linkedin');
                    const mergedOnlyLinkedin = {
                        linkedin: overwrite
                            ? input.url || current.linkedin
                            : current.linkedin || input.url,
                    };
                    if (this.repo) {
                        const entity = await this.repo.findOne({ where: { id: userId } });
                        const updated = this.repo.merge(entity ?? { id: userId }, mergedOnlyLinkedin);
                        await this.repo.save(updated);
                        return this.getOrCreate(userId);
                    }
                    const updatedMem = {
                        ...current,
                        ...mergedOnlyLinkedin,
                    };
                    this.store.set(userId, updatedMem);
                    return updatedMem;
                }
                const basicInfo = item.basic_info || item;
                const firstName = basicInfo.firstName || item.firstName || '';
                const lastName = basicInfo.lastName || item.lastName || '';
                const fullName = firstName && lastName ? `${firstName} ${lastName}`.trim() :
                    basicInfo.fullname || basicInfo.fullName || basicInfo.profileName || basicInfo.name || '';
                const headline = basicInfo.headline || basicInfo.title || '';
                const location = basicInfo.location || {};
                const locationCity = location.city || basicInfo.city || basicInfo.locationCity || '';
                const locationState = location.state || basicInfo.state || basicInfo.locationState || '';
                const locationCountry = location.country || basicInfo.country || basicInfo.locationCountry || '';
                const email = basicInfo.email || item.email || '';
                const phone = basicInfo.phone || item.phone || '';
                const linkedin = input.url;
                const github = Array.isArray(item.links)
                    ? item.links.find((l) => /github\.com/i.test(l)) || ''
                    : '';
                const website = Array.isArray(item.links)
                    ? item.links.find((l) => /^https?:\/\//i.test(l) && !/linkedin|github/i.test(l)) || ''
                    : '';
                const merged = {
                    fullName: overwrite ? fullName || current.fullName : current.fullName || fullName,
                    headline: overwrite ? headline || current.headline : current.headline || headline,
                    email: overwrite ? email || current.email : current.email || email,
                    phone: overwrite ? phone || current.phone : current.phone || phone,
                    linkedin: overwrite ? linkedin || current.linkedin : current.linkedin || linkedin,
                    github: overwrite ? github || current.github : current.github || github,
                    website: overwrite ? website || current.website : current.website || website,
                    locationCity: overwrite
                        ? locationCity || current.locationCity
                        : current.locationCity || locationCity,
                    locationState: overwrite
                        ? locationState || current.locationState
                        : current.locationState || locationState,
                    locationCountry: overwrite
                        ? locationCountry || current.locationCountry
                        : current.locationCountry || locationCountry,
                };
                console.log('✅ Apify mapeado:', {
                    fullName,
                    headline,
                    email: Boolean(email),
                    phone: Boolean(phone),
                    github: Boolean(github),
                    website: Boolean(website),
                    locationCity,
                    locationState,
                    locationCountry,
                });
                if (this.repo) {
                    const entity = await this.repo.findOne({
                        where: { id: userId },
                        relations: ['experiences', 'education', 'skills'],
                    });
                    const updated = this.repo.merge(entity ?? { id: userId }, merged);
                    const savedProfile = await this.repo.save(updated);
                    const experiencesRaw = (Array.isArray(item.experience) && item.experience) ||
                        (Array.isArray(item.experiences) && item.experiences) ||
                        (Array.isArray(item.positions) && item.positions) ||
                        [];
                    if (experiencesRaw.length > 0) {
                        const existing = entity?.experiences ?? [];
                        for (const xp of experiencesRaw) {
                            const title = xp.title || xp.position || '';
                            const company = xp.company || xp.companyName || '';
                            if (!title)
                                continue;
                            const isDuplicate = existing.find((e) => e.title?.toLowerCase() === title.toLowerCase() &&
                                (e.company || '').toLowerCase() === (company || '').toLowerCase());
                            if (isDuplicate)
                                continue;
                            const expEntity = this.experienceRepo.create({
                                title,
                                company,
                                startDate: xp.start_date || xp.startDate || null,
                                endDate: xp.end_date || xp.endDate || null,
                                description: xp.description || null,
                                profile: savedProfile,
                            });
                            await this.experienceRepo.save(expEntity);
                        }
                    }
                    const educationRaw = (Array.isArray(item.education) && item.education) ||
                        (Array.isArray(item.educations) && item.educations) ||
                        [];
                    console.log(`🎓 LinkedIn Import: Educação bruta encontrada:`, educationRaw.length, 'items');
                    if (educationRaw.length > 0) {
                        console.log(`🎓 LinkedIn Import: Primeiro item educação:`, JSON.stringify(educationRaw[0], null, 2));
                        const existing = entity?.education ?? [];
                        for (const edu of educationRaw) {
                            const degreeName = edu.degreeName || edu.degree || '';
                            const fieldOfStudy = edu.fieldOfStudy || edu.field || '';
                            let degree = '';
                            if (degreeName && fieldOfStudy) {
                                degree = `${degreeName.trim()} em ${fieldOfStudy}`;
                            }
                            else if (degreeName) {
                                degree = degreeName.trim();
                            }
                            else if (fieldOfStudy) {
                                degree = fieldOfStudy;
                            }
                            const institution = edu.schoolName || edu.institution || edu.school || '';
                            if (!degree && !institution)
                                continue;
                            const isDuplicate = existing.find((e) => e.degree?.toLowerCase() === degree.toLowerCase() &&
                                (e.institution || '').toLowerCase() === (institution || '').toLowerCase());
                            if (isDuplicate)
                                continue;
                            let startDate = null;
                            let endDate = null;
                            if (edu.timePeriod) {
                                if (edu.timePeriod.startDate) {
                                    const start = edu.timePeriod.startDate;
                                    startDate = `${start.year}-${String(start.month || 1).padStart(2, '0')}-01`;
                                }
                                if (edu.timePeriod.endDate) {
                                    const end = edu.timePeriod.endDate;
                                    endDate = `${end.year}-${String(end.month || 12).padStart(2, '0')}-01`;
                                }
                            }
                            if (!startDate)
                                startDate = edu.start_date || edu.startDate || null;
                            if (!endDate)
                                endDate = edu.end_date || edu.endDate || null;
                            console.log(`🎓 LinkedIn Import: Educação ${degree}:`, {
                                startDate,
                                endDate,
                                timePeriod: edu.timePeriod
                            });
                            const eduEntity = this.educationRepo.create({
                                degree,
                                institution,
                                startDate,
                                endDate,
                                profile: savedProfile,
                            });
                            await this.educationRepo.save(eduEntity);
                        }
                    }
                    const skillsRaw = (Array.isArray(item.skills) && item.skills) ||
                        (Array.isArray(item.skill_keywords) && item.skill_keywords) ||
                        [];
                    if (skillsRaw.length > 0) {
                        const existing = entity?.skills ?? [];
                        for (const s of skillsRaw) {
                            const name = typeof s === 'string' ? s : s?.name || '';
                            if (!name?.trim())
                                continue;
                            const isDuplicate = existing.find((e) => e.name?.toLowerCase() === name.toLowerCase());
                            if (isDuplicate)
                                continue;
                            const skillEntity = this.skillRepo.create({
                                name: name.trim(),
                                level: 3,
                                profile: savedProfile,
                            });
                            await this.skillRepo.save(skillEntity);
                        }
                    }
                    return this.getOrCreate(userId);
                }
                const updatedMem = { ...current, ...merged };
                this.store.set(userId, updatedMem);
                return updatedMem;
            }
            catch (error) {
                console.error('LinkedIn Import (Apify) - Error:', error?.response?.data || error?.message || error);
            }
        }
        const current = await this.getOrCreate(userId);
        const merged = {
            linkedin: overwrite ? input.url || current.linkedin : current.linkedin || input.url,
        };
        if (this.repo) {
            const entity = await this.repo.findOne({ where: { id: userId } });
            const updated = this.repo.merge(entity ?? { id: userId }, merged);
            await this.repo.save(updated);
            return this.getOrCreate(userId);
        }
        const updatedMem = { ...current, ...merged };
        this.store.set(userId, updatedMem);
        return updatedMem;
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(profile_entity_1.ProfileEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(experience_entity_1.ExperienceEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(education_entity_1.EducationEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(skill_entity_1.SkillEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        axios_1.HttpService,
        config_1.ConfigService,
        resume_parser_service_1.ResumeParserService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map