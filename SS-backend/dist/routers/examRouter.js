"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const examController_1 = require("../controllers/examController");
const routerExam = express_1.default.Router();
routerExam.get('/Exams', examController_1.getAllExams);
routerExam.get('/Exams/:id', examController_1.getExamById);
routerExam.post('/examc', examController_1.createExam);
routerExam.put('/Exams/:id', examController_1.updateExam);
routerExam.delete('/Exams/:id', examController_1.deleteExam);
exports.default = routerExam;
