import { Subject } from "../models/subjectModel";
import { Request, Response } from "express";
import { TeacherSubject } from "../models/teacherSubjectsModel";
import { Exam } from "../models/examModel";
import { Op, where } from "sequelize";
import { Reservation } from "../models/reservationModel";
import { count } from "console";

export const CreateSubject = async (req: Request, res: Response) => {
  try {
    const newSubject = await Subject.create(req.body);
    const subject = await Subject.findOne({
      where: { subject__id: newSubject.subject__id },
    });
    res.status(201).json(subject);
  } catch (error) {
    console.error("Error creating Subject:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await Subject.findAll();
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subjects", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const CheckSubjects = async (req: Request, res: Response) => {
  try {
    const { sub }= req.params
    const currentDate = new Date();
    const exams = await Exam.findAll( {where: { subject: sub },});
    if(exams){
      let SchudExam = 0
      for ( const exam of exams){
        const scheduls = await Reservation.findOne( {where: { exam__id: exam.exam__id, endDate: { [Op.gt]: currentDate } },});
        if(scheduls){
          console.log("mn", scheduls)
          SchudExam = SchudExam + 1
        }
      }
const Count  = SchudExam
console.log("Count is Count",Count)
console.log("SchudExam is SchudExam",SchudExam)
       res.status(200).json(Count);
    }
   
  } catch (error) {
    console.error("Error fetching subjects", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




export const UpdateSubject = async (req: Request, res: Response) => {
  try {
    const { id }= req.params
    console.log("dsjjjjjjjjjjjjjjjjjj",id)
    const [updated] = await Subject.update(req.body, {
      where: { subject__id: id },
    });
    if (!updated) {
 
      throw new Error("Subject not found");
    }

const updatedSubject = await Subject.findOne({ where: { subject__id: id } });
res.status(200).json(updatedSubject);
  } catch (error) {
    console.error("Error updating Subject", error);
    res.status(500).send("Error updating Subject");
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Subject.destroy({ where: { subject__id: id } });
    if (deleted) {
      res.status(204).send();
    } else {
      throw new Error("Subject not found");
    }
  } catch (error) {
    console.error("Error deleting Subject", error);
    res.status(500).send("Error deleting Subject");
  }
};



