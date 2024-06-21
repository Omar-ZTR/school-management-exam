"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionController_1 = require("../controllers/questionController");
const routerQuestion = express_1.default.Router();
routerQuestion.get('/', questionController_1.getAllQuestions);
routerQuestion.get('/fake', questionController_1.QuestionById);
routerQuestion.get('/question/:id', questionController_1.getQuestionById);
routerQuestion.post('/question', questionController_1.createQuestion);
routerQuestion.put('/questions/:id', questionController_1.updateQuestion);
routerQuestion.delete('/questions/:id', questionController_1.deleteQuestion);
exports.default = routerQuestion;
