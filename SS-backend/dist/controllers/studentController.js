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
exports.deleteStudent = exports.updateStudent = exports.getStudentById = exports.getAllStudents = exports.createStudent = void 0;
const studentModel_1 = require("../models/studentModel");
// Create operation
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const student = yield studentModel_1.Student.create(req.body);
        res.status(201).json(student);
    }
    catch (error) {
        console.error("Error creating student", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createStudent = createStudent;
// Read operation - Get all students
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield studentModel_1.Student.findAll();
        res.status(200).json(students);
    }
    catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllStudents = getAllStudents;
// Read operation - Get student by ID
const getStudentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const student = yield studentModel_1.Student.findByPk(id);
        if (student) {
            res.status(200).json(student);
        }
        else {
            res.status(404).json({ message: "Student not found" });
        }
    }
    catch (error) {
        console.error("Error fetching student", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getStudentById = getStudentById;
// Update operation
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [updated] = yield studentModel_1.Student.update(req.body, { where: { user__id: id } });
        if (updated) {
            const updatedStudent = yield studentModel_1.Student.findOne({ where: { user__id: id } });
            res.status(200).json(updatedStudent);
        }
        else {
            throw new Error('Student not found');
        }
    }
    catch (error) {
        console.error("Error updating student", error);
        res.status(500).send("Error updating student");
    }
});
exports.updateStudent = updateStudent;
// Delete operation
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
        console.error("Error deleting student", error);
        res.status(500).send("Error deleting student");
    }
});
exports.deleteStudent = deleteStudent;
