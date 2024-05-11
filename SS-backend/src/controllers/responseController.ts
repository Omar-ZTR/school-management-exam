import { Reponse } from "../models/reponseModel"; // Import your Response model
import { Request, Response } from "express";

// Create operation
export const createReponse = async (req: Request, res: Response) => {
    try {
        const reponse = await Reponse.create(req.body);
        res.status(201).json(reponse);
    } catch (error) {
        console.error("Error creation Reponse", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Response by ID
export const getReponseById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const reponse = await Reponse.findByPk(id);
        if (reponse) {
            res.status(200).json(reponse);
        } else {
            res.status(404).json({ message: "Reponse not found" });
        }
    } catch (error) {
        console.error("Error fetch Reponse", error);
        res.status(500).json({ error: 'Internal server error' }); 
       }
};

// Get all responses
export const getAllReponses = async (req: Request, res: Response) => {
    try {
        const reponses = await Reponse.findAll();
        res.status(200).json(reponses);
    } catch (error) {
        console.error("Error fetch Reponse:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update operation
export const updateReponse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updated] = await Reponse.update(req.body, { where: { reponse__id: id } });
        if (updated) {
            const updatedReponse = await Reponse.findOne({ where: { reponse__id: id } });
            res.status(200).json(updatedReponse);
        } else {
            throw new Error('Reponse not found');
        }
    } catch (error) {
        console.error("Error updating Reponse", error);
        res.status(500).send("Error updating Reponse");
    }
};

// Delete operation
export const deleteReponse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Reponse.destroy({ where: { reponse__id: id } });
        if (deleted) {
            res.status(204).send();
        } else {
            throw new Error('Reponse not found');
        }
    } catch (error) {
        console.error("Error deleting Reponse", error);
        res.status(500).send("Error deleting Reponse"); 
    }
};
