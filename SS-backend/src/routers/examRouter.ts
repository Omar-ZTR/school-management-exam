import express from 'express';
import {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getTeacherExams,
  getExamsGroupsStutents,
} from '../controllers/examController';
import { createAnswers } from '../controllers/answerStudentController';

const routerExam= express.Router();

routerExam.get('/allexams', getAllExams);


routerExam.get('/examsGS', getExamsGroupsStutents);

routerExam.get('/exams', getTeacherExams);

routerExam.get('/exams/:id', getExamById);


routerExam.post('/examc', createExam);

routerExam.put('/Exams/:id', updateExam);


routerExam.delete('/Exams/:id', deleteExam);

//Answers

routerExam.post('/answers', createAnswers);

export default routerExam