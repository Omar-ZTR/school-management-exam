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
exports.Subscribe = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const examModel_1 = require("./examModel");
const studentModel_1 = require("./studentModel");
let Subscribe = class Subscribe extends sequelize_typescript_1.Model {
};
exports.Subscribe = Subscribe;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }),
    __metadata("design:type", Number)
], Subscribe.prototype, "subscribe__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => examModel_1.Exam),
    __metadata("design:type", examModel_1.Exam)
], Subscribe.prototype, "exams", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => examModel_1.Exam),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Subscribe.prototype, "exam__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => studentModel_1.Student),
    __metadata("design:type", studentModel_1.Student)
], Subscribe.prototype, "student", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => studentModel_1.Student),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Subscribe.prototype, "user__id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Subscribe.prototype, "acceptation", void 0);
exports.Subscribe = Subscribe = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "Subscribe",
        timestamps: false
    })
], Subscribe);
