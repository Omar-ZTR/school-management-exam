"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("../utils/upload");
const routerFile = express_1.default.Router();
routerFile.get('/download/:filename', upload_1.downloadFile);
exports.default = routerFile;
