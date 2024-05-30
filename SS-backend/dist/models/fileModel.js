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
exports.FileQuestion = exports.FileExam = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const examModel_1 = require("./examModel"); // Import the Exam model if it exists
const questionModel_1 = require("./questionModel");
let FileExam = class FileExam extends sequelize_typescript_1.Model {
};
exports.FileExam = FileExam;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }),
    __metadata("design:type", Number)
], FileExam.prototype, "file__id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => examModel_1.Exam),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], FileExam.prototype, "exam__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => examModel_1.Exam),
    __metadata("design:type", examModel_1.Exam)
], FileExam.prototype, "exam", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], FileExam.prototype, "file__name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], FileExam.prototype, "file__path", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], FileExam.prototype, "file__type", void 0);
exports.FileExam = FileExam = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "FileExam",
    })
], FileExam);
let FileQuestion = class FileQuestion extends sequelize_typescript_1.Model {
};
exports.FileQuestion = FileQuestion;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }),
    __metadata("design:type", Number)
], FileQuestion.prototype, "file__id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => questionModel_1.Question),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], FileQuestion.prototype, "question__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => questionModel_1.Question),
    __metadata("design:type", questionModel_1.Question)
], FileQuestion.prototype, "question", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], FileQuestion.prototype, "file__name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], FileQuestion.prototype, "file__path", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], FileQuestion.prototype, "file__type", void 0);
exports.FileQuestion = FileQuestion = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "FileQuestion",
    })
], FileQuestion);
