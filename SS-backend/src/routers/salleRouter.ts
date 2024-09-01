import express from 'express';
import {
  getAllSalles,
  getSalleById,
  createSalle,
  updateSalle,
  deleteSalle,
  getSallesSpecific,
  CheckSalles,
} from '../controllers/salleController';

const routerSalle = express.Router();

routerSalle.get('/salle', getAllSalles);

routerSalle.post('/salleSpecific', getSallesSpecific);

routerSalle.get('/salle/:id', getSalleById);

routerSalle.get('/salleCheckRe/:id', CheckSalles);

routerSalle.post('/salle', createSalle);


routerSalle.put('/salle/:id', updateSalle);


routerSalle.delete('/salle/:id', deleteSalle);

export default routerSalle;