import express from 'express';
import { deleteTeacher, getAllTeacher, TeacherByid, updatePProfile, updateTeacher } from '../controllers/teacherController';


const routerTeacher = express.Router();

routerTeacher.get('/teachers', getAllTeacher);


routerTeacher.get('/teacher/:id', TeacherByid);

routerTeacher.put('/teacher/:id', updateTeacher);

routerTeacher.put('/pdpTeacher/:id', updatePProfile);

routerTeacher.delete('/teacher/:id', deleteTeacher);

export default routerTeacher;


// {
//     "user__id": 3,
//     "first__name": "omar",
//     "last__name": "er",
//     "user__email": "teach@gmail.com",
//     "active": null,
//     "password": "4eVLumeOabx4MMFbkrY52Vn586DsFY2Qvi9hLW",
//     "specialty": "",
//     "experience": "",
//     "date": "2024-07-04T22:44:43.000Z",
//     "role": ""
// }