"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controllers/AuthController");
const passwordController_1 = require("../controllers/passwordController");
const router = express_1.default.Router();
router.post('/signup', AuthController_1.signup);
// router.post('/signup', signup);
router.post('/login', AuthController_1.login);
router.post('/forgotpassword', passwordController_1.sendResetEmail);
router.post("/resetpassword/:user__id/:token", passwordController_1.resetpassword);
router.post("/verifyToken/:user__id/:token", passwordController_1.verifyToken);
exports.default = router;
