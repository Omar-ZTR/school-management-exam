import express from 'express';
import {
  getAllResults,
  getResultById,
  createResult,
  updateResult,
  deleteResult,
} from '../controllers/resultController';

const routerResult = express.Router();

routerResult.get('/', getAllResults);


routerResult.get('/Result/:id', getResultById);

routerResult.post('/Results', createResult);


routerResult.put('/Results/:id', updateResult);


routerResult.delete('/Results/:id', deleteResult);

export default routerResult;