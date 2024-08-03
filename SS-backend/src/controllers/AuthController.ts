import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import nodemailer from "nodemailer";
import { User } from "../models/User__model";
import { Student } from "../models/studentModel";
import { Teacher } from "../models/teacherModel";
import { Token } from "../models/tokenModel";
import generateToken from "../utils/token";
import { users } from "../models/usress/userModel";
import { Admin } from "../models/adminModel";
import uploadFileMiddleware from "../utils/upload";
import sendEmail from "../utils/sendEmail";

const baseUrl = "http://localhost:3000/files/";

// Signup function
export const signup = async (req: Request, res: Response) => {
  try {
    // console.log("Incoming request:", req);

    await uploadFileMiddleware(req, res); // Handle file upload
    console.log("File uploaded:", req.files);

    if (!req.body.user) {
      return res.status(400).json({ message: "User data is missing" });
    }

    let userData;
    try {
      userData = JSON.parse(req.body.user); // Assuming user data is in req.body.user as a JSON string
    } catch (parseError) {
      console.error("Error parsing user data:", parseError);
      return res.status(400).json({ message: "Invalid user data format" });
    }

    console.log("Parsed user data:", userData);

    userData.resetPasswordToken = "";
    userData.status = false;

    let existingUser;
    let newUser;
    const hashedPassword = await bcrypt.hash(userData.Password, 10);
    userData.password = hashedPassword; // Update userData.Password with hashed password
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      console.log("files 7", req.files);
      for (const file of req.files as Express.Multer.File[]) {
        userData.CV__path = baseUrl + file.filename;
      }
    }

    existingUser = await Student.findOne({
      where: { user__email: userData.user__email },
    });
    if (!existingUser) {
      existingUser = await Teacher.findOne({
        where: { user__email: userData.user__email },
      });
    }

    if (!existingUser) {
      existingUser = await Teacher.findOne({
        where: { user__email: userData.user__email },
      });
    }
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 100; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    userData.codeVerifey = code;

    if (userData.role === "Student") {
      newUser = await Student.create(userData);

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
      await sendEmail(newUser.user__email, "Account Activation", text);
      res
        .status(201)
        .json({ message: "Student registered successfully", user: newUser });
    } else if (userData.role === "Teacher") {
      newUser = await Teacher.create(userData);
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
      await sendEmail(newUser.user__email, "Account Activation", text);
      res
        .status(201)
        .json({ message: "Teacher registered successfully", user: newUser });
    } else {
      newUser = await Admin.create(userData);
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
      await sendEmail(newUser.user__email, "Account Activation", text);
      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    }
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

type UserType = Student | Teacher | Admin;
// Login function
export const login = async (req: Request, res: Response) => {
  try {
    // console.log("innnnnw",req.body.email)
    const { user__email, password } = req.body;

    let user: UserType | null = await Student.findOne({
      where: { user__email },
    });
    if (!user) {
      user = await Teacher.findOne({ where: { user__email } });
    }
    if (!user) {
      user = await Admin.findOne({ where: { user__email } });
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      let tokens = await Token.findOne({
        where: { user__id: user.user__id, role: user.role },
      });
      if (!tokens) {
        const tokenData = {
          user__id: user.user__id,
          role: user.role,
          token: generateToken(user),
        };

        tokens = await Token.create(tokenData as any);
      }
      // const tokenData = {
      //   user__id: user.user__id,
      //   token: generateToken(user),
      // };
      // tokens = await Token.create(tokenData as any);
      res.status(200).json({ token: tokens.token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Intesrnal server error" });
  }
  console.log("hello", req.headers);
};

// Signup function

export const ssignup = async (req: Request, res: Response) => {
  try {
    let userData = req.body;

    userData.resetPasswordToken = "";
    userData.specialty = "";
    userData.role = "Student";
    userData.status = false;

    const existingUser = await User.findOne({
      where: { user__email: userData.user__email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(userData.Password, 10);
    userData.password = hashedPassword; // Update userData.Password with hashedPassword

    const newUser = await User.create(userData);

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Forgot password function
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { user__email } = req.body;

    const user = await User.findOne({ where: { user__email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateToken(user);

    user.resetPasswordToken = token;
    await user.save();

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
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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
