import express from 'express';
import {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getTeacherExams,
} from '../controllers/examController';

const routerExam= express.Router();

routerExam.get('/allexams', getAllExams);


routerExam.get('/exams', getTeacherExams);

routerExam.get('/Exams/:id', getExamById);


routerExam.post('/examc', createExam);

routerExam.put('/Exams/:id', updateExam);


routerExam.delete('/Exams/:id', deleteExam);

export default routerExam