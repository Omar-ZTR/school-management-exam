import express from 'express';
import { signup, login } from '../controllers/AuthController'; 
import {  resetpassword, sendResetEmail, verifyEmail, verifyToken } from '../controllers/passwordController';

const router = express.Router();
router.post('/signup', signup);
// router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotpassword', sendResetEmail);
router.post("/resetpassword/:user__id/:token", resetpassword);
router.post("/verifyToken/:user__id/:token", verifyToken);
router.post("/verifemail/:codeVerifey", verifyEmail);
export default router;
