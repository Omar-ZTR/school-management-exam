"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnswers = void 0;
const examModel_1 = require("../models/examModel");
const answerModel_1 = require("../models/answerModel");
const answerStudentModel_1 = require("../models/answerStudentModel");
const questionModel_1 = require("../models/questionModel");
// Create operation
const createAnswers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const answersData = req.body;
        const exam = yield examModel_1.Exam.findByPk(answersData.exam__id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        const answer = yield answerModel_1.Answer.create(answersData);
        if (answersData.answers && Array.isArray(answersData.answers) && answersData.answers.length > 0) {
            console.log("if  fotnaha");
            const ansDatas = answersData.answers;
            for (const ansData of ansDatas) {
                console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", ansData);
                const question = yield questionModel_1.Question.findByPk(ansData.question__id);
                if (!question) {
                    return res.status(404).json({ message: "question not found" });
                }
                ansData.ans__id = answer.ans__id;
                yield answerStudentModel_1.AnswerStudent.create(ansData);
            }
        }
        res.status(201).json(answer);
    }
    catch (error) {
        console.error("Error creation aswers", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createAnswers = createAnswers;
