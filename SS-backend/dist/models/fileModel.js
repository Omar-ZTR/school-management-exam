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
exports.FileAnswer = exports.FileQuestion = exports.FileExam = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const examModel_1 = require("./examModel");
const questionModel_1 = require("./questionModel");
const answerModel_1 = require("./answerModel");
let File = class File extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }),
    __metadata("design:type", Number)
], File.prototype, "file__id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], File.prototype, "file__name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], File.prototype, "file__path", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], File.prototype, "file__type", void 0);
File = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "File",
    })
], File);
let FileExam = class FileExam extends File {
};
exports.FileExam = FileExam;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => examModel_1.Exam),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], FileExam.prototype, "exam__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => examModel_1.Exam),
    __metadata("design:type", examModel_1.Exam)
], FileExam.prototype, "exam", void 0);
exports.FileExam = FileExam = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "FileExam",
    })
], FileExam);
let FileQuestion = class FileQuestion extends File {
};
exports.FileQuestion = FileQuestion;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => questionModel_1.Question),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], FileQuestion.prototype, "question__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => questionModel_1.Question),
    __metadata("design:type", questionModel_1.Question)
], FileQuestion.prototype, "question", void 0);
exports.FileQuestion = FileQuestion = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "FileQuestion",
    })
], FileQuestion);
let FileAnswer = class FileAnswer extends File {
};
exports.FileAnswer = FileAnswer;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => answerModel_1.Answer),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], FileAnswer.prototype, "ans__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => answerModel_1.Answer),
    __metadata("design:type", answerModel_1.Answer)
], FileAnswer.prototype, "answer", void 0);
exports.FileAnswer = FileAnswer = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "FileAnswer",
    })
], FileAnswer);
// import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
// import { Exam } from "./examModel"; // Import the Exam model if it exists
// import { Question } from "./questionModel";
// @Table({
//     timestamps: true,
//     tableName: "FileExam",
// })
// export class FileExam extends Model {
//     @Column({
//         type: DataType.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     })
//     file__id!: number;
//     @ForeignKey(() => Exam)
//     @Column
//     exam__id!: number;
//     @BelongsTo(() => Exam)
//     exam!: Exam;
//     @Column(DataType.STRING)
//     file__name!: string;
//     @Column(DataType.STRING)
//     file__path!: string;
//     @Column(DataType.STRING)
//     file__type!: string;
//     // Assuming you have an Exam model defined
// }
// @Table({
//     timestamps: true,
//     tableName: "FileQuestion",
// })
// export class FileQuestion extends Model {
//     @Column({
//         type: DataType.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     })
//     file__id!: number;
//     @ForeignKey(() => Question)
//     @Column
//     question__id!: number;
//     @BelongsTo(() => Question)
//     question!: Question;
//     @Column(DataType.STRING)
//     file__name!: string;
//     @Column(DataType.STRING)
//     file__path!: string;
//     @Column(DataType.STRING)
//     file__type!: string;
//     // Assuming you have an Exam model defined
// }
