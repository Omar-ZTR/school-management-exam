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
exports.deleteQuestion = exports.updateQuestion = exports.getAllQuestions = exports.getQuestionById = exports.createQuestion = void 0;
const questionModel_1 = require("../models/questionModel"); // Import your Question model
// Create operation
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const question = yield questionModel_1.Question.create(req.body);
        res.status(201).json(question);
    }
    catch (error) {
        console.error("Error creation question", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createQuestion = createQuestion;
// Get Question by ID
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
        res.status(500).json({ error: 'Internal server error' });
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
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllQuestions = getAllQuestions;
// Update operation
const updateQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [updated] = yield questionModel_1.Question.update(req.body, { where: { question__id: id } });
        if (updated) {
            const updatedQuestion = yield questionModel_1.Question.findOne({ where: { question__id: id } });
            res.status(200).json(updatedQuestion);
        }
        else {
            throw new Error('Question not found');
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
            throw new Error('Question not found');
        }
    }
    catch (error) {
        console.error("Error deleting question", error);
        res.status(500).send("Error deleting question");
    }
});
exports.deleteQuestion = deleteQuestion;
