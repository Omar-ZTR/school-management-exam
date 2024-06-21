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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnswers = exports.createAnswers = void 0;
const examModel_1 = require("../models/examModel");
const answerModel_1 = require("../models/answerModel");
const answerStudentModel_1 = require("../models/answerStudentModel");
const questionModel_1 = require("../models/questionModel");
const reservationModel_1 = require("../models/reservationModel");
const reponseModel_1 = require("../models/reponseModel");
const fileModel_1 = require("../models/fileModel");
const upload_1 = __importDefault(require("../utils/upload"));
const baseUrl = "http://localhost:3000/files/";
// Create operation
const createAnswers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, upload_1.default)(req, res);
        const Answers = Object.assign({}, req.body);
        const answersData = JSON.parse(Answers.ans);
        const exam = yield examModel_1.Exam.findByPk(answersData.exam__id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        const answer = yield answerModel_1.Answer.create(answersData);
        if (req.files && req.files.length > 0) {
            console.log("files 7", req.files);
            for (const file of req.files) {
                const support__files = {
                    file__name: file.originalname,
                    file__path: baseUrl + file.filename,
                    file__type: "answer",
                    ans__id: answer.ans__id,
                };
                console.log("file attribute", support__files);
                yield fileModel_1.FileAnswer.create(support__files);
            }
        }
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
const getAnswers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const answers = yield answerModel_1.Answer.findAll({
            include: [
                {
                    model: answerStudentModel_1.AnswerStudent,
                    as: 'answers',
                },
                {
                    model: fileModel_1.FileAnswer,
                }
            ],
        });
        const formattedAnswers = answers.map((answer) => __awaiter(void 0, void 0, void 0, function* () {
            const examTitle = yield getTitle(answer.exam__id);
            return {
                ans__id: answer.ans__id,
                exam__id: answer.exam__id,
                exam__title: examTitle,
                Student__id: answer.Student__id,
                fileAnswer: answer.file.map((f) => ({
                    file__id: f.file__id,
                    file__name: f.file__name,
                    file__path: f.file__path,
                })),
                createdAt: answer.createdAt,
                updatedAt: answer.updatedAt,
                answers: answer.answers,
                ans__descreption: answer.ans__descreption,
            };
        }));
        // Wait for all exam titles to be fetched
        const allAnswers = yield Promise.all(formattedAnswers);
        res.status(200).json(allAnswers);
    }
    catch (error) {
        console.error('Error fetching answers', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAnswers = getAnswers;
function GetQuestionById(questionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const question = yield questionModel_1.Question.findOne({
                where: {
                    question__id: questionId,
                },
                attributes: ['question__id', 'question__text'], // Adjust attributes as needed
                include: [
                    {
                        model: reponseModel_1.Reponse,
                        as: 'reponses',
                    },
                    {
                        model: fileModel_1.FileQuestion,
                        as: 'file',
                    },
                ],
            });
            if (question) {
                return question;
            }
            else {
                throw new Error('Question not found');
            }
        }
        catch (error) {
            console.error('Error fetching question by question ID', error);
            throw error;
        }
    });
}
function getTitle(examid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const examTitle = yield reservationModel_1.Reservation.findOne({
                where: {
                    exam__id: examid,
                },
                attributes: ['exam__title'],
            });
            console.log("kllllllllllllll", examTitle.exam__title);
            return examTitle.exam__title;
        }
        catch (error) {
            console.error('Error fetching exam title by exam ID', error);
            throw error;
        }
    });
}
