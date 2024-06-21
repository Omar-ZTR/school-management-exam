import * as util from "util";
import multer from "multer";
import path from "path";
import  fs from 'fs';
import { Request, Response } from "express";

const maxSize = 2 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: (arg0: null, arg1: string) => void) => {
    const uploadDir = path.join(__dirname, '/filesUpload');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: any) => void) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

const uploadFile = multer({
  storage: storage,

}).array("files");

const uploadFileMiddleware = util.promisify(uploadFile);

export default uploadFileMiddleware;







export const downloadFile = async(req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'filesUpload', filename);
console.log(filePath)
  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: 'Could not download the file!' });
      }
    });
  } else {
    res.status(404).send({ message: 'File not found!' });
  }
};