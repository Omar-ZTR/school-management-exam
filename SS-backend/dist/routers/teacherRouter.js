"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teacherController_1 = require("../controllers/teacherController");
const routerTeacher = express_1.default.Router();
routerTeacher.get('/teachers', teacherController_1.getAllTeacher);
routerTeacher.get('/teacher/:id', teacherController_1.TeacherByid);
routerTeacher.put('/teacher/:id', teacherController_1.updateTeacher);
routerTeacher.put('/teacherdesc/:id', teacherController_1.desactiveTeacher);
routerTeacher.put('/pdpTeacher/:id', teacherController_1.updatePProfile);
routerTeacher.delete('/teacher/:id', teacherController_1.deleteTeacher);
exports.default = routerTeacher;
