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
exports.deleteTeacher = exports.updateTeacher = exports.getTeacherById = exports.getAllTeachers = exports.createTeacher = void 0;
const teacherModel_1 = require("../models/teacherModel"); // Import your Teacher model
// Create operation
const createTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teacher = yield teacherModel_1.Teacher.create(req.body);
        res.status(201).json(teacher);
    }
    catch (error) {
        console.error("Error creating teacher", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createTeacher = createTeacher;
// Read operation - Get all teachers
const getAllTeachers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teachers = yield teacherModel_1.Teacher.findAll();
        res.status(200).json(teachers);
    }
    catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllTeachers = getAllTeachers;
// Read operation - Get teacher by ID
const getTeacherById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const teacher = yield teacherModel_1.Teacher.findByPk(id);
        if (teacher) {
            res.status(200).json(teacher);
        }
        else {
            res.status(404).json({ message: "Teacher not found" });
        }
    }
    catch (error) {
        console.error("Error fetching teacher", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getTeacherById = getTeacherById;
// Update operation
const updateTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [updated] = yield teacherModel_1.Teacher.update(req.body, { where: { user__id: id } });
        if (updated) {
            const updatedTeacher = yield teacherModel_1.Teacher.findOne({ where: { user__id: id } });
            res.status(200).json(updatedTeacher);
        }
        else {
            throw new Error('Teacher not found');
        }
    }
    catch (error) {
        console.error("Error updating teacher", error);
        res.status(500).send("Error updating teacher");
    }
});
exports.updateTeacher = updateTeacher;
// Delete operation
const deleteTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield teacherModel_1.Teacher.destroy({ where: { user__id: id } });
        if (deleted) {
            res.status(204).send();
        }
        else {
            throw new Error('Teacher not found');
        }
    }
    catch (error) {
        console.error("Error deleting teacher", error);
        res.status(500).send("Error deleting teacher");
    }
});
exports.deleteTeacher = deleteTeacher;
