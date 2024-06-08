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
import {  FileExam, FileQuestion } from "./models/fileModel";
import { Rank } from "./models/rankModel";
import { Subject } from "./models/subjectModel";
import { Group } from "./models/groupModel";
import { GroupSubject } from "./models/groupSubjectModel";
import { ExamQuestion } from "./models/examQuestionModel";
import { ExamGroup } from "./models/examGroupModel";

const connection = new Sequelize('smartskills', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    database: "smartskills",
    models: [User, Exam, Question, Reponse, Salle, Reservation, Student,ExamQuestion, ExamGroup, Teacher,Token,FileExam,FileQuestion, Rank, Subject, Group, GroupSubject ],

});



export default connection;
