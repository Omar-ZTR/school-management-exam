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
exports.deleteSalle = exports.CheckSalles = exports.updateSalle = exports.getSalleById = exports.getSallesSpecific = exports.getAllSalles = exports.createSalle = void 0;
const sequelize_1 = require("sequelize");
const reservationModel_1 = require("../models/reservationModel");
const salleModel_1 = require("../models/salleModel"); // Import your Salle model
// Create 
const createSalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salle = yield salleModel_1.Salle.create(req.body);
        const newSalle = yield salleModel_1.Salle.findOne({
            where: { salle__id: salle.salle__id },
        });
        res.status(201).json(newSalle);
    }
    catch (error) {
        console.error("Error creation salle", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createSalle = createSalle;
//Get all salles
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
    try {
        const { starthour, endhour, reserv__id } = req.body;
        console.log("start", starthour, "end", endhour, "id is ", reserv__id);
        if (!starthour || !endhour) {
            return res.status(400).json({ error: "Hours are required" });
        }
        const start = new Date(starthour);
        const end = new Date(endhour);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
        }
        const durationMs = end.getTime() - start.getTime();
        const reservations = yield reservationModel_1.Reservation.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    {
                        startDate: {
                            [sequelize_1.Op.lt]: new Date(start.getTime() + durationMs),
                        },
                        endDate: {
                            [sequelize_1.Op.gte]: end,
                        },
                        reserv__id: {
                            [sequelize_1.Op.ne]: reserv__id,
                        },
                    },
                    {
                        endDate: {
                            [sequelize_1.Op.and]: [
                                {
                                    [sequelize_1.Op.lte]: new Date(start.getTime() + durationMs),
                                },
                                { [sequelize_1.Op.gt]: start },
                            ],
                        },
                        startDate: {
                            [sequelize_1.Op.lte]: start,
                        },
                        reserv__id: {
                            [sequelize_1.Op.ne]: reserv__id,
                        },
                    },
                    {
                        endDate: {
                            [sequelize_1.Op.gt]: end,
                        },
                        startDate: {
                            [sequelize_1.Op.lt]: start,
                        },
                        reserv__id: {
                            [sequelize_1.Op.ne]: reserv__id,
                        },
                    },
                    {
                        endDate: {
                            [sequelize_1.Op.lte]: end,
                        },
                        startDate: {
                            [sequelize_1.Op.gte]: start,
                        },
                        reserv__id: {
                            [sequelize_1.Op.ne]: reserv__id,
                        },
                    },
                ],
            },
            attributes: ["salle"],
        });
        console.log("Reservations:", reservations);
        let salles = [];
        if (reservations.length > 0) {
            const salleNames = reservations.map(reservation => reservation.salle);
            salles = yield salleModel_1.Salle.findAll({
                where: {
                    salle__id: {
                        [sequelize_1.Op.notIn]: salleNames,
                    },
                },
            });
        }
        else {
            salles = yield salleModel_1.Salle.findAll();
        }
        console.log("Available Salles:", salles);
        res.status(200).json(salles);
    }
    catch (error) {
        console.error("Error fetching available salles:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getSallesSpecific = getSallesSpecific;
// const examreservations = await Reservation.findAll({
//   where: {
//     [Op.and]: [
//       {
//         startDate: {
//           [Op.eq]: start,
//         },
//         reserv__id: {
//           [Op.eq]: nb,
//         },
//       },
//     ],
//   },
//   attributes: ["salle , group__name"],
// });
// console.log("exaaaa ress", examreservations);
// let availableSalles: any[];
// if (reservations.length === 0) {
//   // If there are no reservations, return all salles
//   if (nb !== undefined) {
//     availableSalles = await Salle.findAll({
//       where: {
//         nb__place: {
//           [Op.gte]: nb,
//         },
//       },
//     });
//   } else {
//     availableSalles = await Salle.findAll();
//   }
// } else {
//   // If there are reservations, find salles not in the reserved list
//   const reservedSalles = reservations.map(
//     (reservation) => reservation.salle
//   );
//   if (nb !== undefined) {
//     availableSalles = await Salle.findAll({
//       where: {
//         salle__name: {
//           [Op.notIn]: reservedSalles,
//         },
//         nb__place: {
//           [Op.gte]: nb,
//         },
//       },
//     });
//   } else {
//     availableSalles = await Salle.findAll({
//       where: {
//         salle__name: {
//           [Op.notIn]: reservedSalles,
//         },
//       },
//     });
//   }
// }
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
// Update 
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
const CheckSalles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const currentDate = new Date();
        let SchudExam = 0;
        const scheduls = yield reservationModel_1.Reservation.findOne({ where: { salle: id, endDate: { [sequelize_1.Op.gt]: currentDate } }, });
        if (scheduls) {
            console.log("mn", scheduls);
            SchudExam = SchudExam + 1;
        }
        const Count = SchudExam;
        console.log("Count is Count", Count);
        console.log("SchudExam is SchudExam", SchudExam);
        res.status(200).json(Count);
    }
    catch (error) {
        console.error("Error fetching subjects", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.CheckSalles = CheckSalles;
// Delete 
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
