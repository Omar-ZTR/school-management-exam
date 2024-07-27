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
exports.Student = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const userModel_1 = require("./usress/userModel");
const groupModel_1 = require("./groupModel");
const subscribeModel_1 = require("./subscribeModel");
let Student = class Student extends userModel_1.users {
};
exports.Student = Student;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING,
        allowNull: false, }),
    __metadata("design:type", String)
], Student.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => groupModel_1.Group),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], Student.prototype, "group__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => groupModel_1.Group),
    __metadata("design:type", groupModel_1.Group)
], Student.prototype, "group", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => subscribeModel_1.Subscribe),
    __metadata("design:type", Array)
], Student.prototype, "subscribes", void 0);
exports.Student = Student = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "Student",
        timestamps: true
    })
], Student);
