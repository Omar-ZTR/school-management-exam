import { Exam } from "../models/examModel"; // Import your Exam model
import { Request, Response } from "express";
import uploadFile from "../utils/upload";
import { Reponse } from "../models/reponseModel";
import { Question } from "../models/questionModel";
import { File } from "../models/fileModel";

const baseUrl = "http://localhost:3000/files/";
// Create operation

export const createExam = async (req: Request, res: Response) => {
  console.log("exam bssdena")
  try {

    console.log("exam bdena",req.file)

    await uploadFile(req, res); // Handle file upload
    console.log("exam bdena",req.file)
    const examDatas = { ...req.body}; // Assuming exam data is in req.body
    console.log("exam bdesssna",examDatas)
    const examData= JSON.parse(examDatas.exam)
    console.log("LLLL json",examData)
    const exam = await Exam.create(examData);
    console.log("exam fotnaha")
    if (req.file !== undefined) {
      console.log("file defined", req.file)

      // If file uploaded, save file information in the support__files attribute
     const support__files = 
        {
          file__name: req.file.originalname,
          file__path: baseUrl + req.file.filename,
          file__type:"support",
          exam__id: exam.exam__id
        }
      ;
      console.log("file attribute",support__files)
      const filesup = await File.create({
        file__name: req.file.originalname,
        file__path: baseUrl + req.file.filename,
        file__type:"support",
        exam__id: exam.exam__id
      });
    }
   
    console.log("file fotnaha")
    // Create the questions for the exam
    if (
      examData.questions &&
      Array.isArray(examData.questions) &&
      examData.questions.length > 0
    ) {

      console.log("if eloula fotnaha")
      const questionsData = examData.questions;
      for (const questionData of questionsData) {
        questionData.exam__id = exam.exam__id;
        const question = await Question.create(questionData);
        console.log("question fotnaha")
        // Create the responses for each question
        if (
          questionData.reponses &&
          Array.isArray(questionData.reponses) &&
          questionData.reponses.length > 0
        ) {
          console.log("if ethanya fotnaha")
          const responsesData = questionData.reponses;
          for (const responseData of responsesData) {
            responseData.question__id = question.question__id;

            await Reponse.create(responseData);
          }
        }
      }
    }

    res.status(201).json(exam);
  } catch (error) {
    console.error("Error creation exam", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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

// Update operation
export const updateExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Exam.update(req.body, { where: { exam__id: id } });
    if (updated) {
      const updatedExam = await Exam.findOne({ where: { exam__id: id } });
      res.status(200).json(updatedExam);
    } else {
      throw new Error("Exam not found");
    }
  } catch (error) {
    console.error("Error updating exam", error);
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




