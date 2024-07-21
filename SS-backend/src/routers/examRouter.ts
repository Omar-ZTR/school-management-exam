import express from 'express';
import {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,

  getExamsGroupsStutents,
  getFilteredExams,
  getFullExams,
  getTeacherExams,
} from '../controllers/examController';
import { createAnswers, getAnswers } from '../controllers/answerStudentController';

const routerExam= express.Router();

routerExam.get('/allexams', getAllExams);


routerExam.get('/examCertif', getFilteredExams);

routerExam.get('/examsGS', getExamsGroupsStutents);

routerExam.get('/exams', getFullExams);

routerExam.get('/examsTeach/:id', getTeacherExams);

routerExam.get('/exams/:id', getExamById);


routerExam.post('/examc', createExam);

routerExam.put('/Exams/:id', updateExam);


routerExam.delete('/exam/:id', deleteExam);



export default routerExam