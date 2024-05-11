"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservationController_1 = require("../controllers/reservationController");
const routerReservation = express_1.default.Router();
routerReservation.get('/', reservationController_1.getAllReservations);
routerReservation.get('/Reservation/:id', reservationController_1.getReservationById);
routerReservation.post('/Reservations', reservationController_1.createReservation);
routerReservation.put('/Reservations/:id', reservationController_1.updateReservation);
routerReservation.delete('/Reservations/:id', reservationController_1.deleteReservation);
exports.default = routerReservation;
