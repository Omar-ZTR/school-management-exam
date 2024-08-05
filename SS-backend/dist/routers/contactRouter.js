"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactController_1 = require("../controllers/contactController");
const routerContact = express_1.default.Router();
routerContact.post('/contact', contactController_1.createContact);
routerContact.get('/contact/:email', contactController_1.getAllContacts);
exports.default = routerContact;
