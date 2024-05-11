"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const responseController_1 = require("../controllers/responseController");
const routerReponse = express_1.default.Router();
routerReponse.get('/', responseController_1.getAllReponses);
routerReponse.get('/Reponse/:id', responseController_1.getReponseById);
routerReponse.post('/Reponses', responseController_1.createReponse);
routerReponse.put('/Reponses/:id', responseController_1.updateReponse);
routerReponse.delete('/Reponses/:id', responseController_1.deleteReponse);
exports.default = routerReponse;
