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
exports.TeacherByid = exports.deleteTeacher = exports.updateTeacher = exports.getAllTeacher = void 0;
const teacherModel_1 = require("../models/teacherModel");
const subjectModel_1 = require("../models/subjectModel");
const groupModel_1 = require("../models/groupModel");
const getAllTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Teachers = yield teacherModel_1.Teacher.findAll({
            include: [
                {
                    model: subjectModel_1.Subject,
                    as: "subjects",
                },
                {
                    model: groupModel_1.Group,
                    as: "groups",
                },
            ],
        });
        console.log("teachers is : ", Teachers);
        res.status(200).json(Teachers);
    }
    catch (error) {
        console.error("Error fetch Teacher:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllTeacher = getAllTeacher;
const updateTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const teacherData = req.body;
        const teacherExist = yield teacherModel_1.Teacher.findByPk(id);
        if (!teacherExist) {
            return res.status(404).json({ error: "Teacher not found" });
        }
        console.log("teacherData.subjects", teacherData.subjects);
        if (teacherData.groups &&
            Array.isArray(teacherData.groups) &&
            teacherData.groups.length > 0) {
            const groups = yield groupModel_1.Group.findAll({
                where: {
                    group__id: teacherData.groups,
                },
            });
            yield teacherExist.$set("groups", groups);
        }
        else {
            // If no groups are provided or the array is empty, delete all associations
            yield teacherExist.$set("groups", []);
        }
        if (teacherData.subjects &&
            Array.isArray(teacherData.subjects) &&
            teacherData.subjects.length > 0) {
            const subjects = yield subjectModel_1.Subject.findAll({
                where: {
                    subject__id: teacherData.subjects,
                },
            });
            yield teacherExist.$set("subjects", subjects);
        }
        else {
            // If no groups are provided or the array is empty, delete all associations
            yield teacherExist.$set("subjects", []);
        }
        if (teacherExist.active !== teacherData.active) {
            const [updated] = yield teacherModel_1.Teacher.update(teacherData, {
                where: { user__id: id },
            });
            if (updated) {
                const updatedTeacher = yield teacherModel_1.Teacher.findOne({
                    where: { user__id: id },
                });
                return res.status(200).json(updatedTeacher);
            }
            else {
                throw new Error("Teacher not updated");
            }
        } // If no updates were made, return the current teacher data
        return res.status(200).json(teacherExist);
    }
    catch (error) {
        console.error("Error updating teacher:", error);
        res.status(500).send("Error updating teacher");
    }
});
exports.updateTeacher = updateTeacher;
const deleteTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield teacherModel_1.Teacher.destroy({ where: { user__id: id } });
        if (deleted) {
            res.status(204).send();
        }
        else {
            throw new Error("Teacher not found");
        }
    }
    catch (error) {
        console.error("Error deleting Teacher", error);
        res.status(500).send("Error deleting Teacher");
    }
});
exports.deleteTeacher = deleteTeacher;
const TeacherByid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const teacher = yield teacherModel_1.Teacher.findAll({
            where: { user__id: id },
            include: [
                {
                    model: subjectModel_1.Subject,
                    as: "subjects",
                },
                {
                    model: groupModel_1.Group,
                    as: "groups",
                },
            ],
        });
        res.status(200).send(teacher);
    }
    catch (error) {
        console.error("Error Fetching Teacher", error);
        res.status(500).send("Error Fetching Teacher");
    }
});
exports.TeacherByid = TeacherByid;
