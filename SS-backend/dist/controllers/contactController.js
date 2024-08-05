"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllContacts = exports.createContact = void 0;
const contactModel_1 = require("../models/contactModel");
// Create operation
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contact = yield contactModel_1.Contact.create(req.body);
        const newContact = yield contactModel_1.Contact.findOne({
            where: { contact__id: contact.contact__id },
        });
        res.status(201).json(newContact);
    }
    catch (error) {
        console.error("Error creation Contact", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createContact = createContact;
// Read operation - Get all Contacts
const getAllContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const Contacts = yield contactModel_1.Contact.findAll({
            where: {
                recipient__email: email
            }
        });
        res.status(200).json(Contacts);
    }
    catch (error) {
        console.error("Error fetch Contact:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllContacts = getAllContacts;
