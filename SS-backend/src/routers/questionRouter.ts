import express from 'express';
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controllers/questionController';

const routerQuestion = express.Router();

routerQuestion.get('/', getAllQuestions);


routerQuestion.get('/Question/:id', getQuestionById);

routerQuestion.post('/Questions', createQuestion);


routerQuestion.put('/Questions/:id', updateQuestion);


routerQuestion.delete('/Questions/:id', deleteQuestion);

export default routerQuestion;