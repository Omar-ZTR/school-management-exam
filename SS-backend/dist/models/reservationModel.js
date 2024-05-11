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
exports.Reservation = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const examModel_1 = require("./examModel");
const User__model_1 = require("./User__model");
const salleModel_1 = require("./salleModel");
let Reservation = class Reservation extends sequelize_typescript_1.Model {
};
exports.Reservation = Reservation;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }),
    __metadata("design:type", Number)
], Reservation.prototype, "reserv__id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => examModel_1.Exam),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Reservation.prototype, "exam__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => examModel_1.Exam),
    __metadata("design:type", examModel_1.Exam)
], Reservation.prototype, "exam", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User__model_1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Reservation.prototype, "User__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User__model_1.User),
    __metadata("design:type", User__model_1.User)
], Reservation.prototype, "User", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => salleModel_1.Salle),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Reservation.prototype, "salle__id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => salleModel_1.Salle),
    __metadata("design:type", salleModel_1.Salle)
], Reservation.prototype, "salle", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATEONLY),
    __metadata("design:type", Date)
], Reservation.prototype, "date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TIME),
    __metadata("design:type", String)
], Reservation.prototype, "Timing", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TIME),
    __metadata("design:type", String)
], Reservation.prototype, "time", void 0);
exports.Reservation = Reservation = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "Reservation",
    })
], Reservation);
