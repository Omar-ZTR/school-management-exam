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
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Reservation.prototype, "exam__title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Reservation.prototype, "salle", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], Reservation.prototype, "group__name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], Reservation.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Reservation.prototype, "startDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Reservation.prototype, "endDate", void 0);
exports.Reservation = Reservation = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "Reservation",
    })
], Reservation);
// @ForeignKey(() => User)
// @Column
// User__id!: number;
// @BelongsTo(() => User)
// User!: User;
// @ForeignKey(() => Salle)
// @Column
// salle__id!: number;
// @BelongsTo(() => Salle)
// salle!: Salle;
