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
exports.Question = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const examModel_1 = require("./examModel"); // Import the Exam model if it exists
const reponseModel_1 = require("./reponseModel");
let Question = class Question extends sequelize_typescript_1.Model {
};
exports.Question = Question;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }),
    __metadata("design:type", Number)
], Question.prototype, "question__id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Question.prototype, "question__text", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => examModel_1.Exam),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Question.prototype, "exam__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => examModel_1.Exam),
    __metadata("design:type", examModel_1.Exam)
], Question.prototype, "exam", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => reponseModel_1.Reponse),
    __metadata("design:type", Array)
], Question.prototype, "reponses", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT) // Use FLOAT or INTEGER instead of NUMBER
    ,
    __metadata("design:type", Number)
], Question.prototype, "note", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Question.prototype, "question__type", void 0);
exports.Question = Question = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "Question",
    })
], Question);
