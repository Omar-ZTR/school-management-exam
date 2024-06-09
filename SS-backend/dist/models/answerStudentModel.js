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
exports.AnswerStudent = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const questionModel_1 = require("./questionModel"); // Import the Question model if it exists
let AnswerStudent = class AnswerStudent extends sequelize_typescript_1.Model {
};
exports.AnswerStudent = AnswerStudent;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], AnswerStudent.prototype, "Answer__id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], AnswerStudent.prototype, "Answer__text", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => questionModel_1.Question),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], AnswerStudent.prototype, "question__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => questionModel_1.Question),
    __metadata("design:type", questionModel_1.Question)
], AnswerStudent.prototype, "question", void 0);
exports.AnswerStudent = AnswerStudent = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "AnswerStudent",
    })
], AnswerStudent);
