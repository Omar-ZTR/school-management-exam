import { Salle } from "../models/salleModel"; // Import your Salle model
import { Request, Response } from "express";

// Create operation
export const createSalle = async (req: Request, res: Response) => {
    try {
        const salle = await Salle.create(req.body);
        res.status(201).json(salle);
    } catch (error) {
        console.error("Error creation salle", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Read operation - Get all salles
export const getAllSalles = async (req: Request, res: Response) => {
    try {
        const salles = await Salle.findAll();
        res.status(200).json(salles);
    } catch (error) {
        console.error("Error fetch salle:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Read operation - Get salle by ID
export const getSalleById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const salle = await Salle.findByPk(id);
        if (salle) {
            res.status(200).json(salle);
        } else {
            res.status(404).json({ message: "Salle not found" });
        }
    } catch (error) {
        console.error("Error fetch salle", error);
        res.status(500).json({ error: 'Internal server error' }); 
    }
};

// Update operation
export const updateSalle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updated] = await Salle.update(req.body, { where: { salle__id: id } });
        if (updated) {
            const updatedSalle = await Salle.findOne({ where: { salle__id: id } });
            res.status(200).json(updatedSalle);
        } else {
            throw new Error('Salle not found');
        }
    } catch (error) {
        console.error("Error updating salle", error);
        res.status(500).send("Error updating salle");
    
    }
};

// Delete operation
export const deleteSalle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Salle.destroy({ where: { salle__id: id } });
        if (deleted) {
            res.status(204).send();
        } else {
            throw new Error('Salle not found');
        }
    } catch (error) {
        console.error("Error deleting salle", error);
        res.status(500).send("Error deleting salle"); 
    }
};
