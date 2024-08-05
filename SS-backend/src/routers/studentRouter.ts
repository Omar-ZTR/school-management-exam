import express from "express";
import {
  deleteStudent,
  getAllStudents,
  getChartStudentCount,
  getDaysStudentCount,
  getMonthlyStudentCount,
  getstudentbyid,
  updatePictureProfile,
  updateStudent,
} from "../controllers/studentController";

const routerStudents = express.Router();

routerStudents.get("/students", getAllStudents);

routerStudents.get("/student/:id", getstudentbyid);

routerStudents.get("/studentMonthly", getMonthlyStudentCount);

routerStudents.get("/studentChart", getChartStudentCount);

routerStudents.get("/studentDays", getDaysStudentCount);

routerStudents.put("/student/:id", updateStudent);

routerStudents.put('/pdp/:id', updatePictureProfile);


routerStudents.delete("/student/:id", deleteStudent);

export default routerStudents;
