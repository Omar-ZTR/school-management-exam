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
exports.resetpassword = exports.verifyToken = exports.sendResetEmail = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const studentModel_1 = require("../models/studentModel");
const joi_1 = __importDefault(require("joi"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const tokenModel_1 = require("../models/tokenModel");
const dotenv_1 = __importDefault(require("dotenv"));
const token_1 = __importDefault(require("../utils/token"));
dotenv_1.default.config();
const router = express_1.default.Router();
const sendResetEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const emailSchema = Joi.object({
        //     email: Joi.string().email().required().label("Email"),
        // });
        // const { error } = emailSchema.validate(req.body);
        // if (error)
        //     return res.status(400).send({ message: error.details[0].message + "hhhhh"});
        console.log('Email sent qqqq');
        const student = yield studentModel_1.Student.findOne({ where: { user__email: req.body.user__email } });
        console.log('Email ', student === null || student === void 0 ? void 0 : student.user__id);
        if (!student)
            return res.status(409).send({ message: "User with given email does not exist!" });
        let tokens = yield tokenModel_1.Token.findOne({ where: { user__id: student.user__id } });
        if (!tokens) {
            const tokenData = {
                user__id: student.user__id,
                token: (0, token_1.default)(student), // Assuming generateToken takes user ID as input
            };
            tokens = yield tokenModel_1.Token.create(tokenData);
        }
        console.log(tokens);
        const url = `http://localhost:3000/${student.user__id}/${tokens.token}/`;
        yield (0, sendEmail_1.default)(student.user__email, "Password Reset", url);
        res.status(200).send({ message: "Password reset link sent to your email account", url, success: true });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error", error });
    }
});
exports.sendResetEmail = sendResetEmail;
const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield studentModel_1.Student.findOne({ where: { user__id: req.params.user__id } });
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
const resetpassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("llllllllllllllllllll");
    try {
        console.log("ffffffffffffffffff");
        const passwordSchema = joi_1.default.object({
            password: joi_1.default.string().required().label("Password"),
        });
        console.log("llllllllllllllllllll");
        const { error } = passwordSchema.validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        console.log("hhhhhhhhhhhhhhhh", req.params.user__id);
        console.log("hhhhhhhhhhhhhhhh", req.params.id);
        const student = yield studentModel_1.Student.findOne({ where: { user__id: req.params.user__id } });
        console.log("aaaaaaaaaaaaaaaa");
        if (!student)
            return res.status(400).send({ message: "Invalid link" });
        const token = yield tokenModel_1.Token.findOne({
            where: { user__id: student.user__id, token: req.params.token },
        });
        if (!token)
            return res.status(400).send({ message: "Invalid link" });
        console.log("1111", student.password);
        const salt = yield bcryptjs_1.default.genSalt(Number(process.env.SALT));
        const hashPassword = yield bcryptjs_1.default.hash(req.body.password, salt);
        student.password = hashPassword;
        yield student.save();
        yield token.destroy();
        console.log("2222", student.password);
        res.status(200).send({ success: true, message: "Password reset successfully" });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error", error });
    }
});
exports.resetpassword = resetpassword;
exports.default = router;
