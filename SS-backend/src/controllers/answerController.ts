import { Request, Response } from "express";
import { Answer } from "../models/answerModel";

// Create operation
export const createAnswer = async (req: Request, res: Response) => {
    try {
        const answer = await Answer.create(req.body);
        res.status(201).json(answer);
    } catch (error) {
        console.error("Error creating answer", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Read operation - Get all answers
export const getAllAnswers = async (req: Request, res: Response) => {
    try {
        const answers = await Answer.findAll();
        res.status(200).json(answers);
    } catch (error) {
        console.error("Error fetching answers:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Read operation - Get answer by ID
export const getAnswerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const answer = await Answer.findByPk(id);
        if (answer) {
            res.status(200).json(answer);
        } else {
            res.status(404).json({ message: "Answer not found" });
        }
    } catch (error) {
        console.error("Error fetching answer", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update operation
export const updateAnswer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updated] = await Answer.update(req.body, { where: { ans__id: id } });
        if (updated) {
            const updatedAnswer = await Answer.findOne({ where: { ans__id: id } });
            res.status(200).json(updatedAnswer);
        } else {
            throw new Error('Answer not found');
        }
    } catch (error) {
        console.error("Error updating answer", error);
        res.status(500).send("Error updating answer");
    }
};

// Delete operation
export const deleteAnswer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Answer.destroy({ where: { ans__id: id } });
        if (deleted) {
            res.status(204).send();
        } else {
            throw new Error('Answer not found');
        }
    } catch (error) {
        console.error("Error deleting answer", error);
        res.status(500).send("Error deleting answer");
    }
};
