import express from 'express';
import { downloadFile } from '../utils/upload';
import { deleteFile } from '../controllers/fileController';



const routerFile = express.Router();

routerFile.get('/download/:filename', downloadFile);

routerFile.delete('/file/:id', deleteFile);


export default routerFile;