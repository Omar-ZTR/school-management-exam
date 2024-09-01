import express from "express";
import {
  deleteStudent,
  deleteStudentGr,
  getAllStudents,
  getChartStudentCount,
  getDaysStudentCount,
  getMonthlyStudentCount,
  getstudentbyid,
  getstudentbyidGroup,
  updatePictureProfile,
  updateStudent,
  updateStudentgroup,
} from "../controllers/studentController";

const routerStudents = express.Router();

routerStudents.get("/students", getAllStudents);

routerStudents.get("/studentgroup/:id", getstudentbyidGroup);

routerStudents.get("/student/:id", getstudentbyid);


routerStudents.get("/studentMonthly", getMonthlyStudentCount);

routerStudents.get("/studentChart", getChartStudentCount);

routerStudents.get("/studentDays", getDaysStudentCount);

routerStudents.put("/student/:id", updateStudent);

routerStudents.put("/studentGr/:id", updateStudentgroup);


routerStudents.put('/pdp/:id', updatePictureProfile);


routerStudents.delete("/student/:id", deleteStudent);

routerStudents.delete("/studentGr", deleteStudentGr);

export default routerStudents;
