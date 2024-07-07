"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudent = exports.deleteStudent = exports.getAllStudents = void 0;
const studentModel_1 = require("../models/studentModel");
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield studentModel_1.Student.findAll();
        console.log("studens is : ", students);
        res.status(200).json(students);
    }
    catch (error) {
        console.error("Error fetch student:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
    ;
});
exports.getAllStudents = getAllStudents;
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield studentModel_1.Student.destroy({ where: { user__id: id } });
        if (deleted) {
            res.status(204).send();
        }
        else {
            throw new Error('Student not found');
        }
    }
    catch (error) {
        console.error("Error deleting Student", error);
        res.status(500).send("Error deleting Student");
    }
});
exports.deleteStudent = deleteStudent;
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [updated] = yield studentModel_1.Student.update(req.body, {
            where: { user__id: id }
        });
        if (updated) {
            const updatedStudent = yield studentModel_1.Student.findOne({ where: { user__id: id } });
            res.status(200).json(updatedStudent);
        }
        else {
            throw new Error('Student not found');
        }
    }
    catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateStudent = updateStudent;
