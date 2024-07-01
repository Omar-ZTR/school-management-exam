"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const answerStudentController_1 = require("../controllers/answerStudentController");
const routerAnswer = express_1.default.Router();
routerAnswer.post('/answers', answerStudentController_1.createAnswers);
routerAnswer.get('/getanswers', answerStudentController_1.getAnswers);
routerAnswer.put('/result/:id', answerStudentController_1.updateResult);
exports.default = routerAnswer;
