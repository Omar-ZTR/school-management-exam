import { Question } from "../models/questionModel"; // Import your Question model
import { Request, Response } from "express";
import uploadFile from "../utils/upload";
import { Reponse } from "../models/reponseModel";
import {FileQuestion } from "../models/fileModel";
import { Exam } from "../models/examModel";
import uploadFileMiddleware from "../utils/upload";
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



export const createQuestion = async (req: Request, res: Response) => {
  try {
    console.log("exam 2", req.files);

    await uploadFileMiddleware(req, res)
    console.log("exam 3", req.file);
    const questDatas = { ...req.body };
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>", questDatas);
    
    // Assuming exam data is in req.body
    console.log("exam 4", questDatas[0]);
    const questionData = JSON.parse(questDatas.question);
    console.log("Parsed question data:", questionData);

    const question = await Question.create(questionData);
    console.log("exam 6");

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      console.log("files 7", req.files);

      for (const file of req.files as Express.Multer.File[]) {
        const support__files = {
          file__name: file.originalname,
          file__path: baseUrl + file.filename,
          file__type: "Question",
          question__id: question.question__id,
        };
        console.log("file attribute", support__files);
        await FileQuestion.create(support__files);
      }
    }

    console.log("file 8", questDatas);

    // Associate question with exam if exam__id is provided
    if (questionData.exam__id) {
      const exam = await Exam.findByPk(questionData.exam__id);
      if (exam) {
        await exam.$add('questions', question);
        console.log(`Associated question ${question.question__id} with exam ${questionData.exam__id}`);
      }
    }
    console.log(",,,,,,,,,,,,,,,,,,,,3332,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",questionData.reponses)
    // Create the responses for the question
    if (questionData.reponses && Array.isArray(questionData.reponses) && questionData.reponses.length > 0) {
      console.log("if ethanya fotnaha");
      const responsesData = questionData.reponses;
      for (const responseData of responsesData) {
        console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",responseData)
        responseData.question__id = question.question__id;
        await Reponse.create(responseData);
      }
    }

    res.status(201).json(question);
  } catch (error) {
    console.error("Error creating question", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Get fake Question 

export const getFakeQuestions = async (req: Request, res: Response) => {
try {
  const examId = -1;

 
  const questions = await Question.findAll({
    include: [
      {
        model: Exam,
        as: 'exams',
        where: { exam__id: examId },
        through: { attributes: [] } // Exclude join table attributes
      },
      {
        model: FileQuestion,
        as: 'file',
        required: false,
      },
    ],
  });
console.log("<><<<>>",questions)
  res.status(200).json(questions);
} catch (error) {
  console.error("Error fetching questions with files", error);
  res.status(500).json({ error: "Internal server error" });
}
};



export const updateQuestionsWithExam = async (req: Request, res: Response) => {
  try {
    const { exam__id, questionIds } = req.body;

    if (!exam__id || !Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const exam = await Exam.findByPk(exam__id);

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const questions = await Question.findAll({
      where: {
        question__id: questionIds,
      },
    });

    if (questions.length !== questionIds.length) {
      return res.status(404).json({ error: "One or more questions not found" });
    }

    await exam.$add('questions', questions);

    return questions;
  } catch (error) {
    console.error("Error updating questions with exam", error);
    res.status(500).json({ error: "Internal server error" });
  }
};











export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id);
    if (question) {
      res.status(200).json(question);
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    console.error("Error fetch question", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Read operation - Get all questions
export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.findAll();
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetch questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update operation
export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Question.update(req.body, {
      where: { question__id: id },
    });
    if (updated) {
      const updatedQuestion = await Question.findOne({
        where: { question__id: id },
      });
      res.status(200).json(updatedQuestion);
    } else {
      throw new Error("Question not found");
    }
  } catch (error) {
    console.error("Error updating question", error);
    res.status(500).send("Error updating question");
  }
};

// Delete operation
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Question.destroy({ where: { question__id: id } });
    if (deleted) {
      res.status(204).send();
    } else {
      throw new Error("Question not found");
    }
  } catch (error) {
    console.error("Error deleting question", error);
    res.status(500).send("Error deleting question");
  }
};
