"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const User__model_1 = require("./models/User__model");
const examModel_1 = require("./models/examModel");
const questionModel_1 = require("./models/questionModel");
const reponseModel_1 = require("./models/reponseModel");
const salleModel_1 = require("./models/salleModel");
const reservationModel_1 = require("./models/reservationModel");
const studentModel_1 = require("./models/studentModel");
const teacherModel_1 = require("./models/teacherModel");
const tokenModel_1 = require("./models/tokenModel");
const fileModel_1 = require("./models/fileModel");
const rankModel_1 = require("./models/rankModel");
const subjectModel_1 = require("./models/subjectModel");
const groupModel_1 = require("./models/groupModel");
const groupSubjectModel_1 = require("./models/groupSubjectModel");
const examQuestionModel_1 = require("./models/examQuestionModel");
const examGroupModel_1 = require("./models/examGroupModel");
const answerModel_1 = require("./models/answerModel");
const answerStudentModel_1 = require("./models/answerStudentModel");
const adminModel_1 = require("./models/adminModel");
const teacherSubjectsModel_1 = require("./models/teacherSubjectsModel");
const teacherGroupsModel_1 = require("./models/teacherGroupsModel");
const subscribeModel_1 = require("./models/subscribeModel");
const chatModel_1 = require("./models/chatModel");
const contactModel_1 = require("./models/contactModel");
const connection = new sequelize_typescript_1.Sequelize("smartskills", "root", "", {
    host: "localhost",
    dialect: "mysql",
    database: "smartskills",
    models: [
        contactModel_1.Contact,
        chatModel_1.Chat,
        subscribeModel_1.Subscribe,
        User__model_1.User,
        examModel_1.Exam,
        questionModel_1.Question,
        reponseModel_1.Reponse,
        salleModel_1.Salle,
        reservationModel_1.Reservation,
        studentModel_1.Student,
        examQuestionModel_1.ExamQuestion,
        examGroupModel_1.ExamGroup,
        teacherModel_1.Teacher,
        tokenModel_1.Token,
        fileModel_1.FileExam,
        fileModel_1.FileQuestion,
        rankModel_1.Rank,
        subjectModel_1.Subject,
        groupModel_1.Group,
        groupSubjectModel_1.GroupSubject,
        answerModel_1.Answer,
        answerStudentModel_1.AnswerStudent,
        fileModel_1.FileAnswer,
        adminModel_1.Admin,
        teacherSubjectsModel_1.TeacherSubject,
        teacherGroupsModel_1.TeacherGroup,
    ],
});
exports.default = connection;
