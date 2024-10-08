"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const authRouter_1 = __importDefault(require("./routers/authRouter"));
const dotenv = __importStar(require("dotenv"));
const connection_1 = __importDefault(require("./connection"));
const body_parser_1 = require("body-parser");
const examRouter_1 = __importDefault(require("./routers/examRouter"));
const questionRouter_1 = __importDefault(require("./routers/questionRouter"));
const reservationRouter_1 = __importDefault(require("./routers/reservationRouter"));
const groupRouter_1 = __importDefault(require("./routers/groupRouter"));
const salleRouter_1 = __importDefault(require("./routers/salleRouter"));
const routerSubject_1 = __importDefault(require("./routers/routerSubject"));
const path_1 = __importDefault(require("path"));
const fileRouter_1 = __importDefault(require("./routers/fileRouter"));
const answerRouter_1 = __importDefault(require("./routers/answerRouter"));
const teacherRouter_1 = __importDefault(require("./routers/teacherRouter"));
const studentRouter_1 = __importDefault(require("./routers/studentRouter"));
const subscribeRouter_1 = __importDefault(require("./routers/subscribeRouter"));
const chatRouter_1 = __importDefault(require("./models/usress/chatRouter"));
const contactRouter_1 = __importDefault(require("./routers/contactRouter"));
const reservationModel_1 = require("./models/reservationModel");
const sequelize_1 = require("sequelize");
const reservationController_1 = require("./controllers/reservationController");
const app = (0, express_1.default)();
const cors = require("cors");
app.use((0, body_parser_1.json)());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
    res.header("Access-Control-Expose-Headers", "x-access-token, x-refresh-token");
    next();
});
app.use((0, body_parser_1.urlencoded)({ extended: true }));
app.use("/", teacherRouter_1.default, authRouter_1.default, examRouter_1.default, questionRouter_1.default, reservationRouter_1.default, groupRouter_1.default, salleRouter_1.default, fileRouter_1.default, answerRouter_1.default, routerSubject_1.default, studentRouter_1.default, subscribeRouter_1.default, chatRouter_1.default, contactRouter_1.default);
const corsOptions = {
    origin: "http://localhost:4200",
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
app.use("/files", express_1.default.static(path_1.default.join(__dirname, "utils/filesUpload")));
var cron = require('node-cron');
cron.schedule('0 9 */2 * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Running cron job for sending emails');
    const reservations = yield reservationModel_1.Reservation.findAll({
        where: { where: {
                startDate: {
                    [sequelize_1.Op.gt]: new Date(),
                },
            }, },
    });
    if (reservations) {
        for (const exam of reservations) {
            yield (0, reservationController_1.notifyExamReservation)(exam);
        }
    }
    console.log("helo corn");
}));
dotenv.config();
// alter: true
connection_1.default
    .sync({ alter: true })
    .then(() => {
    console.log("Database successfully connected");
})
    .catch((err) => {
    console.log("Error", err);
});
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
