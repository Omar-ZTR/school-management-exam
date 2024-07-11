import express from "express";
import {
  deleteStudent,
  getAllStudents,
  getChartStudentCount,
  getDaysStudentCount,
  getMonthlyStudentCount,
  updateStudent,
} from "../controllers/studentController";

const routerStudents = express.Router();

routerStudents.get("/students", getAllStudents);

routerStudents.get("/studentMonthly", getMonthlyStudentCount);
routerStudents.get("/studentChart", getChartStudentCount);
routerStudents.get("/studentDays", getDaysStudentCount);

routerStudents.put("/student/:id", updateStudent);

routerStudents.delete("/student/:id", deleteStudent);

export default routerStudents;
