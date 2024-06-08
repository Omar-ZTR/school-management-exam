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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const subjectModel_1 = require("./subjectModel");
const groupSubjectModel_1 = require("./groupSubjectModel");
const studentModel_1 = require("./studentModel");
const examGroupModel_1 = require("./examGroupModel");
const examModel_1 = require("./examModel");
let Group = class Group extends sequelize_typescript_1.Model {
};
exports.Group = Group;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }),
    __metadata("design:type", Number)
], Group.prototype, "group__id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Group.prototype, "Rank", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Group.prototype, "group__name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Group.prototype, "subject", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => subjectModel_1.Subject, () => groupSubjectModel_1.GroupSubject),
    __metadata("design:type", Array)
], Group.prototype, "subjects", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => studentModel_1.Student),
    __metadata("design:type", Array)
], Group.prototype, "students", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => examModel_1.Exam, () => examGroupModel_1.ExamGroup),
    __metadata("design:type", Array)
], Group.prototype, "exams", void 0);
exports.Group = Group = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "Group",
    })
], Group);
