import { Question } from "../models/questionModel"; // Import your Question model
import { Request, Response } from "express";
import uploadFile from "../utils/upload";
import { Reponse } from "../models/reponseModel";
import {FileAnswer, FileExam, FileQuestion } from "../models/fileModel";
import { Exam } from "../models/examModel";
import uploadFileMiddleware from "../utils/upload";
import  fs from 'fs';
import path from "path";
import { Answer } from "../models/answerModel";
import { Reservation } from "../models/reservationModel";
const baseUrl = "http://localhost:3000/files/";







export const deleteFile = async (req: Request, res: Response) => {
    const fileId = req.params.id; // Assuming file ID is passed as a URL parameter
    const model = req.body.model; // Assuming model type is passed in the body

    try {
        let fileRecord;
        switch (model) {
            case 'question':
                fileRecord = await FileQuestion.findOne({ where: { file__id: fileId } });
                break;
            case 'exam':
                fileRecord = await FileExam.findOne({ where: { file__id: fileId } });
                break;
            case 'answer':
                fileRecord = await FileAnswer.findOne({ where: { file__id: fileId } });
                break;
            default:
                return res.status(400).json({ message: 'Invalid model type' });
        }
console.log("filerecord",fileRecord)
        if (!fileRecord) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Delete the file record from the database
        switch (model) {
            case 'question':
               await FileQuestion.destroy({ where: { file__id: fileId } });
             
                break;
            case 'exam':
              await FileExam.destroy({ where: { file__id: fileId } });
         
          
                break;
            case 'answer':
               await FileAnswer.destroy({ where: { file__id: fileId } });
             
                break;
        }

        // Delete the physical file from the server
        const filePath = path.join(__dirname, '../utils/filesUpload', fileRecord.file__name);
        console.log("File path:", filePath);

        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Esrror deleting file:", err);
                    return res.status(500).json({ message: 'Error deleting physical file' });
                }
            });
        } else {
            return res.status(200).json({ message: 'File not found!' });
        }
       
        res.status(200).json({ message: ' deleting physical file' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
  



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