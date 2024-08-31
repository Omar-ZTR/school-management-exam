import express from 'express';
import { deleteTeacher, getAllTeacher, TeacherByid, updatePProfile, updateTeacher } from '../controllers/teacherController';


const routerTeacher = express.Router();

routerTeacher.get('/teachers', getAllTeacher);


routerTeacher.get('/teacher/:id', TeacherByid);

routerTeacher.put('/teacher/:id', updateTeacher);

routerTeacher.put('/pdpTeacher/:id', updatePProfile);

routerTeacher.delete('/teacher/:id', deleteTeacher);

export default routerTeacher;

