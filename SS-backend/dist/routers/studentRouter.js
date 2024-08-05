"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
const routerStudents = express_1.default.Router();
routerStudents.get("/students", studentController_1.getAllStudents);
routerStudents.get("/student/:id", studentController_1.getstudentbyid);
routerStudents.get("/studentMonthly", studentController_1.getMonthlyStudentCount);
routerStudents.get("/studentChart", studentController_1.getChartStudentCount);
routerStudents.get("/studentDays", studentController_1.getDaysStudentCount);
routerStudents.put("/student/:id", studentController_1.updateStudent);
routerStudents.put('/pdp/:id', studentController_1.updatePictureProfile);
routerStudents.delete("/student/:id", studentController_1.deleteStudent);
exports.default = routerStudents;
