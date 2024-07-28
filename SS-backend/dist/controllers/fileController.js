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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = void 0;
const questionModel_1 = require("../models/questionModel"); // Import your Question model
const fileModel_1 = require("../models/fileModel");
const examModel_1 = require("../models/examModel");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const answerModel_1 = require("../models/answerModel");
const reservationModel_1 = require("../models/reservationModel");
const baseUrl = "http://localhost:3000/files/";
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileId = req.params.id; // Assuming file ID is passed as a URL parameter
    const model = req.body.model; // Assuming model type is passed in the body
    try {
        let fileRecord;
        switch (model) {
            case 'question':
                fileRecord = yield fileModel_1.FileQuestion.findOne({ where: { file__id: fileId } });
                break;
            case 'exam':
                fileRecord = yield fileModel_1.FileExam.findOne({ where: { file__id: fileId } });
                break;
            case 'answer':
                fileRecord = yield fileModel_1.FileAnswer.findOne({ where: { file__id: fileId } });
                break;
            default:
                return res.status(400).json({ message: 'Invalid model type' });
        }
        if (!fileRecord) {
            return res.status(404).json({ message: 'File not found' });
        }
        let objRecord;
        let exist;
        // Delete the file record from the database
        switch (model) {
            case 'question':
                objRecord = yield fileModel_1.FileQuestion.destroy({ where: { file__id: fileId } });
                exist = yield fileModel_1.FileQuestion.findOne({ where: { file__id: fileId } });
                break;
            case 'exam':
                yield fileModel_1.FileExam.destroy({ where: { file__id: fileId } });
                exist = yield fileModel_1.FileExam.findOne({ where: { file__id: fileId } });
                if (exist) {
                    objRecord = yield examModel_1.Exam.findOne({ include: [
                            { model: questionModel_1.Question },
                            { model: reservationModel_1.Reservation },
                            { model: fileModel_1.FileExam },
                            { model: answerModel_1.Answer },
                        ], where: { exam__id: exist.exam__id } });
                }
                console.log("objRecord asza:", objRecord);
                break;
            case 'answer':
                objRecord = yield fileModel_1.FileAnswer.destroy({ where: { file__id: fileId } });
                exist = yield fileModel_1.FileAnswer.findOne({ where: { file__id: fileId } });
                break;
        }
        // Delete the physical file from the server
        const filePath = path_1.default.join(__dirname, '../utils/filesUpload', fileRecord.file__name);
        console.log("File path:", filePath);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                    return res.status(500).json({ message: 'Error deleting physical file' });
                }
            });
        }
        else {
            return res.status(404).json({ message: 'File not found!' });
        }
        console.log("objRecord path:", objRecord);
        res.status(200).json(objRecord);
    }
    catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteFile = deleteFile;
// import { Request, Response } from "express";
// import path from "path";
// import  fs from 'fs';
// export const downloadFile = async(req: Request, res: Response) => {
//     const filename = req.params.filename;
//     const filePath = path.join(__dirname, 'utils/filesUpload', filename);
//   console.log(filePath)
//     if (fs.existsSync(filePath)) {
//       res.download(filePath, filename, (err) => {
//         if (err) {
//           console.error(err);
//           res.status(500).send({ message: 'Could not download the file!' });
//         }
//       });
//     } else {
//       res.status(404).send({ message: 'File not found!' });
//     }
//   };
