import express from "express";
import UserRoutes from "./routers/authRouter";
import * as dotenv from "dotenv";
import connection from "./connection";
import { json, urlencoded } from "body-parser";
import routerExam from "./routers/examRouter";
import routerQuestion from "./routers/questionRouter";
import routerReservation from "./routers/reservationRouter";
import routerGroup from "./routers/groupRouter";
import routerSalle from "./routers/salleRouter";
import routersubject from "./routers/routerSubject";
import path from "path";
import routerFile from "./routers/fileRouter";
import routerAnswer from "./routers/answerRouter";
import routerTeacher from "./routers/teacherRouter";
import routerStudents from "./routers/studentRouter";
import routerSubscribe from "./routers/subscribeRouter";
import routerChat from "./models/usress/chatRouter";
import routerContact from "./routers/contactRouter";
import { Reservation } from "./models/reservationModel";
import { Op } from "sequelize";
import { notifyExamReservation } from "./controllers/reservationController";

const app = express();

const cors = require("cors");
app.use(json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id"
  );

  res.header(
    "Access-Control-Expose-Headers",
    "x-access-token, x-refresh-token"
  );

  next();
});
app.use(urlencoded({ extended: true }));

app.use(
  "/",
  routerTeacher,
  UserRoutes,
  routerExam,
  routerQuestion,
  routerReservation,
  routerGroup,
  routerSalle,
  routerFile,
  routerAnswer,
  routersubject,
  routerStudents,
  routerSubscribe,
  routerChat,
  routerContact,
);

const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({ message: err.message });
  }
);
app.use("/files", express.static(path.join(__dirname, "utils/filesUpload")));

var cron = require('node-cron');
cron.schedule('0 9 */2 * *', async () => {
  console.log('Running cron job for sending emails');
  const reservations = await Reservation.findAll({
    where: {  where: {
      startDate: {
        [Op.gt]: new Date(), 
      },
    },},
  });
 
  if (reservations) {

for (const exam of reservations){
  await notifyExamReservation(exam);
}

    
  }

console.log("helo corn")
});
dotenv.config();
// alter: true
connection
  .sync({alter: true})
  .then(() => {
    console.log("Database successfully connected");
  })
  .catch((err) => {
    console.log("Error", err);
  });
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
