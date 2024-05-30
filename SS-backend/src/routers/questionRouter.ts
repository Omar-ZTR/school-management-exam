import express from 'express';
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getFakeQuestions,
} from '../controllers/questionController';

const routerQuestion = express.Router();

routerQuestion.get('/', getAllQuestions);

routerQuestion.get('/fake', getFakeQuestions);

routerQuestion.get('/question/:id', getQuestionById);

routerQuestion.post('/question', createQuestion);


routerQuestion.put('/questions/:id', updateQuestion);


routerQuestion.delete('/questions/:id', deleteQuestion);

export default routerQuestion;