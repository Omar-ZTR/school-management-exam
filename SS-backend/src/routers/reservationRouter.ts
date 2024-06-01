import express from 'express';
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
} from '../controllers/reservationController';

const routerReservation = express.Router();

routerReservation.get('/reservation', getAllReservations);


routerReservation.get('/reservation/:id', getReservationById);

routerReservation.post('/reservation', createReservation);


routerReservation.put('/reservation/:id', updateReservation);


routerReservation.delete('/reservation/:id', deleteReservation);

export default routerReservation;