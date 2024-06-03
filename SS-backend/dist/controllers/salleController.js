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
exports.deleteSalle = exports.updateSalle = exports.getSalleById = exports.getSallesSpecific = exports.getAllSalles = exports.createSalle = void 0;
const sequelize_1 = require("sequelize");
const reservationModel_1 = require("../models/reservationModel");
const salleModel_1 = require("../models/salleModel"); // Import your Salle model
// Create operation
const createSalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salle = yield salleModel_1.Salle.create(req.body);
        res.status(201).json(salle);
    }
    catch (error) {
        console.error("Error creation salle", error);
        res.status(500).json({ error: "Internal server error" });
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
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllSalles = getAllSalles;
const getSallesSpecific = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { starthour, endhour, nb } = req.body;
    if (!starthour || !endhour) {
        return res.status(400).json({ error: "Hours are required" });
    }
    try {
        const reservations = yield reservationModel_1.Reservation.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    {
                        startDate: {
                            [sequelize_1.Op.and]: [
                                {
                                    [sequelize_1.Op.gte]: starthour,
                                },
                                {
                                    [sequelize_1.Op.lte]: endhour,
                                },
                            ],
                        },
                    },
                    {
                        endDate: {
                            [sequelize_1.Op.and]: [
                                {
                                    [sequelize_1.Op.gte]: starthour,
                                },
                                {
                                    [sequelize_1.Op.lte]: endhour,
                                },
                            ],
                        },
                    },
                ],
            },
            attributes: ["salle"],
        });
        let availableSalles;
        if (reservations.length === 0) {
            // If there are no reservations, return all salles
            if (nb !== undefined) {
                availableSalles = yield salleModel_1.Salle.findAll({
                    where: {
                        nb__place: {
                            [sequelize_1.Op.gte]: nb,
                        },
                    },
                });
            }
            else {
                availableSalles = yield salleModel_1.Salle.findAll();
            }
        }
        else {
            // If there are reservations, find salles not in the reserved list
            const reservedSalles = reservations.map((reservation) => reservation.salle);
            if (nb !== undefined) {
                availableSalles = yield salleModel_1.Salle.findAll({
                    where: {
                        salle__name: {
                            [sequelize_1.Op.notIn]: reservedSalles,
                        },
                        nb__place: {
                            [sequelize_1.Op.gte]: nb,
                        },
                    },
                });
            }
            else {
                availableSalles = yield salleModel_1.Salle.findAll({
                    where: {
                        salle__name: {
                            [sequelize_1.Op.notIn]: reservedSalles,
                        },
                    },
                });
            }
        }
        res.status(200).json(availableSalles);
    }
    catch (error) {
        console.error("Error fetching available salles:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getSallesSpecific = getSallesSpecific;
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
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getSalleById = getSalleById;
// Update operation
const updateSalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [updated] = yield salleModel_1.Salle.update(req.body, {
            where: { salle__id: id },
        });
        if (updated) {
            const updatedSalle = yield salleModel_1.Salle.findOne({ where: { salle__id: id } });
            res.status(200).json(updatedSalle);
        }
        else {
            throw new Error("Salle not found");
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
            throw new Error("Salle not found");
        }
    }
    catch (error) {
        console.error("Error deleting salle", error);
        res.status(500).send("Error deleting salle");
    }
});
exports.deleteSalle = deleteSalle;
