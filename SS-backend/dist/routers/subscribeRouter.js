"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscribeController_1 = require("../controllers/subscribeController");
const routerSubscribe = express_1.default.Router();
routerSubscribe.post('/subscribe', subscribeController_1.createSubscribe);
routerSubscribe.get('/subscribe/:exam__id/:user__id', subscribeController_1.getOneSubscribe);
routerSubscribe.get('/subscribe', subscribeController_1.getAllSubscribes);
exports.default = routerSubscribe;
