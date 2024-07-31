import express from 'express';

import { createAnswers, getAnswers, getStudentAnswers, updateResult } from '../controllers/answerStudentController';

const routerAnswer = express.Router();

routerAnswer.post('/answers', createAnswers);

routerAnswer.get('/getanswers/:id', getAnswers);


routerAnswer.put('/result/:id', updateResult);


routerAnswer.get('/studentanswer/:id', getStudentAnswers);

export default routerAnswer;