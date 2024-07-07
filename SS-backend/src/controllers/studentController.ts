
import { Request, Response } from "express";
import { Student } from "../models/studentModel";



export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const students = await Student.findAll();
        console.log("studens is : ",students)
        res.status(200).json(students);
    } catch (error) {
        console.error("Error fetch student:", error);
        res.status(500).json({ error: 'Internal server error' });
    };
}

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Student.destroy({ where: { user__id: id } });
        if (deleted) {
            res.status(204).send();
        } else {
            throw new Error('Student not found');
        }
    } catch (error) {
        console.error("Error deleting Student", error);
        res.status(500).send("Error deleting Student"); 
    }
};

export const updateStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updated] = await Student.update(req.body, {
            where: { user__id: id }
        });

        if (updated) {
            const updatedStudent = await Student.findOne({ where: { user__id: id } });
            res.status(200).json(updatedStudent);
        } else {
            throw new Error('Student not found');
        }
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
