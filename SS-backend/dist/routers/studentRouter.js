"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
const routerStudents = express_1.default.Router();
routerStudents.get('/students', studentController_1.getAllStudents);
routerStudents.put('/student/:id', studentController_1.updateStudent);
routerStudents.delete('/student/:id', studentController_1.deleteStudent);
exports.default = routerStudents;
