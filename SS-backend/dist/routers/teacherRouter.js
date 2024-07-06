"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teacherController_1 = require("../controllers/teacherController");
const routerTeacher = express_1.default.Router();
routerTeacher.get('/teachers', teacherController_1.getAllTeacher);
routerTeacher.put('/teacher/:id', teacherController_1.updateTeacher);
routerTeacher.delete('/teacher/:id', teacherController_1.deleteTeacher);
exports.default = routerTeacher;
// {
//     "user__id": 3,
//     "first__name": "omar",
//     "last__name": "er",
//     "user__email": "teach@gmail.com",
//     "active": null,
//     "password": "4eVLumeOabx4MMFbkrY52Vn586DsFY2Qvi9hLW",
//     "specialty": "",
//     "experience": "",
//     "date": "2024-07-04T22:44:43.000Z",
//     "role": ""
// }
