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
exports.updateStudent = exports.deleteStudent = exports.updatePictureProfile = exports.getDaysStudentCount = exports.getChartStudentCount = exports.getMonthlyStudentCount = exports.getstudentbyid = exports.getAllStudents = void 0;
const studentModel_1 = require("../models/studentModel");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const upload_1 = __importDefault(require("../utils/upload"));
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const student = yield studentModel_1.Student.findAll({
            order: [
                ['createdAt', 'DESC'] // Change 'createdAt' to the actual timestamp field in your model if different
            ]
        });
        console.log("studens is : ", student);
        res.status(200).json(student);
    }
    catch (error) {
        console.error("Error fetch student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllStudents = getAllStudents;
const getstudentbyid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield studentModel_1.Student.findOne({
            where: {
                emailVerifed: true,
            },
        });
        console.log("studens is : ", students);
        res.status(200).json(students);
    }
    catch (error) {
        console.error("Error fetch student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getstudentbyid = getstudentbyid;
const getMonthlyStudentCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentYear = new Date().getFullYear();
        const monthNames = {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December",
        };
        const studentCounts = yield studentModel_1.Student.findAll({
            attributes: [
                [sequelize_typescript_1.Sequelize.fn("MONTH", sequelize_typescript_1.Sequelize.col("createdAt")), "month"],
                [sequelize_typescript_1.Sequelize.fn("COUNT", sequelize_typescript_1.Sequelize.col("user__id")), "count"],
            ],
            where: {
                createdAt: {
                    [sequelize_1.Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`],
                },
            },
            group: [sequelize_typescript_1.Sequelize.fn("MONTH", sequelize_typescript_1.Sequelize.col("createdAt"))],
            order: [[sequelize_typescript_1.Sequelize.fn("MONTH", sequelize_typescript_1.Sequelize.col("createdAt")), "ASC"]],
        });
        const formattedCounts = studentCounts.map((item) => ({
            month: monthNames[item.getDataValue("month")],
            count: item.getDataValue("count"),
        }));
        res.status(200).json(formattedCounts);
    }
    catch (error) {
        console.error("Error fetching monthly student count:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getMonthlyStudentCount = getMonthlyStudentCount;
const getChartStudentCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstDate, endDate } = req.body;
        const monthNames = {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December",
        };
        const studentCounts = yield studentModel_1.Student.findAll({
            attributes: [
                [sequelize_typescript_1.Sequelize.fn("MONTH", sequelize_typescript_1.Sequelize.col("createdAt")), "month"],
                [sequelize_typescript_1.Sequelize.fn("COUNT", sequelize_typescript_1.Sequelize.col("user__id")), "count"],
            ],
            where: {
                createdAt: {
                    [sequelize_1.Op.between]: [firstDate, endDate],
                },
            },
            group: [sequelize_typescript_1.Sequelize.fn("MONTH", sequelize_typescript_1.Sequelize.col("createdAt"))],
            order: [[sequelize_typescript_1.Sequelize.fn("MONTH", sequelize_typescript_1.Sequelize.col("createdAt")), "ASC"]],
        });
        const formattedCounts = studentCounts.map((item) => ({
            month: monthNames[item.getDataValue("month")],
            count: item.getDataValue("count"),
        }));
        res.status(200).json(formattedCounts);
    }
    catch (error) {
        console.error("Error fetching monthly student count:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getChartStudentCount = getChartStudentCount;
const getDaysStudentCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstDate, endDate } = req.body;
        const startDate = new Date(firstDate);
        const endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1); // Increment by one day to include the end date
        const monthNames = {
            0: "janvier",
            1: "février",
            2: "mars",
            3: "avril",
            4: "mai",
            5: "juin",
            6: "juillet",
            7: "août",
            8: "septembre",
            9: "octobre",
            10: "novembre",
            11: "décembre",
        };
        const studentCounts = yield studentModel_1.Student.findAll({
            attributes: [
                [sequelize_typescript_1.Sequelize.fn("DATE", sequelize_typescript_1.Sequelize.col("createdAt")), "date"],
                [sequelize_typescript_1.Sequelize.fn("COUNT", sequelize_typescript_1.Sequelize.col("user__id")), "count"],
            ],
            where: {
                createdAt: {
                    [sequelize_1.Op.between]: [startDate, endDateObj],
                },
            },
            group: [sequelize_typescript_1.Sequelize.fn("DATE", sequelize_typescript_1.Sequelize.col("createdAt"))],
            order: [[sequelize_typescript_1.Sequelize.fn("DATE", sequelize_typescript_1.Sequelize.col("createdAt")), "ASC"]],
        });
        const formattedCounts = studentCounts.map((item) => ({
            date: item.getDataValue("date"),
            count: item.getDataValue("count"),
        }));
        res.status(200).json(formattedCounts);
    }
    catch (error) {
        console.error("Error fetching monthly student count:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getDaysStudentCount = getDaysStudentCount;
const baseUrl = "http://localhost:3000/files/";
const updatePictureProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, upload_1.default)(req, res); // Handle file upload
        if (req.files && req.files.length > 0) {
            console.log("files:", req.files);
            const file = req.files[0];
            const img__path = baseUrl + file.filename;
            console.log("file attribute:", file);
            // Assuming Student model has a column named `img__path`
            yield studentModel_1.Student.update({ img__path }, {
                where: { user__id: id },
            });
            res.status(200).send({ message: 'Profile picture updated successfully.' });
        }
        else {
            res.status(400).send({ message: 'No files were uploaded.' });
        }
    }
    catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).send({ message: 'Error updating profile picture.' });
    }
});
exports.updatePictureProfile = updatePictureProfile;
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield studentModel_1.Student.destroy({ where: { user__id: id } });
        if (deleted) {
            res.status(204).send();
        }
        else {
            throw new Error("Student not found");
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
            where: { user__id: id },
        });
        if (updated) {
            const updatedStudent = yield studentModel_1.Student.findOne({ where: { user__id: id } });
            if (updatedStudent) {
                let status;
                switch (updatedStudent.active) {
                    case true:
                        status = "accepted";
                        break;
                    case false:
                        status = "refused";
                        break;
                    case null:
                        status = "in stay wait";
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
                yield (0, sendEmail_1.default)(updatedStudent.user__email, "Account Activation", text);
            }
            res.status(200).json(updatedStudent);
        }
        else {
            throw new Error("Student not found");
        }
    }
    catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateStudent = updateStudent;
