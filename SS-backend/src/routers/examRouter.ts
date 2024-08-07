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
  updateExamFile,
  addDescreptionExam,
  getfullCertifExam,
} from '../controllers/examController';
import { createAnswers, getAnswers } from '../controllers/answerStudentController';

const routerExam= express.Router();

routerExam.get('/allexams', getAllExams);


routerExam.get('/examCertif', getFilteredExams);
routerExam.get('/examfullCertif', getfullCertifExam);
routerExam.get('/examsGS/:id', getExamsGroupsStutents);

routerExam.get('/exams', getFullExams);

routerExam.get('/examsTeach/:id', getTeacherExams);

routerExam.get('/exams/:id', getExamById);

routerExam.put('/ExamDesc/:id', addDescreptionExam);
routerExam.post('/examc', createExam);
routerExam.post('/examUPfile/:id', updateExamFile);
routerExam.put('/Exams/:id', updateExam);


routerExam.delete('/exam/:id', deleteExam);



export default routerExam