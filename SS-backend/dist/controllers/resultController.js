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
exports.deleteResult = exports.updateResult = exports.getResultById = exports.getAllResults = exports.createResult = void 0;
const resultModel_1 = require("../models/resultModel");
// Create operation
const createResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield resultModel_1.Result.create(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        console.error("Error creating result", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createResult = createResult;
// Read operation - Get all results
const getAllResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield resultModel_1.Result.findAll();
        res.status(200).json(results);
    }
    catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllResults = getAllResults;
// Read operation - Get result by ID
const getResultById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield resultModel_1.Result.findByPk(id);
        if (result) {
            res.status(200).json(result);
        }
        else {
            res.status(404).json({ message: "Result not found" });
        }
    }
    catch (error) {
        console.error("Error fetching result", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getResultById = getResultById;
// Update operation
const updateResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [updated] = yield resultModel_1.Result.update(req.body, { where: { result__id: id } });
        if (updated) {
            const updatedResult = yield resultModel_1.Result.findOne({ where: { result__id: id } });
            res.status(200).json(updatedResult);
        }
        else {
            throw new Error('Result not found');
        }
    }
    catch (error) {
        console.error("Error updating result", error);
        res.status(500).send("Error updating result");
    }
});
exports.updateResult = updateResult;
// Delete operation
const deleteResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield resultModel_1.Result.destroy({ where: { result__id: id } });
        if (deleted) {
            res.status(204).send();
        }
        else {
            throw new Error('Result not found');
        }
    }
    catch (error) {
        console.error("Error deleting result", error);
        res.status(500).send("Error deleting result");
    }
});
exports.deleteResult = deleteResult;
