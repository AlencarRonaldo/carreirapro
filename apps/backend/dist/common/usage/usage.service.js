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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usage_entity_1 = require("./usage.entity");
function currentPeriod() {
    const d = new Date();
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
}
let UsageService = class UsageService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getCount(userId, metric, period = currentPeriod()) {
        const row = await this.repo.findOne({ where: { userId, metric, period } });
        return row?.count ?? 0;
    }
    async increment(userId, metric, delta = 1, period = currentPeriod()) {
        let row = await this.repo.findOne({ where: { userId, metric, period } });
        if (!row)
            row = this.repo.create({ userId, metric, period, count: 0 });
        row.count += delta;
        await this.repo.save(row);
        return row.count;
    }
};
exports.UsageService = UsageService;
exports.UsageService = UsageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usage_entity_1.UsageCounterEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsageService);
//# sourceMappingURL=usage.service.js.map