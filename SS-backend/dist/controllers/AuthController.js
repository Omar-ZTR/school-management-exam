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
const teacherModel_1 = require("../models/teacherModel");
const tokenModel_1 = require("../models/tokenModel");
const token_1 = __importDefault(require("../utils/token"));
const adminModel_1 = require("../models/adminModel");
const upload_1 = __importDefault(require("../utils/upload"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const baseUrl = "http://localhost:3000/files/";
// Signup function
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Incoming request:", req);
        yield (0, upload_1.default)(req, res); // Handle file upload
        console.log("File uploaded:", req.files);
        if (!req.body.user) {
            return res.status(400).json({ message: "User data is missing" });
        }
        let userData;
        try {
            userData = JSON.parse(req.body.user);
        }
        catch (parseError) {
            console.error("Error parsing user data:", parseError);
            return res.status(400).json({ message: "Invalid user data format" });
        }
        console.log("Parsed user data:", userData);
        userData.resetPasswordToken = "";
        userData.status = false;
        let existingUser;
        let newUser;
        const hashedPassword = yield bcryptjs_1.default.hash(userData.Password, 10);
        userData.password = hashedPassword;
        if (req.files && req.files.length > 0) {
            console.log("files 7", req.files);
            for (const file of req.files) {
                userData.CV__path = baseUrl + file.filename;
            }
        }
        existingUser = yield studentModel_1.Student.findOne({
            where: { user__email: userData.user__email },
        });
        if (!existingUser) {
            existingUser = yield teacherModel_1.Teacher.findOne({
                where: { user__email: userData.user__email },
            });
        }
        if (!existingUser) {
            existingUser = yield teacherModel_1.Teacher.findOne({
                where: { user__email: userData.user__email },
            });
        }
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < 100; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        userData.codeVerifey = code;
        if (userData.role === "Student") {
            newUser = yield studentModel_1.Student.create(userData);
            const url = `http://localhost:4200/verifyemail/${newUser.codeVerifey}/`;
            const text = `
      <div>
    <h1>Account Activation</h1>
    <h2>We are delighted to welcome you to our platform, ${newUser.first__name}!</h2>
    <p>To complete your registration and activate your account, please confirm your email by clicking the button below:</p>
    <a href="${url}" style="
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: #ffffff;
      background-color: #007bff;
      border: none;
      border-radius: 5px;
      text-decoration: none;
    ">Confirm Your Email</a>
    <p>Thank you for choosing us.</p>
    <p>Best regards,</p>
  </div>`;
            yield (0, sendEmail_1.default)(newUser.user__email, "Account Activation", text);
            res
                .status(201)
                .json({ message: "Student registered successfully", user: newUser });
        }
        else if (userData.role === "Teacher") {
            newUser = yield teacherModel_1.Teacher.create(userData);
            const url = `http://localhost:4200/verifyemail/${newUser.codeVerifey}/`;
            const text = `
      <div>
    <h1>Account Activation</h1>
    <h2>We are delighted to welcome you to our platform, ${newUser.first__name}!</h2>
    <p>To complete your registration and activate your account, please confirm your email by clicking the button below:</p>
    <a href="${url}" style="
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: #ffffff;
      background-color: #007bff;
      border: none;
      border-radius: 5px;
      text-decoration: none;
    ">Confirm Your Email</a>
    <p>Thank you for choosing us.</p>
    <p>Best regards,</p>
  </div>`;
            yield (0, sendEmail_1.default)(newUser.user__email, "Account Activation", text);
            res
                .status(201)
                .json({ message: "Teacher registered successfully", user: newUser });
        }
        else {
            newUser = yield adminModel_1.Admin.create(userData);
            const url = `http://localhost:4200/verifyemail/${newUser.codeVerifey}/`;
            const text = `
      <div>
    <h1>Account Activation</h1>
    <h2>We are delighted to welcome you to our platform, ${newUser.first__name}!</h2>
    <p>To complete your registration and activate your account, please confirm your email by clicking the button below:</p>
    <a href="${url}" style="
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: #ffffff;
      background-color: #007bff;
      border: none;
      border-radius: 5px;
      text-decoration: none;
    ">Confirm Your Email</a>
    <p>Thank you for choosing us.</p>
    <p>Best regards,</p>
  </div>`;
            yield (0, sendEmail_1.default)(newUser.user__email, "Account Activation", text);
            res
                .status(201)
                .json({ message: "User registered successfully", user: newUser });
        }
    }
    catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("innnnnw",req.body.email)
        const { user__email, password } = req.body;
        console.log("email", user__email);
        let user = yield studentModel_1.Student.findOne({
            where: { user__email },
        });
        if (!user) {
            user = yield teacherModel_1.Teacher.findOne({ where: { user__email } });
        }
        if (!user) {
            user = yield adminModel_1.Admin.findOne({ where: { user__email } });
        }
        if (!user) {
            res.status(404).json({ message: "not exist !" });
        }
        else {
            if (user && user.emailVerifed !== true) {
                console.log("useremail", user.user__email);
                res.status(401).json({ message: "Comfirm your email !" });
            }
            else {
                if (user && user.emailVerifed == true && user.active !== true) {
                    res.status(401).json({ message: "you need  acceptation !" });
                }
                else {
                    if (user && user.active == true && (yield bcryptjs_1.default.compare(password, user.password))) {
                        let tokens = yield tokenModel_1.Token.findOne({
                            where: { user__id: user.user__id, role: user.role },
                        });
                        if (!tokens) {
                            const tokenData = {
                                user__id: user.user__id,
                                role: user.role,
                                token: (0, token_1.default)(user),
                            };
                            console.log("ttuseremail", user.user__email);
                            tokens = yield tokenModel_1.Token.create(tokenData);
                        }
                        console.log("useremailttt", user.user__email);
                        // const tokenData = {
                        //   user__id: user.user__id,
                        //   token: generateToken(user),
                        // };
                        // tokens = await Token.create(tokenData as any);
                        res.status(200).json({ token: tokens.token });
                    }
                    else {
                        res.status(401).json({ message: "Invalid email or password" });
                    }
                }
            }
        }
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Intesrnal server error" });
    }
    console.log("hello", req.headers);
});
exports.login = login;
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
        const hashedPassword = yield bcryptjs_1.default.hash(userData.Password, 10);
        userData.password = hashedPassword; // Update userData.Password with hashedPassword
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
