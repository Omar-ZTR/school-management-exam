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
exports.sendCodeExam = exports.notifyExamReservation = exports.deleteReservation = exports.updateReservation = exports.getReservationTeacher = exports.getReservationById = exports.getAllReservations = exports.getSpecificReservations = exports.createReservation = void 0;
const sequelize_1 = require("sequelize");
const reservationModel_1 = require("../models/reservationModel"); // Import your Reservation model
const examModel_1 = require("../models/examModel");
const groupModel_1 = require("../models/groupModel");
const salleModel_1 = require("../models/salleModel");
const studentModel_1 = require("../models/studentModel");
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const date_fns_1 = require("date-fns");
// Create operation
const createReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("bbbbbbbb", req.body);
        const code = generateCode();
        // Create the reservation object with the generated code
        const reservationData = Object.assign(Object.assign({}, req.body), { code: code });
        const reservation = yield reservationModel_1.Reservation.create(reservationData);
        const updatedReservation = yield reservationModel_1.Reservation.findOne({
            where: { reserv__id: reservation.reserv__id },
            include: [
                {
                    model: examModel_1.Exam,
                },
            ],
        });
        if (updatedReservation) {
            yield (0, exports.notifyExamReservation)(updatedReservation);
        }
        res.status(201).json(reservation);
    }
    catch (error) {
        console.error("Error creation reservation", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createReservation = createReservation;
const generateCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
};
const getSpecificReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupid } = req.params;
    console.log("groupName", req.params);
    const group = yield groupModel_1.Group.findByPk(groupid);
    console.log("groupgroup group group", group);
    try {
        const currentDate = new Date();
        console.log("currentDate is ", currentDate);
        const reservations = yield reservationModel_1.Reservation.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    {
                        [sequelize_1.Op.or]: [
                            { group__name: { [sequelize_1.Op.eq]: group.group__name } },
                            { group__name: { [sequelize_1.Op.is]: null } },
                        ],
                    },
                    {
                        startDate: { [sequelize_1.Op.gt]: currentDate },
                    },
                ],
            },
        });
        const formattedReservations = yield Promise.all(reservations.map((reservation) => __awaiter(void 0, void 0, void 0, function* () {
            const exam = yield examModel_1.Exam.findByPk(reservation.exam__id);
            return {
                reserv__id: reservation.reserv__id,
                exam__id: reservation.exam__id,
                salle: reservation.salle,
                group__name: reservation.group__name,
                title: reservation.exam__title,
                desc: exam === null || exam === void 0 ? void 0 : exam.exam__desc,
                startDate: reservation.startDate,
                endDate: reservation.endDate,
                code: reservation.code,
                createdAt: reservation.createdAt,
                updatedAt: reservation.updatedAt,
                obligation: exam ? exam.obligatoire : null,
            };
        })));
        res.status(200).json(formattedReservations);
    }
    catch (error) {
        console.error("Error fetch reservations:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getSpecificReservations = getSpecificReservations;
// Read operation - Get all reservations
const getAllReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reservations = yield reservationModel_1.Reservation.findAll();
        res.status(200).json(reservations);
    }
    catch (error) {
        console.error("Error fetch reservations:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllReservations = getAllReservations;
// Read operation - Get reservation by ID
const getReservationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const reservation = yield reservationModel_1.Reservation.findByPk(id);
        if (reservation) {
            res.status(200).json(reservation);
        }
        else {
            res.status(404).json({ message: "Reservation not found" });
        }
    }
    catch (error) {
        console.error("Error fetch reservation", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getReservationById = getReservationById;
const getReservationTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extract IDs from query parameters
        console.log("ids is", req.query.ids);
        const ids = (_a = req.query.ids) === null || _a === void 0 ? void 0 : _a.toString().split(",").map((id) => parseInt(id, 10));
        console.log("ids is", ids);
        if (!ids || ids.length === 0) {
            return res.status(400).json({ message: "No IDs provided" });
        }
        const datenow = new Date();
        const reservations = yield reservationModel_1.Reservation.findAll({
            where: {
                exam__id: {
                    [sequelize_1.Op.in]: ids,
                },
                startDate: { [sequelize_1.Op.gt]: datenow }
            },
            include: [
                {
                    model: examModel_1.Exam,
                },
            ],
        });
        if (reservations.length > 0) {
            res.status(200).json(reservations);
        }
        else {
            res.status(201).json({ message: "Reservation not found" });
        }
    }
    catch (error) {
        console.error("Error fetching reservation", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getReservationTeacher = getReservationTeacher;
// Update operation
const updateReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [updated] = yield reservationModel_1.Reservation.update(req.body, {
            where: { reserv__id: id },
        });
        if (updated) {
            const updatedReservation = yield reservationModel_1.Reservation.findOne({
                where: { reserv__id: id },
                include: [
                    {
                        model: examModel_1.Exam,
                    },
                ],
            });
            if (updatedReservation) {
                yield (0, exports.notifyExamReservation)(updatedReservation);
            }
            res.status(200).json(updatedReservation);
        }
        else {
            throw new Error("Reservation not found");
        }
    }
    catch (error) {
        console.error("Error deleting reservation", error);
        res.status(500).send("Error deleting reservation");
    }
});
exports.updateReservation = updateReservation;
// Delete operation
const deleteReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield reservationModel_1.Reservation.destroy({ where: { reserv__id: id } });
        if (deleted) {
            res.status(204).send();
        }
        else {
            throw new Error("Reservation not found");
        }
    }
    catch (error) {
        console.error("Error deleting reservation", error);
        res.status(500).send("Error deleting reservation");
    }
});
exports.deleteReservation = deleteReservation;
const notifyExamReservation = (updatedReservation) => __awaiter(void 0, void 0, void 0, function* () {
    const salle = yield salleModel_1.Salle.findOne({
        where: { salle__id: updatedReservation.salle },
    });
    let group = null;
    if (updatedReservation.group__name) {
        group = yield groupModel_1.Group.findOne({
            where: { group__name: updatedReservation.group__name },
            include: [
                {
                    model: studentModel_1.Student,
                },
            ],
        });
    }
    const formattedDate = (0, date_fns_1.format)(new Date(updatedReservation.startDate), "d MMMM yyyy 'at' HH:mm");
    let text = `
    <div>
      <h1>Exam Notification</h1>
      <p>You have an exam titled "${updatedReservation.exam.exam__title}" scheduled on ${formattedDate}`;
    if (salle) {
        text += ` in salle "${salle.salle__name}"`;
    }
    if (group) {
        text += ` with the group "${group.group__name}."`;
    }
    else {
        text += `. This exam is a certificate exam.`;
    }
    text += `</p>
      <p>Thank you for choosing us.</p>
      <p>Best regards,</p>
     
    </div>`;
    if (group) {
        if (group.students) {
            for (const student of group.students) {
                yield (0, sendEmail_1.default)(student.user__email, "Exam Notification", text);
            }
        }
    }
    else {
        const students = yield studentModel_1.Student.findAll({
            where: { active: true },
        });
        for (const student of students) {
            yield (0, sendEmail_1.default)(student.user__email, "Exam Notification", text);
        }
    }
});
exports.notifyExamReservation = notifyExamReservation;
const sendCodeExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const text = `
  <div>
  <h1>Code Exam</h1>
  <h3>${data.exam__title}</h3>
  <div style="
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    letter-spacing: 25px;
    font-size: 53px;
  ">${data.code}</div>
  <p>Thank you for choosing us.</p>
  <p>Best regards,</p>
</div>`;
        console.log("dta is email is", data);
        for (const email of data.emails) {
            console.log("email is email is", email);
            yield (0, sendEmail_1.default)(email, "Code Exam", text);
        }
        res.status(201).json({ message: "Code send successfully" });
    }
    catch (error) {
        console.error("Error deleting reservation", error);
        res.status(500).send("Error deleting reservation");
    }
});
exports.sendCodeExam = sendCodeExam;
