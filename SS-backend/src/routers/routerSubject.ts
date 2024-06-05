import express from 'express';
import { getSubjects } from "../controllers/subjectController";

const routersubject = express.Router();

routersubject.get("/subjects", getSubjects);

export default routersubject;



