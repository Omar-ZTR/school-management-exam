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
exports.deleteSubject = exports.UpdateSubject = exports.getSubjects = exports.CreateSubject = void 0;
const subjectModel_1 = require("../models/subjectModel");
const CreateSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newSubject = yield subjectModel_1.Subject.create(req.body);
        const subject = yield subjectModel_1.Subject.findOne({
            where: { subject__id: newSubject.subject__id },
        });
        res.status(201).json(subject);
    }
    catch (error) {
        console.error("Error creating Subject:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.CreateSubject = CreateSubject;
const getSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjects = yield subjectModel_1.Subject.findAll();
        res.status(200).json(subjects);
    }
    catch (error) {
        console.error("Error fetching subjects", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getSubjects = getSubjects;
const UpdateSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log("dsjjjjjjjjjjjjjjjjjj", id);
        const [updated] = yield subjectModel_1.Subject.update(req.body, {
            where: { subject__id: id },
        });
        if (!updated) {
            throw new Error("Subject not found");
        }
        const updatedSubject = yield subjectModel_1.Subject.findOne({ where: { subject__id: id } });
        res.status(200).json(updatedSubject);
    }
    catch (error) {
        console.error("Error updating Subject", error);
        res.status(500).send("Error updating Subject");
    }
});
exports.UpdateSubject = UpdateSubject;
const deleteSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield subjectModel_1.Subject.destroy({ where: { subject__id: id } });
        if (deleted) {
            res.status(204).send();
        }
        else {
            throw new Error("Subject not found");
        }
    }
    catch (error) {
        console.error("Error deleting Subject", error);
        res.status(500).send("Error deleting Subject");
    }
});
exports.deleteSubject = deleteSubject;
