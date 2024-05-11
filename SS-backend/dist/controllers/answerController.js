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
exports.deleteAnswer = exports.updateAnswer = exports.getAnswerById = exports.getAllAnswers = exports.createAnswer = void 0;
const answerModel_1 = require("../models/answerModel");
// Create operation
const createAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const answer = yield answerModel_1.Answer.create(req.body);
        res.status(201).json(answer);
    }
    catch (error) {
        console.error("Error creating answer", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createAnswer = createAnswer;
// Read operation - Get all answers
const getAllAnswers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const answers = yield answerModel_1.Answer.findAll();
        res.status(200).json(answers);
    }
    catch (error) {
        console.error("Error fetching answers:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllAnswers = getAllAnswers;
// Read operation - Get answer by ID
const getAnswerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const answer = yield answerModel_1.Answer.findByPk(id);
        if (answer) {
            res.status(200).json(answer);
        }
        else {
            res.status(404).json({ message: "Answer not found" });
        }
    }
    catch (error) {
        console.error("Error fetching answer", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAnswerById = getAnswerById;
// Update operation
const updateAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [updated] = yield answerModel_1.Answer.update(req.body, { where: { ans__id: id } });
        if (updated) {
            const updatedAnswer = yield answerModel_1.Answer.findOne({ where: { ans__id: id } });
            res.status(200).json(updatedAnswer);
        }
        else {
            throw new Error('Answer not found');
        }
    }
    catch (error) {
        console.error("Error updating answer", error);
        res.status(500).send("Error updating answer");
    }
});
exports.updateAnswer = updateAnswer;
// Delete operation
const deleteAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield answerModel_1.Answer.destroy({ where: { ans__id: id } });
        if (deleted) {
            res.status(204).send();
        }
        else {
            throw new Error('Answer not found');
        }
    }
    catch (error) {
        console.error("Error deleting answer", error);
        res.status(500).send("Error deleting answer");
    }
});
exports.deleteAnswer = deleteAnswer;
