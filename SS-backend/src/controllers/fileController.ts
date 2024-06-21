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