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
exports.Subject = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const groupModel_1 = require("./groupModel");
const groupSubjectModel_1 = require("./groupSubjectModel");
const teacherModel_1 = require("./teacherModel");
const teacherSubjectsModel_1 = require("./teacherSubjectsModel");
let Subject = class Subject extends sequelize_typescript_1.Model {
};
exports.Subject = Subject;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }),
    __metadata("design:type", Number)
], Subject.prototype, "subject__id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Subject.prototype, "min__Rank", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], Subject.prototype, "coefficient", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Subject.prototype, "subject__name", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => groupModel_1.Group, () => groupSubjectModel_1.GroupSubject),
    __metadata("design:type", Array)
], Subject.prototype, "groups", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => teacherModel_1.Teacher, () => teacherSubjectsModel_1.TeacherSubject),
    __metadata("design:type", Array)
], Subject.prototype, "teachers", void 0);
exports.Subject = Subject = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "Subject",
    })
], Subject);
