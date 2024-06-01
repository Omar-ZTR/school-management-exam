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
exports.Exam = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const questionModel_1 = require("./questionModel");
const fileModel_1 = require("./fileModel");
const reservationModel_1 = require("./reservationModel");
let Exam = class Exam extends sequelize_typescript_1.Model {
};
exports.Exam = Exam;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], Exam.prototype, "exam__id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Exam.prototype, "nb__reserve", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Exam.prototype, "subject", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Exam.prototype, "exam__type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Exam.prototype, "obligatoire", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => questionModel_1.Question),
    __metadata("design:type", Array)
], Exam.prototype, "questions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => reservationModel_1.Reservation),
    __metadata("design:type", Array)
], Exam.prototype, "reservation", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => fileModel_1.FileExam),
    __metadata("design:type", Array)
], Exam.prototype, "file", void 0);
exports.Exam = Exam = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "Exam",
    })
], Exam);
