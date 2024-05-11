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
exports.Answer = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const questionModel_1 = require("./questionModel");
const examModel_1 = require("./examModel");
const User__model_1 = require("./User__model");
let Answer = class Answer extends sequelize_typescript_1.Model {
};
exports.Answer = Answer;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }),
    __metadata("design:type", Number)
], Answer.prototype, "ans__id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => examModel_1.Exam),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Answer.prototype, "exam__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => examModel_1.Exam),
    __metadata("design:type", examModel_1.Exam)
], Answer.prototype, "exam", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User__model_1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Answer.prototype, "user__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User__model_1.User),
    __metadata("design:type", User__model_1.User)
], Answer.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => questionModel_1.Question),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Answer.prototype, "questiom__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => questionModel_1.Question),
    __metadata("design:type", examModel_1.Exam)
], Answer.prototype, "question", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Answer.prototype, "ans__value", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Answer.prototype, "ans__filePath", void 0);
exports.Answer = Answer = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "Answer",
    })
], Answer);
