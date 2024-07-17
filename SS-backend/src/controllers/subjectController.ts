import { Subject } from "../models/subjectModel";
import { Request, Response } from "express";
import { TeacherSubject } from "../models/teacherSubjectsModel";

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



