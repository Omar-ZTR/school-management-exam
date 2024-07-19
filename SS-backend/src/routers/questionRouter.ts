import express from 'express';
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getFakeQuestions,
  QuestionById,
  CheckAssociation,
} from '../controllers/questionController';

const routerQuestion = express.Router();

routerQuestion.get('/', getAllQuestions);

routerQuestion.get('/fake', QuestionById);

routerQuestion.get('/question/:id', getQuestionById);

routerQuestion.post('/question', createQuestion);

routerQuestion.get('/checkAssociation/:id', CheckAssociation);

routerQuestion.put('/question/:id', updateQuestion);


routerQuestion.delete('/question/:id', deleteQuestion);

export default routerQuestion;