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
exports.Result = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const answerModel_1 = require("./answerModel");
const User__model_1 = require("./User__model");
let Result = class Result extends sequelize_typescript_1.Model {
};
exports.Result = Result;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }),
    __metadata("design:type", Number)
], Result.prototype, "result__id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => answerModel_1.Answer),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Result.prototype, "ans__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => answerModel_1.Answer),
    __metadata("design:type", answerModel_1.Answer)
], Result.prototype, "answer", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User__model_1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Result.prototype, "user__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User__model_1.User),
    __metadata("design:type", User__model_1.User)
], Result.prototype, "User", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Result.prototype, "note", void 0);
exports.Result = Result = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "Result",
    })
], Result);
