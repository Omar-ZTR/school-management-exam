"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
const routerStudent = express_1.default.Router();
routerStudent.get('/', studentController_1.getAllStudents);
routerStudent.get('/student/:id', studentController_1.getStudentById);
routerStudent.post('/students', studentController_1.createStudent);
routerStudent.put('/students/:id', studentController_1.updateStudent);
routerStudent.delete('/students/:id', studentController_1.deleteStudent);
exports.default = routerStudent;
