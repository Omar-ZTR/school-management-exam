import express from 'express';

import { createAnswers, getAnswers, updateResult } from '../controllers/answerStudentController';

const routerAnswer = express.Router();

routerAnswer.post('/answers', createAnswers);

routerAnswer.get('/getanswers', getAnswers);
routerAnswer.put('/result/:id', updateResult);

export default routerAnswer;