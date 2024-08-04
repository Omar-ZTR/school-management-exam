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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherByid = exports.deleteTeacher = exports.updateTeacher = exports.getAllTeacher = void 0;
const teacherModel_1 = require("../models/teacherModel");
const subjectModel_1 = require("../models/subjectModel");
const groupModel_1 = require("../models/groupModel");
const questionModel_1 = require("../models/questionModel");
const fileModel_1 = require("../models/fileModel");
const reponseModel_1 = require("../models/reponseModel");
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
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
            where: {
                emailVerifed: true,
            },
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
                if (updatedTeacher) {
                    let status;
                    switch (updatedTeacher.active) {
                        case true:
                            status: "accepted";
                            break;
                        case false:
                            status: "refused";
                            break;
                        case null:
                            status: "in stay wait";
                            break;
                        default:
                            return res.status(400).json({ message: "Invalid status" });
                    }
                    const url = `http://localhost:4200/dash`;
                    let text = `
          <div>
            <h1>Account Activation</h1>
            <h2>We are delighted to welcome you to our platform!</h2>
            <p>Your account status is ${status}.</p>`;
                    if (status === "accepted") {
                        text += `
            <p>To log in, please click below:</p>
            <a href="${url}" style="
              display: inline-block;
              padding: 10px 20px;
              font-size: 16px;
              color: #ffffff;
              background-color: #007bff;
              border: none;
              border-radius: 5px;
              text-decoration: none;
            ">Confirm Your Email</a>`;
                    }
                    text += `
            <p>Thank you for choosing us.</p>
            <p>Best regards,</p>
          </div>`;
                    yield (0, sendEmail_1.default)(updatedTeacher.user__email, "Account Activation", text);
                }
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
                {
                    model: questionModel_1.Question,
                    as: "questions",
                    include: [fileModel_1.FileQuestion, reponseModel_1.Reponse],
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
