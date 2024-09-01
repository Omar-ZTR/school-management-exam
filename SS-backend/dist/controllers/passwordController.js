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
exports.resetpassword = exports.verifyEmail = exports.verifyToken = exports.sendResetEmail = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const studentModel_1 = require("../models/studentModel");
const joi_1 = __importDefault(require("joi"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const tokenModel_1 = require("../models/tokenModel");
const dotenv_1 = __importDefault(require("dotenv"));
const token_1 = __importDefault(require("../utils/token"));
const teacherModel_1 = require("../models/teacherModel");
const adminModel_1 = require("../models/adminModel");
dotenv_1.default.config();
const router = express_1.default.Router();
const sendResetEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user;
        user = yield studentModel_1.Student.findOne({
            where: { user__email: req.body.user__email },
        });
        if (!user) {
            user = yield teacherModel_1.Teacher.findOne({
                where: { user__email: req.body.user__email },
            });
        }
        if (!user) {
            return res
                .status(409)
                .send({ message: "User with given email does not exist!" });
        }
        let tokens = yield tokenModel_1.Token.findOne({
            where: { user__id: user.user__id, role: user.role },
        });
        if (!tokens) {
            const tokenData = {
                user__id: user.user__id,
                role: user.role,
                token: (0, token_1.default)(user),
            };
            tokens = yield tokenModel_1.Token.create(tokenData);
        }
        console.log(tokens);
        const url = `http://localhost:4200/resetpass/${user.user__id}/${tokens.token}/`;
        const text = `You requested a password reset. Click the following link to reset your password: ${url}`;
        yield (0, sendEmail_1.default)(user.user__email, "Password Reset", text);
        res.status(200).send({
            message: "Password reset link sent to your email account",
            url,
            success: true,
        });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error", error });
    }
});
exports.sendResetEmail = sendResetEmail;
const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield studentModel_1.Student.findOne({
            where: { user__id: req.params.user__id },
        });
        if (!user)
            return res.status(400).send({ message: "Invalid link" });
        const token = yield tokenModel_1.Token.findOne({
            where: { user__id: user.user__id, token: req.params.token },
        });
        if (!token)
            return res.status(400).send({ message: "Invalid link" });
        res.status(200).send("Valid Url");
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.verifyToken = verifyToken;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const codeVerifey = req.params.codeVerifey;
        let user;
        user = yield studentModel_1.Student.findOne({
            where: { codeVerifey: req.params.codeVerifey },
        });
        console.log("1111", user);
        console.log("1codeVerifey111", codeVerifey);
        if (!user) {
            user = yield teacherModel_1.Teacher.findOne({
                where: { codeVerifey: req.params.codeVerifey },
            });
            console.log("222", user);
            console.log("2codeVerifey222", codeVerifey);
        }
        if (!user) {
            user = yield adminModel_1.Admin.findOne({
                where: { codeVerifey: req.params.codeVerifey },
            });
            console.log("333", user);
            console.log("3codeVerifey333", codeVerifey);
        }
        if (!user) {
            return res.status(400).send({ message: "Invalid link" });
        }
        // const token = await Token.findOne({
        //   where: { user__id: user.user__id, token: req.params.token },
        // });
        if (user && user.emailVerifed == true) {
            return res.send({
                message: "Votre compte est déja verified !",
            });
        }
        else {
            user.emailVerifed = true;
            user.save();
            res.status(200).send({
                message: "Votre compte est verifeid avec succées !",
            });
        }
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.verifyEmail = verifyEmail;
const resetpassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Starting password reset process");
    try {
        const passwordSchema = joi_1.default.object({
            password: joi_1.default.string().required().label("Password"),
        });
        const { error } = passwordSchema.validate({ password: req.body.password });
        if (error) {
            console.log("Validation error:", error.details[0].message);
            return res.status(400).send({ message: error.details[0].message });
        }
        const { user__id, token } = req.params;
        const tokenRecord = yield tokenModel_1.Token.findOne({
            where: { user__id: user__id, token },
        });
        if (!tokenRecord) {
            console.log("Invalid link: Token not found");
            return res.status(400).send({ message: "Invalid link" });
        }
        const salt = yield bcryptjs_1.default.genSalt(Number(process.env.SALT));
        const hashPassword = yield bcryptjs_1.default.hash(req.body.password, salt);
        if (tokenRecord.role === "Student") {
            const student = yield studentModel_1.Student.findOne({ where: { user__id } });
            if (!student) {
                console.log("Invalid link: Student not found");
                return res.status(400).send({ message: "Invalid link" });
            }
            student.password = hashPassword;
            yield student.save();
            yield tokenRecord.destroy();
        }
        if (tokenRecord.role === "Teacher") {
            const teacher = yield teacherModel_1.Teacher.findOne({ where: { user__id } });
            if (!teacher) {
                console.log("Invalid link: Teacher not found");
                return res.status(400).send({ message: "Invalid link" });
            }
            teacher.password = hashPassword;
            yield teacher.save();
            yield tokenRecord.destroy();
        }
        console.log("Password reset successfully for user:", user__id);
        res
            .status(200)
            .send({ success: true, message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({ message: "Internal Server Error", error });
    }
});
exports.resetpassword = resetpassword;
exports.default = router;
