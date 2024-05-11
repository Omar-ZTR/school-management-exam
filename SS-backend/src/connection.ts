import { Sequelize } from "sequelize-typescript";
import { User } from "./models/User__model";
import { Exam } from "./models/examModel";
import { Question } from "./models/questionModel";
import { Reponse } from "./models/reponseModel";
import { Salle } from "./models/salleModel";
import { Reservation } from "./models/reservationModel";
import { Student } from "./models/studentModel";
import { Teacher } from "./models/teacherModel";
import { Token } from "./models/tokenModel";
import { File } from "./models/fileModel";

const connection = new Sequelize('smartskills', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    database: "smartskills",
    models: [User, Exam, Question, Reponse, Salle, Reservation, Student, Teacher,Token,File],

});



export default connection;
