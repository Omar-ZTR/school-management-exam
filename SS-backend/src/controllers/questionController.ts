import { Question } from "../models/questionModel"; // Import your Question model
import { Request, Response } from "express";

// Create operation
export const createQuestion = async (req: Request, res: Response) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json(question);
    } catch (error) {
        console.error("Error creation question", error);
        res.status(500).json({ error: 'Internal server error' });

    }
};

// Get Question by ID
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
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Read operation - Get all questions
export const getAllQuestions = async (req: Request, res: Response) => {
    try {
        const questions = await Question.findAll();
        res.status(200).json(questions);
    } catch (error) {
        console.error("Error fetch questions:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update operation
export const updateQuestion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updated] = await Question.update(req.body, { where: { question__id: id } });
        if (updated) {
            const updatedQuestion = await Question.findOne({ where: { question__id: id } });
            res.status(200).json(updatedQuestion);
        } else {
            throw new Error('Question not found');
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
            throw new Error('Question not found');
        }
    } catch (error) {
        console.error("Error deleting question", error);
        res.status(500).send("Error deleting question");  
    }
};
