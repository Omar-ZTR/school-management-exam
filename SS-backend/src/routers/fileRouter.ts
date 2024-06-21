import express from 'express';
import { downloadFile } from '../utils/upload';



const routerFile = express.Router();

routerFile.get('/download/:filename', downloadFile);



export default routerFile;