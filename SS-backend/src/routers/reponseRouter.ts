import express from 'express';
import {
  getAllReponses,
  getReponseById,
  createReponse,
  updateReponse,
  deleteReponse,
} from '../controllers/responseController';

const routerReponse = express.Router();

routerReponse.get('/', getAllReponses);


routerReponse.get('/Reponse/:id', getReponseById);

routerReponse.post('/Reponses', createReponse);


routerReponse.put('/Reponses/:id', updateReponse);


routerReponse.delete('/Reponses/:id', deleteReponse);

export default routerReponse;