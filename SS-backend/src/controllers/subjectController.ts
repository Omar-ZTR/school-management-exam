import { Subject } from "../models/subjectModel";
import { Request, Response } from "express";
export const getSubjects = async (req: Request, res: Response) => {
    try {
        console.log('slamou 3alaykom')
      const subjects = await Subject.findAll();
      res.status(200).json(subjects);
    } catch (error) {
      console.error("Error fetching subjects", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }