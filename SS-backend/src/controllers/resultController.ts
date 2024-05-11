import { Request, Response } from "express";
import { Result } from "../models/resultModel";

// Create operation
export const createResult = async (req: Request, res: Response) => {
    try {
        const result = await Result.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating result", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Read operation - Get all results
export const getAllResults = async (req: Request, res: Response) => {
    try {
        const results = await Result.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Read operation - Get result by ID
export const getResultById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await Result.findByPk(id);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Result not found" });
        }
    } catch (error) {
        console.error("Error fetching result", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update operation
export const updateResult = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updated] = await Result.update(req.body, { where: { result__id: id } });
        if (updated) {
            const updatedResult = await Result.findOne({ where: { result__id: id } });
            res.status(200).json(updatedResult);
        } else {
            throw new Error('Result not found');
        }
    } catch (error) {
        console.error("Error updating result", error);
        res.status(500).send("Error updating result");
    }
};

// Delete operation
export const deleteResult = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Result.destroy({ where: { result__id: id } });
        if (deleted) {
            res.status(204).send();
        } else {
            throw new Error('Result not found');
        }
    } catch (error) {
        console.error("Error deleting result", error);
        res.status(500).send("Error deleting result");
    }
};
