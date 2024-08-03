import express, { Request, Response } from "express";

import bcrypt from "bcryptjs";
import { Student } from "../models/studentModel";

import Joi from "joi";
import sendEmail from "../utils/sendEmail";
import { Token } from "../models/tokenModel";

import dotenv from "dotenv";
import generateToken from "../utils/token";
import { Teacher } from "../models/teacherModel";
import { Admin } from "../models/adminModel";

dotenv.config();

const router = express.Router();
export const sendResetEmail = async (req: Request, res: Response) => {
  try {
    let user;
    user = await Student.findOne({
      where: { user__email: req.body.user__email },
    });

    if (!user) {
      user = await Teacher.findOne({
        where: { user__email: req.body.user__email },
      });
    }
    if (!user) {
      return res
        .status(409)
        .send({ message: "User with given email does not exist!" });
    }

    let tokens = await Token.findOne({
      where: { user__id: user.user__id, role: user.role },
    });

    if (!tokens) {
      const tokenData = {
        user__id: user.user__id,
        role: user.role,
        token: generateToken(user), // Assuming generateToken takes user ID as input
      };

      tokens = await Token.create(tokenData as any);
    }

    console.log(tokens);
    const url = `http://localhost:4200/resetpass/${user.user__id}/${tokens.token}/`;

    const text = `You requested a password reset. Click the following link to reset your password: ${url}`;

    await sendEmail(user.user__email, "Password Reset", text);

    res.status(200).send({
      message: "Password reset link sent to your email account",
      url,
      success: true,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const user = await Student.findOne({
      where: { user__id: req.params.user__id },
    });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      where: { user__id: user.user__id, token: req.params.token },
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    res.status(200).send("Valid Url");
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const codeVerifey = req.params.codeVerifey;
    let user;
    user = await Student.findOne({
      where: { codeVerifey: req.params.codeVerifey },
    });
    console.log("1111",user)
    console.log("1codeVerifey111",codeVerifey)
    if (!user) {
      user = await Teacher.findOne({
        where: { codeVerifey: req.params.codeVerifey },
      });
      console.log("222",user)
      console.log("2codeVerifey222",codeVerifey)
    }
    if (!user) {
      user = await Admin.findOne({
        where: { codeVerifey: req.params.codeVerifey },
      });
      console.log("333",user)
      console.log("3codeVerifey333",codeVerifey)
    }if (!user) {
      return res.status(400).send({ message: "Invalid link" });
    }
    // const token = await Token.findOne({
    //   where: { user__id: user.user__id, token: req.params.token },
    // });


    if (user && user.emailVerifed == true) {
        return res.send({
          message: "Votre compte est déja verified !",
        });
      } else {
        user.emailVerifed = true;
        user.save();
      
    res.status(200).send({
        message: "Votre compte est verifeid avec succées !",
      });}
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const resetpassword = async (req: Request, res: Response) => {
  console.log("Starting password reset process");

  try {
    const passwordSchema = Joi.object({
      password: Joi.string().required().label("Password"),
    });

    const { error } = passwordSchema.validate({ password: req.body.password });
    if (error) {
      console.log("Validation error:", error.details[0].message);
      return res.status(400).send({ message: error.details[0].message });
    }

    const { user__id, token } = req.params;
    const tokenRecord = await Token.findOne({
      where: { user__id: user__id, token },
    });
    if (!tokenRecord) {
      console.log("Invalid link: Token not found");
      return res.status(400).send({ message: "Invalid link" });
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    if (tokenRecord.role === "Student") {
      const student = await Student.findOne({ where: { user__id } });
      if (!student) {
        console.log("Invalid link: Student not found");
        return res.status(400).send({ message: "Invalid link" });
      }
      student.password = hashPassword;
      await student.save();
      await tokenRecord.destroy();
    }

    if (tokenRecord.role === "Teacher") {
      const teacher = await Teacher.findOne({ where: { user__id } });
      if (!teacher) {
        console.log("Invalid link: Teacher not found");
        return res.status(400).send({ message: "Invalid link" });
      }
      teacher.password = hashPassword;
      await teacher.save();
      await tokenRecord.destroy();
    }

    console.log("Password reset successfully for user:", user__id);
    res
      .status(200)
      .send({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

export default router;
