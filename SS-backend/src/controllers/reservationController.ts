import { Reservation } from "../models/reservationModel"; // Import your Reservation model
import { Request, Response } from "express";

// Create operation
export const createReservation = async (req: Request, res: Response) => {
    try {
        const reservation = await Reservation.create(req.body);
        res.status(201).json(reservation);
    } catch (error) {
        console.error("Error creation reservation", error);
        res.status(500).json({ error: 'Internal server error' });

    }
};

// Read operation - Get all reservations
export const getAllReservations = async (req: Request, res: Response) => {
    try {
        const reservations = await Reservation.findAll();
        res.status(200).json(reservations);
    } catch (error) {
        console.error("Error fetch reservations:", error);
        res.status(500).json({ error: 'Internal server error' });
    };
}
// Read operation - Get reservation by ID
export const getReservationById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findByPk(id);
        if (reservation) {
            res.status(200).json(reservation);
        } else {
            res.status(404).json({ message: "Reservation not found" });
        }
    } catch (error) {
        console.error("Error fetch reservation", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update operation
export const updateReservation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updated] = await Reservation.update(req.body, { where: { reserv__id: id } });
        if (updated) {
            const updatedReservation = await Reservation.findOne({ where: { reserv__id: id } });
            res.status(200).json(updatedReservation);
        } else {
            throw new Error('Reservation not found');
        }
    } catch (error) {
        console.error("Error deleting reservation", error);
        res.status(500).send("Error deleting reservation");
    }
};

// Delete operation
export const deleteReservation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Reservation.destroy({ where: { reserv__id: id } });
        if (deleted) {
            res.status(204).send();
        } else {
            throw new Error('Reservation not found');
        }
    } catch (error) {
        console.error("Error deleting reservation", error);
        res.status(500).send("Error deleting reservation"); 
    }
};