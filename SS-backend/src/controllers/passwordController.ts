import express, { Request, Response } from 'express';

import bcrypt from 'bcryptjs';
import {  Student } from '../models/studentModel';

import Joi from 'joi';
import sendEmail from '../utils/sendEmail';
import { Token } from '../models/tokenModel';

 import dotenv from 'dotenv';
import generateToken from '../utils/token';

 dotenv.config();
 
const router = express.Router();
export const sendResetEmail= async(req: Request, res: Response)  =>  {
    try {
        // const emailSchema = Joi.object({
        //     email: Joi.string().email().required().label("Email"),
        // });
        // const { error } = emailSchema.validate(req.body);
        // if (error)
        //     return res.status(400).send({ message: error.details[0].message + "hhhhh"});
        console.log('Email sent qqqq');
        const student = await Student.findOne({ where: { user__email: req.body.user__email } });
        console.log('Email ', student?.user__id);
        if (!student)
            return res.status(409).send({ message: "User with given email does not exist!" });

        let tokens = await Token.findOne({ where: { user__id: student.user__id } });
        if (!tokens) {
            const tokenData = {
                user__id: student.user__id,
                token: generateToken(student), // Assuming generateToken takes user ID as input
            };
           
                 tokens = await Token.create(tokenData as any);
               
        }
      
console.log(tokens)
        const url = `http://localhost:4200/resetpass/${student.user__id}/${tokens.token}/`;
        await sendEmail(student.user__email, "Password Reset", url);

        res.status(200).send({ message: "Password reset link sent to your email account", url,success: true });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error });
    }
};



export const verifyToken=  async (req: Request, res: Response) => {
    try {
        const user = await Student.findOne({ where: { user__id: req.params.user__id } });
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

        const student = await Student.findOne({ where: { user__id } });
        if (!student) {
            console.log("Invalid link: Student not found");
            return res.status(400).send({ message: "Invalid link" });
        }

        const tokenRecord = await Token.findOne({ where: { user__id: student.user__id, token } });
        if (!tokenRecord) {
            console.log("Invalid link: Token not found");
            return res.status(400).send({ message: "Invalid link" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        student.password = hashPassword;
        await student.save();
        await tokenRecord.destroy();

        console.log("Password reset successfully for user:", user__id);
        res.status(200).send({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({ message: "Internal Server Error", error });
    }
};

export default router;
