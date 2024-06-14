
import { Request, Response } from "express";
import { Exam } from "../models/examModel";
import { Answer } from "../models/answerModel";
import { AnswerStudent } from "../models/answerStudentModel";
import { Question } from "../models/questionModel";

// Create operation
export const createAnswers = async (req: Request, res: Response) => {
  try {
    const answersData= req.body
    const exam = await Exam.findByPk(answersData.exam__id);
   if(!exam){
    return res.status(404).json({ message: "Exam not found" });
   }

   const answer = await Answer.create(answersData);

   if (answersData.answers && Array.isArray(answersData.answers ) && answersData.answers .length > 0) {
    console.log("if  fotnaha");
    const ansDatas = answersData.answers;
    for (const ansData of ansDatas) {
      console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",ansData)
      const question = await Question.findByPk(ansData.question__id);
      if(!question){
       return res.status(404).json({ message: "question not found" });
      }
ansData.ans__id= answer.ans__id
      await AnswerStudent.create(ansData);
    }
  }

    res.status(201).json(answer);
  } catch (error) {
    console.error("Error creation aswers", error);
    res.status(500).json({ error: "Internal server error" });
  }
};