import express from 'express';
import {
  getAllSalles,
  getSalleById,
  createSalle,
  updateSalle,
  deleteSalle,
} from '../controllers/salleController';

const routerSalle = express.Router();

routerSalle.get('/', getAllSalles);


routerSalle.get('/Salle/:id', getSalleById);

routerSalle.post('/Salles', createSalle);


routerSalle.put('/Salles/:id', updateSalle);


routerSalle.delete('/Salles/:id', deleteSalle);

export default routerSalle;