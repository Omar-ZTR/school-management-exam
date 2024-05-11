import express from 'express';
import {
  getAllAnswers,
  getAnswerById,
  createAnswer,
  updateAnswer,
  deleteAnswer,
} from '../controllers/answerController';

const routerAnswer = express.Router();

routerAnswer.get('/', getAllAnswers);


routerAnswer.get('/Answer/:id', getAnswerById);

routerAnswer.post('/Answers', createAnswer);


routerAnswer.put('/Answers/:id', updateAnswer);


routerAnswer.delete('/Answers/:id', deleteAnswer);

export default routerAnswer;