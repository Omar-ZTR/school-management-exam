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
exports.deleteExam = exports.updateExam = exports.getAllExams = exports.getExamById = exports.createExam = void 0;
const examModel_1 = require("../models/examModel"); // Import your Exam model
const upload_1 = __importDefault(require("../utils/upload"));
const reponseModel_1 = require("../models/reponseModel");
const questionModel_1 = require("../models/questionModel");
const fileModel_1 = require("../models/fileModel");
const baseUrl = "http://localhost:3000/files/";
// Create operation
const createExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("exam bssdena");
    try {
        console.log("exam bdena", req.file);
        yield (0, upload_1.default)(req, res); // Handle file upload
        console.log("exam bdena", req.file);
        const examDatas = Object.assign({}, req.body); // Assuming exam data is in req.body
        console.log("exam bdesssna", examDatas);
        const examData = JSON.parse(examDatas.exam);
        console.log("LLLL json", examData);
        const exam = yield examModel_1.Exam.create(examData);
        console.log("exam fotnaha");
        if (req.file !== undefined) {
            console.log("file defined", req.file);
            // If file uploaded, save file information in the support__files attribute
            const support__files = {
                file__name: req.file.originalname,
                file__path: baseUrl + req.file.filename,
                file__type: "support",
                exam__id: exam.exam__id
            };
            console.log("file attribute", support__files);
            const filesup = yield fileModel_1.File.create({
                file__name: req.file.originalname,
                file__path: baseUrl + req.file.filename,
                file__type: "support",
                exam__id: exam.exam__id
            });
        }
        console.log("file fotnaha");
        // Create the questions for the exam
        if (examData.questions &&
            Array.isArray(examData.questions) &&
            examData.questions.length > 0) {
            console.log("if eloula fotnaha");
            const questionsData = examData.questions;
            for (const questionData of questionsData) {
                questionData.exam__id = exam.exam__id;
                const question = yield questionModel_1.Question.create(questionData);
                console.log("question fotnaha");
                // Create the responses for each question
                if (questionData.reponses &&
                    Array.isArray(questionData.reponses) &&
                    questionData.reponses.length > 0) {
                    console.log("if ethanya fotnaha");
                    const responsesData = questionData.reponses;
                    for (const responseData of responsesData) {
                        responseData.question__id = question.question__id;
                        yield reponseModel_1.Reponse.create(responseData);
                    }
                }
            }
        }
        res.status(201).json(exam);
    }
    catch (error) {
        console.error("Error creation exam", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createExam = createExam;
// Get Exam by ID
const getExamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const exam = yield examModel_1.Exam.findByPk(id);
        if (exam) {
            res.status(200).json(exam);
        }
        else {
            res.status(404).json({ message: "Exam not found" });
        }
    }
    catch (error) {
        console.error("Error fetch exam", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getExamById = getExamById;
// Get all exams
const getAllExams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exams = yield examModel_1.Exam.findAll();
        res.status(200).json(exams);
    }
    catch (error) {
        console.error("Error fetch exams:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllExams = getAllExams;
// Update operation
const updateExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [updated] = yield examModel_1.Exam.update(req.body, { where: { exam__id: id } });
        if (updated) {
            const updatedExam = yield examModel_1.Exam.findOne({ where: { exam__id: id } });
            res.status(200).json(updatedExam);
        }
        else {
            throw new Error("Exam not found");
        }
    }
    catch (error) {
        console.error("Error updating exam", error);
        res.status(500).send("Error updating exam");
    }
});
exports.updateExam = updateExam;
// Delete operation
const deleteExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield examModel_1.Exam.destroy({ where: { exam__id: id } });
        if (deleted) {
            res.status(204).send();
        }
        else {
            throw new Error("Exam not found");
        }
    }
    catch (error) {
        console.error("Error deleting exam", error);
        res.status(500).send("Error deleting exam");
    }
});
exports.deleteExam = deleteExam;
