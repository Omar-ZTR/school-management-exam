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
exports.Teacher = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const userModel_1 = require("./usress/userModel");
const examModel_1 = require("./examModel");
const subjectModel_1 = require("./subjectModel");
const teacherSubjectsModel_1 = require("./teacherSubjectsModel");
const groupModel_1 = require("./groupModel");
const teacherGroupsModel_1 = require("./teacherGroupsModel");
const questionModel_1 = require("./questionModel");
let Teacher = class Teacher extends userModel_1.users {
};
exports.Teacher = Teacher;
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => subjectModel_1.Subject, () => teacherSubjectsModel_1.TeacherSubject),
    __metadata("design:type", Array)
], Teacher.prototype, "subjects", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => groupModel_1.Group, () => teacherGroupsModel_1.TeacherGroup),
    __metadata("design:type", Array)
], Teacher.prototype, "groups", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING,
        allowNull: true, }),
    __metadata("design:type", String)
], Teacher.prototype, "specialty", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING,
        allowNull: false, }),
    __metadata("design:type", String)
], Teacher.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => examModel_1.Exam, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Teacher.prototype, "exam", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => questionModel_1.Question),
    __metadata("design:type", Array)
], Teacher.prototype, "questions", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Teacher.prototype, "desactive", void 0);
exports.Teacher = Teacher = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "Teacher",
        timestamps: true
    })
], Teacher);
