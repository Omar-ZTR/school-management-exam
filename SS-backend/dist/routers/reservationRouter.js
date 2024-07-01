"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservationController_1 = require("../controllers/reservationController");
const routerReservation = express_1.default.Router();
routerReservation.get('/reservation', reservationController_1.getAllReservations);
routerReservation.get('/specificreservation', reservationController_1.getSpecificReservations);
routerReservation.get('/reservation/:id', reservationController_1.getReservationById);
routerReservation.post('/reservation', reservationController_1.createReservation);
routerReservation.put('/reservation/:id', reservationController_1.updateReservation);
routerReservation.delete('/reservation/:id', reservationController_1.deleteReservation);
exports.default = routerReservation;
