"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resultController_1 = require("../controllers/resultController");
const routerResult = express_1.default.Router();
routerResult.get('/', resultController_1.getAllResults);
routerResult.get('/Result/:id', resultController_1.getResultById);
routerResult.post('/Results', resultController_1.createResult);
routerResult.put('/Results/:id', resultController_1.updateResult);
routerResult.delete('/Results/:id', resultController_1.deleteResult);
exports.default = routerResult;
