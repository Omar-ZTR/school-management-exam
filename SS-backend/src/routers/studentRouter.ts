import express from 'express';
import { deleteStudent, getAllStudents, updateStudent } from '../controllers/studentController';



const routerStudents = express.Router();

routerStudents.get('/students', getAllStudents);




routerStudents.put('/student/:id', updateStudent);


routerStudents.delete('/student/:id', deleteStudent);

export default routerStudents;

