import express from 'express';
import { CheckSubjects, CreateSubject, deleteSubject, getSubjects, UpdateSubject } from "../controllers/subjectController";

const routersubject = express.Router();

routersubject.post("/subject", CreateSubject);

routersubject.get("/subjects", getSubjects);


routersubject.get("/subjectscheck/:sub", CheckSubjects);

routersubject.put('/subject/:id', UpdateSubject);


routersubject.delete('/subject/:id', deleteSubject);

export default routersubject;



