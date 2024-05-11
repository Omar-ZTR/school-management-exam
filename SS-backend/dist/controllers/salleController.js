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
exports.deleteSalle = exports.updateSalle = exports.getSalleById = exports.getAllSalles = exports.createSalle = void 0;
const salleModel_1 = require("../models/salleModel"); // Import your Salle model
// Create operation
const createSalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salle = yield salleModel_1.Salle.create(req.body);
        res.status(201).json(salle);
    }
    catch (error) {
        console.error("Error creation salle", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createSalle = createSalle;
// Read operation - Get all salles
const getAllSalles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salles = yield salleModel_1.Salle.findAll();
        res.status(200).json(salles);
    }
    catch (error) {
        console.error("Error fetch salle:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllSalles = getAllSalles;
// Read operation - Get salle by ID
const getSalleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const salle = yield salleModel_1.Salle.findByPk(id);
        if (salle) {
            res.status(200).json(salle);
        }
        else {
            res.status(404).json({ message: "Salle not found" });
        }
    }
    catch (error) {
        console.error("Error fetch salle", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getSalleById = getSalleById;
// Update operation
const updateSalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [updated] = yield salleModel_1.Salle.update(req.body, { where: { salle__id: id } });
        if (updated) {
            const updatedSalle = yield salleModel_1.Salle.findOne({ where: { salle__id: id } });
            res.status(200).json(updatedSalle);
        }
        else {
            throw new Error('Salle not found');
        }
    }
    catch (error) {
        console.error("Error updating salle", error);
        res.status(500).send("Error updating salle");
    }
});
exports.updateSalle = updateSalle;
// Delete operation
const deleteSalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield salleModel_1.Salle.destroy({ where: { salle__id: id } });
        if (deleted) {
            res.status(204).send();
        }
        else {
            throw new Error('Salle not found');
        }
    }
    catch (error) {
        console.error("Error deleting salle", error);
        res.status(500).send("Error deleting salle");
    }
});
exports.deleteSalle = deleteSalle;
