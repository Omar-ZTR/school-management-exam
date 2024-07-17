"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subjectController_1 = require("../controllers/subjectController");
const routersubject = express_1.default.Router();
routersubject.post("/subject", subjectController_1.CreateSubject);
routersubject.get("/subjects", subjectController_1.getSubjects);
routersubject.get('/subject/:id', subjectController_1.getTeacherSubject);
routersubject.put('/subject/:id', subjectController_1.UpdateSubject);
routersubject.delete('/subject/:id', subjectController_1.deleteSubject);
exports.default = routersubject;
