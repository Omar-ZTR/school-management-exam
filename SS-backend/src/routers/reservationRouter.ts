import express from 'express';
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
} from '../controllers/reservationController';

const routerReservation = express.Router();

routerReservation.get('/', getAllReservations);


routerReservation.get('/Reservation/:id', getReservationById);

routerReservation.post('/Reservations', createReservation);


routerReservation.put('/Reservations/:id', updateReservation);


routerReservation.delete('/Reservations/:id', deleteReservation);

export default routerReservation;