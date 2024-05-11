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
exports.forgotPassword = exports.ssignup = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User__model_1 = require("../models/User__model");
const studentModel_1 = require("../models/studentModel");
const tokenModel_1 = require("../models/tokenModel");
const token_1 = __importDefault(require("../utils/token"));
// Signup function
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userData = req.body;
        userData.resetPasswordToken = "";
        userData.status = false;
        if (userData.role == "Student") {
            const existingUser = yield studentModel_1.Student.findOne({
                where: { user__email: userData.user__email },
            });
            if (existingUser) {
                return res.status(400).json({ message: "Student already exists" });
            }
            const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
            userData.password = hashedPassword; // Update userData.password with hashedPassword
            const newUser = yield studentModel_1.Student.create(userData);
            res
                .status(201)
                .json({ message: "Student registered successfully", user: newUser });
        }
        else {
            const existingUser = yield User__model_1.User.findOne({
                where: { user__email: userData.user__email },
            });
            if (existingUser) {
                return res.status(400).json({ message: "Teacher already exists" });
            }
            const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
            userData.password = hashedPassword; // Update userData.password with hashedPassword
            const newUser = yield User__model_1.User.create(userData);
            res
                .status(201)
                .json({ message: "Teacher registered successfully", user: newUser });
        }
    }
    catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.signup = signup;
// Login function
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("innnnnw",req.body.email)
        const { user__email, password } = req.body;
        const user = yield studentModel_1.Student.findOne({ where: { user__email } });
        if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
            let tokens = yield tokenModel_1.Token.findOne({ where: { user__id: user.user__id } });
            if (!tokens) {
                const tokenData = {
                    user__id: user.user__id,
                    token: (0, token_1.default)(user),
                };
                tokens = yield tokenModel_1.Token.create(tokenData);
            }
            res.status(200).json({ token: tokens.token });
        }
        else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Intesrnal server error" });
    }
    console.log("hello", req.headers);
});
exports.login = login;
// Signup function
const ssignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userData = req.body;
        userData.resetPasswordToken = "";
        userData.specialty = "";
        userData.role = "Student";
        userData.status = false;
        const existingUser = yield User__model_1.User.findOne({
            where: { user__email: userData.user__email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
        userData.password = hashedPassword; // Update userData.password with hashedPassword
        const newUser = yield User__model_1.User.create(userData);
        res
            .status(201)
            .json({ message: "User registered successfully", user: newUser });
    }
    catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.ssignup = ssignup;
// Forgot password function
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user__email } = req.body;
        const user = yield User__model_1.User.findOne({ where: { user__email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const token = (0, token_1.default)(user);
        user.resetPasswordToken = token;
        yield user.save();
        const resetPasswordLink = `http://your-app-domain/reset-password?token=${token}`;
        const mailOptions = {
            from: "marorz513@gmail.com",
            to: user.user__email,
            subject: "Password Reset",
            text: `You requested a password reset. Click the following link to reset your password: ${resetPasswordLink}`,
        };
        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.error('Error sending email:', error);
        //         res.status(500).json({ error: 'Error sending email' });
        //     } else {
        //         console.log('Email sent:', info.response);
        //         res.status(200).json({ message: 'Password reset email sent' });
        //     }
        // });
    }
    catch (error) {
        console.error("Error sending password reset email:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.forgotPassword = forgotPassword;
// export const ah = async (req: Request, res: Response) => {
//     try {
//       const emailSchema = Joi.object({
//         email: Joi.string().email().required().label("Email"),
//       });
//       const { error } = emailSchema.validate(req.body);
//       if (error)
//         return res.status(400).send({ message: error.details[0].message });
//       let user = await User.findOne({ email: req.body.email });
//       if (!user)
//         return res
//           .status(409)
//           .send({ message: "User with given email does not exist!" });
//       let token = await Token.findOne({ userId: user._id });
//       if (!token) {
//         token = await new Token({
//           userId: user._id,
//           token: crypto.randomBytes(32).toString("hex"),
//         }).save();
//       }
//       const url = ${process.env.BASE_URL}password-reset/${user._id}/${token.token}/;
//       await sendEmail(user.email, "Password Reset", url);
//       res
//         .status(200)
//         .send({ message: "Password reset link sent to your email account",success:true });
//     } catch (error) {
//       res.status(500).send({ message: "Internal Server Error"});
//   }
//   });
// const verifyToken = (token: string) => {
//   try {
//     const decoded = jwt.verify(token, secretKey);
//     return decoded;
//   } catch (error) {
//     return null;
//   }
// };
// const transporter = nodemailer.createTransport({
//     host: 'smtp.Gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//         user: 'omarzouiter97@gmail.com',
//         pass: 'oukiouki@omr211',
//     },
// });
// require('crypto').randomBytes(32).toString('hex')
