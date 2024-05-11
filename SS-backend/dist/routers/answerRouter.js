"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const answerController_1 = require("../controllers/answerController");
const routerAnswer = express_1.default.Router();
routerAnswer.get('/', answerController_1.getAllAnswers);
routerAnswer.get('/Answer/:id', answerController_1.getAnswerById);
routerAnswer.post('/Answers', answerController_1.createAnswer);
routerAnswer.put('/Answers/:id', answerController_1.updateAnswer);
routerAnswer.delete('/Answers/:id', answerController_1.deleteAnswer);
exports.default = routerAnswer;
