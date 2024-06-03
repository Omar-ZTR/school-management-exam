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
exports.deleteExam = exports.updateExam = exports.getTeacherExams = exports.getAllExams = exports.getExamById = exports.createExam = void 0;
const examModel_1 = require("../models/examModel"); // Import your Exam model
const upload_1 = __importDefault(require("../utils/upload"));
const reponseModel_1 = require("../models/reponseModel");
const questionModel_1 = require("../models/questionModel");
const fileModel_1 = require("../models/fileModel");
const reservationModel_1 = require("../models/reservationModel");
const baseUrl = "http://localhost:3000/files/";
// Create operation
const createExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("exam 1", req.body);
    try {
        console.log("exam 2", req.body.files);
        yield (0, upload_1.default)(req, res); // Handle file upload
        console.log("exam 3", req.body.file);
        const examDatas = Object.assign({}, req.body); // Assuming exam data is in req.body
        console.log("exam 4", examDatas);
        const examData = JSON.parse(examDatas.exam);
        console.log("LLLL 5", examData);
        const exam = yield examModel_1.Exam.create(examData);
        console.log("exam 6");
        if (req.file !== undefined) {
            console.log("file 7", req.file);
            // If file uploaded, save file information in the support__files attribute
            const support__files = {
                file__name: req.file.originalname,
                file__path: baseUrl + req.file.filename,
                file__type: "support",
                exam__id: exam.exam__id
            };
            console.log("file attribute", support__files);
            const filesup = yield fileModel_1.FileExam.create({
                file__name: req.file.originalname,
                file__path: baseUrl + req.file.filename,
                file__type: "support",
                exam__id: exam.exam__id
            });
        }
        console.log("file 8");
        // Create the questions for the exam
        if (examDatas.questions &&
            Array.isArray(examDatas.questions) &&
            examDatas.questions.length > 0) {
            console.log("if eloula fotnaha");
            const questionsData = examDatas.questions;
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
const getTeacherExams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exams = yield examModel_1.Exam.findAll({
            include: [
                { model: questionModel_1.Question },
                { model: reservationModel_1.Reservation },
                { model: fileModel_1.FileExam },
            ],
        });
        res.status(200).json(exams);
    }
    catch (error) {
        console.error("Error fetching exams:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getTeacherExams = getTeacherExams;
// Update operation
const updateExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Request Body:", req.body);
        console.log("Request Params:", req.params);
        const { id } = req.params;
        const { operation } = req.body;
        // Validate the operation
        if (typeof operation !== 'number') {
            return res.status(400).send("Invalid operation value");
        }
        // Find the exam by primary key
        const exam = yield examModel_1.Exam.findByPk(id);
        if (!exam) {
            return res.status(404).send("Exam not found");
        }
        console.log("Existing Exam:", exam);
        // Update the nb__reserve field
        const nb__reserve = exam.nb__reserve + operation;
        const [updated] = yield examModel_1.Exam.update({ nb__reserve }, { where: { exam__id: id } });
        if (updated) {
            const updatedExam = yield examModel_1.Exam.findOne({ where: { exam__id: id } });
            res.status(200).json(updatedExam);
        }
        else {
            res.status(500).send("Failed to update exam");
        }
    }
    catch (error) {
        console.error("Error updating exam:", error);
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
