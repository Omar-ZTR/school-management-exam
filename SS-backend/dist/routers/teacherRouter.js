"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teacherController_1 = require("../controllers/teacherController");
const routerTeacher = express_1.default.Router();
routerTeacher.get('/Teachers', teacherController_1.getAllTeachers);
routerTeacher.get('/Teachers/:id', teacherController_1.getTeacherById);
routerTeacher.post('/Teachers', teacherController_1.createTeacher);
routerTeacher.put('/Teachers/:id', teacherController_1.updateTeacher);
routerTeacher.delete('/Teachers/:id', teacherController_1.deleteTeacher);
exports.default = routerTeacher;
