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
exports.getAnswers = exports.getStudentAnswers = exports.updateResult = exports.createAnswers = void 0;
const examModel_1 = require("../models/examModel");
const answerModel_1 = require("../models/answerModel");
const answerStudentModel_1 = require("../models/answerStudentModel");
const questionModel_1 = require("../models/questionModel");
const reponseModel_1 = require("../models/reponseModel");
const fileModel_1 = require("../models/fileModel");
const upload_1 = __importDefault(require("../utils/upload"));
const studentModel_1 = require("../models/studentModel");
const subjectModel_1 = require("../models/subjectModel");
const baseUrl = "http://localhost:3000/files/";
// Create operation
const createAnswers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, upload_1.default)(req, res);
        const Answers = Object.assign({}, req.body);
        const answersData = JSON.parse(Answers.ans);
        console.log("sssss", answersData.exam__id);
        const exam = yield examModel_1.Exam.findByPk(answersData.exam__id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        const answer = yield answerModel_1.Answer.create(answersData);
        if (req.files && req.files.length > 0) {
            console.log("files 7", req.files);
            for (const file of req.files) {
                const support__files = {
                    file__name: file.originalname,
                    file__path: baseUrl + file.filename,
                    file__type: "answer",
                    ans__id: answer.ans__id,
                };
                console.log("file attribute", support__files);
                yield fileModel_1.FileAnswer.create(support__files);
            }
        }
        if (answersData.answers &&
            Array.isArray(answersData.answers) &&
            answersData.answers.length > 0) {
            console.log("if  fotnaha");
            const ansDatas = answersData.answers;
            for (const ansData of ansDatas) {
                console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", ansData);
                const question = yield questionModel_1.Question.findByPk(ansData.question__id);
                if (!question) {
                    return res.status(404).json({ message: "question not found" });
                }
                ansData.ans__id = answer.ans__id;
                yield answerStudentModel_1.AnswerStudent.create(ansData);
            }
        }
        res.status(201).json(answer);
    }
    catch (error) {
        console.error("Error creation aswers", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createAnswers = createAnswers;
const updateResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [updated] = yield answerModel_1.Answer.update(req.body, { where: { ans__id: id } });
        if (updated) {
            const updatedResult = yield answerModel_1.Answer.findOne({ where: { ans__id: id } });
            res.status(200).json(updatedResult);
        }
        else {
            throw new Error("Result not found");
        }
    }
    catch (error) {
        console.error("Error updating result", error);
        res.status(500).send("Error updating result");
    }
});
exports.updateResult = updateResult;
const getStudentAnswers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let answers;
        answers = yield answerModel_1.Answer.findAll({
            where: { Student__id: id },
        });
        answers = yield Promise.all(answers.map((ans) => __awaiter(void 0, void 0, void 0, function* () {
            const exam = yield examModel_1.Exam.findOne({
                where: {
                    exam__id: ans.exam__id,
                },
            });
            const subject = yield subjectModel_1.Subject.findOne({
                where: {
                    subject__name: exam === null || exam === void 0 ? void 0 : exam.subject
                },
            });
            // Add student__name to the answer object
            return Object.assign(Object.assign({}, ans.get({ plain: true })), { exam__title: (exam === null || exam === void 0 ? void 0 : exam.exam__title) || null, exam__oblig: (exam === null || exam === void 0 ? void 0 : exam.obligatoire) || null, subject: subject });
        })));
        res.status(200).json(answers);
    }
    catch (error) {
        console.error("Error fetching answers", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getStudentAnswers = getStudentAnswers;
const getAnswers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const exams = yield examModel_1.Exam.findAll({
            include: [
                {
                    model: answerModel_1.Answer,
                    include: [
                        {
                            model: answerStudentModel_1.AnswerStudent,
                            as: "answers",
                        },
                        {
                            model: fileModel_1.FileAnswer,
                        },
                    ],
                },
            ],
            where: { user__id: id },
        });
        for (const e of exams) {
            console.log("exams is ", e.answers);
        }
        // const answers = await Answer.findAll({
        //   include: [
        //     {
        //       model: AnswerStudent,
        //       as: 'answers',
        //     },
        //     {
        //       model: FileAnswer,
        //     }
        //   ],
        // });
        let formattedAnswers = [];
        let formattedAnswersCertif = [];
        for (const exam of exams) {
            for (const answer of exam.answers) {
                if (exam.obligatoire == false) {
                    formattedAnswersCertif.push(((answer) => __awaiter(void 0, void 0, void 0, function* () {
                        const examTitle = yield getTitle(answer.exam__id);
                        const nameStud = yield getNamestudent(answer.Student__id);
                        return {
                            ans__id: answer.ans__id,
                            exam__id: answer.exam__id,
                            exam__title: examTitle,
                            Student__id: answer.Student__id,
                            Student__name: nameStud,
                            ans__result: answer.ans__result,
                            fileAnswer: answer.file.map((f) => ({
                                file__id: f.file__id,
                                file__name: f.file__name,
                                file__path: f.file__path,
                            })),
                            createdAt: answer.createdAt,
                            updatedAt: answer.updatedAt,
                            answers: answer.answers,
                            ans__descreption: answer.ans__descreption,
                        };
                    }))(answer));
                }
                else {
                    formattedAnswers.push(((answer) => __awaiter(void 0, void 0, void 0, function* () {
                        const examTitle = yield getTitle(answer.exam__id);
                        const nameStud = yield getNamestudent(answer.Student__id);
                        return {
                            ans__id: answer.ans__id,
                            exam__id: answer.exam__id,
                            exam__title: examTitle,
                            Student__id: answer.Student__id,
                            Student__name: nameStud,
                            ans__result: answer.ans__result,
                            fileAnswer: answer.file.map((f) => ({
                                file__id: f.file__id,
                                file__name: f.file__name,
                                file__path: f.file__path,
                            })),
                            createdAt: answer.createdAt,
                            updatedAt: answer.updatedAt,
                            answers: answer.answers,
                            ans__descreption: answer.ans__descreption,
                        };
                    }))(answer));
                }
            }
        }
        const ObliAnswers = yield Promise.all(formattedAnswers);
        const CertifAnswers = yield Promise.all(formattedAnswersCertif);
        res.status(200).json({
            ObliAnswers: ObliAnswers,
            CertifAnswers: CertifAnswers,
        });
    }
    catch (error) {
        console.error("Error fetching answers", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAnswers = getAnswers;
function GetQuestionById(questionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const question = yield questionModel_1.Question.findOne({
                where: {
                    question__id: questionId,
                },
                attributes: ["question__id", "question__text"], // Adjust attributes as needed
                include: [
                    {
                        model: reponseModel_1.Reponse,
                        as: "reponses",
                    },
                    {
                        model: fileModel_1.FileQuestion,
                        as: "file",
                    },
                ],
            });
            if (question) {
                return question;
            }
            else {
                throw new Error("Question not found");
            }
        }
        catch (error) {
            console.error("Error fetching question by question ID", error);
            throw error;
        }
    });
}
function getTitle(examid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("................................ exam id fi func", examid);
            const examTitle = yield examModel_1.Exam.findOne({
                where: {
                    exam__id: examid,
                },
                attributes: ["exam__title"],
            });
            if (!examTitle) {
                console.log("ssssssssssss");
            }
            else {
                console.log("kllllllllllllll", examTitle);
            }
            return examTitle.exam__title;
        }
        catch (error) {
            console.error("Error fetching exam title by exam ID", error);
            throw error;
        }
    });
}
function getNamestudent(examid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("................................ exam id fi func", examid);
            const student = yield studentModel_1.Student.findOne({
                where: {
                    user__id: examid,
                },
            });
            let allname = "";
            if (!student) {
                console.log("ssssssssssss");
            }
            else {
                allname = student.first__name + student.last__name;
                console.log("kllllllllllllll", allname);
            }
            return allname;
        }
        catch (error) {
            console.error("Error fetching exam title by exam ID", error);
            throw error;
        }
    });
}
