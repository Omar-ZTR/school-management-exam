import { Exam } from "../models/examModel"; // Import your Exam model
import { Request, Response } from "express";
import uploadFile from "../utils/upload";
import { Reponse } from "../models/reponseModel";
import { Question } from "../models/questionModel";
import { FileExam } from "../models/fileModel";
import { Reservation } from "../models/reservationModel";
import { Group } from "../models/groupModel";
import { Student } from "../models/studentModel";
import { updateQuestionsWithExam } from "./questionController";
import uploadFileMiddleware from "../utils/upload";

const baseUrl = "http://localhost:3000/files/";
// Create operation

export const createExam = async (req: Request, res: Response) => {
  console.log("exam 1", req.body);
  try {
    console.log("exam 2", req.body.files);

    await uploadFileMiddleware(req, res); // Handle file upload
    console.log("exam 3", req.body.file);
    const examDatas = { ...req.body }; // Assuming exam data is in req.body
    console.log("exam 4", examDatas);
    const examData = JSON.parse(examDatas.exam);
    console.log("LLLL 5", examData);
    const exam = await Exam.create(examData);
    console.log("exam 6");

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      console.log("files 7", req.files);

      for (const file of req.files as Express.Multer.File[]) {
        const support__files = {
          file__name: file.originalname,
          file__path: baseUrl + file.filename,
          file__type: "support",
          exam__id: exam.exam__id,
        };
        console.log("file attribute", support__files);
        await FileExam.create(support__files);
      }
    }

    console.log("file 8");
    if (examData.questions && Array.isArray(examData.questions) && examData.questions.length > 0) {
      await updateQuestionsWithExam({
        body: {
          exam__id: exam.exam__id,
          questionIds: examData.questions.map((q: any) => q.question__id || q)
        }
      } as Request, res);
    }


    res.status(201).json(exam);
  } catch (error) {
    console.error("Error creation exam", error);
    res.status(500).json({ error: "Internal server error" });
  }
};






// if (
//   examDatas.questions &&
//   Array.isArray(examDatas.questions) &&
//   examDatas.questions.length > 0
// ) {
//   console.log("if eloula fotnaha");
//   const questionsData = examDatas.questions;
//   for (const questionData of questionsData) {
//     questionData.exam__id = exam.exam__id;
//     const question = await Question.create(questionData);
//     console.log("question fotnaha");
//     // Create the responses for each question
//     if (
//       questionData.reponses &&
//       Array.isArray(questionData.reponses) &&
//       questionData.reponses.length > 0
//     ) {
//       console.log("if ethanya fotnaha");
//       const responsesData = questionData.reponses;
//       for (const responseData of responsesData) {
//         responseData.question__id = question.question__id;

//         await Reponse.create(responseData);
//       }
//     }
//   }
// }












// Get Exam by ID
export const getExamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findByPk(id);
    if (exam) {
      res.status(200).json(exam);
    } else {
      res.status(404).json({ message: "Exam not found" });
    }
  } catch (error) {
    console.error("Error fetch exam", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all exams
export const getAllExams = async (req: Request, res: Response) => {
  try {
    const exams = await Exam.findAll();
    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetch exams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTeacherExams = async (req: Request, res: Response) => {
  try {
    const exams = await Exam.findAll({
      include: [
        { model: Question },
        { model: Reservation },
        { model: FileExam },
      ],
    });
    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getExamsGroupsStutents = async (req: Request, res: Response) => {
  try {
    const exams = await Exam.findAll({
      include: [
        {
          model: Group,
          include: [{ model: Student }],
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    });

    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching students for groups:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update operation
export const updateExam = async (req: Request, res: Response) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request Params:", req.params);

    const { id } = req.params;
    const { operation } = req.body;
    const { group__id } = req.body;
    // Validate the operation
    if (typeof operation !== "number") {
      return res.status(400).send("Invalid operation value");
    }

    // Find the exam by primary key
    const exam = await Exam.findByPk(id);
    if (!exam) {
      return res.status(404).send("Exam not found");
    }
    const group = await Group.findByPk(group__id);
    console.log("Existing Exam:", exam);
    if (!group) {
      return res.status(404).send("group not found");
    }

    await exam.$add('groups', group);

    
    // Update the nb__reserve field
    const nb__reserve = exam.nb__reserve + operation;
    const [updated] = await Exam.update(
      { nb__reserve },
      { where: { exam__id: id } }
    );

    if (updated) {
      const updatedExam = await Exam.findOne({ where: { exam__id: id } });
      res.status(200).json(updatedExam);
    } else {
      res.status(500).send("Failed to update exam");
    }
  } catch (error) {
    console.error("Error updating exam:", error);
    res.status(500).send("Error updating exam");
  }
};

// Delete operation
export const deleteExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Exam.destroy({ where: { exam__id: id } });
    if (deleted) {
      res.status(204).send();
    } else {
      throw new Error("Exam not found");
    }
  } catch (error) {
    console.error("Error deleting exam", error);
    res.status(500).send("Error deleting exam");
  }
};
