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
exports.deleteReponse = exports.updateReponse = exports.getAllReponses = exports.getReponseById = exports.createReponse = void 0;
const reponseModel_1 = require("../models/reponseModel"); // Import your Response model
// Create operation
const createReponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reponse = yield reponseModel_1.Reponse.create(req.body);
        res.status(201).json(reponse);
    }
    catch (error) {
        console.error("Error creation Reponse", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createReponse = createReponse;
// Get Response by ID
const getReponseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const reponse = yield reponseModel_1.Reponse.findByPk(id);
        if (reponse) {
            res.status(200).json(reponse);
        }
        else {
            res.status(404).json({ message: "Reponse not found" });
        }
    }
    catch (error) {
        console.error("Error fetch Reponse", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getReponseById = getReponseById;
// Get all responses
const getAllReponses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reponses = yield reponseModel_1.Reponse.findAll();
        res.status(200).json(reponses);
    }
    catch (error) {
        console.error("Error fetch Reponse:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllReponses = getAllReponses;
// Update operation
const updateReponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [updated] = yield reponseModel_1.Reponse.update(req.body, { where: { reponse__id: id } });
        if (updated) {
            const updatedReponse = yield reponseModel_1.Reponse.findOne({ where: { reponse__id: id } });
            res.status(200).json(updatedReponse);
        }
        else {
            throw new Error('Reponse not found');
        }
    }
    catch (error) {
        console.error("Error updating Reponse", error);
        res.status(500).send("Error updating Reponse");
    }
});
exports.updateReponse = updateReponse;
// Delete operation
const deleteReponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield reponseModel_1.Reponse.destroy({ where: { reponse__id: id } });
        if (deleted) {
            res.status(204).send();
        }
        else {
            throw new Error('Reponse not found');
        }
    }
    catch (error) {
        console.error("Error deleting Reponse", error);
        res.status(500).send("Error deleting Reponse");
    }
});
exports.deleteReponse = deleteReponse;
