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
exports.getSubjects = void 0;
const subjectModel_1 = require("../models/subjectModel");
const getSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('slamou 3alaykom');
        const subjects = yield subjectModel_1.Subject.findAll();
        res.status(200).json(subjects);
    }
    catch (error) {
        console.error("Error fetching subjects", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getSubjects = getSubjects;
