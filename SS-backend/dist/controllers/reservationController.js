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
exports.deleteReservation = exports.updateReservation = exports.getReservationById = exports.getAllReservations = exports.createReservation = void 0;
const reservationModel_1 = require("../models/reservationModel"); // Import your Reservation model
// Create operation
const createReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reservation = yield reservationModel_1.Reservation.create(req.body);
        res.status(201).json(reservation);
    }
    catch (error) {
        console.error("Error creation reservation", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createReservation = createReservation;
// Read operation - Get all reservations
const getAllReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reservations = yield reservationModel_1.Reservation.findAll();
        res.status(200).json(reservations);
    }
    catch (error) {
        console.error("Error fetch reservations:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
    ;
});
exports.getAllReservations = getAllReservations;
// Read operation - Get reservation by ID
const getReservationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const reservation = yield reservationModel_1.Reservation.findByPk(id);
        if (reservation) {
            res.status(200).json(reservation);
        }
        else {
            res.status(404).json({ message: "Reservation not found" });
        }
    }
    catch (error) {
        console.error("Error fetch reservation", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getReservationById = getReservationById;
// Update operation
const updateReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [updated] = yield reservationModel_1.Reservation.update(req.body, { where: { reserv__id: id } });
        if (updated) {
            const updatedReservation = yield reservationModel_1.Reservation.findOne({ where: { reserv__id: id } });
            res.status(200).json(updatedReservation);
        }
        else {
            throw new Error('Reservation not found');
        }
    }
    catch (error) {
        console.error("Error deleting reservation", error);
        res.status(500).send("Error deleting reservation");
    }
});
exports.updateReservation = updateReservation;
// Delete operation
const deleteReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield reservationModel_1.Reservation.destroy({ where: { reserv__id: id } });
        if (deleted) {
            res.status(204).send();
        }
        else {
            throw new Error('Reservation not found');
        }
    }
    catch (error) {
        console.error("Error deleting reservation", error);
        res.status(500).send("Error deleting reservation");
    }
});
exports.deleteReservation = deleteReservation;
