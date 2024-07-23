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
exports.deleteQuestion = exports.CheckAssociation = exports.getAllQuestions = exports.getQuestionById = exports.updateQuestionsWithExam = exports.getFakeQuestions = exports.QuestionById = exports.updateQuestion = exports.createQuestion = void 0;
const questionModel_1 = require("../models/questionModel"); // Import your Question model
const reponseModel_1 = require("../models/reponseModel");
const fileModel_1 = require("../models/fileModel");
const examModel_1 = require("../models/examModel");
const upload_1 = __importDefault(require("../utils/upload"));
const examQuestionModel_1 = require("../models/examQuestionModel");
const baseUrl = "http://localhost:3000/files/";
// Create operation
// export const createQuestion = async (req: Request, res: Response) => {
//   try {
//     console.log("exam 2", req.files);
//     await uploadFile(req, res); // Handle file upload
//     console.log("exam 3", req.file);
//     const questDatas = { ...req.body };
// console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>",questDatas)
//     // Assuming exam data is in req.body
//     console.log("exam 4", questDatas[0]);
//     const questionData = JSON.parse(questDatas.question);
//     console.log("Parsed question data:", questionData);
//     const question = await Question.create(questionData);
//     console.log("exam 6");
//     if (req.files && req.files.length != 0) {
//       console.log("file 7", req.file);
//       for (const file of req.files as Express.Multer.File[]) {
//         const support__files = {
//           file__name: file.originalname,
//           file__path: baseUrl + file.filename,
//           file__type: "Question",
//           question__id: question.question__id,
//         };
//         console.log("file attribute", support__files);
//         const filesup = await FileQuestion.create({
//           file__name: file.originalname,
//           file__path: baseUrl + file.filename,
//           file__type: "Question",
//           question__id: question.question__id,
//         });
//       }
//     }
//     console.log("file 8");
//     // Create the questions for the exam
//     if (
//       questDatas.reponses &&
//       Array.isArray(questDatas.reponses) &&
//       questDatas.reponses.length > 0
//     ) {
//       console.log("if ethanya fotnaha");
//       const responsesData = questDatas.reponses;
//       for (const responseData of responsesData) {
//         responseData.question__id = question.question__id;
//         await Reponse.create(responseData);
//       }
//     }
//     res.status(201).json(question);
//   } catch (error) {
//     console.error("Error creation exam", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("exam 2", req.files);
        yield (0, upload_1.default)(req, res);
        console.log("exam 3", req.file);
        const questDatas = Object.assign({}, req.body);
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>", questDatas);
        // Assuming exam data is in req.body
        console.log("exam 4", questDatas[0]);
        const questionData = JSON.parse(questDatas.question);
        console.log("Parsed question data:", questionData);
        const question = yield questionModel_1.Question.create(questionData);
        console.log("exam 6");
        if (req.files && req.files.length > 0) {
            console.log("files 7", req.files);
            for (const file of req.files) {
                const support__files = {
                    file__name: file.originalname,
                    file__path: baseUrl + file.filename,
                    file__type: "Question",
                    question__id: question.question__id,
                };
                console.log("file attribute", support__files);
                yield fileModel_1.FileQuestion.create(support__files);
            }
        }
        console.log("file 8", questDatas);
        // Associate question with exam if exam__id is provided
        if (questionData.exam__id) {
            const exam = yield examModel_1.Exam.findByPk(questionData.exam__id);
            if (exam) {
                yield exam.$add("questions", question);
                console.log(`Associated question ${question.question__id} with exam ${questionData.exam__id}`);
            }
        }
        console.log(",,,,,,,,,,,,,,,,,,,,3332,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", questionData.reponses);
        // Create the responses for the question
        if (questionData.reponses &&
            Array.isArray(questionData.reponses) &&
            questionData.reponses.length > 0) {
            console.log("if ethanya fotnaha");
            const responsesData = questionData.reponses;
            for (const responseData of responsesData) {
                console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", responseData);
                responseData.question__id = question.question__id;
                yield reponseModel_1.Reponse.create(responseData);
            }
        }
        const NewQuestion = yield questionModel_1.Question.findOne({
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
            where: { question__id: question.question__id },
        });
        res.status(201).json(NewQuestion);
    }
    catch (error) {
        console.error("Error creating question", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createQuestion = createQuestion;
const updateQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Hello to update question >>>>>>>>>>>>>>>>>", req.body);
    try {
        const questionId = req.params.id;
        yield (0, upload_1.default)(req, res);
        // Handle the form data parsing
        const questDatas = Object.assign({}, req.body);
        console.log("Hddddddd>", questDatas);
        const questionData = JSON.parse(questDatas.question);
        console.log("ssssssss>", questionData);
        // Find the existing question
        const question = yield questionModel_1.Question.findByPk(questionId);
        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }
        // Update question data
        yield question.update(questionData);
        // Fetch existing responses and files
        const existingResponses = yield reponseModel_1.Reponse.findAll({
            where: { question__id: questionId },
        });
        // const existingFiles = await FileQuestion.findAll({ where: { question__id: questionId } });
        // Update or create new responses
        if (questionData.reponses && Array.isArray(questionData.reponses)) {
            const responseIds = questionData.reponses.map((response) => response.reponse__id);
            for (const responseData of questionData.reponses) {
                if (responseData.reponse__id) {
                    // Update existing response
                    const response = yield reponseModel_1.Reponse.findByPk(responseData.reponse__id);
                    if (response) {
                        yield response.update(responseData);
                    }
                }
                else {
                    // Create new response
                    responseData.question__id = question.question__id;
                    yield reponseModel_1.Reponse.create(responseData);
                }
            }
            // Delete responses not in the updated data
            for (const response of existingResponses) {
                if (!responseIds.includes(response.reponse__id)) {
                    yield response.destroy();
                }
            }
        }
        // Handle file uploads
        if (req.files && req.files.length > 0) {
            // const fileIds = (req.files as Express.Multer.File[]).map(file => file.filename);
            for (const file of req.files) {
                const support__files = {
                    file__name: file.originalname,
                    file__path: baseUrl + file.filename,
                    file__type: "Question",
                    question__id: question.question__id,
                };
                yield fileModel_1.FileQuestion.create(support__files);
            }
            // Delete files not in the updated data
            // for (const file of existingFiles) {
            //   const filePathParts = file.file__path ? file.file__path.split('/') : [];
            //   const fileName = filePathParts.pop();
            //   if (fileName && !fileIds.includes(fileName)) {
            //     await file.destroy();
            //   }
            // }
        }
        const NewQuestion = yield questionModel_1.Question.findOne({
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
            where: { question__id: question.question__id },
        });
        res.status(200).json(NewQuestion);
    }
    catch (error) {
        console.error("Error updating question", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateQuestion = updateQuestion;
// getby Id
const QuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params;
        const questions = yield questionModel_1.Question.findOne({
            where: {
                question__id: id,
            },
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
        console.log("<><<<>>", questions);
        res.status(200).json(questions);
    }
    catch (error) {
        console.error("Error fetching questions with files", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.QuestionById = QuestionById;
// Get fake Question
const getFakeQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const examId = -1;
        const questions = yield questionModel_1.Question.findAll({
            include: [
                {
                    model: examModel_1.Exam,
                    as: "exams",
                    where: { exam__id: examId },
                    through: { attributes: [] }, // Exclude join table attributes
                },
                {
                    model: fileModel_1.FileQuestion,
                    as: "file",
                    required: false,
                },
            ],
        });
        console.log("<><<<>>", questions);
        res.status(200).json(questions);
    }
    catch (error) {
        console.error("Error fetching questions with files", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getFakeQuestions = getFakeQuestions;
const updateQuestionsWithExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { exam__id, questionIds } = req.body;
        if (!exam__id || !Array.isArray(questionIds) || questionIds.length === 0) {
            return res.status(400).json({ error: "Invalid input data" });
        }
        const exam = yield examModel_1.Exam.findByPk(exam__id);
        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }
        const questions = yield questionModel_1.Question.findAll({
            where: {
                question__id: questionIds,
            },
        });
        if (questions.length !== questionIds.length) {
            return res.status(404).json({ error: "One or more questions not found" });
        }
        yield exam.$add("questions", questions);
        return questions;
    }
    catch (error) {
        console.error("Error updating questions with exam", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateQuestionsWithExam = updateQuestionsWithExam;
const getQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const question = yield questionModel_1.Question.findByPk(id);
        if (question) {
            res.status(200).json(question);
        }
        else {
            res.status(404).json({ message: "Question not found" });
        }
    }
    catch (error) {
        console.error("Error fetch question", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getQuestionById = getQuestionById;
// Read operation - Get all questions
const getAllQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield questionModel_1.Question.findAll();
        res.status(200).json(questions);
    }
    catch (error) {
        console.error("Error fetch questions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllQuestions = getAllQuestions;
// Update operation
const CheckAssociation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let check = false;
        const Count = yield examQuestionModel_1.ExamQuestion.count({
            where: { question__id: id },
        });
        if (Count == 0) {
            check = true;
        }
        res.status(200).json(check);
    }
    catch (error) {
        console.error("Error fetch questions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.CheckAssociation = CheckAssociation;
// Delete operation
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log("hay bb");
        const deleteData = req.body.model;
        console.log("hay req", deleteData);
        if (deleteData.action === "delete") {
            const question = yield questionModel_1.Question.findByPk(id);
            if (question) {
                yield question.destroy();
                console.log(`Deleted question with ID ${id}`);
                res.status(204).send();
            }
            else {
                console.log(`Question with ID ${id} not found`);
                throw new Error("Question not found");
            }
        }
        if (deleteData.action !== "delete") {
            const message = unassociateQuestionFromExam(deleteData.exam__id, id);
            res.status(204).send(message);
        }
    }
    catch (error) {
        console.error("Error deleting question", error);
        res.status(500).send("Error deleting question");
    }
});
exports.deleteQuestion = deleteQuestion;
function unassociateQuestionFromExam(examId, questionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Find the exam and question instances
            const exam = yield examModel_1.Exam.findByPk(examId);
            const question = yield questionModel_1.Question.findByPk(questionId);
            if (exam && question) {
                // Unassociate the question from the exam
                yield exam.$remove("questions", question);
                return `Unassociated question ${question.question__id} from exam ${exam.exam__id}`;
            }
            else {
                return "Exam or Question not found";
            }
        }
        catch (error) {
            console.error("Error unassociating question from exam:", error);
        }
    });
}
