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
exports.deleteQuestion = exports.updateQuestion = exports.getAllQuestions = exports.getQuestionById = exports.updateQuestionsWithExam = exports.getFakeQuestions = exports.QuestionById = exports.createQuestion = void 0;
const questionModel_1 = require("../models/questionModel"); // Import your Question model
const reponseModel_1 = require("../models/reponseModel");
const fileModel_1 = require("../models/fileModel");
const examModel_1 = require("../models/examModel");
const upload_1 = __importDefault(require("../utils/upload"));
const baseUrl = "http://localhost:3000/files/";
// Create operation
// export const createQuestion = async (req: Request, res: Response) => {
//   try {
//     console.log("exam 2", req.files);
//     await uploadFile(req, res); // Handle file upload
//     console.log("exam 3", req.file);
//     const questDatas = { ...req.body }; 
// console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>",questDatas)
//     // Assuming exam data is in req.body
//     console.log("exam 4", questDatas[0]);
//     const questionData = JSON.parse(questDatas.question);
//     console.log("Parsed question data:", questionData);
//     const question = await Question.create(questionData);
//     console.log("exam 6");
//     if (req.files && req.files.length != 0) {
//       console.log("file 7", req.file);
//       for (const file of req.files as Express.Multer.File[]) {
//         const support__files = {
//           file__name: file.originalname,
//           file__path: baseUrl + file.filename,
//           file__type: "Question",
//           question__id: question.question__id,
//         };
//         console.log("file attribute", support__files);
//         const filesup = await FileQuestion.create({
//           file__name: file.originalname,
//           file__path: baseUrl + file.filename,
//           file__type: "Question",
//           question__id: question.question__id,
//         });
//       }
//     }
//     console.log("file 8");
//     // Create the questions for the exam
//     if (
//       questDatas.reponses &&
//       Array.isArray(questDatas.reponses) &&
//       questDatas.reponses.length > 0
//     ) {
//       console.log("if ethanya fotnaha");
//       const responsesData = questDatas.reponses;
//       for (const responseData of responsesData) {
//         responseData.question__id = question.question__id;
//         await Reponse.create(responseData);
//       }
//     }
//     res.status(201).json(question);
//   } catch (error) {
//     console.error("Error creation exam", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("exam 2", req.files);
        yield (0, upload_1.default)(req, res);
        console.log("exam 3", req.file);
        const questDatas = Object.assign({}, req.body);
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>", questDatas);
        // Assuming exam data is in req.body
        console.log("exam 4", questDatas[0]);
        const questionData = JSON.parse(questDatas.question);
        console.log("Parsed question data:", questionData);
        const question = yield questionModel_1.Question.create(questionData);
        console.log("exam 6");
        if (req.files && req.files.length > 0) {
            console.log("files 7", req.files);
            for (const file of req.files) {
                const support__files = {
                    file__name: file.originalname,
                    file__path: baseUrl + file.filename,
                    file__type: "Question",
                    question__id: question.question__id,
                };
                console.log("file attribute", support__files);
                yield fileModel_1.FileQuestion.create(support__files);
            }
        }
        console.log("file 8", questDatas);
        // Associate question with exam if exam__id is provided
        if (questionData.exam__id) {
            const exam = yield examModel_1.Exam.findByPk(questionData.exam__id);
            if (exam) {
                yield exam.$add('questions', question);
                console.log(`Associated question ${question.question__id} with exam ${questionData.exam__id}`);
            }
        }
        console.log(",,,,,,,,,,,,,,,,,,,,3332,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", questionData.reponses);
        // Create the responses for the question
        if (questionData.reponses && Array.isArray(questionData.reponses) && questionData.reponses.length > 0) {
            console.log("if ethanya fotnaha");
            const responsesData = questionData.reponses;
            for (const responseData of responsesData) {
                console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", responseData);
                responseData.question__id = question.question__id;
                yield reponseModel_1.Reponse.create(responseData);
            }
        }
        res.status(201).json(question);
    }
    catch (error) {
        console.error("Error creating question", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createQuestion = createQuestion;
// getby Id
const QuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params;
        const questions = yield questionModel_1.Question.findOne({
            where: {
                question__id: id,
            },
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
        console.log("<><<<>>", questions);
        res.status(200).json(questions);
    }
    catch (error) {
        console.error("Error fetching questions with files", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.QuestionById = QuestionById;
// Get fake Question 
const getFakeQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const examId = -1;
        const questions = yield questionModel_1.Question.findAll({
            include: [
                {
                    model: examModel_1.Exam,
                    as: 'exams',
                    where: { exam__id: examId },
                    through: { attributes: [] } // Exclude join table attributes
                },
                {
                    model: fileModel_1.FileQuestion,
                    as: 'file',
                    required: false,
                },
            ],
        });
        console.log("<><<<>>", questions);
        res.status(200).json(questions);
    }
    catch (error) {
        console.error("Error fetching questions with files", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getFakeQuestions = getFakeQuestions;
const updateQuestionsWithExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { exam__id, questionIds } = req.body;
        if (!exam__id || !Array.isArray(questionIds) || questionIds.length === 0) {
            return res.status(400).json({ error: "Invalid input data" });
        }
        const exam = yield examModel_1.Exam.findByPk(exam__id);
        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }
        const questions = yield questionModel_1.Question.findAll({
            where: {
                question__id: questionIds,
            },
        });
        if (questions.length !== questionIds.length) {
            return res.status(404).json({ error: "One or more questions not found" });
        }
        yield exam.$add('questions', questions);
        return questions;
    }
    catch (error) {
        console.error("Error updating questions with exam", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateQuestionsWithExam = updateQuestionsWithExam;
const getQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const question = yield questionModel_1.Question.findByPk(id);
        if (question) {
            res.status(200).json(question);
        }
        else {
            res.status(404).json({ message: "Question not found" });
        }
    }
    catch (error) {
        console.error("Error fetch question", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getQuestionById = getQuestionById;
// Read operation - Get all questions
const getAllQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield questionModel_1.Question.findAll();
        res.status(200).json(questions);
    }
    catch (error) {
        console.error("Error fetch questions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllQuestions = getAllQuestions;
// Update operation
const updateQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [updated] = yield questionModel_1.Question.update(req.body, {
            where: { question__id: id },
        });
        if (updated) {
            const updatedQuestion = yield questionModel_1.Question.findOne({
                where: { question__id: id },
            });
            res.status(200).json(updatedQuestion);
        }
        else {
            throw new Error("Question not found");
        }
    }
    catch (error) {
        console.error("Error updating question", error);
        res.status(500).send("Error updating question");
    }
});
exports.updateQuestion = updateQuestion;
// Delete operation
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield questionModel_1.Question.destroy({ where: { question__id: id } });
        if (deleted) {
            res.status(204).send();
        }
        else {
            throw new Error("Question not found");
        }
    }
    catch (error) {
        console.error("Error deleting question", error);
        res.status(500).send("Error deleting question");
    }
});
exports.deleteQuestion = deleteQuestion;
