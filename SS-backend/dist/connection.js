"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const User__model_1 = require("./models/User__model");
const examModel_1 = require("./models/examModel");
const questionModel_1 = require("./models/questionModel");
const reponseModel_1 = require("./models/reponseModel");
const salleModel_1 = require("./models/salleModel");
const reservationModel_1 = require("./models/reservationModel");
const studentModel_1 = require("./models/studentModel");
const teacherModel_1 = require("./models/teacherModel");
const tokenModel_1 = require("./models/tokenModel");
const fileModel_1 = require("./models/fileModel");
const connection = new sequelize_typescript_1.Sequelize('smartskills', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    database: "smartskills",
    models: [User__model_1.User, examModel_1.Exam, questionModel_1.Question, reponseModel_1.Reponse, salleModel_1.Salle, reservationModel_1.Reservation, studentModel_1.Student, teacherModel_1.Teacher, tokenModel_1.Token, fileModel_1.File],
});
exports.default = connection;
