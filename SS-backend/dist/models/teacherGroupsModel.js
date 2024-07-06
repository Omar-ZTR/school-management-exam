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
exports.TeacherGroup = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const teacherModel_1 = require("./teacherModel");
const groupModel_1 = require("./groupModel");
let TeacherGroup = class TeacherGroup extends sequelize_typescript_1.Model {
};
exports.TeacherGroup = TeacherGroup;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => teacherModel_1.Teacher),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], TeacherGroup.prototype, "user__id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => groupModel_1.Group),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], TeacherGroup.prototype, "group__id", void 0);
exports.TeacherGroup = TeacherGroup = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "TeacherGroup",
        timestamps: false
    })
], TeacherGroup);
