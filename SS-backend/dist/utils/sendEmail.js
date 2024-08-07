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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendEmail = (email, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 587,
            secure: true,
            auth: {
                user: 'omarzouiter97@gmail.com',
                pass: 'qcgllkqwjstkejty',
            },
        });
        console.log('Email sent sasxd');
        yield transporter.sendMail({
            from: 'omarzouiter97@gmail.com',
            to: email,
            subject: subject,
            html: text,
        });
        console.log('Email sent successfully');
    }
    catch (error) {
        console.log(error);
        console.log('An error occurred while sending mail');
    }
});
exports.default = sendEmail;
