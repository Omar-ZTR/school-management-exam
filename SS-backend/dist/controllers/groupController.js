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
exports.deleteGroup = exports.updateGroup = exports.getGroupById = exports.getGroupsSubject = exports.getTeacherGroups = exports.getFullGroups = exports.getAllGroups = exports.createGroup = void 0;
const sequelize_1 = require("sequelize");
const groupModel_1 = require("../models/groupModel"); // Import your Group model
const subjectModel_1 = require("../models/subjectModel");
const examModel_1 = require("../models/examModel");
const studentModel_1 = require("../models/studentModel");
const teacherModel_1 = require("../models/teacherModel");
const answerModel_1 = require("../models/answerModel");
const reservationModel_1 = require("../models/reservationModel");
// Create operation
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupData = req.body;
        const group = yield groupModel_1.Group.create(groupData);
        if (group &&
            groupData.subjects &&
            Array.isArray(groupData.subjects) &&
            groupData.subjects.length > 0) {
            const subjects = yield subjectModel_1.Subject.findAll({
                where: {
                    subject__id: groupData.subjects,
                },
            });
            yield group.$set("subjects", subjects);
        }
        const newGroup = yield groupModel_1.Group.findOne({
            where: { group__id: group.group__id },
            include: [
                {
                    model: subjectModel_1.Subject,
                    as: "subjects",
                },
            ],
        });
        res.status(201).json(newGroup);
    }
    catch (error) {
        console.error("Error creation Group", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createGroup = createGroup;
// Read operation - Get all Groups
const getAllGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groups = yield groupModel_1.Group.findAll({
            include: [
                {
                    model: subjectModel_1.Subject,
                    as: "subjects",
                },
            ],
        });
        res.status(200).json(groups);
    }
    catch (error) {
        console.error("Error fetch Group:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllGroups = getAllGroups;
const getFullGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groups = yield groupModel_1.Group.findAll({
            include: [
                {
                    model: subjectModel_1.Subject,
                    as: "subjects",
                },
                {
                    model: examModel_1.Exam,
                    as: "exams",
                },
                {
                    model: studentModel_1.Student,
                    as: "students",
                },
                {
                    model: teacherModel_1.Teacher,
                    as: "teachers",
                },
            ],
        });
        const result = yield Promise.all(groups.map((group) => __awaiter(void 0, void 0, void 0, function* () {
            const subjects = yield Promise.all(group.subjects.map((subject) => __awaiter(void 0, void 0, void 0, function* () {
                const exams = yield Promise.all(group.exams
                    .filter((ex) => ex.subject === subject.subject__name)
                    .map((exam) => __awaiter(void 0, void 0, void 0, function* () {
                    const students = yield Promise.all(group.students.map((student) => __awaiter(void 0, void 0, void 0, function* () {
                        const answer = yield answerModel_1.Answer.findOne({
                            where: {
                                Student__id: student.user__id,
                                exam__id: exam.exam__id,
                            },
                        });
                        return {
                            user__name: student.first__name + " " + student.last__name,
                            ans__result: answer ? answer.ans__result : null,
                            ans__id: answer ? answer.ans__id : null,
                        };
                    })));
                    const res = yield checkExam(group.group__name, exam.exam__id);
                    if (res) {
                        return {
                            exam__title: exam.exam__title,
                            students,
                            date: res.startDate,
                        };
                    }
                    else {
                        return {
                            exam__title: exam.exam__title,
                            students,
                            date: "",
                        };
                    }
                })));
                return {
                    id: subject.subject__id,
                    subject__name: subject.subject__name,
                    exams,
                };
            })));
            return {
                group__name: group.group__name,
                subjects,
            };
        })));
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getFullGroups = getFullGroups;
const getTeacherGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groups = yield groupModel_1.Group.findAll({
            include: [
                {
                    model: subjectModel_1.Subject,
                    as: "subjects",
                },
                {
                    model: examModel_1.Exam,
                    as: "exams",
                },
                {
                    model: studentModel_1.Student,
                    as: "students",
                },
                {
                    model: teacherModel_1.Teacher,
                    as: "teachers",
                },
            ],
        });
        // const result = await Promise.all(groups.map(async group => {
        //   const subjects = await Promise.all(group.subjects.map(async subject => {
        //     const exams = await Promise.all(group.exams.filter((ex:any) => ex.subject === subject.subject__name).map(async exam => {
        //       const students = await Promise.all(group.students.map(async student => {
        //         const answer = await Answer.findOne({
        //           where: {
        //             Student__id: student.user__id,
        //             exam__id: exam.exam__id,
        //           }
        //         });
        //         return {
        //           user__name: student.first__name,
        //           ans__result: answer ? answer.ans__result : null,
        //           ans__id: answer ? answer.ans__id : null,
        //         };
        //       }));
        //       const res = await checkExam(group.group__name, exam.exam__id);
        //       if (res) {
        //         return {
        //           exam__title: exam.exam__title,
        //           students,
        //           date: res.startDate
        //         };
        //       } else {
        //         return {
        //           exam__title: exam.exam__title,
        //           students,
        //           date: ''
        //         };
        //       }
        //     }));
        //     return {
        //       id: subject.subject__id,
        //       subject__name: subject.subject__name,
        //       exams,
        //     };
        //   }));
        //   return {
        //     group__name: group.group__name,
        //     subjects,
        //   };
        // }));
        res.status(200).json(groups);
    }
    catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getTeacherGroups = getTeacherGroups;
const checkExam = (group, exam) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const check = yield reservationModel_1.Reservation.findOne({
            where: {
                exam__id: exam,
                group__name: group,
            },
        });
        return check;
    }
    catch (error) {
        console.error("Error checking exam:", error);
        return null;
    }
});
const getGroupsSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("id is : ", req.params);
    try {
        const { exam__id } = req.params;
        console.log("idExam is : ", exam__id);
        const exam = yield examModel_1.Exam.findByPk(exam__id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        const subjectName = exam.subject;
        console.log("sub is : ", subjectName);
        const subject = yield subjectModel_1.Subject.findOne({
            where: { subject__name: subjectName },
        });
        console.log("hhhay: ", subject);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        const groupSubject = yield groupModel_1.Group.findAll({
            include: {
                model: subjectModel_1.Subject,
                where: { subject__name: subjectName },
                through: { attributes: [] },
            },
        });
        console.log("gr hay : ", groupSubject);
        const groupsRank = yield groupModel_1.Group.findAll({
            where: {
                Rank: {
                    [sequelize_1.Op.gte]: subject.min__Rank,
                },
            },
        });
        console.log("reee: ", groupsRank);
        res.json({
            groupsSubject: groupSubject,
            groupsRank: groupsRank,
        });
    }
    catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getGroupsSubject = getGroupsSubject;
const getGroupById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const group = yield groupModel_1.Group.findOne({
            where: {
                group__id: id,
            },
            include: [
                {
                    model: examModel_1.Exam,
                },
            ],
        });
        if (group) {
            res.status(200).json(group);
        }
        else {
            res.status(404).json({ message: "Group not found" });
        }
    }
    catch (error) {
        console.error("Error fetch Group", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getGroupById = getGroupById;
// Update operation
const updateGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const groupData = req.body;
        const groupExist = yield groupModel_1.Group.findByPk(id);
        if (!groupExist) {
            return res.status(404).json({ error: "group not found" });
        }
        if (groupData.subjects &&
            Array.isArray(groupData.subjects) &&
            groupData.subjects.length > 0) {
            const subjects = yield subjectModel_1.Subject.findAll({
                where: {
                    subject__id: groupData.subjects,
                },
            });
            yield groupExist.$set("subjects", subjects);
        }
        else {
            // If no groups are provided or the array is empty, delete all associations
            yield groupExist.$set("subjects", []);
        }
        if (groupExist.group__name !== groupData.group__name) {
            const [updated] = yield groupModel_1.Group.update(req.body, {
                where: { group__id: id },
            });
            if (!updated) {
                throw new Error("Group not found");
            }
        }
        const updatedGroup = yield groupModel_1.Group.findOne({ where: { group__id: id } });
        res.status(200).json(updatedGroup);
    }
    catch (error) {
        console.error("Error updating Group", error);
        res.status(500).send("Error updating Group");
    }
});
exports.updateGroup = updateGroup;
// Delete operation
const deleteGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield groupModel_1.Group.destroy({ where: { group__id: id } });
        if (deleted) {
            res.status(204).send();
        }
        else {
            throw new Error("Group not found");
        }
    }
    catch (error) {
        console.error("Error deleting Group", error);
        res.status(500).send("Error deleting Group");
    }
});
exports.deleteGroup = deleteGroup;
